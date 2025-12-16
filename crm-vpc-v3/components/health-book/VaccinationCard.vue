<template>
  <div class="vaccination-card">
    <!-- Desktop Layout -->
    <div class="desktop-layout">
      <div class="card-content">
        <!-- Vaccine Image -->
        <div class="vaccine-image">
          <img
            v-if="vaccine.thumbnail"
            :src="vaccine.thumbnail"
            :alt="vaccine.name"
            @error="handleImageError"
          />
          <div v-else class="image-placeholder">
            <MedicineBoxOutlined />
          </div>
        </div>

        <!-- Vaccine Info -->
        <div class="vaccine-info">
          <div class="info-header">
            <div class="title-section">
              <h3 class="vaccine-name">
                {{ vaccine.name }}
                <a
                  class="view-detail-link"
                  :href="vaccineDetailLink"
                  target="_blank"
                  rel="noopener noreferrer"
                  @click.stop
                  >(Xem chi tiết)</a
                >
              </h3>
              <p v-if="vaccine.description" class="vaccine-description">
                {{ vaccine.description }}
              </p>
            </div>
            <div class="date-status-section">
              <div class="date-info">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.890727 8.96963L0.484238 8.67848H0.484237L0.890727 8.96963ZM1.59751 6.8442L1.09751 6.83843V6.8442H1.59751ZM1.61234 5.55915L2.11234 5.56493V5.55915H1.61234ZM10.4899 8.97995L10.9021 8.69687L10.9021 8.69687L10.4899 8.97995ZM9.80972 6.8442L9.30972 6.83813V6.8442H9.80972ZM9.82456 5.62283L10.3246 5.62891V5.62283H9.82456ZM4.06781 11C3.79167 11 3.56781 11.2239 3.56781 11.5C3.56781 11.7761 3.79167 12 4.06781 12V11.5V11ZM7.30905 12C7.58519 12 7.80905 11.7761 7.80905 11.5C7.80905 11.2239 7.58519 11 7.30905 11V11.5V12ZM0.0364234 2.3781C-0.0668544 2.6342 0.0570342 2.92553 0.313136 3.02881C0.569239 3.13209 0.860574 3.0082 0.963851 2.7521L0.500137 2.5651L0.0364234 2.3781ZM2.56215 0.940778C2.80559 0.810417 2.89725 0.507396 2.76689 0.263961C2.63653 0.0205257 2.33351 -0.0711392 2.09007 0.0592217L2.32611 0.5L2.56215 0.940778ZM9.27642 0.0673046C9.03438 -0.0656269 8.7304 0.0228239 8.59747 0.264865C8.46454 0.506906 8.55299 0.810881 8.79503 0.943813L9.03572 0.505559L9.27642 0.0673046ZM10.4089 2.74147C10.5094 2.99867 10.7994 3.12568 11.0566 3.02516C11.3138 2.92463 11.4408 2.63464 11.3402 2.37745L10.8745 2.55946L10.4089 2.74147ZM0.890727 8.96963L1.29722 9.26078C1.6994 8.69926 2.09751 7.86301 2.09751 6.8442H1.59751H1.09751C1.09751 7.5991 0.801348 8.23575 0.484238 8.67848L0.890727 8.96963ZM1.59751 6.8442L2.09747 6.84998L2.11231 5.56493L1.61234 5.55915L1.11237 5.55338L1.09754 6.83843L1.59751 6.8442ZM10.4899 8.97995L10.9021 8.69687C10.5981 8.25437 10.3097 7.61091 10.3097 6.8442H9.80972H9.30972C9.30972 7.86338 9.69164 8.70086 10.0778 9.26303L10.4899 8.97995ZM9.80972 6.8442L10.3097 6.85028L10.3245 5.62891L9.82456 5.62283L9.32459 5.61676L9.30976 6.83813L9.80972 6.8442ZM9.82456 5.62283H10.3246C10.3246 2.95209 8.27619 0.736124 5.68843 0.736124V1.23612V1.73612C7.66931 1.73612 9.32456 3.44815 9.32456 5.62283H9.82456ZM10.2424 9.57551V10.0755C10.6473 10.0755 10.888 9.7768 10.9809 9.54532C11.0754 9.3099 11.0941 8.97652 10.9021 8.69687L10.4899 8.97995L10.0778 9.26303C10.0549 9.22973 10.051 9.20179 10.0504 9.19136C10.0499 9.1815 10.0514 9.1766 10.0529 9.17284C10.0541 9.16992 10.0618 9.15122 10.0889 9.12869C10.1196 9.10311 10.1736 9.07551 10.2424 9.07551V9.57551ZM1.61234 5.55915H2.11234C2.11234 3.41964 3.74071 1.73612 5.68843 1.73612V1.23612V0.736124C3.13383 0.736124 1.11234 2.92358 1.11234 5.55915H1.61234ZM1.13507 9.57551V9.07551C1.20545 9.07551 1.2601 9.10423 1.29046 9.12999C1.31704 9.15254 1.32398 9.17067 1.32464 9.17234C1.32564 9.17493 1.32703 9.17884 1.32642 9.1882C1.32577 9.19811 1.32157 9.22677 1.29722 9.26078L0.890727 8.96963L0.484237 8.67848C0.283402 8.95889 0.300405 9.29787 0.392748 9.53509C0.483318 9.76776 0.723524 10.0755 1.13507 10.0755V9.57551ZM10.2424 9.57551V9.07551H1.13507V9.57551V10.0755H10.2424V9.57551ZM4.06781 11.5V12H7.30905V11.5V11H4.06781V11.5ZM0.500137 2.5651L0.963851 2.7521C1.27786 1.97343 1.83769 1.32873 2.56215 0.940778L2.32611 0.5L2.09007 0.0592217C1.14627 0.564633 0.432487 1.39596 0.0364234 2.3781L0.500137 2.5651ZM9.03572 0.505559L8.79503 0.943813C9.53796 1.35184 10.1126 1.98356 10.4089 2.74147L10.8745 2.55946L11.3402 2.37745C10.9522 1.38465 10.2086 0.579262 9.27642 0.0673046L9.03572 0.505559Z"
                    fill="#1A75BB"
                  />
                </svg>

                <span>Thời gian: {{ formattedDate }}</span>
              </div>
              <div class="status-wrapper">
                <span :class="['status-text', statusClass]">{{
                  statusText
                }}</span>
                <a-checkbox
                  :checked="isCompleted"
                  @change="handleStatusChange"
                />
              </div>
            </div>
          </div>
          <div class="info-footer">
            <span class="injection-count"
              >Số mũi tiêm: {{ vaccine.numberOfInjections || 1 }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Layout -->
    <div class="mobile-layout">
      <div class="card-content">
        <!-- Vaccine Image -->
        <div class="vaccine-image">
          <img
            v-if="vaccine.thumbnail"
            :src="vaccine.thumbnail"
            :alt="vaccine.name"
            @error="handleImageError"
          />
          <div v-else class="image-placeholder">
            <MedicineBoxOutlined />
          </div>
        </div>

        <!-- Vaccine Info -->
        <div class="vaccine-info">
          <h3 class="vaccine-name">
            {{ vaccine.name }}
            <a
              class="view-detail-link"
              :href="vaccineDetailLink"
              target="_blank"
              rel="noopener noreferrer"
              @click.stop
            >(Xem chi tiết)</a>
          </h3>
          <div class="date-info">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.890727 8.96963L0.484238 8.67848H0.484237L0.890727 8.96963ZM1.59751 6.8442L1.09751 6.83843V6.8442H1.59751ZM1.61234 5.55915L2.11234 5.56493V5.55915H1.61234ZM10.4899 8.97995L10.9021 8.69687L10.9021 8.69687L10.4899 8.97995ZM9.80972 6.8442L9.30972 6.83813V6.8442H9.80972ZM9.82456 5.62283L10.3246 5.62891V5.62283H9.82456ZM4.06781 11C3.79167 11 3.56781 11.2239 3.56781 11.5C3.56781 11.7761 3.79167 12 4.06781 12V11.5V11ZM7.30905 12C7.58519 12 7.80905 11.7761 7.80905 11.5C7.80905 11.2239 7.58519 11 7.30905 11V11.5V12ZM0.0364234 2.3781C-0.0668544 2.6342 0.0570342 2.92553 0.313136 3.02881C0.569239 3.13209 0.860574 3.0082 0.963851 2.7521L0.500137 2.5651L0.0364234 2.3781ZM2.56215 0.940778C2.80559 0.810417 2.89725 0.507396 2.76689 0.263961C2.63653 0.0205257 2.33351 -0.0711392 2.09007 0.0592217L2.32611 0.5L2.56215 0.940778ZM9.27642 0.0673046C9.03438 -0.0656269 8.7304 0.0228239 8.59747 0.264865C8.46454 0.506906 8.55299 0.810881 8.79503 0.943813L9.03572 0.505559L9.27642 0.0673046ZM10.4089 2.74147C10.5094 2.99867 10.7994 3.12568 11.0566 3.02516C11.3138 2.92463 11.4408 2.63464 11.3402 2.37745L10.8745 2.55946L10.4089 2.74147ZM0.890727 8.96963L1.29722 9.26078C1.6994 8.69926 2.09751 7.86301 2.09751 6.8442H1.59751H1.09751C1.09751 7.5991 0.801348 8.23575 0.484238 8.67848L0.890727 8.96963ZM1.59751 6.8442L2.09747 6.84998L2.11231 5.56493L1.61234 5.55915L1.11237 5.55338L1.09754 6.83843L1.59751 6.8442ZM10.4899 8.97995L10.9021 8.69687C10.5981 8.25437 10.3097 7.61091 10.3097 6.8442H9.80972H9.30972C9.30972 7.86338 9.69164 8.70086 10.0778 9.26303L10.4899 8.97995ZM9.80972 6.8442L10.3097 6.85028L10.3245 5.62891L9.82456 5.62283L9.32459 5.61676L9.30976 6.83813L9.80972 6.8442ZM9.82456 5.62283H10.3246C10.3246 2.95209 8.27619 0.736124 5.68843 0.736124V1.23612V1.73612C7.66931 1.73612 9.32456 3.44815 9.32456 5.62283H9.82456ZM10.2424 9.57551V10.0755C10.6473 10.0755 10.888 9.7768 10.9809 9.54532C11.0754 9.3099 11.0941 8.97652 10.9021 8.69687L10.4899 8.97995L10.0778 9.26303C10.0549 9.22973 10.051 9.20179 10.0504 9.19136C10.0499 9.1815 10.0514 9.1766 10.0529 9.17284C10.0541 9.16992 10.0618 9.15122 10.0889 9.12869C10.1196 9.10311 10.1736 9.07551 10.2424 9.07551V9.57551ZM1.61234 5.55915H2.11234C2.11234 3.41964 3.74071 1.73612 5.68843 1.73612V1.23612V0.736124C3.13383 0.736124 1.11234 2.92358 1.11234 5.55915H1.61234ZM1.13507 9.57551V9.07551C1.20545 9.07551 1.2601 9.10423 1.29046 9.12999C1.31704 9.15254 1.32398 9.17067 1.32464 9.17234C1.32564 9.17493 1.32703 9.17884 1.32642 9.1882C1.32577 9.19811 1.32157 9.22677 1.29722 9.26078L0.890727 8.96963L0.484237 8.67848C0.283402 8.95889 0.300405 9.29787 0.392748 9.53509C0.483318 9.76776 0.723524 10.0755 1.13507 10.0755V9.57551ZM10.2424 9.57551V9.07551H1.13507V9.57551V10.0755H10.2424V9.57551ZM4.06781 11.5V12H7.30905V11.5V11H4.06781V11.5ZM0.500137 2.5651L0.963851 2.7521C1.27786 1.97343 1.83769 1.32873 2.56215 0.940778L2.32611 0.5L2.09007 0.0592217C1.14627 0.564633 0.432487 1.39596 0.0364234 2.3781L0.500137 2.5651ZM9.03572 0.505559L8.79503 0.943813C9.53796 1.35184 10.1126 1.98356 10.4089 2.74147L10.8745 2.55946L11.3402 2.37745C10.9522 1.38465 10.2086 0.579262 9.27642 0.0673046L9.03572 0.505559Z"
                fill="#1A75BB"
              />
            </svg>

            <span>Thời gian: {{ formattedDate }}</span>
          </div>
          <div class="status-wrapper">
            <span :class="['status-text', statusClass]">{{ statusText }}</span>
            <a-checkbox
              :checked="isCompleted"
              @change="handleStatusChange"
            />
          </div>
          <div class="injection-count">
            Số mũi tiêm: {{ vaccine.numberOfInjections || 1 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CalendarOutlined, MedicineBoxOutlined } from "@ant-design/icons-vue";
import dayjs from "dayjs";
import type { VaccinationScheduleItem } from "~/types/api";

interface Props {
  vaccine: VaccinationScheduleItem;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  viewDetail: [vaccine: VaccinationScheduleItem];
  statusChange: [vaccine: VaccinationScheduleItem, completed: boolean];
}>();

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  target.src = "/images/vaccines/default.png";
};

const DEFAULT_DETAIL_LINK = 'https://vanphuccare.vn/tiem-chung';

const vaccineDetailLink = computed(() => {
  return props.vaccine.detailLink?.trim() || DEFAULT_DETAIL_LINK;
});

// Format injection date
const formattedDate = computed(() => {
  if (props.vaccine.injectionDate) {
    return dayjs(props.vaccine.injectionDate).format("DD/MM/YYYY");
  }
  if (props.vaccine.scheduledDate) {
    return dayjs(props.vaccine.scheduledDate).format("DD/MM/YYYY");
  }
  return dayjs().format("DD/MM/YYYY");
});

// Check if completed
const isCompleted = computed(() => {
  return props.vaccine.injectionStatus === "completed";
});

// Status text
const statusText = computed(() => {
  const status = props.vaccine.injectionStatus || "pending";
  switch (status) {
    case "completed":
      return "ĐÃ TIÊM PHÒNG";
    case "scheduled":
      return "ĐÃ ĐẶT LỊCH";
    case "skipped":
      return "BỎ QUA";
    case "pending":
    default:
      return "CHƯA TIÊM PHÒNG";
  }
});

// Status class
const statusClass = computed(() => {
  const status = props.vaccine.injectionStatus || "pending";
  switch (status) {
    case "completed":
      return "status-completed";
    case "scheduled":
      return "status-scheduled";
    case "skipped":
      return "status-skipped";
    case "pending":
    default:
      return "status-pending";
  }
});

// Handle status change
const handleStatusChange = (e: any) => {
  emit("statusChange", props.vaccine, e.target.checked);
};
</script>

<style scoped>
.vaccination-card {
  background: #fff;
  border: 1px solid #1a75bb;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
}

.vaccination-card:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
}

