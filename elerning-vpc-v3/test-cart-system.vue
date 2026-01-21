<template>
  <div class="p-8 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Test Cart System</h1>
    
    <!-- Test Course Data -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Test Course</h2>
      <div class="bg-gray-100 p-4 rounded-lg">
        <h3>{{ testCourse.title }}</h3>
        <p>Price: {{ formatPrice(testCourse.price) }}</p>
        <p>ID: {{ testCourse._id }}</p>
      </div>
    </div>

    <!-- Cart Status -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Cart Status</h2>
      <div class="bg-blue-50 p-4 rounded-lg">
        <p><strong>Item Count:</strong> {{ itemCount }}</p>
        <p><strong>Subtotal:</strong> {{ formatPrice(subtotal) }}</p>
        <p><strong>Total Price:</strong> {{ formatPrice(totalPrice) }}</p>
        <p><strong>Is Loading:</strong> {{ isLoading }}</p>
        <p><strong>Error:</strong> {{ error || 'None' }}</p>
        <p><strong>Is Empty:</strong> {{ isEmpty }}</p>
        <p><strong>Has Items:</strong> {{ hasItems }}</p>
      </div>
    </div>

    <!-- Cart Actions -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Cart Actions</h2>
      <div class="flex gap-4 flex-wrap">
        <button 
          @click="handleAddToCart" 
          :disabled="isLoading"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Add to Cart
        </button>
        
        <button 
          @click="handleRemoveFromCart" 
          :disabled="isLoading || !isItemInCart(testCourse._id)"
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          Remove from Cart
        </button>
        
        <button 
          @click="handleClearCart" 
          :disabled="isLoading || isEmpty"
          class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
        >
          Clear Cart
        </button>
        
        <button 
          @click="handleRefreshCart" 
          :disabled="isLoading"
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Refresh Cart
        </button>
      </div>
    </div>

    <!-- Cart Items -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Cart Items</h2>
      <div v-if="isEmpty" class="text-gray-500 text-center py-8">
        Cart is empty
      </div>
      <div v-else class="space-y-4">
        <div 
          v-for="item in items" 
          :key="item._id"
          class="bg-white border rounded-lg p-4"
        >
          <h4 class="font-semibold">{{ item.course.title }}</h4>
          <p>Price: {{ formatPrice(item.course.price) }}</p>
          <p>Quantity: {{ item.quantity }}</p>
          <p>Total: {{ formatPrice(item.course.price * item.quantity) }}</p>
        </div>
      </div>
    </div>

    <!-- Test Results -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Test Results</h2>
      <div class="bg-yellow-50 p-4 rounded-lg">
        <pre class="text-sm">{{ JSON.stringify(testResults, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Test course data
const testCourse = ref({
  _id: 'test-course-123',
  title: 'Test Course for Cart System',
  price: 299000,
  thumbnail: '/images/placeholder-course.jpg',
  instructor: {
    name: 'Test Instructor'
  },
  duration: 120,
  lessons: 10
})

// Test results
const testResults = ref({
  addToCart: null,
  removeFromCart: null,
  clearCart: null,
  refreshCart: null,
  errors: []
})

// Use cart composable
const {
  items,
  itemCount,
  subtotal,
  totalPrice,
  isLoading,
  error,
  isEmpty,
  hasItems,
  isItemInCart,
  addCourseToCart,
  removeCourseFromCart,
  clearCart,
  refreshCart,
  formatPrice
} = useCart()

// Test functions
const handleAddToCart = async () => {
  try {
    testResults.value.addToCart = 'Adding...'
    await addCourseToCart(testCourse.value)
    testResults.value.addToCart = 'Success'
  } catch (err: any) {
    testResults.value.addToCart = 'Error'
    testResults.value.errors.push(`Add to cart: ${err.message}`)
  }
}

const handleRemoveFromCart = async () => {
  try {
    testResults.value.removeFromCart = 'Removing...'
    await removeCourseFromCart(testCourse.value._id)
    testResults.value.removeFromCart = 'Success'
  } catch (err: any) {
    testResults.value.removeFromCart = 'Error'
    testResults.value.errors.push(`Remove from cart: ${err.message}`)
  }
}

const handleClearCart = async () => {
  try {
    testResults.value.clearCart = 'Clearing...'
    await clearCart()
    testResults.value.clearCart = 'Success'
  } catch (err: any) {
    testResults.value.clearCart = 'Error'
    testResults.value.errors.push(`Clear cart: ${err.message}`)
  }
}

const handleRefreshCart = async () => {
  try {
    testResults.value.refreshCart = 'Refreshing...'
    await refreshCart()
    testResults.value.refreshCart = 'Success'
  } catch (err: any) {
    testResults.value.refreshCart = 'Error'
    testResults.value.errors.push(`Refresh cart: ${err.message}`)
  }
}

// Initialize on mount
onMounted(async () => {
  await refreshCart()
})
</script>

<style scoped>
/* Add any custom styles here */
</style>
