<template>
  <div class="courses-management-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Quản lý khóa học</h1>
        <p class="page-subtitle">Quản lý tất cả khóa học trong hệ thống</p>
      </div>
      <div class="header-actions">
        <a-space>
          <a-button type="primary" @click="showCreateModal">
            <template #icon>
              <PlusOutlined />
            </template>
            Tạo mới
          </a-button>
          <a-button @click="refreshData" :loading="loading">
            <template #icon>
              <ReloadOutlined />
            </template>
            Làm mới
          </a-button>
        </a-space>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card stat-card-blue">
        <div class="stat-icon">
          <BookOutlined />
        </div>
        <div class="stat-content">
          <p class="stat-label">Tổng khóa học</p>
          <p class="stat-value">{{ formatNumber(stats.total) }}</p>
        </div>
      </div>
      
      <div class="stat-card stat-card-green">
        <div class="stat-icon">
          <CheckCircleOutlined />
        </div>
        <div class="stat-content">
          <p class="stat-label">Đang hoạt động</p>
          <p class="stat-value">{{ formatNumber(stats.active) }}</p>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <a-card class="filters-card" :bordered="false">
      <div class="filters-container">
        <a-input-search
          v-model:value="searchQuery"
          placeholder="Tìm kiếm theo tên, mã khóa học..."
          style="width: 300px"
          allow-clear
          @search="handleSearch"
          @pressEnter="handleSearch"
        />
        
        <a-select
          v-model:value="filterStatus"
          placeholder="Trạng thái"
          style="width: 150px"
          allow-clear
          @change="handleFilter"
        >
          <a-select-option value="">Tất cả</a-select-option>
          <a-select-option value="active">Hoạt động</a-select-option>
        </a-select>
      </div>
    </a-card>

    <!-- Courses Table - Desktop -->
    <a-card class="table-card" :bordered="false">
      <template #title>
        <span>Danh sách khóa học</span>
      </template>
      
      <!-- Desktop Table -->
      <div class="desktop-table">
        <a-table
          :columns="columns"
          :data-source="courses"
          :loading="loading"
          :pagination="paginationConfig"
          :scroll="{ x: 1200 }"
          @change="handleTableChange"
          row-key="_id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'thumbnail'">
              <a-avatar 
                :src="record.thumbnail" 
                :size="60"
                shape="square"
                :style="{ backgroundColor: '#f0f0f0' }"
              >
                <template v-if="!record.thumbnail">
                  <BookOutlined />
                </template>
              </a-avatar>
            </template>
            
            <template v-else-if="column.key === 'title'">
              <div class="course-info">
                <div class="course-title">{{ record.title || record.name || 'Chưa có tiêu đề' }}</div>
                <div class="course-code">{{ record.code || 'N/A' }}</div>
              </div>
            </template>
            
            <template v-else-if="column.key === 'description'">
              <div class="course-description">
                {{ record.shortDescription || record.description || 'Chưa có mô tả' }}
              </div>
            </template>
            
            <template v-else-if="column.key === 'price'">
              <div>
                <div class="price-current">{{ formatCurrency(record.price || 0) }}</div>
                <div v-if="record.originalPrice && record.originalPrice > record.price" class="price-original">
                  {{ formatCurrency(record.originalPrice) }}
                </div>
              </div>
            </template>
            
            <template v-else-if="column.key === 'createdAt'">
              {{ formatDate(record.createdAt) }}
            </template>
            
            <template v-else-if="column.key === 'actions'">
              <a-space>
                <a-button 
                  type="link" 
                  size="small" 
                  @click="viewCourse(record)"
                >
                  <EyeOutlined /> Xem
                </a-button>
                <a-button 
                  type="link" 
                  size="small"
                  @click="editCourse(record)"
                >
                  <EditOutlined /> Sửa
                </a-button>
                <a-popconfirm
                  title="Bạn có chắc muốn xóa khóa học này?"
                  ok-text="Xóa"
                  cancel-text="Hủy"
                  ok-type="danger"
                  @confirm="deleteCourse(record)"
                >
                  <a-button type="link" size="small" danger>
                    <DeleteOutlined /> Xóa
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
        </a-table>
      </div>

      <!-- Mobile Stack Cards -->
      <div class="mobile-cards">
        <div v-for="record in courses" :key="record._id" class="mobile-course-card">
          <div class="mobile-card-header">
            <a-avatar 
              :src="record.thumbnail" 
              :size="60"
              shape="square"
              :style="{ backgroundColor: '#f0f0f0' }"
            >
              <template v-if="!record.thumbnail">
                <BookOutlined />
              </template>
            </a-avatar>
            <div class="mobile-card-title-section">
              <div class="mobile-course-title">{{ record.title || record.name || 'Chưa có tiêu đề' }}</div>
              <div class="mobile-course-code">{{ record.code || 'N/A' }}</div>
            </div>
          </div>

          <div class="mobile-card-body">
            <div class="mobile-card-row">
              <span class="mobile-label">Mô tả:</span>
              <span class="mobile-value">{{ record.shortDescription || record.description || 'Chưa có mô tả' }}</span>
            </div>
            
            <div class="mobile-card-row">
              <span class="mobile-label">Giá:</span>
              <div class="mobile-value">
                <div class="price-current">{{ formatCurrency(record.price || 0) }}</div>
                <div v-if="record.originalPrice && record.originalPrice > record.price" class="price-original">
                  {{ formatCurrency(record.originalPrice) }}
                </div>
              </div>
            </div>
            
            <div class="mobile-card-row">
              <span class="mobile-label">Ngày tạo:</span>
              <span class="mobile-value">{{ formatDate(record.createdAt) }}</span>
            </div>
          </div>

          <div class="mobile-card-actions">
            <a-button 
              type="link" 
              size="small" 
              block
              @click="viewCourse(record)"
              class="mobile-action-btn"
            >
              <EyeOutlined /> Xem
            </a-button>
            <a-button 
              type="link" 
              size="small"
              block
              @click="editCourse(record)"
              class="mobile-action-btn"
            >
              <EditOutlined /> Sửa
            </a-button>
            <a-popconfirm
              title="Bạn có chắc muốn xóa khóa học này?"
              ok-text="Xóa"
              cancel-text="Hủy"
              ok-type="danger"
              @confirm="deleteCourse(record)"
            >
              <a-button type="link" size="small" danger block class="mobile-action-btn">
                <DeleteOutlined /> Xóa
              </a-button>
            </a-popconfirm>
          </div>
        </div>

        <!-- Mobile Pagination -->
        <div class="mobile-pagination">
          <a-pagination
            v-model:current="pagination.current"
            v-model:page-size="pagination.pageSize"
            :total="pagination.total"
            :page-size-options="['10', '20', '50']"
            show-size-changer
            show-total
            :show-total="(total) => `Tổng ${total} khóa học`"
            @change="handleTableChange"
            @showSizeChange="handleTableChange"
            size="small"
            simple
          />
        </div>
      </div>
    </a-card>

    <!-- Create/Edit Modal -->
    <a-modal
      v-model:open="modalVisible"
      :title="modalTitle"
      :width="1200"
      :confirm-loading="modalLoading"
      :ok-text="editingCourse ? 'Cập nhật' : 'Tạo mới'"
      :cancel-text="'Hủy'"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <a-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        layout="vertical"
        class="course-form"
      >
        <a-tabs v-model:activeKey="activeTab">
          <!-- Tab 1: Thông tin cơ bản -->
          <a-tab-pane key="basic" tab="Thông tin cơ bản">
            <a-row :gutter="16">
              <a-col :span="24">
                <a-form-item label="Tên khóa học" name="title">
                  <a-input
                    v-model:value="formData.title"
                    placeholder="Nhập tên khóa học"
                    @blur="generateSlug"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="Slug" name="slug">
                  <a-input
                    v-model:value="formData.slug"
                    placeholder="Slug sẽ được tạo tự động từ tên khóa học"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="Mô tả ngắn" name="shortDescription">
                  <a-textarea
                    v-model:value="formData.shortDescription"
                    placeholder="Nhập mô tả ngắn về khóa học"
                    :rows="3"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="Mô tả chi tiết" name="description">
                  <RichTextEditor
                    v-model="formData.description"
                    placeholder="Nhập mô tả chi tiết về khóa học"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="Danh mục" name="category">
                  <a-input
                    v-model:value="formData.category"
                    placeholder="Nhập danh mục"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="Cấp độ" name="level">
                  <a-select v-model:value="formData.level">
                    <a-select-option value="beginner">Cơ bản</a-select-option>
                    <a-select-option value="intermediate">Trung bình</a-select-option>
                    <a-select-option value="advanced">Nâng cao</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="Giá (VND)" name="price">
                  <a-input-number
                    v-model:value="formData.price"
                    :min="0"
                    :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value!.replace(/\$\s?|(,*)/g, '')"
                    style="width: 100%"
                    placeholder="0"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="Giá gốc (VND)" name="originalPrice">
                  <a-input-number
                    v-model:value="formData.originalPrice"
                    :min="0"
                    :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value!.replace(/\$\s?|(,*)/g, '')"
                    style="width: 100%"
                    placeholder="0"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="Giảm giá (%)" name="discount">
                  <a-input-number
                    v-model:value="formData.discount"
                    :min="0"
                    :max="100"
                    style="width: 100%"
                    placeholder="0"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="Ảnh đại diện" name="thumbnail">
                  <a-upload
                    v-model:file-list="thumbnailFileList"
                    list-type="picture-card"
                    :max-count="1"
                    :before-upload="() => false"
                    @change="handleThumbnailChange"
                    @remove="handleRemoveThumbnail"
                    accept="image/*"
                  >
                    <div v-if="thumbnailFileList.length < 1">
                      <PlusOutlined />
                      <div style="margin-top: 8px">Upload</div>
                    </div>
                  </a-upload>
                  <div v-if="formData.thumbnail && thumbnailFileList.length === 0" style="margin-top: 8px">
                    <img :src="formData.thumbnail" alt="Thumbnail" style="max-width: 200px; max-height: 200px; border-radius: 4px;" />
                  </div>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="Video giới thiệu">
                  <a-upload
                    v-model:file-list="introVideoFileList"
                    :before-upload="() => false"
                    @change="handleIntroVideoChange"
                    @remove="handleRemoveIntroVideo"
                    accept="video/*"
                    :max-count="1"
                  >
                    <a-button :loading="uploadingIntroVideo">
                      <UploadOutlined /> Chọn video
                    </a-button>
                  </a-upload>
                  
                  <!-- Video Status -->
                  <div v-if="formData.introVideoStatus" style="margin-top: 8px;" :key="`intro-video-status-${formData.introVideoStatus}-${uploadingIntroVideo}`">
                    <a-tag :color="getStatusColor(formData.introVideoStatus)">
                      <!-- CRITICAL FIX: Hardcode 'Sẵn sàng' when status is 'ready' to avoid any reactive issues -->
                      <span v-if="formData.introVideoStatus === 'ready'">Sẵn sàng</span>
                      <!-- Only show progress when actively uploading AND status is not ready -->
                      <template v-else-if="uploadingIntroVideo === true && 
                                      introVideoUploadProgress.stage && 
                                      introVideoUploadProgress.stage !== 'ready' && 
                                      introVideoUploadProgress.stage !== '' &&
                                      introVideoUploadProgress.percent < 100 &&
                                      formData.introVideoStatus !== 'ready'">
                        <a-spin size="small" style="margin-right: 4px;" />
                        {{ getStatusText(
                          introVideoUploadProgress.stage === 'uploading-r2' 
                            ? 'processing' 
                            : introVideoUploadProgress.stage
                        ) }}
                      </template>
                      <!-- Fallback: show formData.introVideoStatus -->
                      <template v-else>
                        {{ getStatusText(formData.introVideoStatus) }}
                      </template>
                    </a-tag>
                    
                    <!-- Upload Progress -->
                    <div v-if="uploadingIntroVideo && introVideoUploadProgress.percent >= 0" style="margin-top: 12px;">
                      <a-progress 
                        :percent="introVideoUploadProgress.percent" 
                        :status="introVideoUploadProgress.percent === 100 ? 'success' : 'active'"
                        :stroke-color="{
                          '0%': '#108ee9',
                          '100%': '#87d068',
                        }"
                        :show-info="true"
                      />
                      <div style="margin-top: 8px; font-size: 12px; color: #666;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                          <span>
                            <strong>{{ introVideoUploadProgress.percent }}%</strong>
                            <span style="margin-left: 8px; color: #1890ff; font-weight: 500;">
                              {{ getStatusText(introVideoUploadProgress.stage) }}
                            </span>
                          </span>
                          <span v-if="introVideoUploadProgress.timeRemaining > 0 && introVideoUploadProgress.percent < 100" style="color: #1890ff; font-weight: 500;">
                            ⏱️ Còn lại: {{ formatTimeRemaining(introVideoUploadProgress.timeRemaining) }}
                          </span>
                          <span v-else-if="introVideoUploadProgress.percent === 100" style="color: #52c41a; font-weight: 500;">
                            ✅ Hoàn thành
                          </span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                          <span>
                            <span v-if="introVideoUploadProgress.stage === 'uploading'">
                              {{ formatFileSize(introVideoUploadProgress.uploaded) }} / {{ formatFileSize(introVideoUploadProgress.total) }}
                            </span>
                            <span v-else-if="introVideoUploadProgress.stage === 'queueing'">
                              Đang chờ xử lý...
                            </span>
                            <span v-else-if="introVideoUploadProgress.stage === 'processing'">
                              Đang convert video sang HLS...
                            </span>
                            <span v-else-if="introVideoUploadProgress.stage === 'uploading-r2'">
                              Đang upload lên R2/CDN...
                            </span>
                            <span v-if="introVideoUploadProgress.speed > 0 && introVideoUploadProgress.stage === 'uploading'" style="margin-left: 8px; color: #52c41a;">
                              ({{ formatFileSize(introVideoUploadProgress.speed) }}/s)
                            </span>
                          </span>
                        </div>
                      </div>
                      <!-- Cancel button when uploading -->
                      <div v-if="introVideoUploadProgress.percent < 100" style="margin-top: 8px;">
                        <a-button size="small" danger @click="handleRemoveIntroVideo">
                          <DeleteOutlined /> Hủy upload
                        </a-button>
                      </div>
                    </div>
                    
                    <!-- Error Message & Actions -->
                    <div v-if="formData.introVideoStatus === 'error'" style="margin-top: 8px;">
                      <a-alert
                        :message="formData.introVideoErrorMessage || 'Lỗi upload video'"
                        type="error"
                        show-icon
                        style="margin-bottom: 8px;"
                      />
                      <a-space>
                        <a-button size="small" type="primary" @click="retryIntroVideoUpload">
                          <ReloadOutlined /> Thử lại
                        </a-button>
                        <a-button size="small" danger @click="handleRemoveIntroVideo">
                          <DeleteOutlined /> Xóa
                        </a-button>
                      </a-space>
                    </div>
                  </div>
                  
                  <!-- Video Preview -->
                  <div v-if="formData.introVideo && introVideoFileList.length === 0" style="margin-top: 8px">
                    <video :src="formData.introVideoHlsUrl || formData.introVideo" controls style="max-width: 100%; max-height: 300px;" />
                  </div>
                  
                  <!-- HLS URL -->
                  <div v-if="formData.introVideoHlsUrl" style="margin-top: 8px; font-size: 12px; color: #666;">
                    <strong>HLS URL:</strong> 
                    <a :href="formData.introVideoHlsUrl" target="_blank" style="margin-left: 4px; word-break: break-all;">
                      {{ formData.introVideoHlsUrl }}
                    </a>
                  </div>
                  
                  <!-- Quality Metadata -->
                  <div v-if="formData.introVideoQualityMetadata && (formData.introVideoQualityMetadata.resolution || formData.introVideoQualityMetadata.codec)" style="margin-top: 8px; font-size: 12px; color: #666;">
                    <strong>Chất lượng:</strong>
                    <span v-if="formData.introVideoQualityMetadata.resolution" style="margin-left: 4px;">
                      {{ formData.introVideoQualityMetadata.resolution }}
                    </span>
                    <span v-if="formData.introVideoQualityMetadata.codec" style="margin-left: 4px;">
                      {{ formData.introVideoQualityMetadata.codec }}
                    </span>
                    <span v-if="formData.introVideoQualityMetadata.fps" style="margin-left: 4px;">
                      {{ formData.introVideoQualityMetadata.fps }}fps
                    </span>
                    <span v-if="formData.introVideoQualityMetadata.bitrate" style="margin-left: 4px;">
                      {{ formData.introVideoQualityMetadata.bitrate }}
                    </span>
                    <span v-if="formData.introVideoQualityMetadata.segments" style="margin-left: 4px;">
                      ({{ formData.introVideoQualityMetadata.segments }} segments)
                    </span>
                  </div>
                  
                  <!-- Thumbnail Upload (Manual) -->
                  <div style="margin-top: 12px;">
                    <a-form-item label="Thumbnail video (tùy chọn)">
                      <a-upload
                        v-model:file-list="introVideoThumbnailFileList"
                        :before-upload="() => false"
                        @change="handleIntroVideoThumbnailChange"
                        @remove="handleRemoveIntroVideoThumbnail"
                        accept="image/*"
                        :max-count="1"
                        list-type="picture-card"
                      >
                        <div v-if="introVideoThumbnailFileList.length < 1">
                          <PlusOutlined />
                          <div style="margin-top: 8px">Upload</div>
                        </div>
                      </a-upload>
                      <div v-if="formData.introVideoThumbnail && introVideoThumbnailFileList.length === 0" style="margin-top: 8px">
                        <img :src="formData.introVideoThumbnail" alt="Video thumbnail" style="max-width: 200px; max-height: 150px; object-fit: cover;" />
                      </div>
                    </a-form-item>
                  </div>
                  
                  <div v-if="introVideoFileList.length > 0 && introVideoFileList[0] && !introVideoFileList[0].url && !uploadingIntroVideo" style="margin-top: 8px; color: #8c8c8c; font-size: 12px;">
                    Video sẽ được upload khi bạn nhấn "Tạo mới" hoặc "Cập nhật"
                  </div>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="Tags">
                  <a-select
                    v-model:value="formData.tags"
                    mode="tags"
                    placeholder="Nhập tags và nhấn Enter"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="Trạng thái" name="status">
                  <a-select v-model:value="formData.status">
                    <a-select-option value="active">Hoạt động</a-select-option>
                    <a-select-option value="inactive">Không hoạt động</a-select-option>
                    <a-select-option value="draft">Bản nháp</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="Xuất bản">
                  <a-switch v-model:checked="formData.isPublished" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="Nổi bật">
                  <a-switch v-model:checked="formData.isFeatured" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-tab-pane>

          <!-- Tab 2: Thông tin giảng viên -->
          <a-tab-pane key="instructor" tab="Giảng viên">
            <a-row :gutter="16">
              <a-col :span="24">
                <a-form-item label="Tên giảng viên" name="instructor.name">
                  <a-input
                    v-model:value="formData.instructor.name"
                    placeholder="Nhập tên giảng viên"
                    @blur="() => formRef?.clearValidate('instructor.name')"
                    @input="() => formRef?.clearValidate('instructor.name')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="Ảnh đại diện giảng viên">
                  <a-upload
                    v-model:file-list="instructorAvatarFileList"
                    list-type="picture-card"
                    :max-count="1"
                    :before-upload="() => false"
                    @remove="handleRemoveInstructorAvatar"
                    accept="image/*"
                  >
                    <div v-if="instructorAvatarFileList.length < 1">
                      <PlusOutlined />
                      <div style="margin-top: 8px">Upload</div>
                    </div>
                  </a-upload>
                  <div v-if="formData.instructor.avatar && instructorAvatarFileList.length === 0" style="margin-top: 8px">
                    <img :src="formData.instructor.avatar" alt="Avatar" style="max-width: 200px; max-height: 200px; border-radius: 4px;" />
                  </div>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="Tiểu sử">
                  <a-textarea
                    v-model:value="formData.instructor.bio"
                    placeholder="Nhập tiểu sử giảng viên"
                    :rows="5"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-tab-pane>

          <!-- Tab 3: Chương và bài học -->
          <a-tab-pane key="chapters" tab="Chương & Bài học">
            <div class="chapters-section">
              <div v-for="(chapter, chapterIndex) in formData.chapters" :key="chapterIndex" class="chapter-item" style="margin-bottom: 24px; padding: 16px; border: 1px solid #d9d9d9; border-radius: 4px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                  <h4>Chương {{ chapterIndex + 1 }}: {{ chapter.title || 'Chưa có tiêu đề' }}</h4>
                  <a-button type="text" danger @click="removeChapter(chapterIndex)">
                    <DeleteOutlined /> Xóa chương
                  </a-button>
                </div>
                <a-row :gutter="16">
                  <a-col :span="24">
                    <a-form-item :label="`Tiêu đề chương ${chapterIndex + 1}`">
                      <a-input
                        v-model:value="chapter.title"
                        placeholder="Nhập tiêu đề chương"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="24">
                    <a-form-item :label="`Mô tả chương ${chapterIndex + 1}`">
                      <a-textarea
                        v-model:value="chapter.description"
                        placeholder="Nhập mô tả chương"
                        :rows="2"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <div style="margin-top: 16px;">
                  <h5>Bài học trong chương này:</h5>
                  <div v-for="(lesson, lessonIndex) in chapter.lessons" :key="lessonIndex" style="margin-top: 12px; padding: 16px; background: #f5f5f5; border-radius: 4px; border: 1px solid #d9d9d9;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                      <strong>Bài {{ lessonIndex + 1 }}: {{ lesson.title || 'Chưa có tiêu đề' }}</strong>
                      <a-button type="text" danger size="small" @click="removeLesson(chapterIndex, lessonIndex)">
                        <DeleteOutlined /> Xóa
                      </a-button>
                    </div>
                    <a-row :gutter="16">
                      <a-col :span="24">
                        <a-form-item label="Tiêu đề bài học">
                          <a-input
                            v-model:value="lesson.title"
                            placeholder="Nhập tiêu đề bài học"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col :span="24">
                        <a-form-item label="Mô tả bài học">
                          <a-textarea
                            v-model:value="lesson.description"
                            placeholder="Nhập mô tả bài học"
                            :rows="2"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col :span="12">
                        <a-form-item label="Loại bài học">
                          <a-select v-model:value="lesson.type" style="width: 100%">
                            <a-select-option value="video">Video</a-select-option>
                            <a-select-option value="document">Tài liệu</a-select-option>
                            <a-select-option value="quiz">Quiz</a-select-option>
                            <a-select-option value="text">Văn bản</a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col :span="12">
                        <a-form-item label="Cho phép học thử">
                          <a-switch 
                            v-model:checked="lesson.isPreview" 
                            checked-children="Có"
                            un-checked-children="Không"
                          />
                          <span style="margin-left: 8px; color: #8c8c8c; font-size: 12px;">
                            {{ lesson.isPreview ? 'Bài học này có thể học thử' : 'Bài học này không được học thử' }}
                          </span>
                        </a-form-item>
                      </a-col>

                      <!-- Video Type -->
                      <template v-if="lesson.type === 'video'">
                        <a-col :span="24">
                          <a-form-item label="Upload Video">
                            <a-upload
                              v-model:file-list="lesson.videoFileList"
                              :before-upload="() => false"
                              @change="(info) => handleLessonVideoChange(chapterIndex, lessonIndex, info)"
                              accept="video/*"
                              :max-count="1"
                            >
                              <a-button :loading="lesson.uploadingVideo">
                                <UploadOutlined /> Chọn video
                              </a-button>
                            </a-upload>
                            
                            <!-- Video Status -->
                            <div v-if="lesson.videos && lesson.videos.length > 0 && lesson.videos[0].status" style="margin-top: 8px;">
                              <a-tag :color="getStatusColor(
                                (lesson.uploadingVideo && lessonVideoUploadProgress[`chapter-${chapterIndex}-lesson-${lessonIndex}`]?.stage && 
                                 lessonVideoUploadProgress[`chapter-${chapterIndex}-lesson-${lessonIndex}`].stage !== 'ready')
                                  ? lessonVideoUploadProgress[`chapter-${chapterIndex}-lesson-${lessonIndex}`].stage === 'uploading-r2'
                                    ? 'processing'
                                    : lessonVideoUploadProgress[`chapter-${chapterIndex}-lesson-${lessonIndex}`].stage
                                  : (lesson.videos[0]?.status === 'uploading' || lesson.videos[0]?.status === 'queueing' || lesson.videos[0]?.status === 'processing')
                                    && (lesson.videos[0]?.videoUrl || lesson.videos[0]?.hlsUrl)
                                    ? 'ready'
                                    : lesson.videos[0]?.status || 'ready'
                              )">
                                <template v-if="lesson.uploadingVideo && lessonVideoUploadProgress[`chapter-${chapterIndex}-lesson-${lessonIndex}`]?.stage && 
                                               lessonVideoUploadProgress[`chapter-${chapterIndex}-lesson-${lessonIndex}`].stage !== 'ready'">
                                  <a-spin size="small" style="margin-right: 4px;" />
                                  {{ getStatusText(
                                    lessonVideoUploadProgress[`chapter-${chapterIndex}-lesson-${lessonIndex}`].stage === 'uploading-r2'
                                      ? 'processing'
                                      : lessonVideoUploadProgress[`chapter-${chapterIndex}-lesson-${lessonIndex}`].stage
                                  ) }}
                                </template>
                                <template v-else>
                                  {{ getStatusText(
                                    (lesson.videos[0]?.status === 'uploading' || lesson.videos[0]?.status === 'queueing' || lesson.videos[0]?.status === 'processing')
                                    && (lesson.videos[0]?.videoUrl || lesson.videos[0]?.hlsUrl)
                                      ? 'ready'
                                      : lesson.videos[0]?.status || 'ready'
                                  ) }}
                                </template>
                              </a-tag>
                              
                              <!-- Upload Progress for Lesson Video -->
                              <div v-if="lesson.uploadingVideo && lessonVideoUploadProgress[`chapter-${chapterIndex}-lesson-${lessonIndex}`]" style="margin-top: 12px;">
                                <a-progress 
                                  :percent="lessonVideoUploadProgress[`chapter-${chapterIndex}-lesson-${lessonIndex}`]?.percent || 0" 
                                  :status="lessonVideoUploadProgress[`chapter-${chapterIndex}-lesson-${lessonIndex}`]?.percent === 100 ? 'success' : 'active'"
                                  :stroke-color="{
                                    '0%': '#108ee9',
                                    '100%': '#87d068',
                                  }"
                                  :show-info="true"
                                />
                                <div style="margin-top: 8px; font-size: 12px; color: #666;">
                                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                    <span>
                                      <strong>{{ lessonVideoUploadProgress[`chapter-${chapterIndex}-lesson-${lessonIndex}`]?.percent || 0 }}%</strong>
                                      <span style="margin-left: 8px; color: #1890ff; font-weight: 500;">
                                        {{ getStatusText(lessonVideoUploadProgress[`chapter-${chapterIndex}-lesson-${lessonIndex}`]?.stage || 'uploading') }}
                                      </span>
                                    </span>
                                    <span v-if="lessonVideoUploadProgress[`chapter-${chapterIndex}-lesson-${lessonIndex}`]?.timeRemaining > 0 && lessonVideoUploadProgress[`chapter-${chapterIndex}-lesson-${lessonIndex}`]?.percent < 100" style="color: #1890ff; font-weight: 500;">
                                      ⏱️ Còn lại: {{ formatTimeRemaining(lessonVideoUploadProgress[`chapter-${chapterIndex}-lesson-${lessonIndex}`]?.timeRemaining || 0) }}
                                    </span>
                                    <span v-else-if="lessonVideoUploadProgress[`chapter-${chapterIndex}-lesson-${lessonIndex}`]?.percent === 100" style="color: #52c41a; font-weight: 500;">
                                      ✅ Hoàn thành
                                    </span>
                                  </div>
                                  <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span>
                                      <span v-if="lessonVideoUploadProgress[`chapter-${chapterIndex}-lesson-${lessonIndex}`]?.stage === 'uploading'">
                                        {{ formatFileSize(lessonVideoUploadProgress[`chapter-${chapterIndex}-lesson-${lessonIndex}`]?.uploaded || 0) }} / {{ formatFileSize(lessonVideoUploadProgress[`chapter-${chapterIndex}-lesson-${lessonIndex}`]?.total || 0) }}
                                      </span>
                                      <span v-else-if="lessonVideoUploadProgress[`chapter-${chapterIndex}-lesson-${lessonIndex}`]?.stage === 'queueing'">
                                        Đang chờ xử lý...
                                      </span>
                                      <span v-else-if="lessonVideoUploadProgress[`chapter-${chapterIndex}-lesson-${lessonIndex}`]?.stage === 'processing'">
                                        Đang convert video sang HLS...
                                      </span>
                                      <span v-else-if="lessonVideoUploadProgress[`chapter-${chapterIndex}-lesson-${lessonIndex}`]?.stage === 'uploading-r2'">
                                        Đang upload lên R2/CDN...
                                      </span>
                                      <span v-if="lessonVideoUploadProgress[`chapter-${chapterIndex}-lesson-${lessonIndex}`]?.speed > 0 && lessonVideoUploadProgress[`chapter-${chapterIndex}-lesson-${lessonIndex}`]?.stage === 'uploading'" style="margin-left: 8px; color: #52c41a;">
                                        ({{ formatFileSize(lessonVideoUploadProgress[`chapter-${chapterIndex}-lesson-${lessonIndex}`]?.speed || 0) }}/s)
                                      </span>
                                    </span>
                                  </div>
                                </div>
                                <!-- Cancel button when uploading -->
                                <div v-if="lessonVideoUploadProgress[`chapter-${chapterIndex}-lesson-${lessonIndex}`]?.percent < 100" style="margin-top: 8px;">
                                  <a-button size="small" danger @click="async () => {
                                    // Cancel upload if in progress
                                    if (lesson.videos[0]?.jobId && 
                                        (lesson.videos[0].status === 'uploading' || 
                                         lesson.videos[0].status === 'queueing' || 
                                         lesson.videos[0].status === 'processing')) {
                                      try {
                                        const uploadsApi = useUploadsApi()
                                        await uploadsApi.cancelVideoUpload(lesson.videos[0].jobId)
                                        message.success('Đã hủy upload video và xóa các file đã tạo')
                                      } catch (error: any) {
                                        console.error('Cancel video upload error:', error)
                                        message.warning('Không thể hủy upload, nhưng đã xóa khỏi form')
                                      }
                                    }
                                    lesson.videos = []
                                    lesson.videoFileList = []
                                    lesson.uploadingVideo = false
                                    delete lessonVideoUploadProgress[`chapter-${chapterIndex}-lesson-${lessonIndex}`]
                                  }">
                                    <DeleteOutlined /> Hủy upload
                                  </a-button>
                                </div>
                              </div>
                              
                              <!-- Error Message & Actions -->
                              <div v-if="lesson.videos[0].status === 'error'" style="margin-top: 8px;">
                                <a-alert
                                  :message="lesson.videos[0].errorMessage || 'Lỗi upload video'"
                                  type="error"
                                  show-icon
                                  style="margin-bottom: 8px;"
                                />
                                <a-space>
                                  <a-button size="small" type="primary" @click="() => handleLessonVideoChange(chapterIndex, lessonIndex, { fileList: lesson.videoFileList })">
                                    <ReloadOutlined /> Thử lại
                                  </a-button>
                                  <a-button size="small" danger @click="async () => {
                                    // Cancel upload if in progress
                                    if (lesson.videos[0]?.jobId && 
                                        (lesson.videos[0].status === 'uploading' || 
                                         lesson.videos[0].status === 'queueing' || 
                                         lesson.videos[0].status === 'processing')) {
                                      try {
                                        const uploadsApi = useUploadsApi()
                                        await uploadsApi.cancelVideoUpload(lesson.videos[0].jobId)
                                        message.success('Đã hủy upload video và xóa các file đã tạo')
                                      } catch (error: any) {
                                        console.error('Cancel video upload error:', error)
                                        message.warning('Không thể hủy upload, nhưng đã xóa khỏi form')
                                      }
                                    }
                                    lesson.videos = []
                                    lesson.videoFileList = []
                                  }">
                                    <DeleteOutlined /> Xóa
                                  </a-button>
                                </a-space>
                              </div>
                            </div>
                            
                            <!-- Video Info -->
                            <div v-if="lesson.videos && lesson.videos.length > 0 && lesson.videos[0].status !== 'error'" style="margin-top: 8px;">
                              <a-tag color="success">Đã upload: {{ lesson.videos[0].title }}</a-tag>
                            </div>
                            
                            <!-- HLS URL -->
                            <div v-if="lesson.videos && lesson.videos.length > 0 && lesson.videos[0].hlsUrl" style="margin-top: 8px; font-size: 12px; color: #666;">
                              <strong>HLS URL:</strong> 
                              <a :href="lesson.videos[0].hlsUrl" target="_blank" style="margin-left: 4px; word-break: break-all;">
                                {{ lesson.videos[0].hlsUrl }}
                              </a>
                            </div>
                            
                            <!-- Quality Metadata -->
                            <div v-if="lesson.videos && lesson.videos.length > 0 && lesson.videos[0].qualityMetadata && (lesson.videos[0].qualityMetadata.resolution || lesson.videos[0].qualityMetadata.codec)" style="margin-top: 8px; font-size: 12px; color: #666;">
                              <strong>Chất lượng:</strong>
                              <span v-if="lesson.videos[0].qualityMetadata.resolution" style="margin-left: 4px;">
                                {{ lesson.videos[0].qualityMetadata.resolution }}
                              </span>
                              <span v-if="lesson.videos[0].qualityMetadata.codec" style="margin-left: 4px;">
                                {{ lesson.videos[0].qualityMetadata.codec }}
                              </span>
                              <span v-if="lesson.videos[0].qualityMetadata.fps" style="margin-left: 4px;">
                                {{ lesson.videos[0].qualityMetadata.fps }}fps
                              </span>
                              <span v-if="lesson.videos[0].qualityMetadata.bitrate" style="margin-left: 4px;">
                                {{ lesson.videos[0].qualityMetadata.bitrate }}
                              </span>
                              <span v-if="lesson.videos[0].qualityMetadata.segments" style="margin-left: 4px;">
                                ({{ lesson.videos[0].qualityMetadata.segments }} segments)
                              </span>
                            </div>
                          </a-form-item>
                        </a-col>
                      </template>

                      <!-- Document Type -->
                      <template v-if="lesson.type === 'document'">
                        <a-col :span="24">
                          <a-form-item label="Upload Tài liệu">
                            <a-upload
                              v-model:file-list="lesson.documentFileList"
                              :before-upload="() => false"
                              @change="(info) => handleLessonDocumentChange(chapterIndex, lessonIndex, info)"
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                              :max-count="1"
                            >
                              <a-button :loading="lesson.uploadingDocument">
                                <UploadOutlined /> Chọn tài liệu
                              </a-button>
                            </a-upload>
                            <div v-if="lesson.documents && lesson.documents.length > 0" style="margin-top: 8px;">
                              <a-tag color="success">Đã upload: {{ lesson.documents[0].title }}</a-tag>
                            </div>
                          </a-form-item>
                        </a-col>
                      </template>

                      <!-- Quiz Type -->
                      <template v-if="lesson.type === 'quiz'">
                        <a-col :span="24">
                          <a-form-item label="Tiêu đề Quiz">
                            <a-input
                              v-model:value="lesson.quiz.title"
                              placeholder="Nhập tiêu đề quiz"
                            />
                          </a-form-item>
                        </a-col>
                        <a-col :span="24">
                          <a-form-item label="Mô tả Quiz">
                            <a-textarea
                              v-model:value="lesson.quiz.description"
                              placeholder="Nhập mô tả quiz"
                              :rows="2"
                            />
                          </a-form-item>
                        </a-col>
                        <a-col :span="24">
                          <div style="margin-bottom: 16px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                              <strong>Câu hỏi:</strong>
                              <a-button type="primary" size="small" @click="addQuestion(chapterIndex, lessonIndex)">
                                <PlusOutlined /> Thêm câu hỏi
                              </a-button>
                            </div>
                            <div v-for="(question, questionIndex) in (lesson.quiz.questions || [])" :key="questionIndex" style="margin-bottom: 16px; padding: 12px; background: white; border-radius: 4px; border: 1px solid #e8e8e8;">
                              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <strong>Câu {{ questionIndex + 1 }}:</strong>
                                <a-button type="text" danger size="small" @click="removeQuestion(chapterIndex, lessonIndex, questionIndex)">
                                  <DeleteOutlined /> Xóa
                                </a-button>
                              </div>
                              <a-form-item label="Câu hỏi">
                                <a-input
                                  v-model:value="question.question"
                                  placeholder="Nhập câu hỏi"
                                />
                              </a-form-item>
                              <div style="margin-bottom: 12px;">
                                <strong>Đáp án:</strong>
                                <div v-for="(option, optionIndex) in (question.options || [])" :key="optionIndex" style="display: flex; gap: 8px; margin-top: 8px; align-items: center;">
                                  <a-checkbox v-model:checked="option.isCorrect" />
                                  <a-input
                                    v-model:value="option.text"
                                    :placeholder="`Đáp án ${optionIndex + 1}`"
                                    style="flex: 1"
                                  />
                                  <a-button type="text" danger size="small" @click="removeOption(chapterIndex, lessonIndex, questionIndex, optionIndex)">
                                    <DeleteOutlined />
                                  </a-button>
                                </div>
                                <a-button type="dashed" size="small" style="width: 100%; margin-top: 8px;" @click="addOption(chapterIndex, lessonIndex, questionIndex)">
                                  <PlusOutlined /> Thêm đáp án
                                </a-button>
                              </div>
                              <a-form-item label="Giải thích (tùy chọn)">
                                <a-textarea
                                  v-model:value="question.explanation"
                                  placeholder="Nhập giải thích cho câu trả lời đúng"
                                  :rows="2"
                                />
                              </a-form-item>
                            </div>
                          </div>
                        </a-col>
                      </template>

                      <!-- Text Type -->
                      <template v-if="lesson.type === 'text'">
                        <a-col :span="24">
                          <a-form-item label="Nội dung văn bản">
                            <a-textarea
                              v-model:value="lesson.content"
                              placeholder="Nhập nội dung văn bản"
                              :rows="10"
                            />
                          </a-form-item>
                        </a-col>
                      </template>
                    </a-row>
                  </div>
                  <a-button type="dashed" style="width: 100%; margin-top: 8px;" @click="addLesson(chapterIndex)">
                    <PlusOutlined /> Thêm bài học
                  </a-button>
                </div>
              </div>
              <a-button type="dashed" style="width: 100%;" @click="addChapter">
                <PlusOutlined /> Thêm chương mới
              </a-button>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-form>
    </a-modal>

    <!-- View Course Modal -->
    <a-modal
      v-model:open="viewModalVisible"
      title="Chi tiết khóa học"
      :width="1000"
      :footer="null"
    >
      <div v-if="viewingCourse" class="course-detail-view">
        <!-- Basic Info -->
        <a-descriptions title="Thông tin cơ bản" bordered :column="2">
          <a-descriptions-item label="Tên khóa học">
            {{ viewingCourse.title || viewingCourse.name }}
          </a-descriptions-item>
          <a-descriptions-item label="Slug">
            {{ viewingCourse.slug }}
          </a-descriptions-item>
          <a-descriptions-item label="Mô tả ngắn" :span="2">
            {{ viewingCourse.shortDescription || 'Chưa có' }}
          </a-descriptions-item>
          <a-descriptions-item label="Mô tả chi tiết" :span="2">
            {{ viewingCourse.description || 'Chưa có' }}
          </a-descriptions-item>
          <a-descriptions-item label="Danh mục">
            {{ viewingCourse.category }}
          </a-descriptions-item>
          <a-descriptions-item label="Cấp độ">
            {{ viewingCourse.level === 'beginner' ? 'Cơ bản' : viewingCourse.level === 'intermediate' ? 'Trung bình' : 'Nâng cao' }}
          </a-descriptions-item>
          <a-descriptions-item label="Giá">
            {{ formatCurrency(viewingCourse.price || 0) }}
          </a-descriptions-item>
          <a-descriptions-item label="Giá gốc">
            {{ viewingCourse.originalPrice ? formatCurrency(viewingCourse.originalPrice) : 'N/A' }}
          </a-descriptions-item>
          <a-descriptions-item label="Giảm giá">
            {{ viewingCourse.discount || 0 }}%
          </a-descriptions-item>
          <a-descriptions-item label="Trạng thái">
            <a-tag :color="viewingCourse.status === 'active' ? 'success' : 'default'">
              {{ viewingCourse.status === 'active' ? 'Hoạt động' : viewingCourse.status === 'draft' ? 'Bản nháp' : 'Không hoạt động' }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Xuất bản">
            <a-tag :color="viewingCourse.isPublished ? 'success' : 'default'">
              {{ viewingCourse.isPublished ? 'Có' : 'Không' }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Nổi bật">
            <a-tag :color="viewingCourse.isFeatured ? 'success' : 'default'">
              {{ viewingCourse.isFeatured ? 'Có' : 'Không' }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Tags" :span="2">
            <a-tag v-for="tag in (viewingCourse.tags || [])" :key="tag" style="margin: 4px;">
              {{ tag }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Ngày tạo">
            {{ formatDate(viewingCourse.createdAt) }}
          </a-descriptions-item>
          <a-descriptions-item label="Ngày cập nhật">
            {{ formatDate(viewingCourse.updatedAt) }}
          </a-descriptions-item>
        </a-descriptions>

        <!-- Instructor Info -->
        <a-descriptions title="Thông tin giảng viên" bordered :column="2" style="margin-top: 24px;">
          <a-descriptions-item label="Tên giảng viên">
            {{ viewingCourse.instructor?.name || 'Chưa có' }}
          </a-descriptions-item>
          <a-descriptions-item label="Ảnh đại diện">
            <img 
              v-if="viewingCourse.instructor?.avatar" 
              :src="viewingCourse.instructor.avatar" 
              style="max-width: 100px; max-height: 100px; border-radius: 4px;"
            />
            <span v-else>Chưa có</span>
          </a-descriptions-item>
          <a-descriptions-item label="Tiểu sử" :span="2">
            {{ viewingCourse.instructor?.bio || 'Chưa có' }}
          </a-descriptions-item>
        </a-descriptions>

        <!-- Thumbnail & Intro Video -->
        <div style="margin-top: 24px;">
          <h3>Hình ảnh & Video</h3>
          <a-row :gutter="16" style="margin-top: 16px;">
            <a-col :span="12">
              <div>
                <strong>Ảnh đại diện:</strong>
                <div style="margin-top: 8px;">
                  <img 
                    v-if="viewingCourse.thumbnail" 
                    :src="viewingCourse.thumbnail" 
                    style="max-width: 100%; max-height: 200px; border-radius: 4px;"
                  />
                  <span v-else>Chưa có</span>
                </div>
              </div>
            </a-col>
            <a-col :span="12">
              <div>
                <strong>Video giới thiệu:</strong>
                <div style="margin-top: 8px;">
                  <video 
                    v-if="viewingCourse.introVideo" 
                    :src="viewingCourse.introVideo" 
                    controls
                    style="max-width: 100%; max-height: 200px; border-radius: 4px;"
                  />
                  <span v-else>Chưa có</span>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>

        <!-- Statistics -->
        <a-descriptions title="Thống kê" bordered :column="3" style="margin-top: 24px;">
          <a-descriptions-item label="Tổng bài học">
            {{ viewingCourse.lessons || 0 }}
          </a-descriptions-item>
          <a-descriptions-item label="Học viên">
            {{ viewingCourse.students || 0 }}
          </a-descriptions-item>
          <a-descriptions-item label="Đánh giá">
            {{ viewingCourse.rating?.average || 0 }}/5 ({{ viewingCourse.rating?.count || 0 }} đánh giá)
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {
  PlusOutlined,
  ReloadOutlined,
  BookOutlined,
  CheckCircleOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  UserOutlined,
  CalendarOutlined,
  TagOutlined,
  LevelOutlined,
  TagsOutlined,
} from '@ant-design/icons-vue'
import { useUploadsApi } from '~/composables/api/useUploadsApi'
import { message } from 'ant-design-vue'
import type { Course } from '~/types/api'
import { useCoursesApi } from '~/composables/api/useCoursesApi'
import type { UploadFile } from 'ant-design-vue'
import { watch, nextTick } from 'vue'

definePageMeta({
  layout: 'default',
  middleware: ['auth', 'role'],
  requiredRole: ['admin', 'manager']  // Chỉ Admin và Manager
})

useHead({
  title: 'Quản lý khóa học - Vạn Phúc Care Admin'
})

const coursesApi = useCoursesApi()

// State
const loading = ref(false)
const courses = ref<Course[]>([])
const stats = reactive({
  total: 0,
  active: 0,
  // inactive: 0, // Có thể xóa nếu không dùng
})

// Search & Filter
const searchQuery = ref('')
const filterStatus = ref('')

// Pagination
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})

// Modal
const modalVisible = ref(false)
const modalLoading = ref(false)
const modalTitle = computed(() => editingCourse.value ? 'Sửa khóa học' : 'Tạo khóa học mới')
const editingCourse = ref<Course | null>(null)
const formRef = ref()

// Thêm state cho view modal
const viewModalVisible = ref(false)
const viewingCourse = ref<Course | null>(null)

// State for file uploads
const thumbnailFileList = ref<UploadFile[]>([])
const introVideoFileList = ref<UploadFile[]>([])
const introVideoThumbnailFileList = ref<UploadFile[]>([]) // Thumbnail riêng cho video
const instructorAvatarFileList = ref<UploadFile[]>([])
const uploadingIntroVideo = ref(false)
const activeTab = ref('basic')

// Store polling interval references to clear them when needed
const introVideoPollInterval = ref<NodeJS.Timeout | null>(null)
const lessonVideoPollIntervals = ref<Record<string, NodeJS.Timeout>>({})

// Video upload progress tracking - includes upload, processing, and R2 upload
const introVideoUploadProgress = reactive({
  percent: 0,
  uploaded: 0,
  total: 0,
  speed: 0, // bytes per second
  timeRemaining: 0, // seconds
  startTime: 0,
  lastUpdateTime: 0, // For calculating speed more accurately
  lastUploaded: 0, // For calculating speed more accurately
  stage: 'uploading' as 'uploading' | 'queueing' | 'processing' | 'uploading-r2' | 'ready' | '', // Current stage
  fileUploadPercent: 0, // Progress of file upload (0-100)
  estimatedProcessingTime: 0, // Estimated time for HLS conversion (seconds)
  estimatedR2UploadTime: 0, // Estimated time for R2 upload (seconds)
})

const lessonVideoUploadProgress = reactive<Record<string, {
  percent: number
  uploaded: number
  total: number
  speed: number
  timeRemaining: number
  startTime: number
  lastUpdateTime: number
  lastUploaded: number
  stage: 'uploading' | 'queueing' | 'processing' | 'uploading-r2' | 'ready' | ''
  fileUploadPercent: number
  estimatedProcessingTime: number
  estimatedR2UploadTime: number
}>>({})

// Updated formData - THÊM LẠI ĐỊNH NGHĨA NÀY
const formData = reactive({
  title: '',
  slug: '',
  description: '',
  shortDescription: '',
  thumbnail: '',
  introVideo: '',
  // Video metadata fields
  introVideoStatus: 'ready' as 'uploading' | 'queueing' | 'processing' | 'ready' | 'error',
  introVideoHlsUrl: '',
  introVideoJobId: '', // Job ID for canceling upload
  introVideoQualityMetadata: {
    resolution: '',
    bitrate: '',
    codec: '',
    fps: 0,
    segments: 0,
  },
  introVideoThumbnail: '', // Thumbnail riêng cho video (Admin upload thủ công)
  introVideoErrorMessage: '', // Error message for intro video
  price: 0,
  originalPrice: 0,
  discount: 0,
  instructor: {
    name: '',
    avatar: '',
    bio: '',
  },
  category: '',
  level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
  tags: [] as string[],
  isPublished: true,
  isFeatured: false,
  status: 'active' as 'active' | 'inactive' | 'draft',
  chapters: [] as any[],
})

// Table columns - THÊM ĐỊNH NGHĨA NÀY
const columns = [
  {
    title: 'Ảnh',
    key: 'thumbnail',
    width: 80,
    fixed: 'left',
  },
  {
    title: 'Tên khóa học',
    key: 'title',
    width: 250,
    fixed: 'left',
  },
  {
    title: 'Mô tả',
    key: 'description',
    width: 300,
  },
  {
    title: 'Giá',
    key: 'price',
    width: 150,
  },
  {
    title: 'Trạng thái',
    key: 'status',
    width: 120,
  },
  {
    title: 'Ngày tạo',
    key: 'createdAt',
    width: 150,
  },
  {
    title: 'Thao tác',
    key: 'actions',
    width: 200,
    fixed: 'right',
  },
]

const paginationConfig = computed(() => ({
  current: pagination.current,
  pageSize: pagination.pageSize,
  total: pagination.total,
  showSizeChanger: true,
  showTotal: (total: number) => `Tổng ${total} khóa học`,
  pageSizeOptions: ['10', '20', '50', '100'],
}))

// Format functions
// Helper functions for video status
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    uploading: 'blue',
    queueing: 'orange',
    processing: 'purple',
    ready: 'green',
    error: 'red',
  }
  return colors[status] || 'default'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    uploading: 'Đang upload',
    queueing: 'Đang chờ xử lý',
    processing: 'Đang xử lý',
    'uploading-r2': 'Đang upload lên R2',
    ready: 'Sẵn sàng',
    error: 'Lỗi',
  }
  return texts[status] || status
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('vi-VN').format(num || 0)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount || 0)
}

