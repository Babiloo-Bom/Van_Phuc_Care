<template>
  <div class="vaccination-schedule bg-white rounded-lg">
    <!-- Header with Age Filter -->
    <div class="flex items-center justify-between mb-6 flex-col md:flex-row">
      <h2 class="text-xl font-bold text-[#1A75BB] text-center">
        LỊCH TIÊM CHO TRẺ TỪ 0-24 THÁNG TUỔI
      </h2>

      <a-select
        v-model:value="selectedAge"
        placeholder="Sơ sinh"
        class="w-full sm:w-48"
        @change="handleAgeChange"
      >
        <a-select-option value="newborn">Sơ sinh</a-select-option>
        <a-select-option value="1">1 tháng tuổi</a-select-option>
        <a-select-option value="2">2 tháng tuổi</a-select-option>
        <a-select-option value="3">3 tháng tuổi</a-select-option>
        <a-select-option value="4">4 tháng tuổi</a-select-option>
        <a-select-option value="5">5 tháng tuổi</a-select-option>
        <a-select-option value="6">6 tháng tuổi</a-select-option>
        <a-select-option value="9">9 tháng tuổi</a-select-option>
        <a-select-option value="12">12 tháng tuổi</a-select-option>
        <a-select-option value="18">18 tháng tuổi</a-select-option>
        <a-select-option value="24">24 tháng tuổi</a-select-option>
      </a-select>
    </div>

    <!-- Vaccination List -->
    <div class="space-y-4">
      <VaccinationCard
        v-for="vaccine in filteredVaccines"
        :key="`${vaccine._id || vaccine.id}-${vaccine.injectionStatus}`"
        :vaccine="vaccine"
        @statusChange="handleStatusChange"
        @viewDetail="handleViewDetail"
      />
    </div>

    <!-- Empty State -->
    <div v-if="filteredVaccines.length === 0" class="text-center py-12">
      <a-empty description="Không có lịch tiêm cho độ tuổi này" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { message } from "ant-design-vue";
import { useVaccinationsApi } from "~/composables/api/useVaccinationsApi";
import VaccinationCard from "./VaccinationCard.vue";
import type { VaccinationScheduleItem } from "~/types/api";

const props = defineProps<{
  schedule?: any[];
  customerId?: string;
  healthBookId?: string;
}>();

const emit = defineEmits<{
  viewDetail: [vaccine: VaccinationScheduleItem];
}>();

const selectedAge = ref<string>("newborn");
const vaccinations = ref<any[]>([]);
const { loading, error, getVaccinationSchedule, createVaccinationRecord, deleteVaccinationRecordByVaccine } = useVaccinationsApi();

const fetchVaccinations = async () => {
  // Pass healthBookId (preferred) or customerId to get merged schedule + records
  try {
    const data = await getVaccinationSchedule({
      healthBookId: props.healthBookId,
      customerId: props.customerId,
    });
    vaccinations.value = data;
  } catch (error: any) {
    vaccinations.value = []
  }
};

onMounted(() => {  
  if (props.schedule && Array.isArray(props.schedule)) {
    vaccinations.value = props.schedule;
  } else {
    fetchVaccinations();
  }
});

watch(
  () => props.schedule,
  (val) => {
    if (val && Array.isArray(val)) {
      vaccinations.value = val;
    }
  }
);

// Refetch when healthBookId or customerId changes
watch([() => props.healthBookId, () => props.customerId], () => {
  if (props.healthBookId || props.customerId) {
    fetchVaccinations();
  }
});

const filteredVaccines = computed(() => {
  if (!vaccinations.value || vaccinations.value.length === 0) {
    return [];
  }

  // Convert selectedAge to number for comparison
  const ageInMonths =
    selectedAge.value === "newborn" ? 0 : Number(selectedAge.value);

  // Filter vaccines where ageInMonths matches the selected age
  return vaccinations.value.filter((vaccine: any) => {
    const vaccineAge = vaccine.ageInMonths ?? 0;
    return vaccineAge === ageInMonths;
  });
});

const handleAgeChange = (value: string) => {
  selectedAge.value = value;
  // Filtering is handled reactively by filteredVaccines computed
};

// Handle vaccination status change (tick/untick checkbox)
const handleStatusChange = async (vaccine: VaccinationScheduleItem, completed: boolean) => {
  const newStatus = completed ? 'completed' : 'pending';
  const vaccineId = vaccine._id || vaccine.id || '';
  
  // Find vaccine index for updating
  const index = vaccinations.value.findIndex(
    (v: any) => (v._id || v.id) === vaccineId
  );
  
  if (index === -1) {
    message.error('Không tìm thấy vaccine trong danh sách');
    return;
  }
  
  try {
    if (completed) {
      // Create vaccination record to mark as completed
      const result = await createVaccinationRecord({
        customerId: props.customerId || '', // Backend sẽ tự lấy từ healthBook nếu rỗng
        healthBookId: props.healthBookId || '',
        vaccineId: vaccineId,
        injectionDate: new Date().toISOString(),
        status: 'completed',
        injectionNumber: vaccine.injectionNumber || 1,
      });
      
      // Update local state với recordId từ response - tạo array mới để Vue detect thay đổi
      const updatedVaccinations = [...vaccinations.value];
      updatedVaccinations[index] = {
        ...updatedVaccinations[index],
        injectionStatus: 'completed',
        injectionDate: new Date().toISOString(),
        recordId: result?._id || result?.id || null,
      };
      vaccinations.value = updatedVaccinations;
      
    } else {
      // If unchecking, delete the vaccination record by vaccineId
      await deleteVaccinationRecordByVaccine(
        vaccineId,
        props.healthBookId || '',
        vaccine.injectionNumber || 1
      );
      
      // Update local state - tạo array mới để Vue detect thay đổi
      const updatedVaccinations = [...vaccinations.value];
      updatedVaccinations[index] = {
        ...updatedVaccinations[index],
        injectionStatus: 'pending',
        injectionDate: null,
        recordId: null,
      };
      vaccinations.value = updatedVaccinations;
    }
    
    message.success(completed ? 'Đã đánh dấu tiêm phòng' : 'Đã bỏ đánh dấu tiêm phòng');
  } catch (err: any) {
    // Không cần revert vì chưa update state khi có lỗi
    message.error(err?.message || 'Không thể cập nhật trạng thái tiêm phòng');
  }
};

// Handle view detail
const handleViewDetail = (vaccine: VaccinationScheduleItem) => {
  emit('viewDetail', vaccine);
};
</script>

<style scoped>
.vaccination-schedule {
  background-color: #ffffff;
}
</style>
<style>
.vaccination-schedule .ant-select-selector {
  color: #1a75bb !important;
  border-color: #1a75bb !important;
}
</style>
