/**
 * ====================================
 * Products API Composable
 * ====================================
 * All product-related API calls
 */

import type { Product, ProductQueryParams, PaginatedResponse, Category } from '~/types/api'

export const useProductsApi = () => {
  const apiClient = useApiClient()

  return {
    /**
     * Get products list
     */
    async getProducts(params?: ProductQueryParams) {
      return apiClient.get<PaginatedResponse<Product>>('/api/a/products', {
        params,
        showError: false
      })
    },

    /**
     * Get product by ID
     */
    async getProduct(id: string) {
      return apiClient.get<{ product: Product }>(`/api/a/products/${id}`)
    },

    /**
     * Create new product
     */
    async createProduct(data: Partial<Product>) {
      return apiClient.post<{ product: Product }>('/api/a/products', data, {
        errorMessage: 'Không thể tạo sản phẩm'
      })
    },

    /**
     * Update product
     */
    async updateProduct(id: string, data: Partial<Product>) {
      return apiClient.patch<{ product: Product }>(`/api/a/products/${id}`, data, {
        errorMessage: 'Không thể cập nhật sản phẩm'
      })
    },

    /**
     * Delete product
     */
    async deleteProduct(id: string) {
      return apiClient.delete(`/api/a/products/${id}`, {
        errorMessage: 'Không thể xóa sản phẩm'
      })
    },

    /**
     * Get categories
     */
    async getCategories(params?: { type?: 'product' | 'blog'; searchKey?: string }) {
      return apiClient.get<PaginatedResponse<Category>>('/api/a/categories', {
        params,
        showError: false
      })
    },

    /**
     * Create category
     */
    async createCategory(data: Partial<Category>) {
      return apiClient.post<{ category: Category }>('/api/a/categories', data, {
        errorMessage: 'Không thể tạo danh mục'
      })
    },

    /**
     * Update category
     */
    async updateCategory(id: string, data: Partial<Category>) {
      return apiClient.patch<{ category: Category }>(`/api/a/categories/${id}`, data, {
        errorMessage: 'Không thể cập nhật danh mục'
      })
    },

    /**
     * Delete category
     */
    async deleteCategory(id: string) {
      return apiClient.delete(`/api/a/categories/${id}`, {
        errorMessage: 'Không thể xóa danh mục'
      })
    }
  }
}

