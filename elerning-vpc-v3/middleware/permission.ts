/**
 * ====================================
 * Permission-based Middleware
 * ====================================
 * Checks if user has required permissions
 * Usage: definePageMeta({ 
 *   middleware: ['auth', 'permission'],
 *   requiredPermissions: ['users.write', 'users.delete']
 * })
 */

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // First check if authenticated
  if (!authStore.isAuthenticated) {
    console.warn('[Permission Middleware] User not authenticated');
    return navigateTo('/login');
  }

  // Get required permissions from route meta
  const requiredPermissions = to.meta.requiredPermissions as string[] | string | undefined;

  if (!requiredPermissions) {
    // No permission requirement, allow access
    return;
  }

  // Convert to array if single permission
  const permissions = Array.isArray(requiredPermissions) 
    ? requiredPermissions 
    : [requiredPermissions];

  // Get user's permissions
  const userPermissions = authStore.user?.permissions || [];

  // Check if user has ALL required permissions
  const hasAllPermissions = permissions.every(permission => 
    userPermissions.includes(permission),
  );

  if (!hasAllPermissions) {
    console.warn('[Permission Middleware] User lacks required permissions:', permissions);
    console.log('[Permission Middleware] User has:', userPermissions);
    
    // Redirect to unauthorized page
    return navigateTo('/unauthorized');
  }
});

