import {
  skinConditionOptions,
  oralHealthOptions,
  nutritionOptions,
  sleepOptions,
  stoolFrequencyOptions,
  stoolConditionOptions,
  digestiveIssuesOptions,
  methodOptions,
  motorSkillsOptions,
} from "~/constants/healthRecordOptions";
<template>
  <a-modal v-model:open="isVisible" :footer="null" :width="700" :closable="true" class="create-health-record-modal">
    <!-- Header -->
    <div class="modal-header">
      <h2 class="modal-title">Nhập thông tin</h2>
    </div>

    <!-- Form -->
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      layout="vertical"
      class="health-form"
      @finish="handleSubmit"
    >
      <!-- Mã khách hàng -->
      <a-form-item label="Mã khách hàng">
        <a-input :value="healthBookId" placeholder="HealthBook ID" size="large" disabled />
      </a-form-item>
      <!-- Ngày -->
      <a-form-item label="Ngày" name="date" :required="true">
        <a-date-picker
          v-model:value="formState.date"
          format="DD/MM/YYYY"
          size="large"
          class="w-full"
          :disabled-date="disabledDate"
        />
      </a-form-item>

      <!-- Nhiệt độ, Chiều cao, Cân nặng -->
      <div class="grid grid-cols-3 gap-4">
        <a-form-item label="Nhiệt độ" name="temperature">
          <a-input-number
            v-model:value="formState.temperature"
            :min="0"
            :max="50"
            :step="0.1"
            placeholder="37.9"
            size="large"
            class="w-full"
          />
        </a-form-item>

        <a-form-item label="Chiều cao" name="height">
          <a-input-number
            v-model:value="formState.height"
            :min="0"
            :max="300"
            placeholder="87"
            size="large"
            class="w-full"
            addon-after="cm"
          />
        </a-form-item>

        <a-form-item label="Cân nặng" name="weight">
          <a-input-number
            v-model:value="formState.weight"
            :min="0"
            :max="200"
            :step="0.1"
            placeholder="4.5"
            size="large"
            class="w-full"
            addon-after="kg"
          />
        </a-form-item>
      </div>

      <!-- Tình trạng da -->
      <a-form-item label="Tình trạng da" name="skinCondition">
        <a-select v-model:value="formState.skinCondition" placeholder="Da bé bình thường" size="large">
          <a-select-option v-for="opt in skinConditionOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-select-option>
        </a-select>
      </a-form-item>

      <!-- Sức khỏe răng miệng -->
      <a-form-item label="Sức khỏe răng miệng" name="oralHealth">
        <a-select v-model:value="formState.oralHealth" placeholder="Da bé bình thường" size="large">
          <a-select-option v-for="opt in oralHealthOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-select-option>
        </a-select>
      </a-form-item>

      <!-- Dinh dưỡng -->
      <a-form-item label="Dinh dưỡng" name="nutrition">
        <a-select v-model:value="formState.nutrition" placeholder="Da bé bình thường" size="large">
          <a-select-option v-for="opt in nutritionOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-select-option>
        </a-select>
      </a-form-item>

      <!-- Giấc ngủ -->
      <a-form-item label="Giấc ngủ" name="sleep">
        <a-select v-model:value="formState.sleep" placeholder="Mất ngủ" size="large">
          <a-select-option v-for="opt in sleepOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-select-option>
        </a-select>
      </a-form-item>

      <!-- Tần suất đại tiện -->
      <a-form-item label="Tần suất đại tiện" name="stoolFrequency">
        <a-select v-model:value="formState.stoolFrequency" placeholder="1 lần / ngày" size="large">
          <a-select-option v-for="opt in stoolFrequencyOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-select-option>
        </a-select>
      </a-form-item>

      <!-- Tình trạng phân -->
      <a-form-item label="Tình trạng phân" name="stoolCondition">
        <a-select v-model:value="formState.stoolCondition" placeholder="Cứng, đặc" size="large">
          <a-select-option v-for="opt in stoolConditionOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-select-option>
        </a-select>
      </a-form-item>

      <!-- Vấn đề tiêu hóa -->
      <a-form-item label="Vấn đề tiêu hóa" name="digestiveIssues">
        <a-select v-model:value="formState.digestiveIssues" placeholder="Bị táo bón nhẹ" size="large">
          <a-select-option v-for="opt in digestiveIssuesOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-select-option>
        </a-select>
      </a-form-item>

      <!-- Phương pháp -->
      <a-form-item label="Phương pháp" name="method">
        <a-select v-model:value="formState.method" placeholder="EASY 2-3-4" size="large">
          <a-select-option v-for="opt in methodOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-select-option>
        </a-select>
      </a-form-item>

      <!-- Tập vận động và kỹ năng -->
      <a-form-item label="Tập vận động và kỹ năng" name="motorSkills">
        <a-select v-model:value="formState.motorSkills" placeholder="Bé bò, ngồi, vỗ, dũng" size="large">
          <a-select-option v-for="opt in motorSkillsOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-select-option>
        </a-select>
      </a-form-item>

      <!-- Tiêm chủng -->
      <a-form-item label="Tiêm chủng">
        <a-radio-group v-model:value="formState.hasVaccination" size="large">
          <a-radio :value="true">Có</a-radio>
          <a-radio :value="false">Không</a-radio>
        </a-radio-group>
      </a-form-item>

      <!-- Vaccination details (shown only if hasVaccination is true) -->
      <div v-if="formState.hasVaccination" class="grid grid-cols-2 gap-4">
        <a-form-item label="Ngày tiêm" name="vaccinationDate">
          <a-date-picker v-model:value="formState.vaccinationDate" format="DD/MM/YYYY" size="large" class="w-full" />
        </a-form-item>

        <a-form-item label="Mũi tiêm" name="vaccinationDose">
          <a-input v-model:value="formState.vaccinationDose" placeholder="Mũi tiêm" size="large" />
        </a-form-item>
      </div>

      <!-- Ghi chú -->
      <a-form-item label="Ghi chú" name="notes">
        <a-textarea v-model:value="formState.notes" :rows="4" placeholder="Bé bị sốt" :maxlength="500" show-count />
      </a-form-item>

      <!-- Tình trạng sức khỏe -->
      <a-form-item label="Tình trạng sức khỏe" name="healthStatus">
        <a-textarea
          v-model:value="formState.healthStatus"
          :rows="3"
          placeholder="Cần theo dõi thêm"
          :maxlength="500"
          show-count
        />
      </a-form-item>

      <!-- Submit Button -->
      <a-form-item class="submit-button-wrapper">
        <a-button type="primary" html-type="submit" size="large" block :loading="loading"> Gửi thông tin </a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { useHealthRecordsApi } from "~/composables/api/useHealthRecordsApi";