/* Desktop Layout */
.desktop-layout {
  display: block;
}

.mobile-layout {
  display: none;
}

.card-content {
  display: flex;
  gap: 16px;
}

/* Vaccine Image */
.vaccine-image {
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
}

.vaccine-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: #e6f7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #1890ff;
}

/* Vaccine Info */
.vaccine-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.title-section {
  flex: 1;
}

.vaccine-name {
  font-size: 16px;
  font-weight: 700;
  color: #1a75bb;
  margin: 0 0 8px;
  line-height: 1.4;
}

.view-detail-link {
  font-size: 13px;
  font-weight: 400;
  color: #1A75BB;
  margin-left: 8px;
  cursor: pointer;
}

.view-detail-link:hover {
  text-decoration: underline;
}

.vaccine-description {
  font-size: 13px;
  color: #666;
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

.date-status-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

.date-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #1A75BB;
}

.date-info :deep(.anticon) {
  color: #1890ff;
}

.status-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-text {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-completed {
  color: #15CF74;
}

.status-pending {
  color: #999;
}

.status-scheduled {
  color: #1890ff;
}

.status-skipped {
  color: #faad14;
}

.info-footer {
  margin-top: auto;
  padding-top: 12px;
}

.injection-count {
  font-size: 13px;
  color: #1A75BB;
  font-weight: 500;
}

/* Checkbox styling */
:deep(.ant-checkbox-wrapper) {
  margin: 0;
}

:deep(.ant-checkbox-inner) {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background-color: #fff;
  border-color: #d9d9d9;
}

:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: #fff;
  border-color: #06E775;
}

:deep(.ant-checkbox-checked .ant-checkbox-inner::after) {
  border-color: #06E775;
  width: 6px;
  height: 10px;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .desktop-layout {
    display: none;
  }

  .mobile-layout {
    display: block;
  }

  .vaccination-card {
    padding: 12px;
    background: linear-gradient(135deg, #e6f7ff 0%, #ffffff 100%);
    border-radius: 16px;
  }

  .vaccine-image {
    width: 80px;
    height: 80px;
    border-radius: 12px;
  }

  .vaccine-info {
    gap: 4px;
  }

  .vaccine-name {
    font-size: 14px;
    margin-bottom: 4px;
  }

  .date-info {
    font-size: 12px;
    margin-bottom: 4px;
  }

  .status-wrapper {
    margin-bottom: 4px;
  }

  .status-text {
    font-size: 13px;
  }

  .injection-count {
    font-size: 12px;
    color: #1A75BB;
    margin-top: 4px;
  }

  :deep(.ant-checkbox-inner) {
    width: 18px;
    height: 18px;
  }
}
</style>
