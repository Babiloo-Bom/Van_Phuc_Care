/**
 * ====================================
 * Middleware Composable
 * ====================================
 * Helper functions for working with middleware
 */

import { message } from 'ant-design-vue';

export const useMiddleware = () => {
  const authStore = useAuthStore();
  const router = useRouter();

  /**
   * Check if user can access route
   */
  const canAccessRoute = (routeName: string): boolean => {
    const route = router.getRoutes().find(r => r.name === routeName);
    
    if (!route) return false;

    // Check authentication
    if (route.meta.requiresAuth && !authStore.isAuthenticated) {
      return false;
    }

    // Check role
    if (route.meta.requiredRole) {
      const requiredRole = route.meta.requiredRole as string;
      const userRole = authStore.user?.role;
      
      if (userRole !== requiredRole) {
        return false;
      }
    }

    // Check permissions
    if (route.meta.requiredPermissions) {
      const requiredPermissions = route.meta.requiredPermissions as string[];
      const userPermissions = authStore.user?.permissions || [];
      
      const hasAllPermissions = requiredPermissions.every(permission =>
        userPermissions.includes(permission),
      );
      
      if (!hasAllPermissions) {
        return false;
      }
    }

    return true;
  };

  /**
   * Navigate with auth check
   */
  const navigateWithAuth = async (
    to: string,
    options?: {
      requireAuth?: boolean
      requiredRole?: string
      requiredPermissions?: string[]
      onUnauthorized?: () => void
    },
  ) => {
    // Check authentication
    if (options?.requireAuth && !authStore.isAuthenticated) {
      message.warning('Vui lòng đăng nhập để tiếp tục');
      
      if (process.client) {
        localStorage.setItem('redirect_after_login', to);
      }
      
      return navigateTo('/login');
    }

    // Check role
    if (options?.requiredRole) {
      const userRole = authStore.user?.role;
      
      if (userRole !== options.requiredRole) {
        message.error('Bạn không có quyền truy cập trang này');
        
        if (options.onUnauthorized) {
          options.onUnauthorized();
        } else {
          return navigateTo('/unauthorized');
        }
        
        return;
      }
    }

    // Check permissions
    if (options?.requiredPermissions) {
      const userPermissions = authStore.user?.permissions || [];
      
      const hasAllPermissions = options.requiredPermissions.every(permission =>
        userPermissions.includes(permission),
      );
      
      if (!hasAllPermissions) {
        message.error('Bạn không có quyền thực hiện hành động này');
        
        if (options.onUnauthorized) {
          options.onUnauthorized();
        } else {
          return navigateTo('/unauthorized');
        }
        
        return;
      }
    }

    // Navigate
    return navigateTo(to);
  };

  /**
   * Check if current route requires auth
   */
  const currentRouteRequiresAuth = computed(() => {
    const route = useRoute();
    return route.meta.requiresAuth === true;
  });

  /**
   * Get required role for current route
   */
  const currentRouteRequiredRole = computed(() => {
    const route = useRoute();
    return route.meta.requiredRole as string | undefined;
  });

  /**
   * Get required permissions for current route
   */
  const currentRouteRequiredPermissions = computed(() => {
    const route = useRoute();
    return route.meta.requiredPermissions as string[] | undefined;
  });

  /**
   * Guard a function with auth check
   */
  const withAuthGuard = <T extends (...args: any[]) => any>(
    fn: T,
    options?: {
      requireAuth?: boolean
      requiredRole?: string
      requiredPermissions?: string[]
      onUnauthorized?: () => void
    },
  ): T => {
    return ((...args: any[]) => {
      // Check authentication
      if (options?.requireAuth && !authStore.isAuthenticated) {
        message.warning('Vui lòng đăng nhập để thực hiện hành động này');
        if (options.onUnauthorized) {
          options.onUnauthorized();
        }
        return;
      }

      // Check role
      if (options?.requiredRole) {
        const userRole = authStore.user?.role;
        
        if (userRole !== options.requiredRole) {
          message.error('Bạn không có quyền thực hiện hành động này');
          if (options.onUnauthorized) {
            options.onUnauthorized();
          }
          return;
        }
      }

      // Check permissions
      if (options?.requiredPermissions) {
        const userPermissions = authStore.user?.permissions || [];
        
        const hasAllPermissions = options.requiredPermissions.every(permission =>
          userPermissions.includes(permission),
        );
        
        if (!hasAllPermissions) {
          message.error('Bạn không có quyền thực hiện hành động này');
          if (options.onUnauthorized) {
            options.onUnauthorized();
          }
          return;
        }
      }

      // Execute function
      return fn(...args);
    }) as T;
  };

  return {
    canAccessRoute,
    navigateWithAuth,
    currentRouteRequiresAuth,
    currentRouteRequiredRole,
    currentRouteRequiredPermissions,
    withAuthGuard,
  };
};

