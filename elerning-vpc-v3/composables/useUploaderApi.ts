export const useUploaderApi = () => {
  const { baseUrl } = useApiBase()
  const apiBase = baseUrl

  return {
    // Upload file
    async uploadFile(formData: FormData) {
      return await $fetch(`${apiBase}/api/e/uploader/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
    },

    // Upload multiple files
    async uploadFiles(formData: FormData) {
      return await $fetch(`${apiBase}/api/e/uploader/uploads`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
    },

    // Delete file
    async deleteFile(fileId: string) {
      return await $fetch(`${apiBase}/api/e/uploader/${fileId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
    },
  };
};

