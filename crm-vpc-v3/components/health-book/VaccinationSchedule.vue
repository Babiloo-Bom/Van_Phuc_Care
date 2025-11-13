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
        <a-select-option value="newborn">Sa sinh</a-select-option>
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
        :key="vaccine.id"
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
import { ref, computed } from 'vue'

interface Vaccine {
  id: string
  name: string
  ageRecommended: string
  dosage: number
  scheduledDate?: string
  injectedDate?: string
  status: 'completed' | 'pending'
  description?: string
  image?: string
}

interface Props {
  customerId: string
}

const props = defineProps<Props>()

const selectedAge = ref<string>('newborn')

// Mock vaccination data - Replace with API call
const vaccinations = ref<Vaccine[]>([
  {
    id: '1',
    name: 'BCG – Vắc xin Lao liều sơ sinh',
    ageRecommended: 'Khi trẻ sinh ra (trước 1 tháng tuổi)',
    dosage: 1,
    scheduledDate: '15/04/2024',
    injectedDate: '15/04/2024',
    status: 'completed',
    description: 'Lorem ipsum dolor sit amet consectetur. Amet tellus diam morbi vehicula vitae placerat nunc in lorem. Scelerisque arcu quam iaculat ante phasellus.',
    image: '/images/vaccines/bcg.png',
  },
  {
    id: '2',
    name: 'Heberbiovac, Gene-HBvax, Euvax B – Vắc xin Viêm gan B liều sơ sinh',
    ageRecommended: 'Khi trẻ sinh ra',
    dosage: 2,
    scheduledDate: '15/04/2024',
    status: 'pending',
    description: 'Lorem ipsum dolor sit amet consectetur. Amet tellus diam morbi vehicula vitae placerat nunc in lorem. Scelerisque arcu quam iaculat ante phasellus.',
    image: '/images/vaccines/hepatitis-b.png',
  },
  {
    id: '3',
    name: 'Heberbiovac, Gene-HBvax, Euvax B – Vắc xin Viêm gan B liều sơ sinh',
    ageRecommended: 'Khi trẻ sinh ra',
    dosage: 2,
    scheduledDate: '15/04/2024',
    status: 'pending',
    description: 'Lorem ipsum dolor sit amet consectetur. Amet tellus diam morbi vehicula vitae placerat nunc in lorem. Scelerisque arcu quam iaculat ante phasellus.',
    image: '/images/vaccines/hepatitis-b.png',
  },
])

const filteredVaccines = computed(() => {
  // Filter by selected age
  // TODO: Implement proper filtering based on age
  return vaccinations.value
})

const handleAgeChange = (value: string) => {
  console.log('Age changed:', value)
  // TODO: Fetch vaccinations for selected age
}

// TODO: Fetch vaccination data from API
// const fetchVaccinations = async () => {
//   const { getVaccinations } = useVaccinationsApi()
//   const response = await getVaccinations(props.customerId)
//   vaccinations.value = response.data
// }
</script>

<style scoped>
.vaccination-schedule {
  background-color: #ffffff;
}
</style>
