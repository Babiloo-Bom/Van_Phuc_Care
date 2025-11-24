<template>
  <div class="vaccination-schedule bg-white rounded-lg shadow-sm p-6">
    <!-- Header with Age Filter -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-blue-600">
        LỊCH TIÊM CHO TRẺ TỪ 0-24 THÁNG TUỔI
      </h2>
      
      <a-select
        v-model:value="selectedAge"
        placeholder="Sa sinh"
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
import { ref, computed, onMounted, watch } from 'vue'
import { useVaccinationsApi } from '~/composables/api/useVaccinationsApi'

const props = defineProps<{ schedule?: any[] }>()

const selectedAge = ref<string>('newborn')
const vaccinations = ref<any[]>([])
const { loading, error, getVaccinationSchedule } = useVaccinationsApi()

const fetchVaccinations = async () => {
  const data = await getVaccinationSchedule()
  vaccinations.value = data
}

onMounted(() => {
  if (props.schedule && Array.isArray(props.schedule)) {
    vaccinations.value = props.schedule
  } else {
    fetchVaccinations()
  }
})

watch(() => props.schedule, (val) => {
  if (val && Array.isArray(val)) {
    vaccinations.value = val
  }
})

const filteredVaccines = computed(() => {
  // TODO: Implement proper filtering based on selectedAge
  return vaccinations.value
})

const handleAgeChange = (value: string) => {
  selectedAge.value = value
  // TODO: Filter vaccinations by age
}
</script>

<style scoped>
.vaccination-schedule {
  background-color: #ffffff;
}
</style>
