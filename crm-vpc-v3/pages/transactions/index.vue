<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="page-title">Lịch sử giao dịch</h1>
      </div>
    </div>
    <div class="table-wrapper">
      <a-table
        :columns="columns"
        :data-source="transactions"
        :pagination="false"
        row-key="_id"
        class="transaction-table"
        bordered
        size="middle"
      >
        <template #headerCell="{ column }">
          <span class="table-header">{{ column.title }}</span>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'">
            <span :class="statusClass(record.status)">{{ statusText(record.status) }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'total'">
            {{ formatCurrency(record.total) }}
          </template>
          <template v-else-if="column.dataIndex === 'createdAt'">
            {{ formatDate(record.createdAt) }}
          </template>
          <template v-else>
            {{ record[column.dataIndex] }}
          </template>
        </template>
      </a-table>
      <div class="custom-pagination">
        <button :disabled="pagination.current === 1" @click="fetchTransactions(pagination.current - 1)" class="page-btn">
          &lt;
        </button>
        <span class="page-index">{{ pagination.current }}</span>
        <button :disabled="transactions.length < pagination.pageSize" @click="fetchTransactions(pagination.current + 1)" class="page-btn">
          &gt;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTransactionsApi } from '~/composables/api/useTransactionsApi'
import type { Transaction } from '~/types/api'
import dayjs from 'dayjs'

definePageMeta({ layout: 'default' })
useHead({ title: 'Lịch sử giao dịch' })

const { getUserTransactions } = useTransactionsApi()
const authStore = useAuthStore()
const transactions = ref<Transaction[]>([])
const pagination = ref({ current: 1, pageSize: 10, total: 0 })

const columns = [
  { title: 'ID', dataIndex: '_id', key: '_id', width: 100 },
  { title: 'Phân loại', dataIndex: 'title', key: 'title', width: 220 },
  { title: 'Thời gian', dataIndex: 'createdAt', key: 'createdAt', width: 140 },
  { title: 'Giá', dataIndex: 'total', key: 'total', width: 140 },
  { title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 120 },
]

const fetchTransactions = async (page = 1) => {
  const res = await getUserTransactions({ page, limit: pagination.value.pageSize })
  transactions.value = res.data?.data?.transactions ?? []
  pagination.value.total = transactions.value.length
  pagination.value.current = page
}

onMounted(() => fetchTransactions())

function formatCurrency(val: number) {
  return val ? val.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : ''
}
function formatDate(val: string) {
  return val ? dayjs(val).format('DD/MM/YYYY') : ''
}
function statusText(status: string) {
  if (status === 'success') return 'Thành công'
  if (status === 'pending') return 'Đang xử lý'
  if (status === 'denied') return 'Đã huỷ'
  return status
}
function statusClass(status: string) {
  if (status === 'success') return 'px-2 py-1 rounded bg-green-100 text-green-800 text-xs'
  if (status === 'pending') return 'px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs'
  if (status === 'denied') return 'px-2 py-1 rounded bg-red-100 text-red-600 text-xs'
  return ''
}
</script>

<style scoped>
.page-title {
  color: #1976d2;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0;
}
.table-wrapper {
  background: #fff;
  border-radius: 12px;
  overflow-x: auto;
  padding: 16px;
}
.transaction-table {
  min-width: 700px;
}
.table-header {
  color: #1976d2;
  font-weight: 600;
  font-size: 1rem;
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
  }
  .transaction-table {
    min-width: 600px;
  }
}
</style>
