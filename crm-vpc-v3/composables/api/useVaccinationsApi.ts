
import type { 
  VaccinationScheduleResponse, 
  VaccinationScheduleItem,
  VaccinationRecordResponse,
  VaccinationRecordsListResponse,
  VaccinationRecord
} from '~/types/api'

export function useVaccinationsApi() {
  const loading = ref(false)
  const error = ref('')
  const apiClient = useApiClient()

  // Lấy danh sách vaccine schedule (có thể merge với records của customer)
  const getVaccinationSchedule = async (customerId?: string): Promise<VaccinationScheduleItem[]> => {
    loading.value = true;
    error.value = '';
    try {
      const params = customerId ? { customerId } : {};
      const res = await apiClient.get<VaccinationScheduleResponse>('/api/u/schedule-vaccins', { 
        params,
        showError: false 
      });
      return res?.data?.scheduleVaccin || [];
    } catch (err: any) {
      error.value = err?.message || 'Không thể tải lịch tiêm';
      return [];
    } finally {
      loading.value = false;
    }
  }

  // Lấy danh sách vaccination records của customer
  const getVaccinationRecords = async (customerId: string): Promise<VaccinationRecord[]> => {
    loading.value = true;
    error.value = '';
    try {
      const res = await apiClient.get<VaccinationRecordsListResponse>(
        `/api/u/vaccination-records/${customerId}`,
        { showError: false }
      );
      return res?.data?.vaccinationRecords || [];
    } catch (err: any) {
      error.value = err?.message || 'Không thể tải lịch sử tiêm chủng';
      return [];
    } finally {
      loading.value = false;
    }
  }

  // Tạo vaccination record mới (đánh dấu đã tiêm)
  const createVaccinationRecord = async (data: {
    customerId: string;
    healthBookId: string;
    vaccineId: string;
    scheduledDate?: string;
    injectionDate?: string;
    status?: string;
    location?: string;
    notes?: string;
    injectionNumber?: number;
    sideEffects?: string;
    nextDoseDate?: string;
  }): Promise<VaccinationRecord | null> => {
    loading.value = true;
    error.value = '';
    try {
      const res = await apiClient.post<VaccinationRecordResponse>(
        '/api/u/vaccination-records',
        data
      );
      return res?.data?.vaccinationRecord || null;
    } catch (err: any) {
      error.value = err?.message || 'Không thể tạo bản ghi tiêm chủng';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Cập nhật vaccination record
  const updateVaccinationRecord = async (
    recordId: string,
    data: Partial<VaccinationRecord>
  ): Promise<VaccinationRecord | null> => {
    loading.value = true;
    error.value = '';
    try {
      const res = await apiClient.put<VaccinationRecordResponse>(
        `/api/u/vaccination-records/${recordId}`,
        data
      );
      return res?.data?.vaccinationRecord || null;
    } catch (err: any) {
      error.value = err?.message || 'Không thể cập nhật bản ghi tiêm chủng';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Xóa vaccination record
  const deleteVaccinationRecord = async (recordId: string): Promise<boolean> => {
    loading.value = true;
    error.value = '';
    try {
      await apiClient.delete(`/api/u/vaccination-records/${recordId}`);
      return true;
    } catch (err: any) {
      error.value = err?.message || 'Không thể xóa bản ghi tiêm chủng';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    getVaccinationSchedule,
    getVaccinationRecords,
    createVaccinationRecord,
    updateVaccinationRecord,
    deleteVaccinationRecord,
  }
}