import { message } from "ant-design-vue";
import type { FormInstance } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { digestiveIssuesOptions, methodOptions, motorSkillsOptions, nutritionOptions, oralHealthOptions, skinConditionOptions, sleepOptions, stoolConditionOptions, stoolFrequencyOptions } from "~/constants/healthRecordOptions";

interface Props {
  visible?: boolean;
  healthBookId?: string;
}

interface FormState {
  date: Dayjs | null;
  temperature: number | null;
  height: number | null;
  weight: number | null;
  skinCondition: string;
  oralHealth: string;
  nutrition: string;
  sleep: string;
  stoolFrequency: string;
  stoolCondition: string;
  digestiveIssues: string;
  method: string;
  motorSkills: string;
  hasVaccination: boolean;
  vaccinationDate: Dayjs | null;
  vaccinationDose: string;
  notes: string;
  healthStatus: string;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
});

const emit = defineEmits<{
  "update:visible": [value: boolean];
  success: [];
}>();

// State
const isVisible = ref(props.visible);
const formRef = ref<FormInstance>();
const loading = ref(false);
const healthBookId = computed(() => props.healthBookId);

const formState = reactive<FormState>({
  date: dayjs(),
  temperature: null,
  height: null,
  weight: null,
  skinCondition: "",
  oralHealth: "",
  nutrition: "",
  sleep: "",
  stoolFrequency: "",
  stoolCondition: "",
  digestiveIssues: "",
  method: "",
  motorSkills: "",
  hasVaccination: false,
  vaccinationDate: null,
  vaccinationDose: "",
  notes: "",
  healthStatus: "",
});

