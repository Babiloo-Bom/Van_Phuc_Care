<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Quản lý Banner</h1>
      <p class="text-gray-600 mt-2">Quản lý banner cho trang Tất cả khóa học và Khóa học của tôi</p>
    </div>

    <!-- Banner Forms -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Banner cho trang "Tất cả khóa học" -->
      <a-card title="Banner - Tất cả khóa học" :loading="loading">
        <a-form
          ref="allCoursesFormRef"
          :model="allCoursesForm"
          layout="vertical"
        >
          <a-form-item label="Tiêu đề">
            <a-input v-model:value="allCoursesForm.title" placeholder="Nhập tiêu đề banner" />
          </a-form-item>

          <a-form-item label="Hình ảnh">
            <div v-if="allCoursesForm.image" class="mb-4">
              <img
                :src="allCoursesForm.image"
                alt="Banner preview"
                class="w-full h-48 object-cover rounded-lg border border-gray-200"
              />
            </div>
            <a-upload
              v-model:file-list="allCoursesFileList"
              list-type="picture-card"
              :before-upload="(file: any) => { (currentUploadPageType as any).value = 'all-courses'; return beforeUpload(file); }"
              @preview="handlePreview"
              @remove="() => handleRemove('all-courses')"
              accept="image/*"
              :disabled="uploading"
            >
              <div v-if="allCoursesFileList.length < 1">
                <PlusOutlined />
                <div style="margin-top: 8px">Upload</div>
              </div>
            </a-upload>
          </a-form-item>

          <a-form-item label="URL đích">
            <a-input v-model:value="allCoursesForm.url" placeholder="https://..." />
          </a-form-item>

          <a-form-item>
            <a-button type="primary" :loading="saving" @click="handleSave('all-courses')">
              Lưu thay đổi
            </a-button>
          </a-form-item>
        </a-form>
      </a-card>

      <!-- Banner cho trang "Khóa học của tôi" -->
      <a-card title="Banner - Khóa học của tôi" :loading="loading">
        <a-form
          ref="myCoursesFormRef"
          :model="myCoursesForm"
          layout="vertical"
        >
          <a-form-item label="Tiêu đề">
            <a-input v-model:value="myCoursesForm.title" placeholder="Nhập tiêu đề banner" />
          </a-form-item>

          <a-form-item label="Hình ảnh">
            <div v-if="myCoursesForm.image" class="mb-4">
              <img
                :src="myCoursesForm.image"
                alt="Banner preview"
                class="w-full h-48 object-cover rounded-lg border border-gray-200"
              />
            </div>
            <a-upload
              v-model:file-list="myCoursesFileList"
              list-type="picture-card"
              :before-upload="(file: any) => { (currentUploadPageType as any).value = 'my-courses'; return beforeUpload(file); }"
              @preview="handlePreview"
              @remove="() => handleRemove('my-courses')"
              accept="image/*"
              :disabled="uploading"
            >
              <div v-if="myCoursesFileList.length < 1">
                <PlusOutlined />
                <div style="margin-top: 8px">Upload</div>
              </div>
            </a-upload>
          </a-form-item>

          <a-form-item label="URL đích">
            <a-input v-model:value="myCoursesForm.url" placeholder="https://..." />
          </a-form-item>

          <a-form-item>
            <a-button type="primary" :loading="saving" @click="handleSave('my-courses')">
              Lưu thay đổi
            </a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </div>

    <!-- Image Preview Modal -->
    <a-modal v-model:open="previewVisible" :footer="null">
      <img alt="preview" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import type { UploadFile, UploadProps } from 'ant-design-vue'
import { useBannersApi, type Banner } from '~/composables/api/useBannersApi'
import { useUploadsApi } from '~/composables/api/useUploadsApi'

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Quản lý Banner'
})

const { getBanners, createBanner } = useBannersApi()
const uploadsApi = useUploadsApi()
const uploading = ref(false)
const saving = ref(false)
const loading = ref(false)
const allCoursesFormRef = ref()
const myCoursesFormRef = ref()
const allCoursesFileList = ref<UploadFile[]>([])
const myCoursesFileList = ref<UploadFile[]>([])
const previewVisible = ref(false)
const previewImage = ref('')
const currentUploadPageType = ref<'all-courses' | 'my-courses'>('all-courses')

const allCoursesForm = reactive<{
  page: string
  title: string
  image: string
  url: string
}>({
  page: 'all-courses',
  title: '',
  image: '',
  url: '',
})

const myCoursesForm = reactive<{
  page: string
  title: string
  image: string
  url: string
}>({
  page: 'my-courses',
  title: '',
  image: '',
  url: '',
})

