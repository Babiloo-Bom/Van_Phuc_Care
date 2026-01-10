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
  stoolConditionOptions 
} from "~/constants/healthRecordOptions";

// Tình trạng da options
const skinConditionOptions = [
  { label: 'Da bình thường', value: 'normal' },
  { label: 'Da khô', value: 'dry' },
  { label: 'Nổi mẩn đỏ', value: 'rash' },
  { label: 'Chàm sữa', value: 'eczema' },
  { label: 'Vàng da sinh lý', value: 'jaundice' },
  { label: 'Rôm sảy', value: 'heat_rash' },
  { label: 'Viêm da tiết bã', value: 'seborrheic_dermatitis' },
  { label: 'Mụn sữa', value: 'milia' },
];

const skinConditionNoteOptions = [
  { label: 'Bình thường', value: 'normal' },
  { label: 'Cần theo dõi', value: 'monitor' },
  { label: 'Đang điều trị', value: 'treating' },
];

// Sức khỏe răng miệng options (0-20 răng)
const oralHealthOptions = [
  { label: '0 răng', value: '0_teeth' },
  { label: '1 răng', value: '1_teeth' },
  { label: '2 răng', value: '2_teeth' },
  { label: '3 răng', value: '3_teeth' },
  { label: '4 răng', value: '4_teeth' },
  { label: '5 răng', value: '5_teeth' },
  { label: '6 răng', value: '6_teeth' },
  { label: '7 răng', value: '7_teeth' },
  { label: '8 răng', value: '8_teeth' },
  { label: '9 răng', value: '9_teeth' },
  { label: '10 răng', value: '10_teeth' },
  { label: '11 răng', value: '11_teeth' },
  { label: '12 răng', value: '12_teeth' },
  { label: '13 răng', value: '13_teeth' },
  { label: '14 răng', value: '14_teeth' },
  { label: '15 răng', value: '15_teeth' },
  { label: '16 răng', value: '16_teeth' },
  { label: '17 răng', value: '17_teeth' },
  { label: '18 răng', value: '18_teeth' },
  { label: '19 răng', value: '19_teeth' },
  { label: '20 răng', value: '20_teeth' },
];

// Ghi chú sức khỏe răng miệng options (0-20 răng)
const oralHealthNoteOptions = [
  { label: 'Tưa lưỡi/Nấm miệng', value: 'oral_thrush' },
  { label: 'Viêm nướu', value: 'gingivitis' },
  { label: 'Hôi miệng', value: 'bad_breath' },
];

// Dinh dưỡng options
const nutritionOptions = [
  { label: 'Sữa mẹ', value: 'breast_milk' },
  { label: 'Sữa công thức', value: 'formula' },
  { label: 'Ăn dặm', value: 'solid_food' },
  { label: 'Sữa mẹ + Sữa công thức', value: 'breast_milk_formula' },
  { label: 'Ăn dặm + Sữa công thức', value: 'solid_food_formula' },
  { label: 'Ăn dặm + Sữa mẹ', value: 'solid_food_breast_milk' },
  { label: 'Ăn dặm + Sữa mẹ + Sữa công thức', value: 'solid_food_breast_milk_formula' },
];

// Ghi chú dinh dưỡng options
const nutritionNoteOptions = [
  { label: 'Ăn bình thường', value: 'normal' },
  { label: 'Ăn ít', value: 'eat_less' },
  { label: 'Ăn nhiều', value: 'eat_more' },
  { label: 'Chán ăn', value: 'loss_appetite' },
  { label: 'Bỏ ăn', value: 'refuse_eat' },
];

// Giấc ngủ options
const sleepOptions = [
  { label: '1 cữ ngủ/ngày', value: '1_nap' },
  { label: '2 cữ ngủ/ngày', value: '2_naps' },
  { label: '3 cữ ngủ/ngày', value: '3_naps' },
  { label: '4 cữ ngủ/ngày', value: '4_naps' },
  { label: '5 cữ ngủ/ngày', value: '5_naps' },
  { label: '6 cữ ngủ/ngày', value: '6_naps' },
];