const formatDate = (date: string | Date) => {
  if (!date) return 'N/A'
  const dateObj = typeof date === 'string' ? new Date(date) : date
  if (isNaN(dateObj.getTime())) return 'N/A'
  return dateObj.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

// Generate slug from title
const generateSlug = () => {
  if (formData.title) {
    formData.slug = formData.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
}

// File upload handlers
const handlePreview = async (file: UploadFile) => {
  // Preview logic
}

const handleThumbnailChange = (info: any) => {
  const { fileList } = info
  if (fileList.length > 0) {
    const file = fileList[0]
    // Tạo preview URL từ file local
    if (file.originFileObj) {
      const reader = new FileReader()
      reader.onload = (e) => {
        formData.thumbnail = e.target?.result as string
        // Clear validation error
        formRef.value?.clearValidate('thumbnail')
      }
      reader.readAsDataURL(file.originFileObj)
    } else if (file.url) {
      // Nếu đã có URL (khi edit)
      formData.thumbnail = file.url
      formRef.value?.clearValidate('thumbnail')
    }
  } else {
    formData.thumbnail = ''
  }
}

const handleRemoveThumbnail = () => {
  formData.thumbnail = ''
  thumbnailFileList.value = []
  formRef.value?.clearValidate('thumbnail')
}

const handleIntroVideoChange = async (info: any) => {
  const { fileList } = info
  
  if (fileList.length > 0 && fileList[0].originFileObj) {
    const file = fileList[0].originFileObj as File
    uploadingIntroVideo.value = true
    
    // Set status to uploading
    formData.introVideoStatus = 'uploading'
    formData.introVideoErrorMessage = ''
    
    try {
      // Upload video to R2/CDN - returns full video object
      const videoData = await uploadVideoToR2(file, 'courses/intro-videos')
      
      // Lưu các trường vào formData
      formData.introVideo = videoData.url || videoData.hlsUrl || ''
      formData.introVideoHlsUrl = videoData.hlsUrl || ''
      formData.introVideoStatus = videoData.status || 'ready'
      formData.introVideoErrorMessage = videoData.errorMessage || ''
      formData.introVideoJobId = videoData.jobId || ''
      formData.introVideoQualityMetadata = videoData.qualityMetadata || {
        resolution: '',
        bitrate: '',
        codec: '',
        fps: 0,
        segments: 0,
      }
      
      // Cập nhật fileList với URL
      introVideoFileList.value = [{
        ...fileList[0],
        url: formData.introVideo,
        status: 'done',
      }]
      
      // If video is ready, clear progress tracker immediately
      if (formData.introVideoStatus === 'ready') {
        // Clear progress tracker
        introVideoUploadProgress.percent = 0
        introVideoUploadProgress.stage = ''
        introVideoUploadProgress.uploaded = 0
        introVideoUploadProgress.total = 0
        introVideoUploadProgress.speed = 0
        introVideoUploadProgress.timeRemaining = 0
        introVideoUploadProgress.fileUploadPercent = 0
        uploadingIntroVideo.value = false
        message.success('Upload video giới thiệu thành công')
      } else if (formData.introVideoJobId && (formData.introVideoStatus === 'queueing' || formData.introVideoStatus === 'processing')) {
        // Poll job status if video is still processing
        pollIntroVideoJobStatus(formData.introVideoJobId)
      }
    } catch (error: any) {
      console.error('Upload intro video error:', error)
      
    // Extract error message from error response
    let errorMessage = error.message || 'Upload video giới thiệu thất bại'
    if (error.data?.error?.errorMessage) {
      errorMessage = error.data.error.errorMessage
    } else if (error.data?.error?.errorMessage) {
      errorMessage = error.data.error.errorMessage
    } else if (error.data?.errorMessage) {
      errorMessage = error.data.errorMessage
    } else if (typeof error.data?.error === 'object' && error.data.error?.errorMessage) {
      errorMessage = error.data.error.errorMessage
    }
      
      // Set error status and message
      formData.introVideoStatus = 'error'
      formData.introVideoErrorMessage = errorMessage
      
      // Keep file in list but mark as error
      introVideoFileList.value = [{
        ...fileList[0],
        status: 'error',
      }]
      
      message.error(errorMessage)
    } finally {
      uploadingIntroVideo.value = false
    }
  } else {
    // File removed
    formData.introVideo = ''
    formData.introVideoStatus = 'ready'
    formData.introVideoHlsUrl = ''
    formData.introVideoErrorMessage = ''
    formData.introVideoQualityMetadata = {
      resolution: '',
      bitrate: '',
      codec: '',
      fps: 0,
      segments: 0,
    }
  }
}

const handleRemoveIntroVideo = async () => {
  // If video is uploading/queueing/processing, cancel the job first
  if (formData.introVideoJobId && 
      (formData.introVideoStatus === 'uploading' || 
       formData.introVideoStatus === 'queueing' || 
       formData.introVideoStatus === 'processing')) {
    try {
      const uploadsApi = useUploadsApi()
      await uploadsApi.cancelVideoUpload(formData.introVideoJobId)
      message.success('Đã hủy upload video và xóa các file đã tạo')
    } catch (error: any) {
      console.error('Cancel video upload error:', error)
      message.warning('Không thể hủy upload, nhưng đã xóa khỏi form')
    }
  }
  
  formData.introVideo = ''
  formData.introVideoStatus = 'ready'
  formData.introVideoHlsUrl = ''
  formData.introVideoErrorMessage = ''
  formData.introVideoJobId = ''
  formData.introVideoQualityMetadata = {
    resolution: '',
    bitrate: '',
    codec: '',
    fps: 0,
    segments: 0,
  }
  introVideoFileList.value = []
}

// Retry intro video upload
const retryIntroVideoUpload = async () => {
  if (introVideoFileList.value.length > 0 && introVideoFileList.value[0].originFileObj) {
    await handleIntroVideoChange({ fileList: introVideoFileList.value })
  }
}

const handleIntroVideoThumbnailChange = async (info: any) => {
  const { fileList } = info
  
  if (fileList.length > 0 && fileList[0].originFileObj) {
    const file = fileList[0].originFileObj as File
    try {
      const uploadsApi = useUploadsApi()
      const response = await uploadsApi.uploadImage(file)
      const imageUrl = response?.data?.files?.[0]?.url || response?.data?.url || ''
      
      if (imageUrl) {
        formData.introVideoThumbnail = imageUrl
        introVideoThumbnailFileList.value = [{
          ...fileList[0],
          url: imageUrl,
          status: 'done',
        }]
        message.success('Upload thumbnail video thành công')
      }
    } catch (error: any) {
      console.error('Upload intro video thumbnail error:', error)
      message.error(error.message || 'Upload thumbnail thất bại')
      introVideoThumbnailFileList.value = []
      formData.introVideoThumbnail = ''
    }
  } else {
    formData.introVideoThumbnail = ''
  }
}

const handleRemoveIntroVideoThumbnail = () => {
  formData.introVideoThumbnail = ''
  introVideoThumbnailFileList.value = []
}

const handleRemoveInstructorAvatar = () => {
  formData.instructor.avatar = ''
  instructorAvatarFileList.value = []
}

// Upload file to MinIO - SỬA URL THÀNH /api/uploads/minio
const uploadFileToMinIO = async (file: File, folder: string = 'courses'): Promise<string> => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  // Nếu apiHost rỗng, dùng relative path (Nuxt sẽ proxy)
  // Nếu không, dùng apiHost được cấu hình hoặc fallback localhost cho development
  let apiHost = config.public.apiHost
  if (!apiHost || apiHost.trim() === '') {
    // Trong development, có thể cần localhost
    // Trong production, dùng relative path để Nuxt proxy xử lý
    if (process.client && config.public.isDevelopment) {
      apiHost = 'http://localhost:3000'
    } else {
      apiHost = '' // Relative path
    }
  }
  const uploadFormData = new FormData()
  uploadFormData.append('files', file)
  
  try {
    // URL đúng: /api/uploads/minio (không có /a)
    const url = apiHost ? `${apiHost}/api/uploads/minio?folder=${folder}` : `/api/uploads/minio?folder=${folder}`
    console.log('📤 Uploading to:', url) // Debug
    
    const response: any = await $fetch(url, {
      method: 'POST',
      body: uploadFormData,
      headers: {
        ...(authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {}),
      }
    })
    
    console.log('📤 Upload response:', response) // Debug
    
    // Parse response
    const files = response?.data?.files || response?.files || []
    
    if (files.length > 0 && files[0].url) {
      return files[0].url
    }
    
    throw new Error('Upload failed: No file URL in response')
  } catch (error: any) {
    console.error('❌ Upload error:', error)
    throw new Error(error.message || 'Upload failed')
  }
}

// Upload video to R2/CDN with progress tracking
// Returns full video object with status, hlsUrl, qualityMetadata
const uploadVideoToR2 = async (
  file: File, 
  folder: string = 'courses/intro-videos',
  progressKey?: string, // Key để track progress cho lesson videos
  lessonId?: string // Optional: lesson ID if this is a lesson video (for auto-update)
): Promise<{
  url: string
  hlsUrl: string
  status: 'uploading' | 'queueing' | 'processing' | 'ready' | 'error'
  errorMessage?: string
  jobId?: string
  qualityMetadata: {
    resolution: string
    bitrate: string
    codec: string
    fps: number
    segments: number
  }
}> => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  
  // Nếu apiHost rỗng, dùng relative path (Nuxt sẽ proxy)
  // Nếu không, dùng apiHost được cấu hình hoặc fallback localhost cho development
  let apiHost = config.public.apiHost
  if (!apiHost || apiHost.trim() === '') {
    // Trong development, có thể cần localhost
    // Trong production, dùng relative path để Nuxt proxy xử lý
    if (process.client && config.public.isDevelopment) {
      apiHost = 'http://localhost:3000'
    } else {
      apiHost = '' // Relative path
    }
  }
  
  const uploadFormData = new FormData()
  uploadFormData.append('file', file)
  
  // Build URL with folder and optional lessonId
  let url = apiHost ? `${apiHost}/api/uploads/video?folder=${folder}` : `/api/uploads/video?folder=${folder}`
  if (lessonId) {
    url += `&lessonId=${lessonId}`
    console.log('✅ [Video Upload] Including lessonId in URL:', lessonId)
  } else {
    console.log('⚠️ [Video Upload] No lessonId provided - lesson may not be saved to database yet')
    console.log('⚠️ [Video Upload] Worker will try to find lesson by jobId after course is saved')
  }
  console.log('📤 Uploading video to:', url)
  
  // Use XMLHttpRequest for progress tracking
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    
    // Initialize progress tracker
    const now = Date.now()
    
    // Estimate processing time based on file size (rough estimate: 1MB = 1 second for conversion)
    const estimatedProcessingSeconds = Math.max(10, Math.ceil(file.size / (1024 * 1024))) // At least 10 seconds
    // Estimate R2 upload time (rough estimate: 5MB/s upload speed)
    const estimatedR2UploadSeconds = Math.max(5, Math.ceil(file.size / (5 * 1024 * 1024)))
    
    if (progressKey) {
      if (!lessonVideoUploadProgress[progressKey]) {
        lessonVideoUploadProgress[progressKey] = {
          percent: 0,
          uploaded: 0,
          total: file.size,
          speed: 0,
          timeRemaining: 0,
          startTime: now,
          lastUpdateTime: now,
          lastUploaded: 0,
          stage: 'uploading',
          fileUploadPercent: 0,
          estimatedProcessingTime: estimatedProcessingSeconds,
          estimatedR2UploadTime: estimatedR2UploadSeconds,
        }
      } else {
        // Reset if exists
        lessonVideoUploadProgress[progressKey].percent = 0
        lessonVideoUploadProgress[progressKey].uploaded = 0
        lessonVideoUploadProgress[progressKey].total = file.size
        lessonVideoUploadProgress[progressKey].speed = 0
        lessonVideoUploadProgress[progressKey].timeRemaining = 0
        lessonVideoUploadProgress[progressKey].startTime = now
        lessonVideoUploadProgress[progressKey].lastUpdateTime = now
        lessonVideoUploadProgress[progressKey].lastUploaded = 0
        lessonVideoUploadProgress[progressKey].stage = 'uploading'
        lessonVideoUploadProgress[progressKey].fileUploadPercent = 0
        lessonVideoUploadProgress[progressKey].estimatedProcessingTime = estimatedProcessingSeconds
        lessonVideoUploadProgress[progressKey].estimatedR2UploadTime = estimatedR2UploadSeconds
      }
    } else {
      introVideoUploadProgress.percent = 0
      introVideoUploadProgress.uploaded = 0
      introVideoUploadProgress.total = file.size
      introVideoUploadProgress.speed = 0
      introVideoUploadProgress.timeRemaining = 0
      introVideoUploadProgress.startTime = now
      introVideoUploadProgress.lastUpdateTime = now
      introVideoUploadProgress.lastUploaded = 0
      introVideoUploadProgress.stage = 'uploading'
      introVideoUploadProgress.fileUploadPercent = 0
      introVideoUploadProgress.estimatedProcessingTime = estimatedProcessingSeconds
      introVideoUploadProgress.estimatedR2UploadTime = estimatedR2UploadSeconds
    }
    
    // Get progress tracker reference
    const progressTracker = progressKey ? lessonVideoUploadProgress[progressKey] : introVideoUploadProgress
    
    // Store interval IDs for cleanup
    let processingIntervalId: NodeJS.Timeout | null = null
    let r2UploadIntervalId: NodeJS.Timeout | null = null
    
    // Function to start processing stages after file upload completes
    const startProcessingStages = () => {
      if (!progressTracker) return
      
      // File upload is complete (40%), now simulate processing stages
      progressTracker.fileUploadPercent = 100
      progressTracker.stage = 'queueing'
      progressTracker.percent = 40
      progressTracker.timeRemaining = progressTracker.estimatedProcessingTime + progressTracker.estimatedR2UploadTime
      
      // Simulate queueing stage (40-45%)
      setTimeout(() => {
        if (!progressTracker) return
        
        progressTracker.stage = 'processing'
        progressTracker.percent = 45
        
        // Simulate processing stage (45-80%)
        const processingStartTime = Date.now()
        processingIntervalId = setInterval(() => {
          if (!progressTracker) {
            if (processingIntervalId) clearInterval(processingIntervalId)
            return
          }
          
          const elapsed = (Date.now() - processingStartTime) / 1000
          const processingProgress = Math.min(80, 45 + (elapsed / progressTracker.estimatedProcessingTime) * 35)
          progressTracker.percent = Math.round(processingProgress)
          progressTracker.timeRemaining = Math.max(0, progressTracker.estimatedProcessingTime - elapsed + progressTracker.estimatedR2UploadTime)
          
          if (processingProgress >= 80) {
            if (processingIntervalId) clearInterval(processingIntervalId)
            processingIntervalId = null
            progressTracker.stage = 'uploading-r2'
            
            // Simulate R2 upload stage (80-100%)
            const r2UploadStartTime = Date.now()
            r2UploadIntervalId = setInterval(() => {
              if (!progressTracker) {
                if (r2UploadIntervalId) clearInterval(r2UploadIntervalId)
                return
              }
              
              const r2Elapsed = (Date.now() - r2UploadStartTime) / 1000
              const r2Progress = Math.min(100, 80 + (r2Elapsed / progressTracker.estimatedR2UploadTime) * 20)
              progressTracker.percent = Math.round(r2Progress)
              progressTracker.timeRemaining = Math.max(0, progressTracker.estimatedR2UploadTime - r2Elapsed)
              
              if (r2Progress >= 100) {
                if (r2UploadIntervalId) clearInterval(r2UploadIntervalId)
                r2UploadIntervalId = null
                progressTracker.stage = 'ready'
                progressTracker.percent = 100
                progressTracker.timeRemaining = 0
              }
            }, 200) // Update every 200ms
          }
        }, 200) // Update every 200ms
      }, 500) // Small delay for queueing
    }
    
    // Track upload progress with real-time updates
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && progressTracker) {
        const currentTime = Date.now()
        const fileUploadPercent = Math.round((e.loaded / e.total) * 100)
        
        // Calculate speed based on recent progress (more accurate)
        const timeDelta = (currentTime - progressTracker.lastUpdateTime) / 1000 // seconds
        let speed = 0
        
        if (timeDelta > 0.1) { // Update speed every 100ms minimum
          const bytesDelta = e.loaded - progressTracker.lastUploaded
          speed = bytesDelta / timeDelta // bytes per second
          
          // Use moving average for smoother speed calculation
          if (progressTracker.speed > 0) {
            // Weighted average: 70% old speed, 30% new speed
            speed = progressTracker.speed * 0.7 + speed * 0.3
          }
          
          progressTracker.lastUpdateTime = currentTime
          progressTracker.lastUploaded = e.loaded
        } else {
          // Keep previous speed if update is too frequent
          speed = progressTracker.speed
        }
        
        // Calculate overall progress:
        // - File upload: 0-40% of total progress
        // - Processing (HLS conversion): 40-80% of total progress
        // - R2 upload: 80-100% of total progress
        const fileUploadProgress = fileUploadPercent * 0.4 // File upload is 40% of total
        const overallPercent = Math.round(fileUploadProgress)
        
        // Calculate time remaining for file upload
        const fileUploadRemaining = speed > 0 ? (e.total - e.loaded) / speed : 0
        // Add estimated time for processing and R2 upload
        const totalRemaining = fileUploadRemaining + progressTracker.estimatedProcessingTime + progressTracker.estimatedR2UploadTime
        
        // Update progress tracker
        progressTracker.percent = overallPercent
        progressTracker.uploaded = e.loaded
        progressTracker.total = e.total
        progressTracker.speed = speed
        progressTracker.timeRemaining = Math.max(0, totalRemaining)
        progressTracker.fileUploadPercent = fileUploadPercent
        progressTracker.stage = 'uploading'
        
        // When file upload reaches 100%, start processing stages
        if (fileUploadPercent >= 100 && progressTracker.stage === 'uploading') {
          startProcessingStages()
        }
      }
    })
    
    // Handle response
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText)
          console.log('📤 Video upload response:', response)
          
          // Parse response first to check status
          const videos = response?.data?.videos || response?.videos || []
          const jobId = response?.data?.jobId || response?.jobId || ''
          const videoStatus = videos.length > 0 ? videos[0].status : 'ready'
          
          // CRITICAL: Only start simulated processing if video is ready
          // If status is 'queueing' or 'processing', stop simulated progress immediately
          // Real progress will come from polling
          if (videoStatus === 'ready') {
            // If processing stages haven't started yet, start them now
            if (progressTracker && progressTracker.stage === 'uploading' && progressTracker.fileUploadPercent >= 100) {
              startProcessingStages()
            }
          } else {
            // Stop simulated progress immediately - polling will handle real progress
            if (processingIntervalId) {
              clearInterval(processingIntervalId)
              processingIntervalId = null
            }
            if (r2UploadIntervalId) {
              clearInterval(r2UploadIntervalId)
              r2UploadIntervalId = null
            }
            // Reset progress to 40% (after file upload, before processing)
            // Polling will update it with real backend progress
            if (progressTracker) {
              progressTracker.percent = 40
              progressTracker.stage = 'queueing'
            }
            console.log('⏸️ [Video Upload] Stopped simulated progress - reset to 40%, will use polling for real progress')
          }
          
          if (videos.length > 0 && videos[0]) {
            const video = videos[0]
            const videoData = {
              url: video.url || video.hlsUrl || '',
              hlsUrl: video.hlsUrl || video.url || '',
              status: video.status || 'ready',
              errorMessage: video.errorMessage || '',
              jobId: jobId || video.jobId || '',
              qualityMetadata: video.qualityMetadata || {
                resolution: '',
                bitrate: '',
                codec: '',
                fps: 0,
                segments: video.segments || 0,
              },
            }
            console.log('📤 Final videoData:', videoData)
            
            // CRITICAL: Only clear progress tracker if video is ready
            // If status is 'queueing' or 'processing', keep progress tracker visible
            // Progress tracker will be cleared when polling detects 'ready' status
            if (videoData.status === 'ready') {
              // Clear any running intervals
              if (processingIntervalId) {
                clearInterval(processingIntervalId)
                processingIntervalId = null
              }
              if (r2UploadIntervalId) {
                clearInterval(r2UploadIntervalId)
                r2UploadIntervalId = null
              }
              
              // Wait for progress to complete, then reset
              setTimeout(() => {
                if (progressKey) {
                  // Clear lesson video progress tracker
                  delete lessonVideoUploadProgress[progressKey]
                } else {
                  // Clear intro video progress tracker completely
                  introVideoUploadProgress.percent = 0
                  introVideoUploadProgress.stage = ''
                  introVideoUploadProgress.uploaded = 0
                  introVideoUploadProgress.total = 0
                  introVideoUploadProgress.speed = 0
                  introVideoUploadProgress.timeRemaining = 0
                  introVideoUploadProgress.fileUploadPercent = 0
                }
              }, 2000) // Wait 2 seconds for final progress animation
            } else {
              // If still processing, keep progress tracker and stop simulated intervals
              // Real progress will come from polling
              if (processingIntervalId) {
                clearInterval(processingIntervalId)
                processingIntervalId = null
              }
              if (r2UploadIntervalId) {
                clearInterval(r2UploadIntervalId)
                r2UploadIntervalId = null
              }
              console.log('⏳ [Video Upload] Video is still processing, keeping progress tracker visible for polling')
            }
            
            resolve(videoData)
          } else {
            throw new Error('Video upload failed: No file URL in response')
          }
        } catch (error: any) {
          console.error('❌ Parse response error:', error)
          
          // Clear intervals on error
          if (processingIntervalId) {
            clearInterval(processingIntervalId)
            processingIntervalId = null
          }
          if (r2UploadIntervalId) {
            clearInterval(r2UploadIntervalId)
            r2UploadIntervalId = null
          }
          
          reject(new Error('Lỗi định dạng file hoặc không thể parse response'))
        }
      } else {
        // Handle error response
        let errorMessage = 'Upload video thất bại'
        try {
          const errorResponse = JSON.parse(xhr.responseText)
          if (errorResponse?.error?.errorMessage) {
            errorMessage = errorResponse.error.errorMessage
          } else if (errorResponse?.error) {
            errorMessage = typeof errorResponse.error === 'string' ? errorResponse.error : 'Upload video thất bại'
          }
        } catch (e) {
          // If can't parse, use status-based message
          if (xhr.status === 413) {
            errorMessage = 'File quá lớn! Kích thước file không được vượt quá 5GB.'
          } else if (xhr.status === 503 || xhr.status === 504) {
            errorMessage = 'Upload video mất quá nhiều thời gian. Vui lòng thử lại sau.'
          }
        }
        
        // Reset progress
        if (progressKey) {
          delete lessonVideoUploadProgress[progressKey]
        } else {
          introVideoUploadProgress.percent = 0
        }
        
        reject(new Error(errorMessage))
      }
    })
    
    // Handle errors
    xhr.addEventListener('error', () => {
      // Clear intervals on error
      if (processingIntervalId) {
        clearInterval(processingIntervalId)
        processingIntervalId = null
      }
      if (r2UploadIntervalId) {
        clearInterval(r2UploadIntervalId)
        r2UploadIntervalId = null
      }
      
      // Reset progress
      if (progressKey) {
        delete lessonVideoUploadProgress[progressKey]
      } else {
        introVideoUploadProgress.percent = 0
        introVideoUploadProgress.stage = 'uploading'
      }
      reject(new Error('Lỗi kết nối khi upload video'))
    })
    
    xhr.addEventListener('abort', () => {
      // Clear intervals on abort
      if (processingIntervalId) {
        clearInterval(processingIntervalId)
        processingIntervalId = null
      }
      if (r2UploadIntervalId) {
        clearInterval(r2UploadIntervalId)
        r2UploadIntervalId = null
      }
      
      // Reset progress
      if (progressKey) {
        delete lessonVideoUploadProgress[progressKey]
      } else {
        introVideoUploadProgress.percent = 0
        introVideoUploadProgress.stage = 'uploading'
      }
      reject(new Error('Upload bị hủy'))
    })
    
    // Send request
    xhr.open('POST', url)
    
    // Set headers
    if (authStore.token) {
      xhr.setRequestHeader('Authorization', `Bearer ${authStore.token}`)
    }
    
    xhr.send(uploadFormData)
  })
}

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

