<template>
  <a-modal 
    v-model:open="isVisible" 
    :footer="null" 
    :width="850" 
    :closable="true" 
    class="create-health-record-modal"
    centered
  >
    <!-- Form -->
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      layout="vertical"
      class="health-form"
      @finish="handleSubmit"
    >
      <!-- ========== PHẦN 1: Thông tin cơ bản ========== -->
      <div class="form-section section-1">
        <!-- Mã khách hàng -->
        <a-form-item label="Mã khách hàng">
          <a-input 
            :value="customerCode" 
            placeholder="NCY7HU" 
            size="large" 
            disabled 
            class="input-disabled"
          />
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
            <div class="input-with-unit">
              <a-input-number
                v-model:value="formState.height"
                :min="0"
                :max="300"
                placeholder="87"
                size="large"
                class="w-full"
              />
              <span class="unit">cm</span>
            </div>
          </a-form-item>

          <a-form-item label="Cân nặng" name="weight">
            <div class="input-with-unit">
              <a-input-number
                v-model:value="formState.weight"
                :min="0"
                :max="200"
                :step="0.1"
                placeholder="4.5"
                size="large"
                class="w-full"
              />
              <span class="unit">kg</span>
            </div>
          </a-form-item>
        </div>
      </div>

      <!-- ========== PHẦN 2: Tình trạng sức khỏe ========== -->
      <div class="form-section section-2">
        <!-- Tình trạng da -->
        <a-form-item label="Tình trạng da" name="skinCondition">
          <a-select 
            v-model:value="formState.skinCondition" 
            placeholder="Da bé bình thường" 
            size="large"
          >
            <a-select-option v-for="opt in skinConditionOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- Ghi chú tình trạng da -->
        <a-form-item label="Ghi chú tình trạng da" name="skinConditionNote">
          <a-select 
            v-model:value="formState.skinConditionNote" 
            placeholder="Da bé bình thường" 
            size="large"
          >
            <a-select-option v-for="opt in skinConditionNoteOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- Sức khỏe răng miệng -->
        <a-form-item label="Sức khỏe răng miệng" name="oralHealth">
          <a-select 
            v-model:value="formState.oralHealth" 
            placeholder="0 răng" 
            size="large"
          >
            <a-select-option v-for="opt in oralHealthOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- Ghi chú Sức khỏe răng miệng -->
        <a-form-item label="Ghi chú Sức khỏe răng miệng" name="oralHealthNote">
          <a-select 
            v-model:value="formState.oralHealthNote" 
            placeholder="0 răng" 
            size="large"
          >
            <a-select-option v-for="opt in oralHealthNoteOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- Dinh dưỡng -->
        <a-form-item label="Dinh dưỡng" name="nutrition">
          <a-select 
            v-model:value="formState.nutrition" 
            placeholder="Sữa mẹ" 
            size="large"
          >
            <a-select-option v-for="opt in nutritionOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- Ghi chú Dinh dưỡng -->
        <a-form-item label="Ghi chú Dinh dưỡng" name="nutritionNote">
          <a-select 
            v-model:value="formState.nutritionNote" 
            placeholder="Ăn bình thường" 
            size="large"
          >
            <a-select-option v-for="opt in nutritionNoteOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- Giấc ngủ -->
        <a-form-item label="Giấc ngủ" name="sleep">
          <a-select 
            v-model:value="formState.sleep" 
            placeholder="1 cữ ngủ/ngày" 
            size="large"
          >
            <a-select-option v-for="opt in sleepOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- Ghi chú Giấc ngủ -->
        <a-form-item label="Ghi chú Giấc ngủ" name="sleepNote">
          <a-select 
            v-model:value="formState.sleepNote" 
            placeholder="Ngủ đủ giấc" 
            size="large"
          >
            <a-select-option v-for="opt in sleepNoteOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </div>

      <!-- ========== PHẦN 3: Tiêu hóa ========== -->
      <div class="form-section section-3">
        <!-- Tần suất đại tiện -->
        <a-form-item label="Tần suất đại tiện" name="stoolFrequency">
          <a-select 
            v-model:value="formState.stoolFrequency" 
            placeholder="1 lần / ngày" 
            size="large"
          >
            <a-select-option v-for="opt in stoolFrequencyOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- Tình trạng phân -->
        <a-form-item label="Tình trạng phân" name="stoolCondition">
          <a-select 
            v-model:value="formState.stoolCondition" 
            placeholder="Cứng, đặc" 
            size="large"
          >
            <a-select-option v-for="opt in stoolConditionOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- Vấn đề tiêu hóa -->
        <a-form-item label="Vấn đề tiêu hóa" name="digestiveIssues">
          <a-select 
            v-model:value="formState.digestiveIssues" 
            placeholder="Bị táo bón nhẹ" 
            size="large"
          >
            <a-select-option v-for="opt in digestiveIssuesOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </div>

      <!-- ========== PHẦN 4: Phát triển ========== -->
      <div class="form-section section-4">
        <!-- Lịch sinh hoạt -->
        <a-form-item label="Lịch sinh hoạt" name="schedule">
          <a-select 
            v-model:value="formState.schedule" 
            placeholder="EASY 2 3 4" 
            size="large"
          >
            <a-select-option v-for="opt in scheduleOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- Ghi chú -->
        <a-form-item label="Ghi chú" name="notes">
          <a-textarea 
            v-model:value="formState.notes" 
            :rows="3" 
            placeholder="Bé bò, ngồi, vỗ, dũng" 
            :maxlength="500" 
          />
        </a-form-item>

        <!-- Mốc phát triển -->
        <a-form-item label="Mốc phát triển" name="developmentMilestone">
          <a-select 
            v-model:value="formState.developmentMilestone" 
            placeholder="0-2 tháng" 
            size="large"
          >
            <a-select-option v-for="opt in developmentMilestoneOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- Vận động thô -->
        <a-form-item label="Vận động thô" name="grossMotorSkills">
          <a-select 
            v-model:value="formState.grossMotorSkills" 
            placeholder="Chọn vận động thô" 
            size="large"
          >
            <template v-for="stage in grossMotorSkillsStages" :key="stage.period">
              <!-- Group header (disabled) -->
              <a-select-option 
                :value="`__group_${stage.period}__`" 
                disabled
                class="gross-motor-group-header"
              >
                <span style="font-weight: 700; color: #1f2937;">{{ stage.period }}</span>
              </a-select-option>
              <!-- Options in this group -->
              <a-select-option
                v-for="option in stage.options"
                :key="option.value"
                :value="option.value"
                class="gross-motor-option"
              >
                {{ option.label }}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>

        <!-- Vận động tĩnh -->
        <a-form-item label="Vận động tĩnh" name="fineMotorSkills">
          <a-select 
            v-model:value="formState.fineMotorSkills" 
            placeholder="Chọn vận động tĩnh" 
            size="large"
          >
            <template v-for="stage in fineMotorSkillsStages" :key="stage.period">
              <!-- Group header (disabled) -->
              <a-select-option 
                :value="`__group_${stage.period}__`" 
                disabled
                class="fine-motor-group-header"
              >
                <span style="font-weight: 700; color: #1f2937;">{{ stage.period }}</span>
              </a-select-option>
              <!-- Options in this group -->
              <a-select-option
                v-for="option in stage.options"
                :key="option.value"
                :value="option.value"
                class="fine-motor-option"
              >
                {{ option.label }}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>

        <!-- Thị giác và nhận thức -->
        <a-form-item label="Thị giác và nhận thức" name="visualCognition">
          <a-select 
            v-model:value="formState.visualCognition" 
            placeholder="Chọn thị giác và nhận thức" 
            size="large"
          >
            <template v-for="stage in visualCognitionStages" :key="stage.period">
              <!-- Group header (disabled) -->
              <a-select-option 
                :value="`__group_${stage.period}__`" 
                disabled
                class="visual-cognition-group-header"
              >
                <span style="font-weight: 700; color: #1f2937;">{{ stage.period }}</span>
              </a-select-option>
              <!-- Options in this group -->
              <a-select-option
                v-for="option in stage.options"
                :key="option.value"
                :value="option.value"
                class="visual-cognition-option"
              >
                {{ option.label }}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>

        <!-- Giao tiếp và cảm xúc -->
        <a-form-item label="Giao tiếp và cảm xúc" name="communicationEmotion">
          <a-select 
            v-model:value="formState.communicationEmotion" 
            placeholder="Chọn giao tiếp và cảm xúc" 
            size="large"
          >
            <template v-for="stage in communicationEmotionStages" :key="stage.period">
              <!-- Group header (disabled) -->
              <a-select-option 
                :value="`__group_${stage.period}__`" 
                disabled
                class="communication-emotion-group-header"
              >
                <span style="font-weight: 700; color: #1f2937;">{{ stage.period }}</span>
              </a-select-option>
              <!-- Options in this group -->
              <a-select-option
                v-for="option in stage.options"
                :key="option.value"
                :value="option.value"
                class="communication-emotion-option"
              >
                {{ option.label }}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>

        <!-- Dấu hiệu cảnh báo sớm -->
        <a-form-item label="Dấu hiệu cảnh báo sớm" name="earlyWarning">
          <a-select 
            v-model:value="formState.earlyWarning" 
            placeholder="Chọn dấu hiệu cảnh báo sớm" 
            size="large"
          >
            <template v-for="stage in earlyWarningStages" :key="stage.period">
              <template v-if="stage.options && stage.options.length > 0">
                <!-- Group header (disabled) -->
                <a-select-option 
                  :value="`__group_${stage.period}__`" 
                  disabled
                  class="early-warning-group-header"
                >
                  <span style="font-weight: 700; color: #1f2937;">{{ stage.period }}</span>
                </a-select-option>
                <!-- Options in this group -->
                <a-select-option
                  v-for="option in stage.options"
                  :key="option.value"
                  :value="option.value"
                  class="early-warning-option"
                >
                  {{ option.label }}
                </a-select-option>
              </template>
            </template>
          </a-select>
        </a-form-item>
      </div>

      <!-- Submit Button -->
      <a-form-item class="submit-button-wrapper">
        <a-button 
          type="primary" 
          html-type="submit" 
          size="large" 
          block 
          :loading="loading"
          class="submit-btn"
        > 
          Gửi thông tin 
        </a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import { useHealthRecordsApi } from "~/composables/api/useHealthRecordsApi";
