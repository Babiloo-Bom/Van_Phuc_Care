<template>
  <div class="api-example-page p-8 max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">🚀 API Layer - Usage Examples</h1>

    <!-- Example 1: Get List -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Example 1: Get Customers List</h3>
      <button 
        @click="loadCustomers" 
        :disabled="loading.customers"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 mb-4"
      >
        {{ loading.customers ? 'Loading...' : 'Load Customers' }}
      </button>
      
      <div v-if="customers.length" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="px-4 py-2 text-left">Email</th>
              <th class="px-4 py-2 text-left">Name</th>
              <th class="px-4 py-2 text-left">Phone</th>
              <th class="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in customers" :key="customer._id" class="hover:bg-gray-50">
              <td class="px-4 py-2">{{ customer.email }}</td>
              <td class="px-4 py-2">{{ customer.firstname }} {{ customer.lastname }}</td>
              <td class="px-4 py-2">{{ customer.phone }}</td>
              <td class="px-4 py-2">
                <span :class="customer.status === 'active' ? 'text-green-500' : 'text-red-500'">
                  {{ customer.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 bg-gray-50 p-3 rounded text-sm">
        <p class="font-mono text-xs">
          const customersApi = useCustomersApi()<br>
          const result = await customersApi.getCustomers({ page: 1, limit: 10 })
        </p>
      </div>
    </div>

    <!-- Example 2: Create -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Example 2: Create Customer</h3>
      <div class="grid grid-cols-2 gap-4 mb-4">
        <input v-model="newCustomer.email" placeholder="Email" class="border p-2 rounded">
        <input v-model="newCustomer.phone" placeholder="Phone" class="border p-2 rounded">
        <input v-model="newCustomer.firstname" placeholder="First Name" class="border p-2 rounded">
        <input v-model="newCustomer.lastname" placeholder="Last Name" class="border p-2 rounded">
      </div>
      <button 
        @click="createCustomer" 
        :disabled="loading.create"
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
      >
        {{ loading.create ? 'Creating...' : 'Create Customer' }}
      </button>

      <div class="mt-4 bg-gray-50 p-3 rounded text-sm">
        <p class="font-mono text-xs">
          const result = await customersApi.createCustomer(data)<br>
          if (result.status) { /* Success */ }
        </p>
      </div>
    </div>

    <!-- Example 3: Upload File -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Example 3: Upload Image</h3>
      <input 
        type="file" 
        @change="handleFileSelect" 
        accept="image/*"
        class="mb-4"
      >
      <button 
        @click="uploadImage" 
        :disabled="!selectedFile || loading.upload"
        class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
      >
        {{ loading.upload ? 'Uploading...' : 'Upload Image' }}
      </button>
      
      <div v-if="uploadedUrl" class="mt-4">
        <p class="text-sm text-gray-600 mb-2">Uploaded:</p>
        <img :src="uploadedUrl" alt="Uploaded" class="max-w-xs rounded">
      </div>

      <div class="mt-4 bg-gray-50 p-3 rounded text-sm">
        <p class="font-mono text-xs">
          const uploadsApi = useUploadsApi()<br>
          const result = await uploadsApi.uploadImage(file)<br>
          const url = result.data.url
        </p>
      </div>
    </div>

    <!-- Example 4: Error Handling -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Example 4: Error Handling</h3>
      <button 
        @click="triggerError" 
        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Trigger 404 Error
      </button>
      <p class="text-sm text-gray-500 mt-2">This will show automatic error handling</p>

      <div class="mt-4 bg-gray-50 p-3 rounded text-sm">
        <p class="font-mono text-xs">
          // Errors are automatically handled<br>
          const result = await customersApi.getCustomer('invalid-id')<br>
          if (!result.status) {<br>
          &nbsp;&nbsp;console.error(result.message)<br>
          }
        </p>
      </div>
    </div>

    <!-- Example 5: Direct API Client -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Example 5: Direct API Client Usage</h3>
      <button 
        @click="useDirectClient" 
        class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
      >
        Call Custom Endpoint
      </button>

      <div class="mt-4 bg-gray-50 p-3 rounded text-sm">
        <p class="font-mono text-xs">
          const apiClient = useApiClient()<br>
          const result = await apiClient.get('/api/a/custom-endpoint', {<br>
          &nbsp;&nbsp;params: { key: 'value' },<br>
          &nbsp;&nbsp;showError: true<br>
          })
        </p>
      </div>
    </div>

    <!-- Documentation Link -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
      <h2 class="text-xl font-semibold mb-4">📚 Complete Documentation</h2>
      <p class="mb-4">Xem chi tiết tại: <code class="bg-white px-2 py-1 rounded">API_LAYER_GUIDE.md</code></p>
      <ul class="list-disc list-inside space-y-2 text-sm">
        <li>7 API modules (Customers, Products, Orders, etc.)</li>
        <li>Type-safe with TypeScript</li>
        <li>Auto error handling</li>
        <li>Auto retry on failure</li>
        <li>Request/Response interceptors</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Customer } from '~/types/api'
import { message } from 'ant-design-vue'

// API composables
const customersApi = useCustomersApi()
const uploadsApi = useUploadsApi()
const apiClient = useApiClient()

// State
const customers = ref<Customer[]>([])
const loading = reactive({
  customers: false,
  create: false,
  upload: false
})

const newCustomer = reactive({
  email: '',
  phone: '',
  firstname: '',
  lastname: ''
})

const selectedFile = ref<File | null>(null)
const uploadedUrl = ref('')

// Example 1: Load customers
const loadCustomers = async () => {
  loading.customers = true
  
  const result = await customersApi.getCustomers({
    page: 1,
    limit: 10
  })
  
  if (result.status && result.data) {
    customers.value = result.data.data || []
    message.success(`Loaded ${customers.value.length} customers`)
  }
  
  loading.customers = false
}

// Example 2: Create customer
const createCustomer = async () => {
  loading.create = true
  
  const result = await customersApi.createCustomer(newCustomer)
  
  if (result.status) {
    message.success('Customer created successfully!')
    // Reset form
    Object.assign(newCustomer, {
      email: '',
      phone: '',
      firstname: '',
      lastname: ''
    })
    // Reload list
    await loadCustomers()
  }
  
  loading.create = false
}

// Example 3: Upload image
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
  }
}

const uploadImage = async () => {
  if (!selectedFile.value) return
  
  loading.upload = true
  
  try {
    const result = await uploadsApi.uploadImage(selectedFile.value)
    
    if (result.status && result.data) {
      uploadedUrl.value = result.data.url
      message.success('Image uploaded successfully!')
    }
  } catch (error: any) {
    message.error(error.message)
  }
  
  loading.upload = false
}

// Example 4: Trigger error
const triggerError = async () => {
  await customersApi.getCustomer('invalid-id-12345')
  // Error will be shown automatically via antMessage
}

// Example 5: Direct client
const useDirectClient = async () => {
  const result = await apiClient.get('/api/a/customers', {
    params: { limit: 5 }
  })
  
  if (result.status) {
    message.info(`Direct call successful! Got ${result.data?.data?.length || 0} items`)
  }
}
</script>