// Helper function to format time remaining
const formatTimeRemaining = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.round(seconds)} giây`
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60)
    const secs = Math.round(seconds % 60)
    return `${minutes} phút ${secs} giây`
  } else {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours} giờ ${minutes} phút`
  }
}

// Chapter & Lesson management
const addChapter = () => {
  formData.chapters.push({
    title: '',
    description: '',
    index: formData.chapters.length,
    status: 'active',
    lessons: [],
  })
}

const removeChapter = (index: number) => {
  formData.chapters.splice(index, 1)
  // Re-index
  formData.chapters.forEach((ch, idx) => {
    ch.index = idx
  })
}

const addLesson = (chapterIndex: number) => {
  if (!formData.chapters[chapterIndex].lessons) {
    formData.chapters[chapterIndex].lessons = []
  }
  formData.chapters[chapterIndex].lessons.push({
    title: '',
    description: '',
    content: '',
    type: 'video',
    isPreview: false, // Đảm bảo có field này
    isLocked: false,
    status: 'active',
    videos: [],
    documents: [],
    videoFileList: [],
    documentFileList: [],
    uploadingVideo: false,
    uploadingDocument: false,
    quiz: {
      title: '',
      description: '',
      questions: [],
      passingScore: 80,
      timeLimit: 0,
      attempts: 3,
    },
  })
}

