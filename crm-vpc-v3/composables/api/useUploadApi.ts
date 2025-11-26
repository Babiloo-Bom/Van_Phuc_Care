/**
 * Upload API Composable
 * Handles file uploads to MinIO storage
 */

interface UploadedFile {
  filename: string
  url: string
  size: number
  type: string
  uploadedAt: string
}

interface UploadResponse {
  files: UploadedFile[]
}

export const useUploadApi = () => {
  const config = useRuntimeConfig()
  const apiClient = useApiClient()

  /**
   * Upload files to MinIO storage
   * @param files - Array of File objects to upload
   * @param folder - Folder name in MinIO (default: 'general')
   * @returns Array of uploaded file info with URLs
   */
  const uploadFiles = async (
    files: File[],
    folder: string = 'general'
  ): Promise<UploadedFile[]> => {
    if (!files || files.length === 0) {
      return []
    }

    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    const baseUrl = config.public.apiBaseUrl || 'http://localhost:3000'
    
    try {
      const response = await fetch(`${baseUrl}/uploads/minio?folder=${folder}`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Upload failed')
      }

      const data = await response.json()
      return data.data?.files || []
    } catch (error: any) {
      console.error('Upload error:', error)
      throw error
    }
  }

  /**
   * Upload a single file to MinIO
   * @param file - File object to upload
   * @param folder - Folder name in MinIO
   * @returns Uploaded file info with URL
   */
  const uploadFile = async (
    file: File,
    folder: string = 'general'
  ): Promise<UploadedFile | null> => {
    const result = await uploadFiles([file], folder)
    return result[0] || null
  }

  return {
    uploadFiles,
    uploadFile,
  }
}
