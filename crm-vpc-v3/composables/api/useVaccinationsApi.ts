
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

  /**
   * Lấy danh sách vaccine schedule (có thể merge với records của healthBook)
   * GET /api/vaccinations/schedule -> backend /api/u/schedule-vaccins
   */
  const getVaccinationSchedule = async (params?: {
    healthBookId?: string
    customerId?: string
  }): Promise<VaccinationScheduleItem[]> => {
    loading.value = true;
    error.value = '';
    try {
      const queryParams: Record<string, string> = {};
      if (params?.healthBookId) {
        queryParams.healthBookId = params.healthBookId;
      }
      if (params?.customerId) {
        queryParams.customerId = params.customerId;
      }
      
      console.log('🔍 getVaccinationSchedule called with params:', queryParams)
      
      // Use Nuxt server proxy endpoint
      const res = await apiClient.get<VaccinationScheduleResponse>('/api/vaccinations/schedule', { 
        params: queryParams,
        showError: false 
      });
      
      console.log('🔍 getVaccinationSchedule response:', res)
      console.log('🔍 Response structure:', {
        hasData: !!res?.data,
        hasDataData: !!res?.data?.data,
        hasScheduleVaccin: !!res?.data?.data?.scheduleVaccin,
        scheduleVaccinLength: res?.data?.data?.scheduleVaccin?.length
      })
      
      const scheduleVaccin = res?.data?.data?.scheduleVaccin || res?.data?.scheduleVaccin || []
      console.log('✅ Returning scheduleVaccin:', scheduleVaccin.length, 'items')
      
      return scheduleVaccin
    } catch (err: any) {
      console.error('❌ getVaccinationSchedule error:', err)
      error.value = err?.message || 'Không thể tải lịch tiêm';
      return [];
    } finally {
      loading.value = false;
    }
  }

  /**
   * Lấy danh sách vaccination records của customer
   * GET /api/vaccinations/records/:customerId -> backend /api/u/vaccination-records/:customerId
   */
  const getVaccinationRecords = async (customerId: string): Promise<VaccinationRecord[]> => {
    loading.value = true;
    error.value = '';
    try {
      // Use Nuxt server proxy endpoint
      const res = await apiClient.get<VaccinationRecordsListResponse>(
        `/api/vaccinations/records/${customerId}`,
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

  /**
   * Tạo vaccination record mới (đánh dấu đã tiêm)
   * POST /api/vaccinations/records -> backend /api/u/vaccination-records
   */
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
      // Use Nuxt server proxy endpoint
      const res = await apiClient.post<VaccinationRecordResponse>(
        '/api/vaccinations/records',
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

  /**
   * Cập nhật vaccination record
   * PUT /api/vaccinations/records/:id -> backend /api/u/vaccination-records/:id
   */
  const updateVaccinationRecord = async (
    recordId: string,
    data: Partial<VaccinationRecord>
  ): Promise<VaccinationRecord | null> => {
    loading.value = true;
    error.value = '';
    try {
      // Use Nuxt server proxy endpoint
      const res = await apiClient.put<VaccinationRecordResponse>(
        `/api/vaccinations/records/${recordId}`,
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

  /**
   * Xóa vaccination record
   * DELETE /api/vaccinations/records/:id -> backend /api/u/vaccination-records/:id
   */
  const deleteVaccinationRecord = async (recordId: string): Promise<boolean> => {
    loading.value = true;
    error.value = '';
    try {
      // Use Nuxt server proxy endpoint
      await apiClient.delete(`/api/vaccinations/records/${recordId}`);
      return true;
    } catch (err: any) {
      error.value = err?.message || 'Không thể xóa bản ghi tiêm chủng';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Xóa vaccination record theo vaccineId và healthBookId
   * DELETE /api/vaccinations/records/by-vaccine/:vaccineId -> backend /api/u/vaccination-records/by-vaccine/:vaccineId
   */
  const deleteVaccinationRecordByVaccine = async (
    vaccineId: string,
    healthBookId: string,
    injectionNumber?: number
  ): Promise<boolean> => {
    loading.value = true;
    error.value = '';
    try {
      const params: Record<string, string | number> = { healthBookId };
      if (injectionNumber) {
        params.injectionNumber = injectionNumber;
      }
      // Use Nuxt server proxy endpoint
      await apiClient.delete(`/api/vaccinations/records/by-vaccine/${vaccineId}`, { params });
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
    deleteVaccinationRecordByVaccine,
  }
}