// Fetch banners
const fetchBanners = async () => {
  loading.value = true
  try {
    // Fetch banner for all-courses
    const allCoursesResponse = await getBanners({ pageType: 'all-courses', limit: 1 })
    const allCoursesData = (allCoursesResponse.data as any)?.data?.banners || (allCoursesResponse.data as any)?.banners || []
    if (allCoursesData.length > 0) {
      const banner = allCoursesData[0]
      allCoursesForm.title = banner.title || ''
      allCoursesForm.image = banner.image || ''
      allCoursesForm.url = banner.url || ''
      if (banner.image) {
        allCoursesFileList.value = [{
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: banner.image,
        }]
      }
    }

    // Fetch banner for my-courses
    const myCoursesResponse = await getBanners({ pageType: 'my-courses', limit: 1 })
    const myCoursesData = (myCoursesResponse.data as any)?.data?.banners || (myCoursesResponse.data as any)?.banners || []
    if (myCoursesData.length > 0) {
      const banner = myCoursesData[0]
      myCoursesForm.title = banner.title || ''
      myCoursesForm.image = banner.image || ''
      myCoursesForm.url = banner.url || ''
      if (banner.image) {
        myCoursesFileList.value = [{
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: banner.image,
        }]
      }
    }
  } catch (error) {
    console.error('Error fetching banners:', error)
    message.error('Lỗi khi tải banner')
  } finally {
    loading.value = false
  }
}

// Handle upload
const beforeUpload = async (file: any) => {
  const pageType = currentUploadPageType.value
  const fileObj = file as File
  const isImage = fileObj.type.startsWith('image/')
  if (!isImage) {
    message.error('Chỉ được upload file ảnh!')
    return false
  }
  const isLt10M = fileObj.size / 1024 / 1024 < 10
  if (!isLt10M) {
    message.error('Ảnh phải nhỏ hơn 10MB!')
    return false
  }
  
  // Upload to server
  uploading.value = true
  try {
    const uploadResponse = await uploadsApi.uploadImage(fileObj)
    
    if (uploadResponse.status) {
      const responseData = (uploadResponse as any).data?.data || (uploadResponse as any).data || uploadResponse
      let imageUrl = ''
      
      // Try multiple possible paths for the image URL
      if (responseData.fileAttributes && responseData.fileAttributes[0]?.source) {
        imageUrl = responseData.fileAttributes[0].source
      } else if (responseData.data?.fileAttributes?.[0]?.source) {
        imageUrl = responseData.data.fileAttributes[0].source
      } else if (responseData.url) {
        imageUrl = responseData.url
      } else if (responseData.data?.url) {
        imageUrl = responseData.data.url
      } else if (responseData.files && responseData.files[0]?.url) {
        imageUrl = responseData.files[0].url
      }
      
      if (imageUrl) {
        const fileItem = {
          uid: file.uid || Date.now().toString(),
          name: fileObj.name || 'image.png',
          status: 'done' as const,
          url: imageUrl,
        }
        
        if (pageType === 'all-courses') {
          allCoursesForm.image = imageUrl
          allCoursesFileList.value = [fileItem]
        } else {
          myCoursesForm.image = imageUrl
          myCoursesFileList.value = [fileItem]
        }
        message.success('Upload ảnh thành công')
      } else {
        throw new Error('Không thể lấy URL ảnh từ server')
      }
    } else {
      throw new Error('Upload ảnh thất bại')
    }
  } catch (error: any) {
    console.error('Upload error:', error)
    message.error(error?.message || 'Không thể upload ảnh')
  } finally {
    uploading.value = false
  }
  
  return false // Prevent auto upload
}

const handlePreview = (file: UploadFile) => {
  previewImage.value = file.url || file.thumbUrl || ''
  previewVisible.value = true
}

const handleRemove = (pageType: 'all-courses' | 'my-courses') => {
  if (pageType === 'all-courses') {
    allCoursesForm.image = ''
    allCoursesFileList.value = []
  } else {
    myCoursesForm.image = ''
    myCoursesFileList.value = []
  }
}

// Handle save
const handleSave = async (pageType: 'all-courses' | 'my-courses') => {
  saving.value = true
  try {
    const formData = pageType === 'all-courses' ? allCoursesForm : myCoursesForm
    
    if (!formData.image) {
      message.error('Vui lòng upload hình ảnh')
      return
    }
    
    const response = await createBanner({
      page: pageType,
      title: formData.title || 'Banner',
      image: formData.image,
      url: formData.url || '',
      status: 'active',
    })
    
    if (response.status) {
      message.success('Lưu banner thành công')
      // Refresh to get updated data
      await fetchBanners()
    }
  } catch (error: any) {
    console.error('Error saving banner:', error)
    message.error(error?.message || 'Không thể lưu banner')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchBanners()
})
</script>