// Ghi chú giấc ngủ options
const sleepNoteOptions = [
  { label: 'Ngủ vặt', value: 'short_naps' },
  { label: 'Ngủ khó vào giấc', value: 'hard_to_sleep' },
  { label: 'Không chuyển giấc được', value: 'cant_transition' },
  { label: 'Ngủ hay giật mình', value: 'startled_sleep' },
  { label: 'Ngủ li bì', value: 'drowsy' },
  { label: 'Ngủ đủ giấc', value: 'enough_sleep' },
];

// Tần suất đại tiện options
const stoolFrequencyOptions = [
  { label: '0 lần/ngày', value: '0_per_day' },
  { label: '1-2 lần/ngày', value: '1-2_per_day' },
  { label: '3-4 lần/ngày', value: '3-4_per_day' },
  { label: '5+ lần/ngày', value: '5+_per_day' },
];

// Vấn đề tiêu hóa options
const digestiveIssuesOptions = [
  { label: 'Táo bón', value: 'constipation' },
  { label: 'Tiêu chảy', value: 'diarrhea' },
  { label: 'Trào ngược', value: 'reflux' },
  { label: 'Đầy hơi', value: 'bloating' },
  { label: 'Nôn', value: 'vomiting' },
  { label: 'Trớ', value: 'spitting_up' },
  { label: 'Cặn sữa', value: 'milk_residue' },
];

// Lịch sinh hoạt options
const scheduleOptions = [
  { label: 'EASY 3', value: 'easy_3' },
  { label: 'EASY 3.5', value: 'easy_3_5' },
  { label: 'EASY 4', value: 'easy_4' },
  { label: 'EASY 2-3-4', value: 'easy_2_3_4' },
  { label: 'EASY 5-6', value: 'easy_5_6' },
  { label: 'Khác', value: 'other' },
];

// Mốc phát triển options
const developmentMilestoneOptions = [
  { label: '0-2 tháng', value: '0-2_months' },
  { label: '3-5 tháng', value: '3-5_months' },
  { label: '7-9 tháng', value: '7-9_months' },
  { label: '10-12 tháng', value: '10-12_months' },
  { label: '13-18 tháng', value: '13-18_months' },
  { label: '19-24 tháng', value: '19-24_months' },
];

// Vận động thô - Cấu trúc theo giai đoạn
const grossMotorSkillsStages = [
  {
    period: '0-3 tháng',
    options: [
      { label: 'Nâng đầu/ngực khi nằm sấp', value: 'lift_head_chest' },
      { label: 'Chuyển động chân tay nhịp nhàng', value: 'rhythmic_movement' },
      { label: 'Giữ đầu ổn định hơn khi được bế', value: 'hold_head_stable' },
    ],
  },
  {
    period: '4-6 tháng',
    options: [
      { label: 'Lật thành thạo', value: 'roll_mastery' },
      { label: 'Bắt đầu tập ngồi', value: 'start_sitting' },
      { label: 'Có thể tự ngồi 2-5p', value: 'sit_independent_2_5min' },
    ],
  },
  {
    period: '7-9 tháng',
    options: [
      { label: 'Bắt đầu biết bò -> thành thạo', value: 'crawl_start_mastery' },
      { label: 'Vịn tường, thành giường đứng dậy', value: 'pull_to_stand' },
    ],
  },
  {
    period: '10-12 tháng',
    options: [
      { label: 'Bắt đầu tập đi, đi men', value: 'start_walking_cruising' },
      { label: 'Đứng độc lập được vài giây', value: 'stand_independent_seconds' },
    ],
  },
  {
    period: '13-18 tháng',
    options: [
      { label: 'Bắt đầu đi vững, ít ngã, có thể chạy', value: 'walk_steady_run' },
      { label: 'Tự xúc đồ ăn, vẫn còn rơi vãi', value: 'self_feed_spill' },
      { label: 'Cầm cốc uống thành thạo', value: 'cup_drinking_mastery' },
    ],
  },
  {
    period: '19-24 tháng',
    options: [
      { label: 'Chạy vững vàng', value: 'run_steady' },
      { label: 'Lên xuống cầu thang', value: 'stairs_up_down' },
      { label: 'Biết đá bóng', value: 'kick_ball' },
      { label: 'Biết bật chân lên khỏi mặt đất', value: 'jump_off_ground' },
    ],
  },
];