const removeLesson = (chapterIndex: number, lessonIndex: number) => {
  formData.chapters[chapterIndex].lessons.splice(lessonIndex, 1)
}

const addQuestion = (chapterIndex: number, lessonIndex: number) => {
  const lesson = formData.chapters[chapterIndex].lessons[lessonIndex]
  if (!lesson.quiz.questions) {
    lesson.quiz.questions = []
  }
  
  lesson.quiz.questions.push({
    id: `q-${Date.now()}`,
    question: '',
    type: 'multiple-choice', // Mặc định luôn là Trắc nghiệm
    options: [
      { id: `opt-${Date.now()}-1`, text: '', isCorrect: false },
      { id: `opt-${Date.now()}-2`, text: '', isCorrect: false },
    ],
    correctAnswer: '',
    explanation: '',
    points: 1,
  })
}

const removeQuestion = (chapterIndex: number, lessonIndex: number, questionIndex: number) => {
  formData.chapters[chapterIndex].lessons[lessonIndex].quiz.questions.splice(questionIndex, 1)
}

const addOption = (chapterIndex: number, lessonIndex: number, questionIndex: number) => {
  const question = formData.chapters[chapterIndex].lessons[lessonIndex].quiz.questions[questionIndex]
  if (!question.options) {
    question.options = []
  }
  question.options.push({
    id: `opt-${Date.now()}`,
    text: '',
    isCorrect: false,
  })
}

