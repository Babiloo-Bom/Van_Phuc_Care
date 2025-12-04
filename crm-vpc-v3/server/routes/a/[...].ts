import { proxyRequest, getHeaders } from "h3";

/**
 * Catch-all proxy for /a/* requests (without /api prefix)
 * Forwards requests to the backend API server as /api/a/*
 *
 * Example: /a/some/path -> http://api:3000/api/a/some/path
 *
 * Uses proxyRequest for proper handling of all content types including multipart/form-data
 */
export default defineEventHandler(async (event) => {
  const path = event.path;

  // Only handle /a/* paths
  if (!path.startsWith("/a/")) {
    return;
  }

  const config = useRuntimeConfig();

  // Get internal API host (accessible within Docker network)
  const apiHost = config.apiHostInternal || "http://localhost:3000";

  // Convert /a/* to /api/a/*
  const targetPath = "/api" + path;
  const targetUrl = `${apiHost}${targetPath}`;

  console.log(`[API Proxy /a] ${event.method} ${path} -> ${targetUrl}`);

  // Use proxyRequest for proper streaming of all content types (including multipart/form-data)
  return proxyRequest(event, targetUrl, {
    headers: {
      ...Object.fromEntries(
        Object.entries(getHeaders(event)).filter(
          ([key]) => key.toLowerCase() !== "host"
        )
      ),
    },
    fetchOptions: {
      method: event.method,
    },
  });
});
