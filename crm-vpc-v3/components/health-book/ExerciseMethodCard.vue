<template>
  <div
    class="bg-white rounded-none lg:rounded-lg shadow-none lg:shadow-sm py-4"
  >
    <div class="space-y-3">
      <!-- Method -->
      <div>
        <h4 class="font-bold text-[#1A75BB] text-base mb-2">
          Phương pháp:
        </h4>
        <div v-if="healthBook.method">
          <div v-if="healthBook.method.status" class="mb-2">
            <span class="font-medium text-gray-600">Trạng thái:</span>
            <span class="ml-2 text-gray-800">{{
              getHealthRecordOptionLabel(
                healthBook.method.status,
                methodOptions
              )
            }}</span>
          </div>
          <div
            v-if="healthBook.method.descriptions"
            class="text-sm text-gray-600 leading-relaxed"
            v-html="healthBook.method.descriptions"
          />
        </div>
        <p v-else class="text-sm text-gray-400">Đang cập nhật</p>
      </div>
      <!-- Exercise & Skills -->
      <div>
        <h4 class="font-bold text-[#1A75BB] text-base mb-2">
          Tập vận động và kỹ năng:
        </h4>
        <div
          v-if="healthBook.exerciseAndSkills"
          class="text-sm text-gray-600 leading-relaxed"
        >
          {{
            getHealthRecordOptionLabel(
              healthBook.exerciseAndSkills,
              motorSkillsOptions
            )
          }}
        </div>
        <p v-else class="text-sm text-gray-400">Đang cập nhật</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HealthBook } from "~/types/api";

import {
  methodOptions,
  motorSkillsOptions,
} from "~/constants/healthRecordOptions";
import { getHealthRecordOptionLabel } from "~/utils/healthbook";

interface Props {
  healthBook: HealthBook;
}

defineProps<Props>();
</script>
