<template>
  <div class="container mx-auto">
    <div class="flex justify-between items-center mb-8 md:mb-4">
      <h1 class="page-title">Lịch sử giao dịch</h1>
    </div>
    <div class="table-wrapper">
      <a-table
        :columns="columns"
        :data-source="transactions"
        :pagination="false"
        row-key="_id"
        class="transaction-table"
        size="middle"
      >
        <template #headerCell="{ column }">
          <span class="table-header">{{ column.title }}</span>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'total'">
            {{ formatCurrency(record.total) }}
          </template>
          <template v-else-if="column.dataIndex === 'createdAt'">
            {{ formatDate(record.createdAt) }}
          </template>
          <template v-else-if="column.dataIndex === 'courseNames'">
            <span class="course-names-cell">{{ formatCourseNames(record.courseNames) }}</span>
          </template>
          <template v-else>
            {{ record[column.dataIndex] }}
          </template>
        </template>
      </a-table>
      <a-pagination
        :current="pagination.current"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        @change="fetchTransactions"
        :show-size-changer="false"
        class="ant-pagination-custom"
        style="margin-top: 20px; display: flex; justify-content: flex-end; align-items: center"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useTransactionsApi } from "~/composables/api/useTransactionsApi";
import type { Transaction } from "~/types/api";
import dayjs from "dayjs";

definePageMeta({ layout: "default" });
useHead({ title: "Lịch sử giao dịch" });

const { getUserTransactions } = useTransactionsApi();
const transactions = ref<Transaction[]>([]);
const pagination = ref({ current: 1, pageSize: 10, total: 0 });

const columns = [
  { title: "Mô tả đơn hàng", dataIndex: "title", key: "title", width: 260 },
  { title: "Tên khóa học", dataIndex: "courseNames", key: "courseNames", width: 280 },
  { title: "Thời gian", dataIndex: "createdAt", key: "createdAt", width: 140 },
  { title: "Giá", dataIndex: "total", key: "total", width: 140 },
  { title: "Trạng thái", dataIndex: "status", key: "status", width: 120 },
];

const fetchTransactions = async (page = 1) => {
  const res = await getUserTransactions({ page, limit: pagination.value.pageSize });
  transactions.value = res.data?.data?.transactions ?? [];
  pagination.value.total = transactions.value.length;
  pagination.value.current = page;
};

onMounted(() => fetchTransactions());

function formatCurrency(val: number) {
  return val ? val.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) : "";
}
function formatDate(val: string) {
  return val ? dayjs(val).format("DD/MM/YYYY") : "";
}
function formatCourseNames(names: string[] | undefined) {
  if (!names || !Array.isArray(names) || names.length === 0) return "—";
  return names.join(", ");
}
// Đồng bộ với admin: màu và nhãn trạng thái (Đang xử lý = blue như admin)
function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    success: "green",
    pending: "blue",   // Đang xử lý hiển thị giống admin (tag xanh)
    denied: "red",
    processing: "blue",
    completed: "green",
    cancelled: "red",
  };
  return colors[status] || "default";
}
function getStatusText(status: string) {
  const texts: Record<string, string> = {
    success: "Thành công",
    pending: "Đang xử lý",
    denied: "Đã huỷ",
    processing: "Đang xử lý",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
  };
  return texts[status] || status || "N/A";
}
</script>

<style scoped>
.page-title {
  color: #1976d2;
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: 0;
  width: 100%;
  text-align: left;
}

.transaction-table {
  width: 100%;
}

.course-names-cell {
  word-break: break-word;
  white-space: normal;
}

/* Table border styles - only horizontal lines + left/right border */
.transaction-table :deep(.ant-table) {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e8e8e8;
  border-bottom: none;
}

.transaction-table :deep(.ant-table-thead > tr > th) {
  border-bottom: 1px solid #f0f0f0;
  border-right: none !important;
  background: #dbedffcf;
}

.transaction-table :deep(.ant-table-thead > tr > th::before) {
  display: none !important;
}

.transaction-table :deep(.ant-table-tbody > tr > td) {
  border-bottom: 1px solid #f0f0f0;
  border-right: none !important;
}

.transaction-table :deep(.ant-table-tbody > tr:last-child > td) {
  border-bottom: none;
}

.transaction-table :deep(.ant-table-container) {
  border-radius: 12px;
}

.table-header {
  color: #1976d2;
  font-weight: 600;
  font-size: 1rem;
  text-transform: uppercase;
}
.custom-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 8px;
}
.page-btn {
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 4px 12px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.page-btn:disabled {
  background: #e0e0e0;
  color: #888;
  cursor: not-allowed;
}
.page-index {
  font-weight: bold;
  font-size: 1rem;
  color: #1976d2;
}

@media (max-width: 768px) {
  .table-wrapper {
    padding: 4px;
    overflow-x: auto;
  }
  .transaction-table :deep(.ant-table-content) {
    overflow-x: auto !important;
  }
  .transaction-table :deep(.ant-table-content table) {
    min-width: 900px;
  }
  .page-title {
    text-align: center;
    font-size: 1.875rem;
    line-height: 1.5;
  }
  .ant-pagination-custom {
    justify-content: center !important;
  }
}
</style>
<style>
/* ant design */
.ant-table-wrapper .ant-table-ping-right:not(.ant-table-has-fix-right) .ant-table-container::after,
.ant-table-wrapper .ant-table-ping-left:not(.ant-table-has-fix-left) .ant-table-container::before {
  box-shadow: none !important;
}

.ant-pagination-item-link {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* Pagination Styles */
.ant-pagination-custom .ant-pagination-item {
  min-width: 32px;
  height: 32px;
  line-height: 32px;
  border: none;
  background: transparent;
  margin: 0;
}

.ant-pagination-custom .ant-pagination-item a {
  color: #666;
  font-weight: 500;
}

.ant-pagination-custom .ant-pagination-item-active {
  background: transparent;
  border: none;
}

.ant-pagination-custom .ant-pagination-item-active a {
  color: #317BC4;
  font-weight: 700;
}

.ant-pagination-custom .ant-pagination-prev,
.ant-pagination-custom .ant-pagination-next {
  min-width: 32px;
  height: 32px;
  line-height: 32px;
  border: 1px solid #317BC4;
  border-radius: 6px;
  margin: 0;
}

.ant-pagination-custom .ant-pagination-prev:hover,
.ant-pagination-custom .ant-pagination-next:hover {
  background: #E8F4FC;
}

.ant-pagination-custom .ant-pagination-prev .ant-pagination-item-link,
.ant-pagination-custom .ant-pagination-next .ant-pagination-item-link {
  color: #317BC4;
  border: none;
  background: transparent;
}

.ant-pagination-custom .ant-pagination-disabled {
  border-color: #d9d9d9;
}

.ant-pagination-custom .ant-pagination-disabled .ant-pagination-item-link {
  color: #d9d9d9;
}

.ant-pagination-custom .ant-pagination-jump-prev,
.ant-pagination-custom .ant-pagination-jump-next {
  min-width: 32px;
  height: 32px;
  line-height: 32px;
  margin: 0;
}
</style>