const removeOption = (chapterIndex: number, lessonIndex: number, questionIndex: number, optionIndex: number) => {
  formData.chapters[chapterIndex].lessons[lessonIndex].quiz.questions[questionIndex].options.splice(optionIndex, 1)
}

// Updated form rules - Custom validator cho thumbnail
const formRules = {
  title: [{ required: true, message: 'Vui lòng nhập tên khóa học', trigger: 'blur' }],
  shortDescription: [{ required: true, message: 'Vui lòng nhập mô tả ngắn', trigger: 'blur' }],
  description: [{ required: true, message: 'Vui lòng nhập mô tả chi tiết', trigger: 'blur' }],
  thumbnail: [
    { 
      required: true, 
      message: 'Vui lòng chọn ảnh đại diện', 
      trigger: 'change',
      validator: (_rule: any, value: any) => {
        // Check cả thumbnailFileList và formData.thumbnail
        if (thumbnailFileList.value.length > 0 || formData.thumbnail) {
          return Promise.resolve()
        }
        return Promise.reject('Vui lòng chọn ảnh đại diện')
      }
    }
  ],
  category: [{ required: true, message: 'Vui lòng nhập danh mục', trigger: 'blur' }],
  'instructor.name': [
    {
      required: true,
      message: 'Vui lòng nhập tên giảng viên',
      trigger: ['blur', 'change'],
      validator: (_rule: any, _value: any) => {
        // Kiểm tra trực tiếp từ formData vì nested object có thể không pass value đúng cách
        const instructorName = formData.instructor?.name
        if (!instructorName || !instructorName.trim()) {
          return Promise.reject('Vui lòng nhập tên giảng viên')
        }
        return Promise.resolve()
      }
    }
  ],
  status: [{ required: true, message: 'Vui lòng chọn trạng thái', trigger: 'change' }],
}

// Updated resetForm
const resetForm = () => {
  Object.assign(formData, {
    title: '',
    slug: '',
    description: '',
    shortDescription: '',
    thumbnail: '',
    introVideo: '',
    introVideoStatus: 'ready',
    introVideoHlsUrl: '',
    introVideoQualityMetadata: {
      resolution: '',
      bitrate: '',
      codec: '',
      fps: 0,
      segments: 0,
    },
    introVideoThumbnail: '',
    introVideoErrorMessage: '',
    price: 0,
    originalPrice: 0,
    discount: 0,
    instructor: {
      name: '',
      avatar: '',
      bio: '',
    },
    category: '',
    level: 'beginner',
    tags: [],
    isPublished: true,
    isFeatured: false,
    status: 'active',
    chapters: [],
  })
  thumbnailFileList.value = []
  introVideoFileList.value = []
  introVideoThumbnailFileList.value = []
  instructorAvatarFileList.value = []
  activeTab.value = 'basic'
  formRef.value?.resetFields()
}