import { message } from "ant-design-vue";
import type { FormInstance } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import {
  stoolConditionOptions,
  skinConditionOptions,
  skinConditionNoteOptions,
  oralHealthOptions,
  oralHealthNoteOptions,
  nutritionOptions,
  nutritionNoteOptions,
  sleepOptions,
  sleepNoteOptions,
  stoolFrequencyOptions,
  digestiveIssuesOptions,
  scheduleOptions,
  developmentMilestoneOptions,
  grossMotorSkillsStages,
  grossMotorSkillsOptions,
  fineMotorSkillsStages,
  fineMotorSkillsOptions,
  visualCognitionStages,
  visualCognitionOptions,
  communicationEmotionStages,
  communicationEmotionOptions,
  earlyWarningStages,
  earlyWarningOptions,
} from "~/constants/healthRecordOptions";

// skinConditionOptions imported from constants

// skinConditionNoteOptions imported from constants

// oralHealthOptions imported from constants

// oralHealthNoteOptions imported from constants

// nutritionOptions imported from constants

// nutritionNoteOptions imported from constants

// sleepOptions imported from constants

// sleepNoteOptions imported from constants

// stoolFrequencyOptions imported from constants

// digestiveIssuesOptions imported from constants

// scheduleOptions imported from constants

// developmentMilestoneOptions imported from constants