const grossMotorSkillsOptions = [
  { label: 'Bé bò, ngồi, vỗ, dũng', value: 'crawling_sitting' },
  { label: 'Đi được', value: 'walking' },
  { label: 'Chạy được', value: 'running' },
  { label: 'Leo trèo được', value: 'climbing' },
  { label: 'Chậm phát triển', value: 'delayed' },
  { label: 'Khác', value: 'other' },
];

// Vận động tĩnh - Cấu trúc theo giai đoạn
const fineMotorSkillsStages = [
  {
    period: '0-3 tháng',
    options: [
      { label: 'Mở bàn tay thả lỏng', value: 'open_hand_relaxed' },
      { label: 'Phản xạ nắm', value: 'grasp_reflex' },
      { label: 'Đưa tay lên miệng', value: 'hand_to_mouth' },
    ],
  },
  {
    period: '4-6 tháng',
    options: [
      { label: 'Thành thạo cầm nắm', value: 'grasp_mastery' },
      { label: 'Chuyển đồ vật từ tay này qua tay khác/cho vào mồm', value: 'transfer_to_mouth' },
      { label: 'Khám phá đồ vật bằng miệng', value: 'explore_with_mouth' },
    ],
  },
  {
    period: '7-9 tháng',
    options: [
      { label: 'Cầm nắm thành thạo hơn', value: 'grasp_more_mastery' },
      { label: 'Sử dụng ngón cái ngón trỏ nhặt vật nhỏ', value: 'pincer_grasp' },
      { label: 'Đập 2 vật vào nhau', value: 'bang_objects' },
    ],
  },
  {
    period: '10-12 tháng',
    options: [
      { label: 'Hiểu công dụng đồ vật', value: 'understand_object_use' },
    ],
  },
  {
    period: '13-18 tháng',
    options: [
      { label: 'Bắt đầu biết giả vờ bắt chước người lớn', value: 'pretend_imitate' },
    ],
  },
  {
    period: '19-24 tháng',
    options: [
      { label: 'Phân loại hình dạng và màu sắc', value: 'sort_shapes_colors' },
      { label: 'Bắt đầu biết tô màu', value: 'start_coloring' },
    ],
  },
];

const fineMotorSkillsOptions = [
  { label: 'Bé bò, ngồi, vỗ, dũng', value: 'basic' },
  { label: 'Cầm nắm tốt', value: 'grasping' },
  { label: 'Sử dụng ngón tay', value: 'finger_use' },
  { label: 'Vẽ, viết', value: 'drawing_writing' },
  { label: 'Chậm phát triển', value: 'delayed' },
  { label: 'Khác', value: 'other' },
];