// Modal handlers - THÊM LẠI CÁC HÀM NÀY
const showCreateModal = () => {
  console.log('showCreateModal called') // Debug
  editingCourse.value = null
  resetForm()
  modalVisible.value = true
  console.log('modalVisible set to:', modalVisible.value) // Debug
  nextTick(() => {
    console.log('After nextTick, modalVisible:', modalVisible.value) // Debug
  })
}

const handleModalCancel = () => {
  modalVisible.value = false
  resetForm()
}

// Updated editCourse
const editCourse = async (course: Course) => {
  editingCourse.value = course
  // Fetch full course data with chapters
  try {
    const response = await coursesApi.getCourse(course._id)
    if (response.status && response.data) {
      const courseData = response.data.course || response.data.data?.course || response.data
      
      // Determine intro video status first - ALWAYS set to 'ready' if URL exists
      const hasIntroVideoUrl = !!(courseData.introVideo || courseData.introVideoHlsUrl)
      // Force 'ready' if URL exists, regardless of what's in database
      const introVideoStatusValue = hasIntroVideoUrl ? 'ready' : (courseData.introVideoStatus || 'ready')
      
      console.log('🔍 [Load Course] courseData.introVideoStatus from DB:', courseData.introVideoStatus)
      console.log('🔍 [Load Course] hasIntroVideoUrl:', hasIntroVideoUrl)
      console.log('🔍 [Load Course] introVideoStatusValue (will be set):', introVideoStatusValue)
      
      Object.assign(formData, {
        title: courseData.title || '',
        slug: courseData.slug || '',
        description: courseData.description || '',
        shortDescription: courseData.shortDescription || '',
        thumbnail: courseData.thumbnail || '',
        introVideo: courseData.introVideo || '',
        // Auto-fix status: if video has URL, it should be 'ready' (regardless of stored status)
        introVideoStatus: introVideoStatusValue,
        introVideoHlsUrl: courseData.introVideoHlsUrl || '',
        introVideoJobId: '', // Clear jobId when loading course (no need to poll old jobs)
        introVideoErrorMessage: '', // Clear error message when loading
        introVideoQualityMetadata: courseData.introVideoQualityMetadata || {
          resolution: '',
          bitrate: '',
          codec: '',
          fps: 0,
          segments: 0,
        },
        introVideoThumbnail: courseData.introVideoThumbnail || '',
        price: courseData.price || 0,
        originalPrice: courseData.originalPrice || 0,
        discount: courseData.discount || 0,
        instructor: courseData.instructor || { name: '', avatar: '', bio: '' },
        category: courseData.category || '',
        level: courseData.level || 'beginner',
        tags: courseData.tags || [],
        isPublished: courseData.isPublished ?? true,
        isFeatured: courseData.isFeatured ?? false,
        status: courseData.status || 'active',
        chapters: [], // Sẽ được load bên dưới
      })

      // Load chapters and lessons từ API response
      if (courseData.chapters && Array.isArray(courseData.chapters)) {
        formData.chapters = courseData.chapters.map((chapter: any) => ({
          _id: chapter._id,
          title: chapter.title || '',
          description: chapter.description || '',
          index: chapter.index || 0,
          status: chapter.status || 'active',
          lessons: (chapter.lessons || []).map((lesson: any) => {
            // Fix video status: if video has URL, it should be 'ready' (regardless of stored status)
            const videos = (lesson.videos || []).map((video: any) => {
              if (video && (video.videoUrl || video.hlsUrl)) {
                return {
                  ...video,
                  status: 'ready', // Always set to ready if URL exists
                  jobId: '', // Clear jobId when loading (no need to poll old jobs)
                  errorMessage: '', // Clear error message when loading
                }
              }
              return {
                ...video,
                jobId: '', // Clear jobId even if no URL
              }
            })
            
            return {
              _id: lesson._id,
              title: lesson.title || '',
              description: lesson.description || '',
              content: lesson.content || '',
              type: lesson.type || 'video',
              isPreview: lesson.isPreview || false,
              status: lesson.status || 'active',
              videos: videos,
              documents: lesson.documents || [],
              videoFileList: [],
              documentFileList: [],
              uploadingVideo: false,
              uploadingDocument: false,
              quiz: lesson.quiz ? {
              title: lesson.quiz.title || '',
              description: lesson.quiz.description || '',
              questions: (lesson.quiz.questions || []).map((q: any) => ({
                id: q.id || `q-${Date.now()}`,
                question: q.question || '',
                type: q.type || 'multiple-choice',
                options: (q.options || []).map((opt: any) => ({
                  id: opt.id || `opt-${Date.now()}`,
                  text: opt.text || '',
                  isCorrect: opt.isCorrect || false,
                })),
                correctAnswer: q.correctAnswer || '',
                explanation: q.explanation || '',
                points: q.points || 1,
              })),
              passingScore: lesson.quiz.passingScore || 80,
              timeLimit: lesson.quiz.timeLimit || 0,
              attempts: lesson.quiz.attempts || 3,
            } : {
              title: '',
              description: '',
              questions: [],
              passingScore: 80,
              timeLimit: 0,
              attempts: 3,
            },
          }
          }),
        }))
      }

      // Set thumbnail file list if exists
      if (courseData.thumbnail) {
        thumbnailFileList.value = [{
          uid: '-1',
          name: 'thumbnail',
          status: 'done',
          url: courseData.thumbnail,
        }]
      } else {
        thumbnailFileList.value = []
      }

      // Set intro video file list if exists
      if (courseData.introVideo) {
        introVideoFileList.value = [{
          uid: '-1',
          name: 'intro-video',
          status: 'done',
          url: courseData.introVideoHlsUrl || courseData.introVideo,
        }]
      } else {
        introVideoFileList.value = []
      }
      
      // Set intro video thumbnail file list if exists
      if (courseData.introVideoThumbnail) {
        introVideoThumbnailFileList.value = [{
          uid: '-1',
          name: 'intro-video-thumbnail',
          status: 'done',
          url: courseData.introVideoThumbnail,
        }]
      } else {
        introVideoThumbnailFileList.value = []
      }

      // Set instructor avatar file list if exists
      if (courseData.instructor?.avatar) {
        instructorAvatarFileList.value = [{
          uid: '-1',
          name: 'instructor-avatar',
          status: 'done',
          url: courseData.instructor.avatar,
        }]
      } else {
        instructorAvatarFileList.value = []
      }
      
      // Clear all polling intervals first
      if (introVideoPollInterval.value) {
        clearInterval(introVideoPollInterval.value)
        introVideoPollInterval.value = null
      }
      Object.keys(lessonVideoPollIntervals.value).forEach(key => {
        if (lessonVideoPollIntervals.value[key]) {
          clearInterval(lessonVideoPollIntervals.value[key])
        }
        delete lessonVideoPollIntervals.value[key]
      })
      
      // Clear all progress trackers when loading course for edit
      Object.keys(lessonVideoUploadProgress).forEach(key => {
        delete lessonVideoUploadProgress[key]
      })
      introVideoUploadProgress.percent = 0
      introVideoUploadProgress.stage = ''
      introVideoUploadProgress.uploaded = 0
      introVideoUploadProgress.total = 0
      introVideoUploadProgress.speed = 0
      introVideoUploadProgress.timeRemaining = 0
      introVideoUploadProgress.fileUploadPercent = 0
      uploadingIntroVideo.value = false
      
      // Ensure status is 'ready' if video URL exists (override any stale status)
      // This is a final check to make sure status is correct
      // Use nextTick to ensure reactive update happens after all assignments
      await nextTick()
      if (formData.introVideo || formData.introVideoHlsUrl) {
        // Force set status to ready - this should override any stale status
        formData.introVideoStatus = 'ready'
        // Force clear progress stage to prevent template from showing old status
        introVideoUploadProgress.stage = ''
        introVideoUploadProgress.percent = 0
        // Ensure uploading flag is false
        uploadingIntroVideo.value = false
        console.log('✅ [Load Course] Auto-fixed introVideoStatus to ready (has URL):', formData.introVideo || formData.introVideoHlsUrl)
        console.log('✅ [Load Course] formData.introVideoStatus =', formData.introVideoStatus)
        console.log('✅ [Load Course] introVideoUploadProgress.stage =', introVideoUploadProgress.stage)
        console.log('✅ [Load Course] uploadingIntroVideo =', uploadingIntroVideo.value)
        console.log('✅ [Load Course] introVideoUploadProgress.percent =', introVideoUploadProgress.percent)
        
        // Force another nextTick to ensure template updates
        await nextTick()
        console.log('✅ [Load Course] After second nextTick, formData.introVideoStatus =', formData.introVideoStatus)
        console.log('✅ [Load Course] getStatusText result =', getStatusText(formData.introVideoStatus))
        
        // Final verification: check if status is actually 'ready'
        if (formData.introVideoStatus !== 'ready') {
          console.error('❌ [Load Course] CRITICAL ERROR: formData.introVideoStatus is NOT ready! Value:', formData.introVideoStatus)
          // Force set one more time
          formData.introVideoStatus = 'ready'
          await nextTick()
          console.log('✅ [Load Course] Force set again, now:', formData.introVideoStatus)
        } else {
          console.log('✅ [Load Course] Status verified: ready')
        }
        
        // Force Vue to re-render the component
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
          console.log('🔄 [Load Course] Force checking template values after timeout')
          console.log('🔄 [Load Course] formData.introVideoStatus =', formData.introVideoStatus)
          console.log('🔄 [Load Course] getStatusText =', getStatusText(formData.introVideoStatus))
        }, 100)
      } else {
        console.log('⚠️ [Load Course] No intro video URL, status:', formData.introVideoStatus)
      }
    }
  } catch (error) {
    console.error('Error loading course:', error)
    message.error('Không thể tải thông tin khóa học')
  }
  
  modalVisible.value = true
  activeTab.value = 'basic' // Reset về tab đầu tiên
}

// Updated handleModalOk
const handleModalOk = async () => {
  try {
    await formRef.value?.validate()
    modalLoading.value = true
    
    // Upload thumbnail to MinIO - CHỈ KHI CÓ FILE MỚI
    if (thumbnailFileList.value.length > 0 && thumbnailFileList.value[0].originFileObj) {
      formData.thumbnail = await uploadFileToMinIO(thumbnailFileList.value[0].originFileObj as File, 'courses/thumbnails')
    }
    // Nếu không có file mới nhưng có URL (khi edit), giữ nguyên URL
    else if (thumbnailFileList.value.length > 0 && thumbnailFileList.value[0].url) {
      formData.thumbnail = thumbnailFileList.value[0].url
    }
    
    // Upload intro video to R2/CDN - CHỈ KHI CÓ FILE MỚI VÀ CHƯA CÓ URL
    // Nếu đã upload qua handleIntroVideoChange thì sẽ có URL rồi, không cần upload lại
    if (introVideoFileList.value.length > 0 && introVideoFileList.value[0].originFileObj && !formData.introVideo) {
      const videoData = await uploadVideoToR2(introVideoFileList.value[0].originFileObj as File, 'courses/intro-videos')
      formData.introVideo = videoData.url
      formData.introVideoHlsUrl = videoData.hlsUrl
      formData.introVideoStatus = videoData.status
      formData.introVideoQualityMetadata = videoData.qualityMetadata
    }
    // Nếu không có file mới nhưng có URL (khi edit hoặc đã upload), giữ nguyên URL
    else if (introVideoFileList.value.length > 0 && introVideoFileList.value[0].url) {
      formData.introVideo = introVideoFileList.value[0].url
      // Keep existing metadata if not set
      if (!formData.introVideoHlsUrl) {
        formData.introVideoHlsUrl = formData.introVideo
      }
    }
    // Nếu formData.introVideo đã có (đã upload qua handleIntroVideoChange), giữ nguyên
    
    // Upload intro video thumbnail - CHỈ KHI CÓ FILE MỚI
    if (introVideoThumbnailFileList.value.length > 0 && introVideoThumbnailFileList.value[0].originFileObj) {
      const uploadsApi = useUploadsApi()
      const response = await uploadsApi.uploadImage(introVideoThumbnailFileList.value[0].originFileObj as File)
      formData.introVideoThumbnail = response?.data?.files?.[0]?.url || response?.data?.url || ''
    }
    // Nếu không có file mới nhưng có URL (khi edit), giữ nguyên URL
    else if (introVideoThumbnailFileList.value.length > 0 && introVideoThumbnailFileList.value[0].url) {
      formData.introVideoThumbnail = introVideoThumbnailFileList.value[0].url
    }
    
    // Upload instructor avatar to MinIO - CHỈ KHI CÓ FILE MỚI
    if (instructorAvatarFileList.value.length > 0 && instructorAvatarFileList.value[0].originFileObj) {
      formData.instructor.avatar = await uploadFileToMinIO(instructorAvatarFileList.value[0].originFileObj as File, 'instructors')
    }
    // Nếu không có file mới nhưng có URL (khi edit), giữ nguyên URL
    else if (instructorAvatarFileList.value.length > 0 && instructorAvatarFileList.value[0].url) {
      formData.instructor.avatar = instructorAvatarFileList.value[0].url
    }

    // Calculate discount
    if (formData.originalPrice > 0 && formData.price < formData.originalPrice) {
      formData.discount = Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100)
    }

    // Prepare payload
    const payload: any = {
      ...formData,
      chapters: formData.chapters.map((ch, idx) => ({
        ...ch,
        index: idx,
        lessons: ch.lessons?.map((lesson: any) => {
          const lessonData: any = {
            // CRITICAL: Include _id if lesson exists (for update, not create)
            ...(lesson._id ? { _id: lesson._id } : {}),
            title: lesson.title,
            description: lesson.description,
            content: lesson.content || '',
            // Giữ nguyên type, không map 'text' thành 'document' nữa
            type: lesson.type || 'video',
            isPreview: lesson.isPreview || false,
            status: lesson.status || 'active',
            videos: lesson.videos || [],
            documents: lesson.documents || [],
          }

          // Handle quiz
          if (lesson.type === 'quiz' && lesson.quiz) {
            lessonData.quizData = {
              title: lesson.quiz.title,
              description: lesson.quiz.description,
              questions: lesson.quiz.questions.map((q: any) => ({
                id: q.id || `q-${Date.now()}`,
                question: q.question,
                type: q.type,
                options: q.options.map((opt: any) => ({
                  id: opt.id || `opt-${Date.now()}`,
                  text: opt.text,
                  isCorrect: opt.isCorrect,
                })),
                correctAnswer: q.options.find((opt: any) => opt.isCorrect)?.id || '',
                explanation: q.explanation || '',
                points: q.points || 1,
              })),
              passingScore: lesson.quiz.passingScore || 80,
              timeLimit: lesson.quiz.timeLimit || 0,
              attempts: lesson.quiz.attempts || 3,
            }
          }

          return lessonData
        }) || [],
      })),
    }

    if (editingCourse.value) {
      const response = await coursesApi.updateCourse(editingCourse.value._id, payload)
      if (response.status) {
        message.success('Cập nhật khóa học thành công')
        modalVisible.value = false
        resetForm()
        fetchCourses()
      } else {
        message.error(response.message || 'Cập nhật khóa học thất bại')
      }
    } else {
      const response = await coursesApi.createCourse(payload)
      if (response.status) {
        message.success('Tạo khóa học thành công')
        modalVisible.value = false
        resetForm()
        fetchCourses()
      } else {
        message.error(response.message || 'Tạo khóa học thất bại')
      }
    }
  } catch (error: any) {
    // Lỗi validate form của Ant Design Vue
    if (error && Array.isArray(error.errorFields) && error.errorFields.length > 0) {
      const firstField = error.errorFields[0]
      const firstMsg = firstField?.errors?.[0]

      message.warning(firstMsg || 'Vui lòng kiểm tra lại các trường bắt buộc trong form')
      return
    }

    // Các lỗi khác (API / logic)
    console.error('Lỗi khi lưu khóa học:', error)

    // Extract error message from various possible locations
    let apiMessage = 
      error?.message ||
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.data?.error ||
      error?.data?.message ||
      'Có lỗi xảy ra khi lưu khóa học. Vui lòng thử lại.'

    // Parse validation errors (Mongoose format)
    if (apiMessage.includes('validation failed') || apiMessage.includes('Path `') || apiMessage.includes('is required')) {
      // Format: "chapters validation failed: title: Path `title` is required."
      if (apiMessage.includes('chapters validation failed')) {
        const fieldMatch = apiMessage.match(/Path\s+`(\w+)`\s+is\s+required/i)
        if (fieldMatch) {
          const field = fieldMatch[1]
          const fieldMap: Record<string, string> = {
            'title': 'tiêu đề',
            'description': 'mô tả',
            'content': 'nội dung',
          }
          const fieldName = fieldMap[field.toLowerCase()] || field
          apiMessage = `Lỗi validation: Một số chương học thiếu ${fieldName}. Vui lòng kiểm tra lại các chương học và đảm bảo tất cả các trường bắt buộc đã được điền.`
        } else {
          apiMessage = 'Lỗi validation: Một số chương học thiếu thông tin bắt buộc. Vui lòng kiểm tra lại các chương học.'
        }
      } else if (apiMessage.includes('lessons validation failed')) {
        const fieldMatch = apiMessage.match(/Path\s+`(\w+)`\s+is\s+required/i)
        if (fieldMatch) {
          const field = fieldMatch[1]
          const fieldMap: Record<string, string> = {
            'title': 'tiêu đề',
            'description': 'mô tả',
            'content': 'nội dung',
            'videoUrl': 'video',
          }
          const fieldName = fieldMap[field.toLowerCase()] || field
          apiMessage = `Lỗi validation: Một số bài học thiếu ${fieldName}. Vui lòng kiểm tra lại các bài học và đảm bảo tất cả các trường bắt buộc đã được điền.`
        } else {
          apiMessage = 'Lỗi validation: Một số bài học thiếu thông tin bắt buộc. Vui lòng kiểm tra lại các bài học.'
        }
      } else {
        // General validation error - try to extract field name
        const fieldMatch = apiMessage.match(/Path\s+`(\w+)`\s+is\s+required/i)
        if (fieldMatch) {
          const field = fieldMatch[1]
          apiMessage = `Lỗi validation: Trường "${field}" là bắt buộc nhưng chưa được điền. Vui lòng kiểm tra lại.`
        }
      }
    }

    message.error(apiMessage)
  } finally {
    modalLoading.value = false
  }
}

