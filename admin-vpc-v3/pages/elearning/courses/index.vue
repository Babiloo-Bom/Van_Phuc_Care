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
      
      <div class="stat-card stat-card-orange">
        <div class="stat-icon">
          <PauseCircleOutlined />
        </div>
        <div class="stat-content">
          <p class="stat-label">Tạm dừng</p>
          <p class="stat-value">{{ formatNumber(stats.inactive) }}</p>
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
          <a-select-option value="inactive">Tạm dừng</a-select-option>
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
          <!-- Thumbnail Column -->
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
            
            <!-- Title Column -->
            <template v-else-if="column.key === 'title'">
              <div class="course-info">
                <div class="course-title">{{ record.title || record.name || 'Chưa có tiêu đề' }}</div>
                <div class="course-code">{{ record.code || 'N/A' }}</div>
              </div>
            </template>
            
            <!-- Description Column -->
            <template v-else-if="column.key === 'description'">
              <div class="course-description">
                {{ record.shortDescription || record.description || 'Chưa có mô tả' }}
              </div>
            </template>
            
            <!-- Price Column -->
            <template v-else-if="column.key === 'price'">
              <div>
                <div class="price-current">{{ formatCurrency(record.price || 0) }}</div>
                <div v-if="record.originalPrice && record.originalPrice > record.price" class="price-original">
                  {{ formatCurrency(record.originalPrice) }}
                </div>
              </div>
            </template>
            
            <!-- Status Column -->
            <template v-else-if="column.key === 'status'">
              <a-tag :color="record.status === 'active' ? 'success' : 'default'">
                {{ record.status === 'active' ? 'Hoạt động' : 'Tạm dừng' }}
              </a-tag>
            </template>
            
            <!-- Created At Column -->
            <template v-else-if="column.key === 'createdAt'">
              {{ formatDate(record.createdAt) }}
            </template>
            
            <!-- Actions Column -->
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
                <a-button 
                  type="link" 
                  size="small"
                  :danger="record.status === 'active'"
                  @click="toggleCourseStatus(record)"
                >
                  <template v-if="record.status === 'active'">
                    <PauseCircleOutlined /> Tạm dừng
                  </template>
                  <template v-else>
                    <PlayCircleOutlined /> Kích hoạt
                  </template>
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
              <span class="mobile-label">Trạng thái:</span>
              <a-tag :color="record.status === 'active' ? 'success' : 'default'">
                {{ record.status === 'active' ? 'Hoạt động' : 'Tạm dừng' }}
              </a-tag>
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
            <a-button 
              type="link" 
              size="small"
              block
              :danger="record.status === 'active'"
              @click="toggleCourseStatus(record)"
              class="mobile-action-btn"
            >
              <template v-if="record.status === 'active'">
                <PauseCircleOutlined /> Tạm dừng
              </template>
              <template v-else>
                <PlayCircleOutlined /> Kích hoạt
              </template>
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

    <!-- Create/Edit Modal - UPDATED -->
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
      <a-tabs v-model:activeKey="activeTab">
        <!-- Tab 1: Thông tin cơ bản -->
        <a-tab-pane key="basic" tab="Thông tin cơ bản">
          <a-form
            ref="formRef"
            :model="formData"
            :rules="formRules"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
          >
            <a-form-item label="Tên khóa học" name="title">
              <a-input 
                v-model:value="formData.title" 
                placeholder="Nhập tên khóa học"
                @input="generateSlug"
              />
            </a-form-item>
            
            <a-form-item label="Slug (tự động)" name="slug">
              <a-input 
                v-model:value="formData.slug" 
                placeholder="Slug sẽ tự động tạo từ tên khóa học"
                disabled
              />
            </a-form-item>
            
            <a-form-item label="Mô tả ngắn" name="shortDescription">
              <a-textarea 
                v-model:value="formData.shortDescription" 
                placeholder="Nhập mô tả ngắn"
                :rows="3"
              />
            </a-form-item>
            
            <a-form-item label="Mô tả chi tiết" name="description">
              <a-textarea 
                v-model:value="formData.description" 
                placeholder="Nhập mô tả chi tiết"
                :rows="5"
              />
            </a-form-item>

            <a-form-item label="Ảnh đại diện" name="thumbnail">
              <a-upload
                v-model:file-list="thumbnailFileList"
                :before-upload="() => false"
                :max-count="1"
                accept="image/*"
                list-type="picture-card"
                @preview="handlePreview"
                @remove="handleRemoveThumbnail"
                @change="handleThumbnailChange"
              >
                <div v-if="thumbnailFileList.length < 1">
                  <PlusOutlined />
                  <div style="margin-top: 8px">Upload</div>
                </div>
              </a-upload>
              <div v-if="formData.thumbnail && !thumbnailFileList.length" class="preview-url">
                <img :src="formData.thumbnail" style="max-width: 200px; max-height: 200px" />
              </div>
            </a-form-item>

            <a-form-item label="Video giới thiệu" name="introVideo">
              <a-upload
                v-model:file-list="introVideoFileList"
                :before-upload="() => false"
                :max-count="1"
                accept="video/*"
                @remove="handleRemoveIntroVideo"
              >
                <a-button>
                  <UploadOutlined /> Chọn video
                </a-button>
              </a-upload>
              <div v-if="formData.introVideo" class="preview-url">
                <video :src="formData.introVideo" controls style="max-width: 400px; max-height: 300px"></video>
              </div>
            </a-form-item>

            <a-form-item label="Danh mục" name="category">
              <a-input v-model:value="formData.category" placeholder="Ví dụ: Lập Trình, Marketing, Thiết Kế" />
            </a-form-item>

            <a-form-item label="Cấp độ" name="level">
              <a-select v-model:value="formData.level" placeholder="Chọn cấp độ">
                <a-select-option value="beginner">Cơ bản</a-select-option>
                <a-select-option value="intermediate">Trung bình</a-select-option>
                <a-select-option value="advanced">Nâng cao</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="Tags">
              <a-select
                v-model:value="formData.tags"
                mode="tags"
                placeholder="Nhập tags và nhấn Enter"
                style="width: 100%"
              />
            </a-form-item>

            <a-form-item label="Giá" name="price">
              <a-input-number 
                v-model:value="formData.price" 
                placeholder="Nhập giá"
                :min="0"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value!.replace(/\$\s?|(,*)/g, '')"
                style="width: 100%"
              />
            </a-form-item>
            
            <a-form-item label="Giá gốc" name="originalPrice">
              <a-input-number 
                v-model:value="formData.originalPrice" 
                placeholder="Nhập giá gốc (nếu có)"
                :min="0"
                :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value!.replace(/\$\s?|(,*)/g, '')"
                style="width: 100%"
              />
            </a-form-item>

            <a-form-item label="Trạng thái" name="status">
              <a-select v-model:value="formData.status" placeholder="Chọn trạng thái">
                <a-select-option value="active">Hoạt động</a-select-option>
                <a-select-option value="inactive">Tạm dừng</a-select-option>
                <a-select-option value="draft">Bản nháp</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="Xuất bản">
              <a-switch v-model:checked="formData.isPublished" />
            </a-form-item>

            <a-form-item label="Nổi bật">
              <a-switch v-model:checked="formData.isFeatured" />
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <!-- Tab 2: Thông tin giảng viên -->
        <a-tab-pane key="instructor" tab="Giảng viên">
          <a-form
            :model="formData.instructor"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
          >
            <a-form-item label="Tên giảng viên" name="name">
              <a-input 
                v-model:value="formData.instructor.name" 
                placeholder="Nhập tên giảng viên"
              />
            </a-form-item>

            <a-form-item label="Ảnh đại diện">
              <a-upload
                v-model:file-list="instructorAvatarFileList"
                :before-upload="() => false"
                :max-count="1"
                accept="image/*"
                list-type="picture-card"
                @preview="handlePreview"
                @remove="handleRemoveInstructorAvatar"
              >
                <div v-if="instructorAvatarFileList.length < 1">
                  <PlusOutlined />
                  <div style="margin-top: 8px">Upload</div>
                </div>
              </a-upload>
              <div v-if="formData.instructor.avatar" class="preview-url">
                <img :src="formData.instructor.avatar" style="max-width: 200px; max-height: 200px" />
              </div>
            </a-form-item>

            <a-form-item label="Tiểu sử">
              <a-textarea 
                v-model:value="formData.instructor.bio" 
                placeholder="Nhập tiểu sử giảng viên"
                :rows="5"
              />
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <!-- Tab 3: Nội dung khóa học (Chapters & Lessons) -->
        <a-tab-pane key="content" tab="Nội dung khóa học">
          <div class="chapters-container">
            <div v-for="(chapter, chapterIndex) in formData.chapters" :key="chapterIndex" class="chapter-item">
              <a-card :title="`Chương ${chapterIndex + 1}: ${chapter.title || 'Chưa có tiêu đề'}`" class="chapter-card">
                <template #extra>
                  <a-space>
                    <a-button type="link" danger @click="removeChapter(chapterIndex)">
                      <DeleteOutlined /> Xóa chương
                    </a-button>
                  </a-space>
                </template>

                <!-- Chapter Info -->
                <a-form :model="chapter" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                  <a-form-item label="Tiêu đề chương">
                    <a-input v-model:value="chapter.title" placeholder="Nhập tiêu đề chương" />
                  </a-form-item>
                  <a-form-item label="Mô tả">
                    <a-textarea v-model:value="chapter.description" :rows="2" placeholder="Mô tả chương" />
                  </a-form-item>
                </a-form>

                <!-- Lessons -->
                <a-divider>Bài học</a-divider>
                <div v-for="(lesson, lessonIndex) in chapter.lessons" :key="lessonIndex" class="lesson-item">
                  <a-card size="small" class="lesson-card" v-if="ensureLessonProperties(lesson)">
                    <template #title>
                      <a-input 
                        v-model:value="lesson.title" 
                        placeholder="Tên bài học"
                        style="width: 300px"
                      />
                    </template>
                    <template #extra>
                      <a-space>
                        <a-select v-model:value="lesson.type" style="width: 120px">
                          <a-select-option value="video">Video</a-select-option>
                          <a-select-option value="document">Tài liệu</a-select-option>
                          <a-select-option value="text">Văn bản</a-select-option>
                          <a-select-option value="quiz">Quiz</a-select-option>
                        </a-select>
                        <a-button type="link" danger size="small" @click="removeLesson(chapterIndex, lessonIndex)">
                          <DeleteOutlined />
                        </a-button>
                      </a-space>
                    </template>

                    <a-form :model="lesson" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                      <a-form-item label="Mô tả">
                        <a-textarea v-model:value="lesson.description" :rows="2" />
                      </a-form-item>

                      <!-- Thêm checkbox Học thử ở đây -->
                      <a-form-item label="Học thử">
                        <a-checkbox v-model:checked="lesson.isPreview">
                          Cho phép học thử bài này
                        </a-checkbox>
                        <div style="font-size: 12px; color: #8c8c8c; margin-top: 4px;">
                          Người dùng chưa mua khóa học vẫn có thể xem bài này
                        </div>
                      </a-form-item>

                      <!-- Video Type -->
                      <template v-if="lesson.type === 'video'">
                        <a-form-item label="Video">
                          <a-upload
                            v-model:file-list="lesson.videoFileList"
                            :before-upload="() => false"
                            :max-count="1"
                            accept="video/*"
                            @change="(info) => handleLessonVideoChange(chapterIndex, lessonIndex, info)"
                            @remove="() => { 
                              lesson.videoFileList = []
                              lesson.videos = []
                            }"
                          >
                            <a-button :loading="lesson.uploadingVideo">
                              <UploadOutlined /> Chọn video
                            </a-button>
                          </a-upload>
                          <div v-if="lesson.videos && lesson.videos.length > 0" class="uploaded-files">
                            <a-tag v-for="(video, idx) in lesson.videos" :key="idx" color="success">
                              {{ video.title || 'Video đã upload' }}
                            </a-tag>
                          </div>
                        </a-form-item>
                      </template>

                      <!-- Document Type -->
                      <template v-if="lesson.type === 'document'">
                        <a-form-item label="Tài liệu">
                          <a-upload
                            v-model:file-list="lesson.documentFileList"
                            :before-upload="() => false"
                            accept=".pdf,.doc,.docx,.txt"
                            @change="(info) => handleLessonDocumentChange(chapterIndex, lessonIndex, info)"
                            @remove="() => { 
                              lesson.documentFileList = []
                              lesson.documents = []
                            }"
                          >
                            <a-button :loading="lesson.uploadingDocument">
                              <UploadOutlined /> Chọn tài liệu
                            </a-button>
                          </a-upload>
                          <div v-if="lesson.documents && lesson.documents.length > 0" class="uploaded-files">
                            <a-tag v-for="(doc, idx) in lesson.documents" :key="idx" color="success">
                              {{ doc.title || doc.fileName || 'Tài liệu đã upload' }}
                            </a-tag>
                          </div>
                        </a-form-item>
                      </template>

                      <!-- Text Type -->
                      <template v-if="lesson.type === 'text'">
                        <a-form-item label="Nội dung">
                          <a-textarea v-model:value="lesson.content" :rows="6" placeholder="Nhập nội dung văn bản" />
                        </a-form-item>
                      </template>

                      <!-- Quiz Type -->
                      <template v-if="lesson.type === 'quiz'">
                        <a-form-item label="Tiêu đề quiz">
                          <a-input v-model:value="lesson.quiz.title" placeholder="Tiêu đề quiz" />
                        </a-form-item>
                        <a-form-item label="Mô tả">
                          <a-textarea v-model:value="lesson.quiz.description" :rows="2" />
                        </a-form-item>
                        <a-form-item label="Điểm đạt">
                          <a-input-number 
                            v-model:value="lesson.quiz.passingScore" 
                            :min="0" 
                            :max="100" 
                            style="width: 100%"
                          />
                          <span style="margin-left: 8px">%</span>
                        </a-form-item>
                        <a-form-item label="Thời gian (phút)">
                          <a-input-number 
                            v-model:value="lesson.quiz.timeLimit" 
                            :min="0" 
                            style="width: 100%"
                          />
                        </a-form-item>
                        <a-form-item label="Số lần thử">
                          <a-input-number 
                            v-model:value="lesson.quiz.attempts" 
                            :min="1" 
                            style="width: 100%"
                          />
                        </a-form-item>

                        <!-- Questions -->
                        <a-divider>Câu hỏi</a-divider>
                        <div v-for="(question, qIndex) in lesson.quiz.questions" :key="qIndex" class="question-item">
                          <a-card size="small">
                            <template #extra>
                              <a-button type="link" danger size="small" @click="removeQuestion(chapterIndex, lessonIndex, qIndex)">
                                <DeleteOutlined />
                              </a-button>
                            </template>
                            <a-form :model="question" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
                              <a-form-item label="Câu hỏi">
                                <a-input v-model:value="question.question" />
                              </a-form-item>
                              <a-form-item label="Điểm">
                                <a-input-number v-model:value="question.points" :min="1" style="width: 100%" />
                              </a-form-item>
                              <a-form-item label="Câu trả lời">
                                <!-- Trắc nghiệm: Nhiều lựa chọn với checkbox -->
                                <div v-for="(option, optIndex) in question.options" :key="optIndex" class="option-item">
                                  <a-space style="width: 100%">
                                    <a-input 
                                      v-model:value="option.text" 
                                      placeholder="Nội dung câu trả lời"
                                      style="flex: 1"
                                    />
                                    <a-checkbox v-model:checked="option.isCorrect">Đúng</a-checkbox>
                                    <a-button type="link" danger size="small" @click="removeOption(chapterIndex, lessonIndex, qIndex, optIndex)">
                                      <DeleteOutlined />
                                    </a-button>
                                  </a-space>
                                </div>
                                <a-button 
                                  type="dashed" 
                                  block 
                                  @click="addOption(chapterIndex, lessonIndex, qIndex)"
                                  style="margin-top: 8px"
                                >
                                  <PlusOutlined /> Thêm câu trả lời
                                </a-button>
                              </a-form-item>
                              <a-form-item label="Giải thích">
                                <a-textarea v-model:value="question.explanation" :rows="2" />
                              </a-form-item>
                            </a-form>
                          </a-card>
                        </div>
                        <a-button 
                          type="dashed" 
                          block 
                          @click="addQuestion(chapterIndex, lessonIndex)"
                          style="margin-top: 16px"
                        >
                          <PlusOutlined /> Thêm câu hỏi
                        </a-button>
                      </template>
                    </a-form>
                  </a-card>
                </div>

                <a-button 
                  type="dashed" 
                  block 
                  @click="addLesson(chapterIndex)"
                  style="margin-top: 16px"
                >
                  <PlusOutlined /> Thêm bài học
                </a-button>
              </a-card>
            </div>

            <a-button 
              type="dashed" 
              block 
              @click="addChapter"
              style="margin-top: 16px"
            >
              <PlusOutlined /> Thêm chương
            </a-button>
          </div>
        </a-tab-pane>
      </a-tabs>
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
              {{ viewingCourse.status === 'active' ? 'Hoạt động' : 'Tạm dừng' }}
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
import { message } from 'ant-design-vue'
import type { Course } from '~/types/api'
import { useCoursesApi } from '~/composables/api/useCoursesApi'
import type { UploadFile } from 'ant-design-vue'
import { watch, nextTick } from 'vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
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
  inactive: 0,
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
const instructorAvatarFileList = ref<UploadFile[]>([])
const activeTab = ref('basic')