// Validation rules
const rules: Record<string, Rule[]> = {
  date: [{ required: true, message: "Vui lòng chọn ngày", trigger: "change" }],
};

// Watch props
watch(
  () => props.visible,
  (newVal) => {
    isVisible.value = newVal;
  }
);

watch(isVisible, (newVal) => {
  if (!newVal) {
    emit("update:visible", false);
  }
});

// Disabled future dates
const disabledDate = (current: Dayjs) => {
  return current && current > dayjs().endOf("day");
};

// Form handlers
const { upsertHealthRecord } = useHealthRecordsApi();

const handleSubmit = async () => {
  try {
    loading.value = true;
    // Prepare data
    const healthRecordData = {
      date: formState.date?.format("YYYY-MM-DD"),
      temperature: formState.temperature,
      height: formState.height,
      weight: formState.weight,
      skinCondition: formState.skinCondition,
      oralHealth: formState.oralHealth,
      nutrition: formState.nutrition,
      sleep: formState.sleep,
      stoolFrequency: formState.stoolFrequency,
      stoolCondition: formState.stoolCondition,
      digestiveIssues: formState.digestiveIssues,
      method: formState.method,
      motorSkills: formState.motorSkills,
      vaccination: formState.hasVaccination
        ? {
            date: formState.vaccinationDate?.format("YYYY-MM-DD"),
            dose: formState.vaccinationDose,
          }
        : null,
      notes: formState.notes,
      healthStatus: formState.healthStatus,
    };
    // Gọi API tạo phiếu sức khỏe
    await upsertHealthRecord(healthBookId.value as string, healthRecordData);
    message.success("Đã lưu thông tin sức khỏe thành công!");
    emit("success");
    handleClose();
  } catch (error) {
    console.error("Error creating health record:", error);
    message.error("Có lỗi xảy ra khi lưu thông tin!");
  } finally {
    loading.value = false;
  }
};

const handleClose = () => {
  isVisible.value = false;
  resetForm();
};

const resetForm = () => {
  formRef.value?.resetFields();
  formState.date = dayjs();
  formState.temperature = null;
  formState.height = null;
  formState.weight = null;
  formState.hasVaccination = false;
  formState.vaccinationDate = null;
  formState.vaccinationDose = "";
};
</script>

<style scoped>
.modal-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #317BC4;
  margin: 0;
  text-align: center;
}

.health-form {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 8px;
}

/* Custom scrollbar */
.health-form::-webkit-scrollbar {
  width: 6px;
}

.health-form::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.health-form::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 3px;
}

.health-form::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}

/* Form styling */
:deep(.ant-form-item-label > label) {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

:deep(.ant-input),
:deep(.ant-input-number),
:deep(.ant-select-selector),
:deep(.ant-picker) {
  border-radius: 6px !important;
}

:deep(.ant-input-number) {
  width: 100%;
}

.submit-button-wrapper {
  margin-top: 32px;
  margin-bottom: 0;
}

:deep(.ant-btn-primary) {
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .modal-title {
    font-size: 20px;
  }

  .grid-cols-3 {
    grid-template-columns: 1fr;
  }

  .health-form {
    max-height: 60vh;
  }

  :deep(.ant-modal) {
    max-width: calc(100vw - 32px);
    margin: 16px;
  }

  :deep(.ant-modal-body) {
    padding: 16px;
  }
}
</style>

<style>
/* Global modal styles */
.create-health-record-modal.ant-modal {
  top: 50px;
}

.create-health-record-modal .ant-modal-content {
  border-radius: 12px;
  padding: 24px;
}

.create-health-record-modal .ant-modal-body {
  padding: 0;
}

.create-health-record-modal .ant-modal-close {
  top: 16px;
  right: 16px;
}
</style>