// Actions
const viewCourse = async (course: Course) => {
  viewingCourse.value = course
  try {
    // Fetch full course data with chapters
    const response = await coursesApi.getCourse(course._id)
    if (response.status && response.data) {
      const courseData = response.data.course || response.data.data?.course || response.data
      viewingCourse.value = courseData as Course
    }
  } catch (error) {
    console.error('Error loading course:', error)
    message.error('Không thể tải thông tin khóa học')
  }
  viewModalVisible.value = true
}

const toggleCourseStatus = async (course: Course) => {
  try {
    const response = await coursesApi.toggleCourseStatus(course._id)
    if (response.status) {
      message.success('Thay đổi trạng thái thành công')
      fetchCourses()
    }
  } catch (error: any) {
    console.error('Toggle status error:', error)
    message.error('Không thể thay đổi trạng thái')
  }
}

const deleteCourse = async (course: Course) => {
  try {
    const response = await coursesApi.deleteCourse(course._id)
    if (response.status) {
      message.success('Xóa khóa học thành công')
      fetchCourses()
    }
  } catch (error: any) {
    console.error('Delete error:', error)
    message.error('Không thể xóa khóa học')
  }
}

// Lifecycle
onMounted(() => {
  fetchCourses()
})

// Thêm method này vào script
const ensureLessonProperties = (lesson: any) => {
  if (!lesson.videoFileList) {
    lesson.videoFileList = []
  }
  if (!lesson.documentFileList) {
    lesson.documentFileList = []
  }
  if (lesson.isPreview === undefined) {
    lesson.isPreview = false // Đảm bảo có giá trị mặc định
  }
  if (!lesson.quiz) {
    lesson.quiz = {
      title: '',
      description: '',
      questions: [],
      passingScore: 80,
      timeLimit: 0,
      attempts: 3,
    }
  }
  if (!lesson.quiz.questions) {
    lesson.quiz.questions = []
  }
  return true
}

// Thêm vào script setup, sau phần khai báo reactive
// Watch instructor.name để clear validation khi thay đổi
watch(() => formData.instructor.name, (newVal) => {
  if (newVal && newVal.trim()) {
    nextTick(() => {
      formRef.value?.clearValidate('instructor.name')
    })
  }
}, { immediate: false })

watch(() => formData.chapters, (chapters) => {
  chapters.forEach((chapter) => {
    if (chapter.lessons) {
      chapter.lessons.forEach((lesson: any) => {
        if (!lesson.videoFileList) {
          lesson.videoFileList = []
        }
        if (!lesson.documentFileList) {
          lesson.documentFileList = []
        }
        if (!lesson.quiz) {
          lesson.quiz = {
            title: '',
            description: '',
            questions: [],
            passingScore: 80,
            timeLimit: 0,
            attempts: 3,
          }
        }
        if (!lesson.quiz.questions) {
          lesson.quiz.questions = []
        }
      })
    }
  })
}, { deep: true, immediate: true })

// Fetch data
const fetchCourses = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.current,
      limit: pagination.pageSize,
    }
    
    if (searchQuery.value) {
      params.search = searchQuery.value
    }
    
    if (filterStatus.value) {
      params.status = filterStatus.value
    }
    
    const response = await coursesApi.getCourses(params)
    
    if (response.status && response.data) {
      // Structure: response.data.data.data.courses
      // Backend trả về: { message: "", data: { data: { courses: [], pagination: {} } } }
      const nestedData = response.data.data?.data || response.data.data || response.data
      
      // Đảm bảo courses là array
      const coursesArray = Array.isArray(nestedData?.courses) 
        ? nestedData.courses 
        : Array.isArray(nestedData) 
          ? nestedData 
          : []
      
      courses.value = coursesArray
      
      // Lấy pagination
      const paginationData = nestedData?.pagination || {}
      pagination.total = paginationData.total || coursesArray.length
      
      // Calculate stats - đảm bảo courses.value là array trước khi filter
      if (Array.isArray(courses.value)) {
        stats.total = pagination.total
        stats.active = courses.value.filter(c => c.status === 'active').length
        // Xóa dòng: stats.inactive = courses.value.filter(c => c.status === 'inactive').length
      } else {
        // Fallback nếu không phải array
        stats.total = 0
        stats.active = 0
        // Xóa dòng: stats.inactive = 0
        courses.value = []
      }
    } else {
      // Nếu response không hợp lệ, set về mảng rỗng
      courses.value = []
      pagination.total = 0
      stats.total = 0
      stats.active = 0
      // Xóa dòng: stats.inactive = 0
    }
  } catch (error: any) {
    console.error('Failed to fetch courses:', error)
    message.error('Không thể tải danh sách khóa học')
    // Đảm bảo courses luôn là array khi có lỗi
    courses.value = []
    pagination.total = 0
    stats.total = 0
    stats.active = 0
    // Xóa dòng: stats.inactive = 0
  } finally {
    loading.value = false
  }
}

// Handlers
const handleSearch = () => {
  pagination.current = 1
  fetchCourses()
}

const handleFilter = () => {
  pagination.current = 1
  fetchCourses()
}

const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchCourses()
}

const refreshData = () => {
  fetchCourses()
}

// New handlers for lesson file uploads
// Upload lesson video to R2/CDN
const handleLessonVideoChange = async (chapterIndex: number, lessonIndex: number, info: any) => {
  const lesson = formData.chapters[chapterIndex].lessons[lessonIndex]
  const { fileList } = info
  
  if (fileList.length > 0 && fileList[0].originFileObj) {
    const file = fileList[0].originFileObj as File
    
    // Set uploading state
    lesson.uploadingVideo = true
    
    // Create unique progress key for this lesson
    const progressKey = `chapter-${chapterIndex}-lesson-${lessonIndex}`
    
    // Initialize videos array if not exists
    if (!lesson.videos) {
      lesson.videos = []
    }
    
    // Set initial status to uploading
    if (lesson.videos.length === 0) {
      lesson.videos = [{
        title: file.name,
        videoUrl: '',
        thumbnail: '',
        duration: 0,
        fileSize: file.size,
        quality: '720',
        index: 0,
        status: 'uploading',
        hlsUrl: '',
        errorMessage: '',
        qualityMetadata: {
          resolution: '',
          bitrate: '',
          codec: '',
          fps: 0,
          segments: 0,
        },
      }]
    } else {
      lesson.videos[0].status = 'uploading'
      lesson.videos[0].errorMessage = ''
    }
    
    try {
      // Upload video to R2/CDN - returns full video object with progress tracking
      // Pass lessonId if lesson already exists in database (for auto-update from worker)
      const lessonId = lesson._id || undefined
      console.log('🔍 [Lesson Video Upload] lesson._id:', lesson._id, 'lessonId:', lessonId)
      const videoData = await uploadVideoToR2(file, `courses/lessons/${Date.now()}`, progressKey, lessonId)
      
      // Cập nhật video với đầy đủ thông tin (bao gồm jobId)
      if (lesson.videos.length === 0) {
        lesson.videos = [{
          title: file.name,
          videoUrl: videoData.url || videoData.hlsUrl || '',
          thumbnail: '',
          duration: 0,
          fileSize: file.size,
          quality: '720',
          index: 0,
          status: videoData.status || 'ready',
          hlsUrl: videoData.hlsUrl || '',
          errorMessage: videoData.errorMessage || '',
          jobId: videoData.jobId || '',
          qualityMetadata: videoData.qualityMetadata || {
            resolution: '',
            bitrate: '',
            codec: '',
            fps: 0,
            segments: 0,
          },
        }]
      } else {
        lesson.videos[0] = {
          ...lesson.videos[0],
          title: file.name,
          videoUrl: videoData.url || videoData.hlsUrl || '',
          fileSize: file.size,
          status: videoData.status || 'ready',
          hlsUrl: videoData.hlsUrl || '',
          errorMessage: videoData.errorMessage || '',
          jobId: videoData.jobId || '',
          qualityMetadata: videoData.qualityMetadata || {
            resolution: '',
            bitrate: '',
            codec: '',
            fps: 0,
            segments: 0,
        },
      }
    }
    
    // CRITICAL: If lesson already exists in database (has _id), save jobId immediately
    // This allows worker to auto-update lesson when video processing completes
    if (lesson._id && videoData.jobId && (videoData.status === 'queueing' || videoData.status === 'processing')) {
      try {
        // Save jobId to database immediately so worker can find and update lesson
        const updatePayload = {
          videos: JSON.stringify(lesson.videos || []),
        }
        await coursesApi.updateCourse(editingCourse.value?._id || '', {
          ...formData,
          chapters: formData.chapters.map((ch: any, chIdx: number) => ({
            ...ch,
            index: chIdx,
            lessons: ch.lessons?.map((l: any, lIdx: number) => {
              if (chIdx === chapterIndex && lIdx === lessonIndex) {
                return {
                  ...l,
                  videos: l.videos || [],
                }
              }
              return l
            }) || [],
          })),
        })
        console.log('✅ [Lesson Video] Saved jobId to database for lesson:', lesson._id, 'jobId:', videoData.jobId)
      } catch (error: any) {
        console.error('⚠️ [Lesson Video] Failed to save jobId to database:', error.message)
        // Don't fail the upload if save fails - jobId is still in formData
      }
    }
    
    if (videoData.status === 'ready') {
      // Clear progress tracker for lesson video
      const progressKey = `chapter-${chapterIndex}-lesson-${lessonIndex}`
      delete lessonVideoUploadProgress[progressKey]
      lesson.uploadingVideo = false
      message.success('Upload video thành công')
    } else if (videoData.jobId && (videoData.status === 'queueing' || videoData.status === 'processing')) {
      // Poll job status if video is still processing
      pollLessonVideoJobStatus(chapterIndex, lessonIndex, videoData.jobId)
    }
    } catch (error: any) {
      console.error('Upload video error:', error)
      
      // Extract error message from error response
      let errorMsg = error.message || 'Upload video thất bại'
      if (error.data?.error?.errorMessage) {
        errorMsg = error.data.error.errorMessage
      } else if (error.data?.errorMessage) {
        errorMsg = error.data.errorMessage
      } else if (typeof error.data?.error === 'object' && error.data.error?.errorMessage) {
        errorMsg = error.data.error.errorMessage
      }
      
      message.error(errorMsg)
      
      // Set status to error with error message
      if (lesson.videos.length > 0) {
        lesson.videos[0].status = 'error'
        lesson.videos[0].errorMessage = errorMsg
      }
      
      // Keep file in list but mark as error
      if (lesson.videoFileList.length > 0) {
        lesson.videoFileList[0].status = 'error'
      }
    } finally {
      lesson.uploadingVideo = false
    }
  } else {
    // File removed
    lesson.videos = []
  }
}

// Poll intro video job status
const pollIntroVideoJobStatus = async (jobId: string) => {
  // Clear any existing polling interval
  if (introVideoPollInterval.value) {
    clearInterval(introVideoPollInterval.value)
    introVideoPollInterval.value = null
  }
  
  const uploadsApi = useUploadsApi()
  let pollCount = 0
  const maxPolls = 120 // Poll for up to 10 minutes (5 seconds * 120 = 600 seconds)
  
  introVideoPollInterval.value = setInterval(async () => {
    try {
      pollCount++
      const response = await uploadsApi.getVideoJobStatus(jobId)
      const jobStatus = response?.data?.status || response?.status
      const jobResult = response?.data?.result || response?.result
      const errorMessage = response?.data?.errorMessage || response?.errorMessage
      const state = response?.data?.state || response?.state
      
      // If job not found but video URL exists, consider it ready
      if (state === 'not_found' || jobStatus === 'unknown') {
        if (formData.introVideo || formData.introVideoHlsUrl) {
          if (introVideoPollInterval.value) {
            clearInterval(introVideoPollInterval.value)
            introVideoPollInterval.value = null
          }
          formData.introVideoStatus = 'ready'
          introVideoUploadProgress.percent = 0
          introVideoUploadProgress.stage = ''
          introVideoUploadProgress.uploaded = 0
          introVideoUploadProgress.total = 0
          introVideoUploadProgress.speed = 0
          introVideoUploadProgress.timeRemaining = 0
          introVideoUploadProgress.fileUploadPercent = 0
          uploadingIntroVideo.value = false
          message.success('Video đã xử lý xong')
          return
        }
      }
      
      if (jobStatus === 'ready') {
        if (introVideoPollInterval.value) {
          clearInterval(introVideoPollInterval.value)
          introVideoPollInterval.value = null
        }
        
        // Update formData with final video data
        if (jobResult) {
          formData.introVideo = jobResult.hlsUrl || jobResult.url || formData.introVideo
          formData.introVideoHlsUrl = jobResult.hlsUrl || formData.introVideoHlsUrl
          formData.introVideoStatus = 'ready'
          formData.introVideoQualityMetadata = jobResult.qualityMetadata || formData.introVideoQualityMetadata
        } else {
          formData.introVideoStatus = 'ready'
        }
        
        // Clear progress tracker
        introVideoUploadProgress.percent = 0
        introVideoUploadProgress.stage = ''
        introVideoUploadProgress.uploaded = 0
        introVideoUploadProgress.total = 0
        introVideoUploadProgress.speed = 0
        introVideoUploadProgress.timeRemaining = 0
        introVideoUploadProgress.fileUploadPercent = 0
        uploadingIntroVideo.value = false
        
        message.success('Video đã xử lý xong')
      } else if (jobStatus === 'error') {
        if (introVideoPollInterval.value) {
          clearInterval(introVideoPollInterval.value)
          introVideoPollInterval.value = null
        }
        formData.introVideoStatus = 'error'
        formData.introVideoErrorMessage = errorMessage || 'Lỗi xử lý video'
        uploadingIntroVideo.value = false
        message.error('Lỗi xử lý video: ' + (errorMessage || 'Unknown error'))
      } else if (jobStatus === 'processing') {
        // Only update status if we're actually uploading (not loading from database)
        if (uploadingIntroVideo.value) {
          formData.introVideoStatus = 'processing'
        }
      } else if (jobStatus === 'queueing') {
        // Only update status if we're actually uploading (not loading from database)
        if (uploadingIntroVideo.value) {
          formData.introVideoStatus = 'queueing'
        }
      }
      
      // Stop polling after max attempts
      if (pollCount >= maxPolls) {
        if (introVideoPollInterval.value) {
          clearInterval(introVideoPollInterval.value)
          introVideoPollInterval.value = null
        }
        if (formData.introVideoStatus !== 'ready' && formData.introVideoStatus !== 'error') {
          formData.introVideoStatus = 'error'
          formData.introVideoErrorMessage = 'Timeout: Video processing took too long'
          uploadingIntroVideo.value = false
        }
      }
    } catch (error: any) {
      console.error('Error polling intro video job status:', error)
      // Continue polling on error (might be temporary)
      if (pollCount >= maxPolls) {
        if (introVideoPollInterval.value) {
          clearInterval(introVideoPollInterval.value)
          introVideoPollInterval.value = null
        }
      }
    }
  }, 5000) // Poll every 5 seconds
}

