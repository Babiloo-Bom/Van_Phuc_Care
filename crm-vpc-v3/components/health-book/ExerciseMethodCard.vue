<template>
  <div
    class="bg-white rounded-none lg:rounded-lg shadow-none lg:shadow-sm py-4"
  >
    <div class="space-y-4">
      <!-- Phương pháp (Lịch sinh hoạt) -->
      <div>
        <div class="flex items-center justify-between mb-1">
          <h4 class="font-bold text-[#1A75BB] text-base mb-0">
            Phương pháp:
          </h4>
          <span v-if="healthBook.schedule" class="font-bold text-[#1A75BB] text-sm">
            {{ getHealthRecordOptionLabel(healthBook.schedule, scheduleOptions) }}
          </span>
          <span v-else-if="healthBook.method?.status" class="font-semibold text-[#4A4A4A] text-sm">
            {{ getHealthRecordOptionLabel(healthBook.method.status, methodOptions) }}
          </span>
          <span v-else class="text-sm text-[#4A4A4A] opacity-60">Đang cập nhật</span>
        </div>
        <div class="text-sm text-[#4A4A4A]">
          {{ healthBook.scheduleNote || healthBook.method?.descriptions || 'Bé tự chuyển giấc tốt' }}
        </div>
        <div class="text-sm text-[#4A4A4A]">
          {{ healthBook.notes || 'Cần theo dõi thêm' }}
        </div>
      </div>

      <!-- Mốc phát triển -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <h4 class="font-bold text-[#1A75BB] text-base mb-0">
            Mốc phát triển
          </h4>
          <span v-if="healthBook.developmentMilestone" class="font-bold text-[#1A75BB] text-sm">
            {{ getHealthRecordOptionLabel(healthBook.developmentMilestone, developmentMilestoneOptions) }}
          </span>
          <span v-else class="text-sm text-[#4A4A4A] opacity-60">0-3 tháng</span>
        </div>
        
        <div class="mb-2">
          <h5 class="font-bold text-[#4A4A4A] text-sm mb-1">Vận động thô</h5>
          <div v-if="healthBook.grossMotorSkills" class="text-sm text-[#4A4A4A]">
            {{ getHealthRecordOptionLabel(healthBook.grossMotorSkills, grossMotorSkillsOptions) }}
          </div>
          <div v-else class="text-sm text-[#4A4A4A]">
            Không có
          </div>
        </div>

        <div class="mb-2">
          <h5 class="font-bold text-[#4A4A4A] text-sm mb-1">Vận động tĩnh</h5>
          <div v-if="healthBook.fineMotorSkills" class="text-sm text-[#4A4A4A]">
            {{ getHealthRecordOptionLabel(healthBook.fineMotorSkills, fineMotorSkillsOptions) }}
          </div>
          <div v-else class="text-sm text-[#4A4A4A]">
            Không có
          </div>
        </div>

        <!-- Thị giác & nhận thức -->
        <div class="mb-2">
          <h5 class="font-bold text-[#4A4A4A] text-sm mb-1">Thị giác & nhận thức</h5>
          <div v-if="healthBook.visualCognition" class="text-sm text-[#4A4A4A]">
            {{ getHealthRecordOptionLabel(healthBook.visualCognition, visualCognitionOptions) }}
          </div>
          <div v-else class="text-sm text-[#4A4A4A]">
            Không có
          </div>
        </div>

        <!-- Giao tiếp & Cảm xúc -->
        <div class="mb-2">
          <h5 class="font-bold text-[#4A4A4A] text-sm mb-1">Giao tiếp & Cảm xúc</h5>
          <div v-if="healthBook.communicationEmotion" class="text-sm text-[#4A4A4A]">
            {{ getHealthRecordOptionLabel(healthBook.communicationEmotion, communicationEmotionOptions) }}
          </div>
          <div v-else class="text-sm text-[#4A4A4A]">
            Không có
          </div>
        </div>

        <!-- Dấu hiệu cảnh báo sớm -->
        <div>
          <h5 class="font-bold text-[#4A4A4A] text-sm mb-1">Dấu hiệu cảnh báo sớm</h5>
          <div v-if="healthBook.earlyWarning" class="text-sm text-[#4A4A4A]">
            {{ getHealthRecordOptionLabel(healthBook.earlyWarning, earlyWarningOptions) }}
          </div>
          <div v-else class="text-sm text-[#4A4A4A]">
            Không có
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HealthBook } from "~/types/api";

import {
  methodOptions,
  scheduleOptions,
  developmentMilestoneOptions,
  grossMotorSkillsOptions,
  fineMotorSkillsOptions,
  visualCognitionOptions,
  communicationEmotionOptions,
  earlyWarningOptions,
} from "~/constants/healthRecordOptions";
import { getHealthRecordOptionLabel } from "~/utils/healthbook";

interface Props {
  healthBook: HealthBook;
}

defineProps<Props>();
</script>
