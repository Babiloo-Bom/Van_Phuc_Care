
import type { VaccinationScheduleResponse, VaccinationScheduleItem } from '~/types/api'

export function useVaccinationsApi() {
  const loading = ref(false)
  const error = ref('')
  const apiClient = useApiClient()

  // Lấy danh sách vaccine schedule (public)
  const getVaccinationSchedule = async (): Promise<VaccinationScheduleItem[]> => {
    loading.value = true;
    error.value = '';
    try {
      const res = await apiClient.get<VaccinationScheduleResponse>('/api/u/schedule-vaccins', { showError: false });
      return res?.data?.scheduleVaccin || [];
    } catch (err: any) {
      error.value = err?.message || 'Không thể tải lịch tiêm';
      return [];
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    getVaccinationSchedule,
  }
}
