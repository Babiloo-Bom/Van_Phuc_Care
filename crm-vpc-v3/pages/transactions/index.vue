<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-primary-600">Lịch sử giao dịch</h1>
      </div>
    </div>
    <a-table
      :columns="columns"
      :data-source="transactions"
      :pagination="pagination"
      row-key="_id"
      class="transaction-table"
      bordered
      size="middle"
    >
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTransactionsApi } from '~/composables/api/useTransactionsApi'
import dayjs from 'dayjs'

definePageMeta({ layout: 'default' })
useHead({ title: 'Lịch sử giao dịch' })

const { getTransactions } = useTransactionsApi()
const transactions = ref<any[]>([])
const pagination = ref({ current: 1, pageSize: 10, total: 0 })

const columns = [
  { title: 'ID', dataIndex: '_id', key: '_id', width: 100 },
  { title: 'Phân loại', dataIndex: 'title', key: 'title', width: 220 },
  { title: 'Thời gian', dataIndex: 'createdAt', key: 'createdAt', width: 140 },
  { title: 'Giá', dataIndex: 'total', key: 'total', width: 140 },
  { title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 120 },
]

const fetchTransactions = async (page = 1) => {
  const res = await getTransactions({ page, limit: pagination.value.pageSize })
  transactions.value = res.data?.data || []
  pagination.value.total = res.data?.pagination?.total || 0
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
.transaction-table {
  background: #fff;
  border-radius: 12px;
  overflow-x: auto;
}
</style>