// grossMotorSkillsStages imported from constants

// grossMotorSkillsOptions imported from constants

// fineMotorSkillsStages imported from constants

// fineMotorSkillsOptions imported from constants

// visualCognitionStages imported from constants

// visualCognitionOptions imported from constants

// communicationEmotionStages imported from constants
// communicationEmotionStages, communicationEmotionOptions, earlyWarningStages, earlyWarningOptions imported from constants

interface Props {
  visible?: boolean;
  healthBookId?: string;
  selectedDate?: Dayjs | null;
}

interface FormState {
  date: Dayjs | null;
  temperature: number | null;
  height: number | null;
  weight: number | null;
  skinCondition: string;
  skinConditionNote: string;
  oralHealth: string;
  oralHealthNote: string;
  nutrition: string;
  nutritionNote: string;
  sleep: string;
  sleepNote: string;
  stoolFrequency: string;
  stoolCondition: string;
  digestiveIssues: string;
  schedule: string;
  notes: string;
  developmentMilestone: string;
  grossMotorSkills: string;
  fineMotorSkills: string;
  visualCognition: string;
  communicationEmotion: string;
  earlyWarning: string;
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
const customerCode = computed(() => {
  // Generate customer code from healthBookId or use placeholder
  if (props.healthBookId) {
    return props.healthBookId.slice(-6).toUpperCase();
  }
  return 'NCY7HU';
});

const formState = reactive<FormState>({
  date: dayjs(),
  temperature: null,
  height: null,
  weight: null,
  skinCondition: "",
  skinConditionNote: "",
  oralHealth: "",
  oralHealthNote: "",
  nutrition: "",
  nutritionNote: "",
  sleep: "",
  sleepNote: "",
  stoolFrequency: "",
  stoolCondition: "",
  digestiveIssues: "",
  schedule: "",
  notes: "",
  developmentMilestone: "",
  grossMotorSkills: "",
  fineMotorSkills: "",
  visualCognition: "",
  communicationEmotion: "",
  earlyWarning: "",
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

watch(
  () => props.selectedDate,
  (newVal) => {
    if (newVal) {
      formState.date = newVal;
    }
  },
  { immediate: true }
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
      skinConditionNote: formState.skinConditionNote,
      oralHealth: formState.oralHealth,
      oralHealthNote: formState.oralHealthNote,
      nutrition: formState.nutrition,
      nutritionNote: formState.nutritionNote,
      sleep: formState.sleep,
      sleepNote: formState.sleepNote,
      stoolFrequency: formState.stoolFrequency,
      stoolCondition: formState.stoolCondition,
      digestiveIssues: formState.digestiveIssues,
      schedule: formState.schedule,
      notes: formState.notes,
      developmentMilestone: formState.developmentMilestone,
      grossMotorSkills: formState.grossMotorSkills && !formState.grossMotorSkills.startsWith('__group_') ? formState.grossMotorSkills : '',
      fineMotorSkills: formState.fineMotorSkills && !formState.fineMotorSkills.startsWith('__group_') ? formState.fineMotorSkills : '',
      visualCognition: formState.visualCognition && !formState.visualCognition.startsWith('__group_') ? formState.visualCognition : '',
      communicationEmotion: formState.communicationEmotion && !formState.communicationEmotion.startsWith('__group_') ? formState.communicationEmotion : '',
      earlyWarning: formState.earlyWarning && !formState.earlyWarning.startsWith('__group_') ? formState.earlyWarning : '',
    };
    // Gọi API tạo phiếu sức khỏe
    const response = await upsertHealthRecord(healthBookId.value as string, healthRecordData);
    
    // Check if API call was successful
    if (response.status === false) {
      // Error already shown by apiClient, don't show duplicate
      return;
    }
    
    message.success("Đã lưu thông tin sức khỏe thành công!");
    emit("success");
    handleClose();
  } catch (error) {
    // Error already shown by apiClient
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
  formState.skinCondition = "";
  formState.skinConditionNote = "";
  formState.oralHealth = "";
  formState.oralHealthNote = "";
  formState.nutrition = "";
  formState.nutritionNote = "";
  formState.sleep = "";
  formState.sleepNote = "";
  formState.stoolFrequency = "";
  formState.stoolCondition = "";
  formState.digestiveIssues = "";
  formState.schedule = "";
  formState.notes = "";
  formState.developmentMilestone = "";
  formState.grossMotorSkills = "";
  formState.fineMotorSkills = "";
  formState.visualCognition = "";
  formState.communicationEmotion = "";
  formState.earlyWarning = "";
};
</script>

<style scoped>
.health-form {
  max-height: 80vh;
  overflow-y: auto;
  padding: 0 8px;
}

/* Custom scrollbar */
.health-form::-webkit-scrollbar {
  width: 4px;
}

.health-form::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.health-form::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.health-form::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* ========== Form Sections ========== */
.form-section {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 14px;
  padding: 20px 24px;
  margin-bottom: 16px;
}

/* Phần 1: Thông tin cơ bản - Height 271px */
.section-1 {
  min-height: 200px;
}

/* Phần 2: Tình trạng sức khỏe - Height 672px */
.section-2 {
  min-height: 500px;
}

/* Phần 3: Tiêu hóa - Height 270px */
.section-3 {
  min-height: 200px;
}

/* Phần 4: Phát triển - Height 701px */
.section-4 {
  min-height: 550px;
}

/* Input with unit */
.input-with-unit {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-unit .unit {
  position: absolute;
  right: 12px;
  color: #999;
  font-size: 14px;
  pointer-events: none;
}

.input-with-unit :deep(.ant-input-number) {
  padding-right: 35px;
}

/* Disabled input style */
.input-disabled {
  background-color: #e6f7ff !important;
  border-color: #91d5ff !important;
  color: #1890ff !important;
}

:deep(.input-disabled.ant-input-disabled) {
  background-color: #e6f7ff !important;
  border-color: #91d5ff !important;
  color: #1890ff !important;
}

/* Form styling */
:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.ant-form-item-label > label) {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

:deep(.ant-input),
:deep(.ant-input-number),
:deep(.ant-select-selector),
:deep(.ant-picker) {
  border-radius: 6px !important;
  border-color: #e5e7eb !important;
}

:deep(.ant-input:focus),
:deep(.ant-input-number:focus),
:deep(.ant-input-number-focused),
:deep(.ant-select-focused .ant-select-selector),
:deep(.ant-picker-focused) {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
}

:deep(.ant-input-number) {
  width: 100%;
}

:deep(.ant-select-selector) {
  height: 40px !important;
}

:deep(.ant-select-selection-item) {
  line-height: 38px !important;
}

/* Fine Motor Skills - Group header styling */
:deep(.fine-motor-group-header) {
  font-weight: 700 !important;
  font-weight: bold !important;
  color: #1f2937 !important;
  font-size: 13px !important;
  padding: 8px 12px !important;
  background-color: #f9fafb !important;
  border-bottom: 1px solid #e5e7eb !important;
  cursor: default !important;
  pointer-events: none !important;
  user-select: none !important;
  opacity: 1 !important;
}

:deep(.fine-motor-group-header .ant-select-item-option-content) {
  font-weight: 700 !important;
  font-weight: bold !important;
  color: #1f2937 !important;
}

:deep(.fine-motor-group-header:hover) {
  background-color: #f9fafb !important;
}

:deep(.fine-motor-group-header:hover .ant-select-item-option-content) {
  font-weight: 700 !important;
  font-weight: bold !important;
  color: #1f2937 !important;
}

:deep(.fine-motor-option) {
  padding-left: 24px !important;
  padding-right: 12px !important;
}

/* Visual Cognition - Group header styling */
:deep(.visual-cognition-group-header) {
  font-weight: 700 !important;
  font-weight: bold !important;
  color: #1f2937 !important;
  font-size: 13px !important;
  padding: 8px 12px !important;
  background-color: #f9fafb !important;
  border-bottom: 1px solid #e5e7eb !important;
  cursor: default !important;
  pointer-events: none !important;
  user-select: none !important;
  opacity: 1 !important;
}

:deep(.visual-cognition-group-header .ant-select-item-option-content) {
  font-weight: 700 !important;
  font-weight: bold !important;
  color: #1f2937 !important;
}

:deep(.visual-cognition-group-header:hover) {
  background-color: #f9fafb !important;
}

:deep(.visual-cognition-group-header:hover .ant-select-item-option-content) {
  font-weight: 700 !important;
  font-weight: bold !important;
  color: #1f2937 !important;
}

:deep(.visual-cognition-option) {
  padding-left: 24px !important;
  padding-right: 12px !important;
}

/* Communication Emotion - Group header styling */
:deep(.communication-emotion-group-header) {
  font-weight: 700 !important;
  font-weight: bold !important;
  color: #1f2937 !important;
  font-size: 13px !important;
  padding: 8px 12px !important;
  background-color: #f9fafb !important;
  border-bottom: 1px solid #e5e7eb !important;
  cursor: default !important;
  pointer-events: none !important;
  user-select: none !important;
  opacity: 1 !important;
}

:deep(.communication-emotion-group-header .ant-select-item-option-content) {
  font-weight: 700 !important;
  font-weight: bold !important;
  color: #1f2937 !important;
}

:deep(.communication-emotion-group-header:hover) {
  background-color: #f9fafb !important;
}

:deep(.communication-emotion-group-header:hover .ant-select-item-option-content) {
  font-weight: 700 !important;
  font-weight: bold !important;
  color: #1f2937 !important;
}

:deep(.communication-emotion-option) {
  padding-left: 24px !important;
  padding-right: 12px !important;
}

/* Early Warning - Group header styling */
:deep(.early-warning-group-header) {
  font-weight: 700 !important;
  font-weight: bold !important;
  color: #1f2937 !important;
  font-size: 13px !important;
  padding: 8px 12px !important;
  background-color: #f9fafb !important;
  border-bottom: 1px solid #e5e7eb !important;
  cursor: default !important;
  pointer-events: none !important;
  user-select: none !important;
  opacity: 1 !important;
}

:deep(.early-warning-group-header .ant-select-item-option-content) {
  font-weight: 700 !important;
  font-weight: bold !important;
  color: #1f2937 !important;
}

:deep(.early-warning-group-header:hover) {
  background-color: #f9fafb !important;
}

:deep(.early-warning-group-header:hover .ant-select-item-option-content) {
  font-weight: 700 !important;
  font-weight: bold !important;
  color: #1f2937 !important;
}

:deep(.early-warning-option) {
  padding-left: 24px !important;
  padding-right: 12px !important;
}

/* Communication Emotion - Group header styling */
:deep(.communication-emotion-group-header) {
  font-weight: 700 !important;
  font-weight: bold !important;
  color: #1f2937 !important;
  font-size: 13px !important;
  padding: 8px 12px !important;
  background-color: #f9fafb !important;
  border-bottom: 1px solid #e5e7eb !important;
  cursor: default !important;
  pointer-events: none !important;
  user-select: none !important;
  opacity: 1 !important;
}

:deep(.communication-emotion-group-header .ant-select-item-option-content) {
  font-weight: 700 !important;
  font-weight: bold !important;
  color: #1f2937 !important;
}

:deep(.communication-emotion-group-header:hover) {
  background-color: #f9fafb !important;
}

:deep(.communication-emotion-group-header:hover .ant-select-item-option-content) {
  font-weight: 700 !important;
  font-weight: bold !important;
  color: #1f2937 !important;
}

:deep(.communication-emotion-option) {
  padding-left: 24px !important;
  padding-right: 12px !important;
}

/* Gross Motor Skills - Group header styling */
:deep(.gross-motor-group-header) {
  font-weight: 700 !important;
  font-weight: bold !important;
  color: #1f2937 !important;
  font-size: 13px !important;
  padding: 8px 12px !important;
  background-color: #f9fafb !important;
  border-bottom: 1px solid #e5e7eb !important;
  cursor: default !important;
  pointer-events: none !important;
  user-select: none !important;
  opacity: 1 !important;
}

:deep(.gross-motor-group-header .ant-select-item-option-content) {
  font-weight: 700 !important;
  font-weight: bold !important;
  color: #1f2937 !important;
}

:deep(.gross-motor-group-header:hover) {
  background-color: #f9fafb !important;
}

:deep(.gross-motor-group-header:hover .ant-select-item-option-content) {
  font-weight: 700 !important;
  font-weight: bold !important;
  color: #1f2937 !important;
}

:deep(.gross-motor-option) {
  padding-left: 24px !important;
  padding-right: 12px !important;
}

:deep(.ant-select-selection-placeholder) {
  line-height: 38px !important;
}

/* Submit button */
.submit-button-wrapper {
  margin-top: 24px;
  margin-bottom: 0;
}

.submit-btn {
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  background: #317BC4 !important;
  border-color: #317BC4 !important;
}

.submit-btn:hover {
  background: #2563eb !important;
  border-color: #2563eb !important;
}

/* Grid responsive */
@media (max-width: 640px) {
  .grid-cols-3 {
    grid-template-columns: 1fr;
  }
  
  .form-section {
    padding: 16px;
    border-radius: 10px;
  }
}
</style>

<style>
/* Global modal styles */
.create-health-record-modal.ant-modal {
  max-width: 95vw;
}

.create-health-record-modal .ant-modal-content {
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.create-health-record-modal .ant-modal-body {
  padding: 0;
}

.create-health-record-modal .ant-modal-close {
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
}

.create-health-record-modal .ant-modal-close-x {
  width: 32px;
  height: 32px;
  line-height: 32px;
}
</style>
