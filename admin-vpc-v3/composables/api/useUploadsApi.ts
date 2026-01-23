/**
 * ====================================
 * Uploads API Composable
 * ====================================
 * File upload APIs
 */

import type { UploadResponse, FileUploadOptions } from '~/types/api'

export const useUploadsApi = () => {
  const apiClient = useApiClient()

  return {
    /**
     * Upload single or multiple files to MinIO
     */
    async uploadFiles(files: File | File[], options?: FileUploadOptions) {
      const formData = new FormData()
      const folder = options?.folder || 'general'
      
      if (Array.isArray(files)) {
        files.forEach(file => {
          // Validate file size
          if (options?.maxSize && file.size > options.maxSize * 1024 * 1024) {
            throw new Error(`File ${file.name} vượt quá kích thước cho phép (${options.maxSize}MB)`)
          }
          
          // Validate file type
          if (options?.allowedTypes && !options.allowedTypes.includes(file.type)) {
            throw new Error(`File ${file.name} không đúng định dạng cho phép`)
          }
          
          formData.append('files', file)
        })
      } else {
        // Validate single file
        if (options?.maxSize && files.size > options.maxSize * 1024 * 1024) {
          throw new Error(`File vượt quá kích thước cho phép (${options.maxSize}MB)`)
        }
        
        if (options?.allowedTypes && !options.allowedTypes.includes(files.type)) {
          throw new Error(`File không đúng định dạng cho phép`)
        }
        
        formData.append('files', files)
      }

      return apiClient.upload(`/api/uploads/minio?folder=${folder}`, formData, {
        errorMessage: 'Không thể upload file',
        timeout: 120000 // 2 minutes for large files
      })
    },

    /**
     * Upload image to MinIO
     */
    async uploadImage(file: File, folder: string = 'images') {
      // Validate image type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP)')
      }

      // Validate size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Kích thước ảnh không được vượt quá 5MB')
      }

      const formData = new FormData()
      formData.append('files', file)

      return apiClient.upload(`/api/uploads/minio?folder=${folder}`, formData, {
        errorMessage: 'Không thể upload ảnh'
      })
    },

    /**
     * Upload video
     */
    async uploadVideo(file: File) {
      // Validate video type
      const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/quicktime']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Chỉ chấp nhận file video (MP4, AVI, MOV)')
      }

      // Validate size (max 5GB)
      if (file.size > 5 * 1024 * 1024 * 1024) {
        throw new Error('Kích thước video không được vượt quá 5GB')
      }

      const formData = new FormData()
      formData.append('file', file) // Backend expects 'file', not 'video'

      return apiClient.upload('/api/uploads/video', formData, {
        errorMessage: 'Không thể upload video',
        timeout: 7200000 // 2 hours for large videos (5GB)
      })
    },

    /**
     * Upload with progress tracking
     */
    async uploadWithProgress(
      file: File,
      onProgress?: (progress: number) => void
    ) {
      const formData = new FormData()
      formData.append('file', file)

      // Note: $fetch doesn't support progress tracking natively
      // You would need to use XMLHttpRequest or axios for this
      // For now, just upload without progress
      return this.uploadFiles(file)
    },

    /**
     * Delete file from storage
     */
    async deleteFile(url: string) {
      return apiClient.post('/api/uploads/delete', { url }, {
        errorMessage: 'Không thể xóa file'
      })
    },

    /**
     * Cancel video upload job and cleanup files
     */
    async cancelVideoUpload(jobId: string) {
      return apiClient.delete(`/api/uploads/video/${jobId}`, {
        errorMessage: 'Không thể hủy upload video'
      })
    },

    /**
     * Get video upload job status
     */
    async getVideoJobStatus(jobId: string) {
      return apiClient.get(`/api/uploads/video/status/${jobId}`, {
        errorMessage: 'Không thể lấy trạng thái upload video'
      })
    }
  }
}

