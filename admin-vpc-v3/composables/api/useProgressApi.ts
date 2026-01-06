/**
 * ====================================
 * Progress API Composable
 * ====================================
 * All progress-related API calls
 */

export const useProgressApi = () => {
  const apiClient = useApiClient()

  return {
    /**
     * Get course completion rate statistics
     */
    async getCompletionRate() {
      return apiClient.get('/api/a/progress/completion-rate')
    }
  }
}

