<template>
  <div v-if="isPurchased" class="w-full mb-3 sm:mb-4 flex-grow flex flex-col justify-end">
    <div class="w-full flex items-center justify-between mb-2">
      <span class="text-xs sm:text-sm text-[#868686]">Tiến độ</span>
      <span class="text-xs sm:text-sm text-[#868686]">{{ progressPct }}%</span>
    </div>
    <div class="relative w-full h-1 bg-[#dfdfdf] rounded-sm">
      <div
        class="absolute top-0 bottom-0 left-0 bg-[#6DE380] rounded-sm transition-all duration-300"
        :style="{ width: `${progressWidth}%` }"
      ></div>
    </div>
  </div>

  <div class="course-actions" v-if="!isPurchased">
    <button class="btn-buy-now" @click.stop="$emit('buyNow')">Mua ngay</button>
    <button class="btn-add-cart" @click.stop="$emit('addToCart')">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <g clip-path="url(#cart-clip)">
          <path
            d="M12 4C12 2.93913 11.5786 1.92172 10.8284 1.17157C10.0783 0.421427 9.06087 0 8 0C6.93913 0 5.92172 0.421427 5.17157 1.17157C4.42143 1.92172 4 2.93913 4 4H0V14C0 14.5304 0.210714 15.0391 0.585786 15.4142C0.960859 15.7893 1.46957 16 2 16H9.33333V14.6667H2C1.82319 14.6667 1.65362 14.5964 1.5286 14.4714C1.40357 14.3464 1.33333 14.1768 1.33333 14V5.33333H4V6.66667H5.33333V5.33333H10.6667V6.66667H12V5.33333H14.6667V9.33333H16V4H12ZM5.33333 4C5.33333 3.29276 5.61428 2.61448 6.11438 2.11438C6.61448 1.61428 7.29276 1.33333 8 1.33333C8.70724 1.33333 9.38552 1.61428 9.88562 2.11438C10.3857 2.61448 10.6667 3.29276 10.6667 4H5.33333Z"
            fill="white"
          />
          <path
            d="M14.0002 10.6663H12.6669V12.6663H10.6669V13.9996H12.6669V15.9996H14.0002V13.9996H16.0002V12.6663H14.0002V10.6663Z"
            fill="white"
          />
        </g>
        <defs>
          <clipPath id="cart-clip">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </button>
  </div>

  <div v-else class="flex-grow flex flex-col justify-end w-full gap-4">
    <div class="course-actions" v-if="everCompleted || isCurrentlyCompleted">
      <button class="btn-completed" @click.stop="$emit('goToCertificate')">
        Xem chứng chỉ
      </button>
    </div>
    <div class="course-actions" v-else>
      <button class="btn-access" @click.stop="$emit('goToLearning')">
        Học ngay
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  isPurchased: boolean;
  everCompleted: boolean;
  isCurrentlyCompleted: boolean;
  progressPct: number;
}>();

defineEmits<{
  buyNow: [];
  addToCart: [];
  goToCertificate: [];
  goToLearning: [];
}>();

const progressWidth = computed(() => Math.min(Math.max(props.progressPct, 0), 100));
</script>

<style scoped>
.course-actions {
  display: flex;
  width: 100%;
  gap: 8px;
  margin-top: auto;
}

.btn-add-cart,
.btn-buy-now {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-buy-now {
  flex: 1;
  background: #2563eb;
  color: white;
}

.btn-buy-now:hover {
  background: #1d4ed8;
}

.btn-add-cart {
  flex-shrink: 0;
  background: #f48284;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.btn-add-cart:hover {
  background: #e5e7eb;
}

.btn-access {
  width: 100%;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #15cf74;
  color: #ffffff;
}

.btn-access:hover {
  background: #12b865;
}

.btn-completed {
  width: 100%;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: linear-gradient(88.69deg, #FFBE6A -1.04%, #EBBC46 23.61%, #FFDA7D 55.57%, #EBBC46 74.44%, #FFBE6A 97.91%);
  color: white;
}

.btn-completed:hover {
  opacity: 0.9;
}
</style>