// Thị giác và nhận thức - Cấu trúc theo giai đoạn
const visualCognitionStages = [
  {
    period: '0-3 tháng',
    options: [
      { label: 'Nhìn theo vật di chuyển từ trái sang phải', value: 'track_left_right' },
      { label: 'Nhìn chăm chú vào khuôn mặt người chăm sóc', value: 'stare_caregiver_face' },
    ],
  },
  {
    period: '4-6 tháng',
    options: [
      { label: 'Lấy đồ có chủ đích', value: 'intentional_reach' },
      { label: 'Sử dụng bàn tay lấy vật nhỏ', value: 'hand_grasp_small' },
    ],
  },
  {
    period: '7-9 tháng',
    options: [
      { label: 'Nhận biết sự tồn tại của đồ vật, thích chơi ú òa', value: 'object_permanence_peekaboo' },
      { label: 'Nhìn theo vật rơi xuống đất', value: 'track_falling_object' },
    ],
  },
  {
    period: '10-12 tháng',
    options: [
      { label: 'Tìm đồ vật bị giấu', value: 'find_hidden_object' },
      { label: 'Bắt chước hành động người khác', value: 'imitate_actions' },
      { label: 'Cho đồ vào hộp rồi lấy ra', value: 'put_take_out_box' },
    ],
  },
  {
    period: '13-18 tháng',
    options: [
      { label: 'Hiểu ngôn ngữ và chỉ dẫn đơn giản', value: 'understand_simple_instructions' },
    ],
  },
  {
    period: '19-24 tháng',
    options: [
      { label: 'Tương tác với người xung quanh nhưng chưa hòa đồng', value: 'interact_not_social' },
      { label: 'Muốn tự làm mọi thứ, không làm được sẽ ăn vạ', value: 'want_independence_tantrum' },
    ],
  },
];

const visualCognitionOptions = [
  { label: 'Bé bò, ngồi, vỗ, dũng', value: 'basic' },
  { label: 'Nhận biết màu sắc', value: 'color_recognition' },
  { label: 'Nhận biết hình dạng', value: 'shape_recognition' },
  { label: 'Giải quyết vấn đề đơn giản', value: 'problem_solving' },
  { label: 'Chậm phát triển', value: 'delayed' },
  { label: 'Khác', value: 'other' },
];

// Giao tiếp và cảm xúc - Cấu trúc theo giai đoạn
const communicationEmotionStages = [
  {
    period: '0-3 tháng',
    options: [
      { label: 'Nụ cười xã hội', value: 'social_smile' },
      { label: 'Hóng chuyện, phát ra âm thanh gù gù', value: 'cooing_sounds' },
      { label: 'Bình tĩnh lại khi được bế hoặc nói chuyện', value: 'calm_when_held_talked' },
    ],
  },
  {
    period: '4-6 tháng',
    options: [
      { label: 'Bập bẹ các âm tiết đơn giản', value: 'babble_simple_syllables' },
    ],
  },
  {
    period: '7-9 tháng',
    options: [
      { label: 'Hiểu được từ không', value: 'understand_no' },
      { label: 'Bắt chước âm thanh cử chỉ', value: 'imitate_sounds_gestures' },
      { label: 'Nói bập bẹ chuỗi dài hơn', value: 'longer_babble' },
    ],
  },
  {
    period: '10-12 tháng',
    options: [
      { label: 'Bắt đầu nói đc từ đơn', value: 'start_single_words' },
      { label: 'Giao tiếp bằng cử chỉ (vẫy tay, lắc đầu,...)', value: 'gesture_communication' },
    ],
  },
  {
    period: '13-18 tháng',
    options: [
      { label: 'Giai đoạn bùng nổ ngôn ngữ (nói đc 3-20 từ đơn)', value: 'language_explosion' },
      { label: 'Hiểu mệnh lệnh đơn giản', value: 'understand_simple_commands' },
    ],
  },
  {
    period: '19-24 tháng',
    options: [
      { label: 'Ghép từ và câu ngắn', value: 'combine_words_short_sentences' },
      { label: 'Vốn từ vựng ~50 từ', value: 'vocabulary_50_words' },
      { label: 'Thể hiện sự ngang bướng', value: 'show_stubbornness' },
    ],
  },
];