// Updated formData - THÊM LẠI ĐỊNH NGHĨA NÀY
const formData = reactive({
  title: '',
  slug: '',
  description: '',
  shortDescription: '',
  thumbnail: '',
  introVideo: '',
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

const handleRemoveIntroVideo = () => {
  formData.introVideo = ''
  introVideoFileList.value = []
}

const handleRemoveInstructorAvatar = () => {
  formData.instructor.avatar = ''
  instructorAvatarFileList.value = []
}

// Upload file to MinIO - SỬA URL THÀNH /api/uploads/minio
const uploadFileToMinIO = async (file: File, folder: string = 'courses'): Promise<string> => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const apiHost = config.public.apiHost || 'http://localhost:3000'
  const uploadFormData = new FormData()
  uploadFormData.append('files', file)
  
  try {
    // URL đúng: /api/uploads/minio (không có /a)
    const url = `${apiHost}/api/uploads/minio?folder=${folder}`
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

// Upload video to R2/CDN - SỬA URL TƯƠNG TỰ
const uploadVideoToR2 = async (file: File, folder: string = 'courses/intro-videos'): Promise<string> => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const apiHost = config.public.apiHost || 'http://localhost:3000'
  const uploadFormData = new FormData()
  uploadFormData.append('file', file) // Note: 'file' not 'files'
  
  try {
    // URL đúng: /api/uploads/video (không có /a)
    const url = `${apiHost}/api/uploads/video?folder=${folder}`
    console.log('📤 Uploading video to:', url) // Debug
    
    const response: any = await $fetch(url, {
      method: 'POST',
      body: uploadFormData,
      headers: {
        ...(authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {}),
      }
    })
    
    console.log('📤 Video upload response:', response) // Debug
    
    // Parse response
    const videos = response?.data?.videos || response?.videos || []
    
    if (videos.length > 0 && videos[0].url) {
      return videos[0].url
    }
    
    throw new Error('Video upload failed: No file URL in response')
  } catch (error: any) {
    console.error('❌ Video upload error:', error)
    throw new Error(error.message || 'Video upload failed')
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
  'instructor.name': [{ required: true, message: 'Vui lòng nhập tên giảng viên', trigger: 'blur' }],
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
      
      Object.assign(formData, {
        title: courseData.title || '',
        slug: courseData.slug || '',
        description: courseData.description || '',
        shortDescription: courseData.shortDescription || '',
        thumbnail: courseData.thumbnail || '',
        introVideo: courseData.introVideo || '',
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
          lessons: (chapter.lessons || []).map((lesson: any) => ({
            _id: lesson._id,
            title: lesson.title || '',
            description: lesson.description || '',
            content: lesson.content || '',
            type: lesson.type || 'video',
            isPreview: lesson.isPreview || false,
            status: lesson.status || 'active',
            videos: lesson.videos || [],
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
          })),
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
          url: courseData.introVideo,
        }]
      } else {
        introVideoFileList.value = []
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
    
    // Upload intro video to R2/CDN - CHỈ KHI CÓ FILE MỚI
    if (introVideoFileList.value.length > 0 && introVideoFileList.value[0].originFileObj) {
      formData.introVideo = await uploadVideoToR2(introVideoFileList.value[0].originFileObj as File, 'courses/intro-videos')
    }
    // Nếu không có file mới nhưng có URL (khi edit), giữ nguyên URL
    else if (introVideoFileList.value.length > 0 && introVideoFileList.value[0].url) {
      formData.introVideo = introVideoFileList.value[0].url
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
            title: lesson.title,
            description: lesson.description,
            content: lesson.content || '',
            // Map 'text' thành 'document' nếu schema không hỗ trợ 'text'
            type: lesson.type === 'text' ? 'document' : lesson.type,
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
    console.error('Modal error:', error)
    if (error.errorFields) {
      return
    }
    message.error('Có lỗi xảy ra')
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
        stats.inactive = courses.value.filter(c => c.status === 'inactive').length
      } else {
        // Fallback nếu không phải array
        stats.total = 0
        stats.active = 0
        stats.inactive = 0
        courses.value = []
      }
    } else {
      // Nếu response không hợp lệ, set về mảng rỗng
      courses.value = []
      pagination.total = 0
      stats.total = 0
      stats.active = 0
      stats.inactive = 0
    }
  } catch (error: any) {
    console.error('Failed to fetch courses:', error)
    message.error('Không thể tải danh sách khóa học')
    // Đảm bảo courses luôn là array khi có lỗi
    courses.value = []
    pagination.total = 0
    stats.total = 0
    stats.active = 0
    stats.inactive = 0
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
    
    try {
      // Upload video to R2/CDN
      const videoUrl = await uploadVideoToR2(file, `courses/lessons/${Date.now()}`)
      
      // Lưu vào lesson.videos
      if (!lesson.videos) {
        lesson.videos = []
      }
      
      // Thêm hoặc cập nhật video
      lesson.videos = [{
        title: file.name,
        videoUrl: videoUrl,
        thumbnail: '',
        duration: 0,
        fileSize: file.size,
        quality: '720',
        index: 0,
      }]
      
      message.success('Upload video thành công')
    } catch (error: any) {
      console.error('Upload video error:', error)
      message.error('Upload video thất bại: ' + (error.message || 'Unknown error'))
      // Xóa file khỏi fileList nếu upload thất bại
      lesson.videoFileList = []
    } finally {
      lesson.uploadingVideo = false
    }
  } else {
    // File removed
    lesson.videos = []
  }
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
