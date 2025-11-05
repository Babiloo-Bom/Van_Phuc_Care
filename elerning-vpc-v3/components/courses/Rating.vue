<template>
  <div class="rating" :class="{ 'rating-disabled': disabled }">
    <span
      v-for="star in maxStars"
      :key="star"
      class="star"
      :class="getStarClass(star)"
      @click="!disabled && handleClick(star)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        :width="size"
        :height="size"
        class="star-svg"
      >
        <!-- Empty star background -->
        <path
          class="star-bg"
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          :fill="inactiveColor"
        />
        
        <!-- Full star overlay -->
        <path
          v-if="getStarFillPercentage(star) > 0"
          class="star-fill"
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          :fill="activeColor"
          :style="{ clipPath: getClipPath(star) }"
        />
      </svg>
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: number;
  value?: number;
  maxStars?: number;
  size?: string | number;
  activeColor?: string;
  inactiveColor?: string;
  allowHalf?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  value: 0,
  maxStars: 5,
  size: '16px',
  activeColor: '#FFD700',
  inactiveColor: '#E5E7EB',
  allowHalf: false,
  disabled: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: number];
  change: [value: number];
}>();

const currentValue = computed(() => props.value || props.modelValue);

const getStarClass = (star: number): string => {
  const fillPercentage = getStarFillPercentage(star);
  
  if (fillPercentage >= 1) {
    return 'star-full';
  }
  if (fillPercentage > 0) {
    return 'star-partial';
  }
  return 'star-empty';
};

/**
 * Calculate fill percentage for a star (0 to 1)
 * Examples:
 * - value=4.9, star=5 => 0.9 (90% filled)
 * - value=4.5, star=5 => 0.5 (50% filled)
 * - value=4.3, star=5 => 0.3 (30% filled)
 * - value=4.9, star=4 => 1.0 (100% filled)
 */
const getStarFillPercentage = (star: number): number => {
  const value = currentValue.value;
  
  // If star position is less than value, it's fully filled
  if (star <= Math.floor(value)) {
    return 1;
  }
  
  // If star position is the next star after the integer part
  if (star === Math.floor(value) + 1) {
    const decimal = value - Math.floor(value);
    
    if (props.allowHalf) {
      // Round to nearest 0.5 for half star display
      return decimal >= 0.75 ? 1 : (decimal >= 0.25 ? 0.5 : 0);
    } else {
      // For non-half mode, show partial fill based on decimal
      return decimal;
    }
  }
  
  // Star is beyond the value, empty
  return 0;
};

/**
 * Generate clip-path for partial star fill
 */
const getClipPath = (star: number): string => {
  const fillPercentage = getStarFillPercentage(star);
  
  if (fillPercentage >= 1) {
    return 'none'; // Fully visible
  }
  
  if (fillPercentage <= 0) {
    return 'polygon(0 0, 0 0, 0 0, 0 0)'; // Fully hidden
  }
  
  // Create clip-path for partial fill (left to right)
  const percentage = fillPercentage * 100;
  return `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
};

const handleClick = (star: number) => {
  if (props.disabled) return;
  
  let newValue = star;
  
  // Handle half star clicks
  if (props.allowHalf) {
    // If clicking on same star, toggle between full and half
    if (Math.floor(currentValue.value) === star) {
      newValue = star - 0.5;
    }
  }
  
  emit('update:modelValue', newValue);
  emit('change', newValue);
};
</script>

<style scoped>
.rating {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  line-height: 1;
}

.star {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  line-height: 0;
}

.star:hover:not(.rating-disabled .star) {
  transform: scale(1.1);
}

.rating-disabled .star {
  cursor: default;
}

.star-svg {
  display: block;
  width: 100%;
  height: 100%;
}

.star-bg {
  transition: fill 0.2s ease;
}

.star-fill {
  transition: clip-path 0.2s ease;
}

/* Optional: Add hover effect for interactive ratings */
.rating:not(.rating-disabled) .star:hover ~ .star .star-bg {
  fill: currentColor;
  opacity: 0.5;
}
</style>
