<template>
  <div class="vaccination-schedule bg-white rounded-lg">
    <!-- Header with Age Filter -->
    <div class="flex items-center justify-between mb-6 flex-col md:flex-row">
      <h2 class="text-xl font-bold text-[#1A75BB]">
        LỊCH TIÊM CHO TRẺ TỪ 0-24 THÁNG TUỔI
      </h2>

      <a-select
        v-model:value="selectedAge"
        placeholder="Sơ sinh"
        class="w-48"
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
        :key="vaccine._id || vaccine.id"
        :vaccine="vaccine"
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
import { useVaccinationsApi } from "~/composables/api/useVaccinationsApi";
import VaccinationCard from "./VaccinationCard.vue";

const props = defineProps<{
  schedule?: any[];
  customerId?: string;
  healthBookId?: string;
}>();

const selectedAge = ref<string>("newborn");
const vaccinations = ref<any[]>([]);
const { loading, error, getVaccinationSchedule } = useVaccinationsApi();

const fetchVaccinations = async () => {
  // Pass healthBookId (preferred) or customerId to get merged schedule + records
  const data = await getVaccinationSchedule({
    healthBookId: props.healthBookId,
    customerId: props.customerId,
  });
  vaccinations.value = data;
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