// Poll lesson video job status
const pollLessonVideoJobStatus = async (chapterIndex: number, lessonIndex: number, jobId: string) => {
  const uploadsApi = useUploadsApi()
  const lesson = formData.chapters[chapterIndex].lessons[lessonIndex]
  const progressKey = `chapter-${chapterIndex}-lesson-${lessonIndex}`
  
  // Clear any existing polling interval for this lesson
  if (lessonVideoPollIntervals.value[progressKey]) {
    clearInterval(lessonVideoPollIntervals.value[progressKey])
    delete lessonVideoPollIntervals.value[progressKey]
  }
  
  let pollCount = 0
  const maxPolls = 120 // Poll for up to 10 minutes
  
  lessonVideoPollIntervals.value[progressKey] = setInterval(async () => {
    try {
      pollCount++
      console.log(`🔍 [Lesson Video Polling] Polling job ${jobId}, attempt ${pollCount}`)
      const response = await uploadsApi.getVideoJobStatus(jobId)
      const jobData = response?.data || response
      // jobData.status is the real job status; response.status is only success boolean
      const jobStatus = jobData?.status ?? jobData?.data?.status ?? ''
      const jobResult = jobData?.result ?? jobData?.data?.result ?? null
      const errorMessage = jobData?.errorMessage ?? jobData?.data?.errorMessage ?? null
      const state = jobData?.state ?? jobData?.data?.state ?? ''
      const progress = jobData?.progress ?? jobData?.data?.progress ?? 0
      
      console.log(`🔍 [Lesson Video Polling] Job ${jobId} status: ${jobStatus}, state: ${state}, progress: ${progress}%`)
      
      // If job not found but video URL exists, consider it ready
      if (state === 'not_found' || jobStatus === 'unknown') {
        if (lesson.videos.length > 0 && (lesson.videos[0].videoUrl || lesson.videos[0].hlsUrl)) {
          if (lessonVideoPollIntervals.value[progressKey]) {
            clearInterval(lessonVideoPollIntervals.value[progressKey])
            delete lessonVideoPollIntervals.value[progressKey]
          }
          lesson.videos[0].status = 'ready'
          lesson.videos[0].errorMessage = ''
          delete lessonVideoUploadProgress[progressKey]
          lesson.uploadingVideo = false
          message.success('Video đã xử lý xong')
          return
        }
      }
      
      if (jobStatus === 'ready') {
        if (lessonVideoPollIntervals.value[progressKey]) {
          clearInterval(lessonVideoPollIntervals.value[progressKey])
          delete lessonVideoPollIntervals.value[progressKey]
        }
        
        // Update lesson video with final data
        if (lesson.videos.length > 0 && jobResult) {
          lesson.videos[0] = {
            ...lesson.videos[0],
            videoUrl: jobResult.hlsUrl || jobResult.url || lesson.videos[0].videoUrl,
            hlsUrl: jobResult.hlsUrl || lesson.videos[0].hlsUrl,
            status: 'ready',
            qualityMetadata: jobResult.qualityMetadata || lesson.videos[0].qualityMetadata,
            errorMessage: '',
          }
          console.log('✅ [Lesson Video Polling] Updated lesson video with hlsUrl:', jobResult.hlsUrl)
        } else if (lesson.videos.length > 0) {
          lesson.videos[0].status = 'ready'
          lesson.videos[0].errorMessage = ''
        }
        
        // CRITICAL: If lesson has _id, save to database immediately
        // This ensures database is updated even if worker didn't find the lesson
        if (lesson._id && lesson.videos.length > 0 && jobResult) {
          try {
            // Update lesson in database via course update
            if (editingCourse.value?._id) {
              await coursesApi.updateCourse(editingCourse.value._id, {
                ...formData,
                chapters: formData.chapters.map((ch: any, chIdx: number) => ({
                  ...ch,
                  index: chIdx,
                  lessons: ch.lessons?.map((l: any, lIdx: number) => {
                    if (chIdx === chapterIndex && lIdx === lessonIndex) {
                      return {
                        ...l,
                        videos: l.videos || [],
                      }
                    }
                    return l
                  }) || [],
                })),
              })
              console.log('✅ [Lesson Video Polling] Saved video URL to database for lesson:', lesson._id)
            }
          } catch (error: any) {
            console.error('⚠️ [Lesson Video Polling] Failed to save video URL to database:', error.message)
            // Don't fail - video is still updated in local state
          }
        }
        
        // Update progress to 100% before hiding
        if (progressKey && lessonVideoUploadProgress[progressKey]) {
          lessonVideoUploadProgress[progressKey].percent = 100
          lessonVideoUploadProgress[progressKey].stage = 'ready'
        }
        
        // Wait 2 seconds for final progress animation, then hide
        setTimeout(() => {
          lesson.uploadingVideo = false
          if (progressKey) {
            delete lessonVideoUploadProgress[progressKey]
          }
        }, 2000)
        
        message.success('Video đã xử lý xong')
      } else if (jobStatus === 'error') {
        if (lessonVideoPollIntervals.value[progressKey]) {
          clearInterval(lessonVideoPollIntervals.value[progressKey])
          delete lessonVideoPollIntervals.value[progressKey]
        }
        if (lesson.videos.length > 0) {
          lesson.videos[0].status = 'error'
          lesson.videos[0].errorMessage = errorMessage || 'Lỗi xử lý video'
        }
        lesson.uploadingVideo = false
        delete lessonVideoUploadProgress[progressKey]
        message.error('Lỗi xử lý video: ' + (errorMessage || 'Unknown error'))
      } else if (jobStatus === 'processing') {
        if (lesson.videos.length > 0) {
          lesson.videos[0].status = 'processing'
        }
        // CRITICAL: Sync frontend progress with backend job progress
        // Backend progress: 50% (reading file), 70% (converting HLS), 85% (uploading), 100% (done)
        if (progressKey && lessonVideoUploadProgress[progressKey]) {
          // Use actual backend progress instead of simulated
          lessonVideoUploadProgress[progressKey].percent = progress || 70
          lessonVideoUploadProgress[progressKey].stage = progress >= 85 ? 'uploading-r2' : progress >= 70 ? 'processing' : 'queueing'
          // Keep progress tracker visible while backend is processing
          lesson.uploadingVideo = true
        }
        console.log(`🔄 [Lesson Video Polling] Job ${jobId} is processing, progress: ${progress}% (synced with backend)`)
      } else if (jobStatus === 'queueing') {
        if (lesson.videos.length > 0) {
          lesson.videos[0].status = 'queueing'
        }
        console.log(`⏳ [Lesson Video Polling] Job ${jobId} is queueing`)
      }
      
      // Stop polling after max attempts
      if (pollCount >= maxPolls) {
        if (lessonVideoPollIntervals.value[progressKey]) {
          clearInterval(lessonVideoPollIntervals.value[progressKey])
          delete lessonVideoPollIntervals.value[progressKey]
        }
        if (lesson.videos.length > 0 && lesson.videos[0].status !== 'ready' && lesson.videos[0].status !== 'error') {
          lesson.videos[0].status = 'error'
          lesson.videos[0].errorMessage = 'Timeout: Video processing took too long'
        }
        lesson.uploadingVideo = false
        delete lessonVideoUploadProgress[progressKey]
      }
    } catch (error: any) {
      console.error(`❌ [Lesson Video Polling] Error polling job ${jobId}:`, error)
      // Continue polling on error (might be temporary network issue)
      // But stop after max attempts
      if (pollCount >= maxPolls) {
        if (lessonVideoPollIntervals.value[progressKey]) {
          clearInterval(lessonVideoPollIntervals.value[progressKey])
          delete lessonVideoPollIntervals.value[progressKey]
        }
        // Set status to error if still not ready
        if (lesson.videos.length > 0 && lesson.videos[0].status !== 'ready') {
          lesson.videos[0].status = 'error'
          lesson.videos[0].errorMessage = 'Timeout: Video processing took too long or server error'
          lesson.uploadingVideo = false
          delete lessonVideoUploadProgress[progressKey]
          message.error('Lỗi xử lý video: Timeout hoặc lỗi server')
        }
      }
    }
  }, 5000) // Poll every 5 seconds
}

// Upload lesson document to MinIO
const handleLessonDocumentChange = async (chapterIndex: number, lessonIndex: number, info: any) => {
  const lesson = formData.chapters[chapterIndex].lessons[lessonIndex]
  const { fileList } = info
  
  if (fileList.length > 0 && fileList[0].originFileObj) {
    const file = fileList[0].originFileObj as File
    
    // Set uploading state
    lesson.uploadingDocument = true
    
    try {
      // Upload document to MinIO
      const documentUrl = await uploadFileToMinIO(file, `courses/documents/${Date.now()}`)
      
      // Lưu vào lesson.documents
      if (!lesson.documents) {
        lesson.documents = []
      }
      
      // Thêm hoặc cập nhật document
      lesson.documents = [{
        title: file.name,
        fileUrl: documentUrl,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        index: 0,
      }]
      
      message.success('Upload tài liệu thành công')
    } catch (error: any) {
      console.error('Upload document error:', error)
      message.error('Upload tài liệu thất bại: ' + (error.message || 'Unknown error'))
      // Xóa file khỏi fileList nếu upload thất bại
      lesson.documentFileList = []
    } finally {
      lesson.uploadingDocument = false
    }
  } else {
    // File removed
    lesson.documents = []
  }
}
</script>

<style scoped>
.courses-management-page {
  padding: 24px;
  background: #f5f5f5;
  min-height: calc(100vh - 64px);
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

@media (min-width: 768px) {
  .page-header {
    flex-direction: row;
    align-items: center;
  }
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.page-subtitle {
  font-size: 14px;
  color: #8c8c8c;
  margin: 4px 0 0 0;
}

.header-actions {
  width: 100%;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.stat-card-blue .stat-icon {
  background: #e6f7ff;
  color: #1890ff;
}

.stat-card-green .stat-icon {
  background: #f6ffed;
  color: #52c41a;
}

.stat-card-orange .stat-icon {
  background: #fff7e6;
  color: #fa8c16;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0 0 8px 0;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.filters-card {
  margin-bottom: 24px;
}

.filters-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-wrap: wrap;
}

@media (min-width: 640px) {
  .filters-container {
    flex-direction: row;
    gap: 16px;
  }
}

.filters-container .ant-input-search {
  width: 100% !important;
}

@media (min-width: 640px) {
  .filters-container .ant-input-search {
    width: 300px !important;
  }
}

.filters-container .ant-select {
  width: 100% !important;
}

@media (min-width: 640px) {
  .filters-container .ant-select {
    width: 150px !important;
  }
}

.table-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Desktop Table - Ẩn trên mobile */
.desktop-table {
  display: none;
}

@media (min-width: 1024px) {
  .desktop-table {
    display: block;
  }
}

/* Mobile Cards - Hiển thị trên mobile, ẩn trên desktop */
.mobile-cards {
  display: block;
}

@media (min-width: 1024px) {
  .mobile-cards {
    display: none;
  }
}

.mobile-course-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mobile-card-header {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.mobile-card-title-section {
  flex: 1;
  min-width: 0;
}

.mobile-course-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
  word-wrap: break-word;
}

.mobile-course-code {
  font-size: 12px;
  color: #8c8c8c;
}

.mobile-card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.mobile-card-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

@media (min-width: 640px) {
  .mobile-card-row {
    flex-direction: row;
    align-items: flex-start;
  }
}

.mobile-label {
  font-size: 12px;
  font-weight: 600;
  color: #8c8c8c;
  min-width: 80px;
  flex-shrink: 0;
}

.mobile-value {
  font-size: 14px;
  color: #1a1a1a;
  flex: 1;
  word-wrap: break-word;
}

.mobile-card-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.mobile-action-btn {
  text-align: left !important;
  padding: 8px 0 !important;
  height: auto !important;
}

.mobile-pagination {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.course-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.course-title {
  font-weight: 600;
  color: #1a1a1a;
}

.course-code {
  font-size: 12px;
  color: #8c8c8c;
}

.course-description {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #595959;
}

.price-current {
  font-weight: 600;
  color: #1a1a1a;
}

.price-original {
  font-size: 12px;
  color: #8c8c8c;
  text-decoration: line-through;
}

.preview-url {
  margin-top: 8px;
}

.chapters-container {
  max-height: 600px;
  overflow-y: auto;
}

.chapter-card {
  margin-bottom: 16px;
}

.lesson-item {
  margin-bottom: 16px;
}

.lesson-card {
  background: #fafafa;
}

.question-item {
  margin-bottom: 16px;
}

.option-item {
  margin-bottom: 8px;
}

.uploaded-files {
  margin-top: 8px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.course-details-container {
  padding: 20px;
}

.course-header {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.course-image-card {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f0f0;
  border-radius: 8px;
  padding: 20px;
}

.course-info-card {
  padding: 20px;
}

.course-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.course-code {
  font-size: 16px;
  color: #8c8c8c;
  margin-bottom: 12px;
}

.course-description {
  font-size: 16px;
  color: #595959;
  margin-bottom: 16px;
  line-height: 1.6;
}

.course-price-section {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 16px;
}

.course-price-section .price-current {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
}

.course-price-section .price-original {
  font-size: 18px;
  color: #8c8c8c;
  text-decoration: line-through;
}

.course-status-tag {
  margin-bottom: 16px;
}

.course-meta-info {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
  font-size: 14px;
  color: #8c8c8c;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.course-content-section {
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.course-content-section h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.lesson-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.lesson-description {
  font-size: 14px;
  color: #595959;
  margin-bottom: 12px;
  line-height: 1.5;
}

.lesson-content h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-top: 16px;
  margin-bottom: 8px;
}

.lesson-content p {
  font-size: 14px;
  color: #595959;
  line-height: 1.6;
  margin-bottom: 12px;
}

.quiz-info {
  margin-top: 16px;
  padding: 12px;
  background-color: #f0f0f0;
  border-radius: 8px;
}

.quiz-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.quiz-info p {
  font-size: 14px;
  color: #595959;
  margin-bottom: 12px;
}

.quiz-info .ant-button {
  margin-top: 12px;
}

.course-detail-view {
  max-height: 70vh;
  overflow-y: auto;
}
</style>

