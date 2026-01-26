export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  // Get request host to determine if we're in production
  const host = getHeader(event, "host") || "";

  // ALWAYS use production domain for sitemap - never use localhost
  const baseUrl = "https://edu.vanphuccare.vn";

  // Get API host for fetching courses
  const apiHost =
    config.apiHostInternal || config.public.apiHost || "http://localhost:3000";

  // Static pages - Only include public pages that should be indexed
  const staticPages = [
    {
      url: "/",
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: "1.0",
    },
    {
      url: "/courses",
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: "0.9",
    },
    {
      url: "/instructors",
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: "0.7",
    },
    {
      url: "/privacy-policy",
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: "0.5",
    },
    {
      url: "/terms-of-service",
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: "0.5",
    },
    {
      url: "/complaint-procedure",
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: "0.5",
    },
    {
      url: "/content-partner-policy",
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: "0.5",
    },
    {
      url: "/user-rights",
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: "0.5",
    },
  ];

  // Fetch courses from API
  let courses: any[] = [];
  try {
    // Fetch all courses with pagination
    let page = 1;
    const limit = 100; // Fetch 100 courses per page
    let allCourses: any[] = [];
    let hasMore = true;

    while (hasMore) {
      const response: any = await $fetch(`${apiHost}/api/u/courses`, {
        params: {
          page,
          limit,
          status: "active", // Only get active courses
        },
      });

      const coursesData = response?.data?.courses || response?.courses || [];

      // Filter to only include courses with valid slug
      const validCourses = coursesData.filter(
        (course: any) =>
          course.slug &&
          typeof course.slug === "string" &&
          course.slug.trim().length > 0 &&
          course.status === "active",
      );

      allCourses = [...allCourses, ...validCourses];

      // Check if there are more pages
      const totalPages =
        response?.data?.pagination?.totalPages ||
        response?.pagination?.totalPages ||
        1;
      hasMore = page < totalPages && coursesData.length > 0;
      page++;
    }

    courses = allCourses;
    console.log(`[Sitemap] Fetched ${courses.length} published courses`);
  } catch (error) {
    console.error("[Sitemap] Error fetching courses:", error);
    // Continue with empty courses array if API fails
  }

  // Dynamic course pages - Only include course detail pages, NOT lesson pages
  const coursePages = courses
    .filter((course) => course.slug) // Only include courses with slug
    .map((course) => ({
      url: `/courses/${course.slug}`,
      lastmod: course.updatedAt || course.createdAt || new Date().toISOString(),
      changefreq: "weekly",
      priority: "0.8",
    }));

  const allPages = [...staticPages, ...coursePages];

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allPages
  .map((page) => {
    // Find course data for image if it's a course page
    const course = courses.find((c) => page.url === `/courses/${c.slug}`);
    const imageTag = course?.thumbnail
      ? `    <image:image>
      <image:loc>${course.thumbnail.startsWith('http') ? course.thumbnail : `${baseUrl}${course.thumbnail.startsWith('/') ? course.thumbnail : `/${course.thumbnail}`}`}</image:loc>
      <image:title>${(course.title || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</image:title>
    </image:image>`
      : "";

    return `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${imageTag ? `\n${imageTag}` : ""}
  </url>`;
  })
  .join("\n")}
</urlset>`;

  // Set headers
  setHeader(event, "Content-Type", "application/xml; charset=utf-8");
  setHeader(event, "Cache-Control", "public, max-age=3600"); // Cache for 1 hour

  return sitemap;
});