const communicationEmotionOptions = [
  { label: 'Bé bò, ngồi, vỗ, dũng', value: 'basic' },
  { label: 'Nói được từ đơn', value: 'single_words' },
  { label: 'Nói câu ngắn', value: 'short_sentences' },
  { label: 'Giao tiếp tốt', value: 'good_communication' },
  { label: 'Chậm nói', value: 'speech_delay' },
  { label: 'Khác', value: 'other' },
];

// Dấu hiệu cảnh báo sớm - Cấu trúc theo giai đoạn
const earlyWarningStages = [
  {
    period: '0-3 tháng',
    options: [
      { label: 'Cổ quá mềm', value: 'neck_too_soft' },
      { label: 'Cứng cơ', value: 'muscle_stiffness' },
      { label: 'Không nhấc được đầu khi nằm sấp', value: 'cant_lift_head_tummy' },
      { label: 'Bàn tay nắm chặt liên tục sau 3 tháng tuổi', value: 'tight_fist_after_3months' },
      { label: 'Không cầm nắm vật đặt vào tay', value: 'no_grasp_object' },
      { label: 'Không nhìn theo vật chuyển động', value: 'no_track_moving_object' },
      { label: 'Không giao tiếp bằng mắt', value: 'no_eye_contact' },
      { label: 'Không cười với người khác sau 3 tháng', value: 'no_smile_after_3months' },
      { label: 'Không phản ứng với tiếng động lớn', value: 'no_response_loud_sound' },
      { label: 'Quấy khóc liên tục không thể dỗ dành', value: 'excessive_crying' },
    ],
  },
  {
    period: '4-6 tháng',
    options: [
      { label: 'Không lật được', value: 'cant_roll' },
      { label: 'Cơ thể quá mềm hoặc quá cứng', value: 'body_too_soft_or_stiff' },
      { label: 'Chỉ với tay bằng một bên (nguy cơ liệt nửa người hoặc tổn thương thần kinh)', value: 'one_hand_reach_only' },
      { label: 'Không cười, không phát ra âm thanh', value: 'no_smile_no_sound' },
    ],
  },
  {
    period: '7-9 tháng',
    options: [
      { label: 'Không thể ngồi vững', value: 'cant_sit_stable' },
      { label: 'Không dồn trọng lượng lên chân khi được bế đứng', value: 'no_weight_bearing_legs' },
      { label: 'Không bập bẹ', value: 'no_babbling' },
      { label: 'Không phản ứng khi được gọi tên', value: 'no_response_name' },
      { label: 'Không quan tâm đến đồ chơi', value: 'no_interest_toys' },
      { label: 'Không nhìn theo hướng chỉ tay của người lớn', value: 'no_follow_pointing' },
    ],
  },
  {
    period: '10-12 tháng',
    options: [],
  },
  {
    period: '13-18 tháng',
    options: [
      { label: 'Không chỉ ngón tay để thể hiện sự quan tâm', value: 'no_pointing_interest' },
      { label: 'Không chơi giả vờ', value: 'no_pretend_play' },
      { label: 'Không nhìn vào mắt người đối diện khi giao tiếp', value: 'no_eye_contact_communication' },
      { label: 'Mất đi kỹ năng đã có', value: 'loss_acquired_skills' },
    ],
  },
  {
    period: '19-24 tháng',
    options: [],
  },
];

const earlyWarningOptions = [
  { label: 'Bé bò, ngồi, vỗ, dũng', value: 'none' },
  { label: 'Không có', value: 'no_warning' },
  { label: 'Chậm phát triển vận động', value: 'motor_delay' },
  { label: 'Chậm phát triển ngôn ngữ', value: 'language_delay' },
  { label: 'Vấn đề về thị giác', value: 'vision_issue' },
  { label: 'Vấn đề về thính giác', value: 'hearing_issue' },
  { label: 'Khác', value: 'other' },
];

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
    console.error("Error creating health record:", error);
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
  top: 16px;
  right: 16px;
}

.create-health-record-modal .ant-modal-close-x {
  width: 32px;
  height: 32px;
  line-height: 32px;
}
</style>
