<template>
  <div class="so-skdt-management-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Quản lý Sổ SKĐT</h1>
        <p class="page-subtitle">Quản lý sổ sức khỏe điện tử</p>
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
          <FileTextOutlined />
        </div>
        <div class="stat-content">
          <p class="stat-label">Tổng sổ SKĐT</p>
          <p class="stat-value">{{ formatNumber(stats.total) }}</p>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <a-card class="filters-card" :bordered="false">
      <div class="filters-container">
        <a-input-search
          v-model:value="searchQuery"
          placeholder="Tìm kiếm theo email hoặc tên người dùng..."
          style="width: 300px"
          allow-clear
          @search="handleSearch"
          @pressEnter="handleSearch"
        />
        
        <a-date-picker
          v-model:value="filterDate"
          placeholder="Chọn ngày tạo"
          format="DD/MM/YYYY"
          style="width: 200px"
          allow-clear
          @change="handleFilter"
        />
      </div>
    </a-card>

    <!-- Health Books Table -->
    <a-card class="table-card" :bordered="false">
      <template #title>
        <span>Danh sách Sổ SKĐT</span>
      </template>
      
      <!-- Desktop Table -->
      <div class="desktop-table">
        <a-table
          :columns="columns"
          :data-source="healthBooks"
          :loading="loading"
          :pagination="paginationConfig"
          :scroll="{ x: 1200 }"
          @change="handleTableChange"
          row-key="_id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'avatar'">
              <a-avatar 
                :src="record.avatar" 
                :size="60"
                shape="circle"
                :style="{ backgroundColor: '#f0f0f0' }"
              >
                <template v-if="!record.avatar">
                  <UserOutlined />
                </template>
              </a-avatar>
            </template>
            
            <template v-else-if="column.key === 'name'">
              <div class="healthbook-info">
                <!-- Tên sổ / tên bé -->
                <div class="healthbook-name">
                  {{ record.name || 'Chưa có tên' }}
                </div>
                <!-- Thông tin người dùng: email ưu tiên -->
                <div class="healthbook-user">
                  <span class="healthbook-user-email">
                    {{ record.customerEmail || 'Chưa có email người dùng' }}
                  </span>
                </div>
              </div>
            </template>
            
            <template v-else-if="column.key === 'dob'">
              {{ formatDate(record.dob) }}
            </template>
            
            <template v-else-if="column.key === 'gender'">
              <a-tag :color="record.gender === 'male' ? 'blue' : record.gender === 'female' ? 'pink' : 'default'">
                {{ record.gender === 'male' ? 'Nam' : record.gender === 'female' ? 'Nữ' : record.gender || 'N/A' }}
              </a-tag>
            </template>
            
            <template v-else-if="column.key === 'createdAt'">
              {{ formatDate(record.createdAt) }}
            </template>
            
            <template v-else-if="column.key === 'updatedAt'">
              {{ formatDate(record.updatedAt) }}
            </template>
            
            <template v-else-if="column.key === 'actions'">
              <a-button 
                type="primary" 
                size="small"
                @click="openVaccinationModal(record)"
              >
                <template #icon>
                  <MedicineBoxOutlined />
                </template>
                Lịch tiêm
              </a-button>
            </template>
          </template>
        </a-table>
      </div>

      <!-- Mobile Stack Cards -->
      <div class="mobile-cards">
        <div v-for="record in healthBooks" :key="record._id" class="mobile-healthbook-card">
          <div class="mobile-card-header">
            <a-avatar 
              :src="record.avatar" 
              :size="60"
              shape="circle"
              :style="{ backgroundColor: '#f0f0f0' }"
            >
              <template v-if="!record.avatar">
                <UserOutlined />
              </template>
            </a-avatar>
            <div class="mobile-card-title-section">
              <div class="mobile-healthbook-name">
                {{ record.name || 'Chưa có tên' }}
              </div>
              <div class="mobile-healthbook-user">
                {{ record.customerEmail || 'Chưa có email người dùng' }}
              </div>
            </div>
          </div>

          <div class="mobile-card-body">
            <div class="mobile-card-row">
              <span class="mobile-label">Ngày sinh:</span>
              <span class="mobile-value">{{ formatDate(record.dob) }}</span>
            </div>
            
            <div class="mobile-card-row">
              <span class="mobile-label">Giới tính:</span>
              <span class="mobile-value">
                <a-tag :color="record.gender === 'male' ? 'blue' : record.gender === 'female' ? 'pink' : 'default'" size="small">
                  {{ record.gender === 'male' ? 'Nam' : record.gender === 'female' ? 'Nữ' : record.gender || 'N/A' }}
                </a-tag>
              </span>
            </div>
            
            <div class="mobile-card-row">
              <span class="mobile-label">Ngày tạo:</span>
              <span class="mobile-value">{{ formatDate(record.createdAt) }}</span>
            </div>
            
            <div class="mobile-card-row">
              <span class="mobile-label">Cập nhật:</span>
              <span class="mobile-value">{{ formatDate(record.updatedAt) }}</span>
            </div>
          </div>

        </div>
        
        <!-- Mobile Pagination -->
        <div class="mobile-pagination" v-if="pagination.total > 0">
          <a-pagination
            v-model:current="pagination.current"
            v-model:page-size="pagination.pageSize"
            :total="pagination.total"
            :page-size-options="['10', '20', '50']"
            show-size-changer
            :show-total="(total: number) => `Tổng ${total} sổ SKĐT`"
            @change="handleTableChange"
            @showSizeChange="handleTableChange"
            size="small"
          />
        </div>
      </div>
    </a-card>

    <!-- Create/Edit Modal -->
    <a-modal
      v-model:open="modalVisible"
      :title="modalTitle"
      :width="850"
      :confirm-loading="modalLoading"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
      centered
      class="create-health-record-modal"
    >
      <a-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        layout="vertical"
        class="health-form"
      >
        <!-- ========== PHẦN 1: Thông tin cơ bản ========== -->
        <div class="form-section section-1">
          <!-- Mã khách hàng - Search với autocomplete -->
          <a-form-item label="Mã khách hàng" name="customerEmail" required>
            <a-select
              v-model:value="formData.customerEmail"
              show-search
              placeholder="Tìm kiếm khách hàng theo tên hoặc email"
              :filter-option="false"
              :not-found-content="customerSearchLoading ? undefined : null"
              :loading="customerSearchLoading"
              size="large"
              @search="handleCustomerSearch"
              @change="handleCustomerSelect"
              allow-clear
            >
              <template v-if="customerSearchResults.length > 0">
                <a-select-option 
                  v-for="customer in customerSearchResults" 
                  :key="customer._id || customer.email" 
                  :value="customer.email"
                >
                  <div class="customer-option">
                    <div class="customer-name">
                      {{ customer.fullname || `${customer.firstname || ''} ${customer.lastname || ''}`.trim() }}
                    </div>
                    <div class="customer-email">{{ customer.email }}</div>
                  </div>
                </a-select-option>
              </template>
              <template v-else-if="!customerSearchLoading">
                <a-select-option disabled value="">
                  Không tìm thấy khách hàng
                </a-select-option>
              </template>
            </a-select>
          </a-form-item>

          <!-- Ngày -->
          <a-form-item label="Ngày" name="recordedAt" required>
            <a-date-picker
              v-model:value="formData.recordedAt"
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
                v-model:value="formData.temperature"
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
                  v-model:value="formData.height"
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
                  v-model:value="formData.weight"
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
              v-model:value="formData.skinCondition" 
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
              v-model:value="formData.skinConditionNote" 
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
              v-model:value="formData.oralHealth" 
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
              v-model:value="formData.oralHealthNote" 
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
              v-model:value="formData.nutrition" 
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
              v-model:value="formData.nutritionNote" 
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
              v-model:value="formData.sleep" 
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
              v-model:value="formData.sleepNote" 
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
              v-model:value="formData.stoolFrequency" 
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
              v-model:value="formData.stoolCondition" 
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
              v-model:value="formData.digestiveIssues" 
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
              v-model:value="formData.schedule" 
              placeholder="EASY 2 3 4" 
              size="large"
            >
              <a-select-option v-for="opt in scheduleOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <!-- Ghi chú -->
          <a-form-item label="Ghi chú" name="note">
            <a-textarea 
              v-model:value="formData.note" 
              :rows="3" 
              placeholder="Bé bò, ngồi, vỗ, dũng" 
              :maxlength="500" 
            />
          </a-form-item>

          <!-- Mốc phát triển -->
          <a-form-item label="Mốc phát triển" name="developmentMilestone">
            <a-select 
              v-model:value="formData.developmentMilestone" 
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
              v-model:value="formData.grossMotorSkills" 
              placeholder="Bé bò, ngồi, vỗ, dũng" 
              size="large"
            >
              <a-select-option v-for="opt in grossMotorSkillsOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <!-- Vận động tĩnh -->
          <a-form-item label="Vận động tĩnh" name="fineMotorSkills">
            <a-select 
              v-model:value="formData.fineMotorSkills" 
              placeholder="Bé bò, ngồi, vỗ, dũng" 
              size="large"
            >
              <a-select-option v-for="opt in fineMotorSkillsOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <!-- Thị giác và nhận thức -->
          <a-form-item label="Thị giác và nhận thức" name="visualCognition">
            <a-select 
              v-model:value="formData.visualCognition" 
              placeholder="Bé bò, ngồi, vỗ, dũng" 
              size="large"
            >
              <a-select-option v-for="opt in visualCognitionOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <!-- Giao tiếp và cảm xúc -->
          <a-form-item label="Giao tiếp và cảm xúc" name="communicationEmotion">
            <a-select 
              v-model:value="formData.communicationEmotion" 
              placeholder="Bé bò, ngồi, vỗ, dũng" 
              size="large"
            >
              <a-select-option v-for="opt in communicationEmotionOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <!-- Dấu hiệu cảnh báo sớm -->
          <a-form-item label="Dấu hiệu cảnh báo sớm" name="earlyWarning">
            <a-select 
              v-model:value="formData.earlyWarning" 
              placeholder="Bé bò, ngồi, vỗ, dũng" 
              size="large"
            >
              <a-select-option v-for="opt in earlyWarningOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </div>
      </a-form>
    </a-modal>

    <!-- View Modal -->
    <a-modal
      v-model:open="viewModalVisible"
      title="Chi tiết Sổ SKĐT"
      :width="800"
      :footer="null"
    >
      <a-descriptions :column="2" bordered v-if="viewingHealthBook">
        <a-descriptions-item label="Tên">{{ viewingHealthBook.name || 'N/A' }}</a-descriptions-item>
        <a-descriptions-item label="Email">{{ viewingHealthBook.customerEmail || 'N/A' }}</a-descriptions-item>
        <a-descriptions-item label="Ngày sinh">{{ formatDate(viewingHealthBook.dob) }}</a-descriptions-item>
        <a-descriptions-item label="Giới tính">
          {{ viewingHealthBook.gender === 'male' ? 'Nam' : viewingHealthBook.gender === 'female' ? 'Nữ' : viewingHealthBook.gender || 'N/A' }}
        </a-descriptions-item>
        <a-descriptions-item label="Cân nặng">{{ viewingHealthBook.weight || 'N/A' }}</a-descriptions-item>
        <a-descriptions-item label="Chiều cao">{{ viewingHealthBook.height || 'N/A' }}</a-descriptions-item>
        <a-descriptions-item label="Ngày tạo">{{ formatDate(viewingHealthBook.createdAt) }}</a-descriptions-item>
        <a-descriptions-item label="Cập nhật">{{ formatDate(viewingHealthBook.updatedAt) }}</a-descriptions-item>
        <a-descriptions-item label="Ghi chú" :span="2">{{ viewingHealthBook.note || 'N/A' }}</a-descriptions-item>
      </a-descriptions>
    </a-modal>

    <!-- Vaccination Schedule Modal -->
    <a-modal
      v-model:open="vaccinationModalVisible"
      title="Lịch tiêm chủng"
      :width="900"
      :footer="null"
      @cancel="closeVaccinationModal"
    >
      <div v-if="currentHealthBook" class="vaccination-modal-content">
        <div class="vaccination-header">
          <h3>{{ currentHealthBook.name || 'Chưa có tên' }}</h3>
          <p class="vaccination-subtitle">Quản lý lịch tiêm chủng</p>
        </div>

        <a-spin :spinning="vaccinationLoading">
          <div v-if="vaccinationSchedule.length === 0" class="empty-vaccination">
            <a-empty description="Chưa có lịch tiêm nào" />
          </div>
          
          <div v-else class="vaccination-list">
            <a-table
              :columns="vaccinationColumns"
              :data-source="vaccinationSchedule"
              :pagination="false"
              row-key="_id"
              size="small"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'vaccineName'">
                  <div class="vaccine-name-cell">
                    <strong>{{ record.title || record.name || 'N/A' }}</strong>
                    <div class="vaccine-age" v-if="record.age">
                      {{ record.age }}
                    </div>
                  </div>
                </template>
                
                <template v-else-if="column.key === 'status'">
                  <a-tag 
                    :color="getVaccinationStatusColor(record.injectionStatus || record.vaccinationRecord?.status || 'pending')"
                  >
                    {{ getVaccinationStatusLabel(record.injectionStatus || record.vaccinationRecord?.status || 'pending') }}
                  </a-tag>
                </template>
                
                <template v-else-if="column.key === 'scheduledDate'">
                  {{ record.scheduledDate ? formatDate(record.scheduledDate) : 'Chưa có' }}
                </template>
                
                <template v-else-if="column.key === 'injectionDate'">
                  {{ record.injectionDate || record.vaccinationRecord?.injectionDate ? formatDate(record.injectionDate || record.vaccinationRecord?.injectionDate) : 'Chưa tiêm' }}
                </template>
                
                <template v-else-if="column.key === 'actions'">
                  <a-space>
                    <a-button 
                      type="link" 
                      size="small"
                      @click="viewVaccinationDetail(record)"
                    >
                      <EyeOutlined /> Xem
                    </a-button>
                    <a-button 
                      type="link" 
                      size="small"
                      @click="editVaccination(record)"
                    >
                      <EditOutlined /> Sửa
                    </a-button>
                    <a-button 
                      v-if="!record.vaccinationRecord || record.vaccinationRecord.status !== 'completed'"
                      type="link" 
                      size="small"
                      @click="markAsCompleted(record)"
                    >
                      <CheckCircleOutlined /> Tick
                    </a-button>
                    <a-popconfirm
                      v-if="record.vaccinationRecord"
                      title="Bạn có chắc muốn xóa bản ghi tiêm này?"
                      ok-text="Xóa"
                      cancel-text="Hủy"
                      ok-type="danger"
                      @confirm="deleteVaccinationRecord(record)"
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
        </a-spin>
      </div>
    </a-modal>

    <!-- Vaccination Detail/Edit Modal -->
    <a-modal
      v-model:open="vaccinationFormVisible"
      :title="editingVaccination ? 'Chỉnh sửa bản ghi tiêm chủng' : 'Chi tiết bản ghi tiêm chủng'"
      width="700px"
      :confirm-loading="vaccinationLoading"
      @ok="handleVaccinationFormOk"
      @cancel="handleVaccinationFormCancel"
    >
      <div v-if="editingVaccination" class="vaccination-form">
        <a-form
          :model="vaccinationFormData"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
          layout="horizontal"
        >
          <a-form-item label="Tên vaccine">
            <a-input 
              :value="editingVaccination.title || editingVaccination.name || 'N/A'" 
              disabled
            />
          </a-form-item>
          
          <a-form-item label="Ngày dự kiến">
            <a-date-picker
              v-model:value="vaccinationFormData.scheduledDate"
              format="DD/MM/YYYY"
              style="width: 100%"
              placeholder="Chọn ngày dự kiến"
            />
          </a-form-item>
          
          <a-form-item label="Ngày tiêm">
            <a-date-picker
              v-model:value="vaccinationFormData.injectionDate"
              format="DD/MM/YYYY"
              style="width: 100%"
              placeholder="Chọn ngày tiêm"
            />
          </a-form-item>
          
          <a-form-item label="Trạng thái">
            <a-select v-model:value="vaccinationFormData.status" placeholder="Chọn trạng thái">
              <a-select-option value="pending">Chờ tiêm</a-select-option>
              <a-select-option value="completed">Đã tiêm</a-select-option>
              <a-select-option value="cancelled">Đã hủy</a-select-option>
              <a-select-option value="missed">Bỏ lỡ</a-select-option>
            </a-select>
          </a-form-item>
          
          <a-form-item label="Địa điểm">
            <a-input 
              v-model:value="vaccinationFormData.location" 
              placeholder="Nhập địa điểm tiêm"
            />
          </a-form-item>
          
          <a-form-item label="Ghi chú">
            <a-textarea 
              v-model:value="vaccinationFormData.notes" 
              :rows="3"
              placeholder="Nhập ghi chú"
            />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {
  PlusOutlined,
  ReloadOutlined,
  FileTextOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import dayjs, { type Dayjs } from 'dayjs'
import { useHealthBooksApi, type HealthBook } from '~/composables/api/useHealthBooksApi'
import { useCustomersApi, type Customer } from '~/composables/api/useCustomersApi'
import { useVaccinationRecordsApi, type VaccinationScheduleItem } from '~/composables/api/useVaccinationRecordsApi'
import { debounce } from 'lodash-es'

definePageMeta({
  layout: 'default',
  middleware: ['auth'],
})

useHead({
  title: 'Quản lý Sổ SKĐT - Vạn Phúc Care Admin'
})

const healthBooksApi = useHealthBooksApi()
const customersApi = useCustomersApi()
const vaccinationRecordsApi = useVaccinationRecordsApi()

// State
const loading = ref(false)
const healthBooks = ref<HealthBook[]>([])
const stats = reactive({
  total: 0,
})

// Search & Filter
const searchQuery = ref('')
const filterDate = ref<Dayjs | null>(null)

// Pagination
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})

// Modal
const modalVisible = ref(false)
const modalLoading = ref(false)
const modalTitle = computed(() => editingHealthBook.value ? 'Sửa Sổ SKĐT' : 'Tạo Sổ SKĐT mới')
const editingHealthBook = ref<HealthBook | null>(null)
const formRef = ref()

// View modal
const viewModalVisible = ref(false)
const viewingHealthBook = ref<HealthBook | null>(null)

// Vaccination modal
const vaccinationModalVisible = ref(false)
const currentHealthBook = ref<HealthBook | null>(null)
const vaccinationSchedule = ref<VaccinationScheduleItem[]>([])
const vaccinationLoading = ref(false)
const editingVaccination = ref<VaccinationScheduleItem | null>(null)
const vaccinationFormVisible = ref(false)

// Form data - Cập nhật với tất cả các field từ CRM form
const formData = reactive({
  customerEmail: '',
  recordedAt: dayjs() as Dayjs | null,
  temperature: null as number | null,
  height: null as number | null,
  weight: null as number | null,
  skinCondition: '',
  skinConditionNote: '',
  oralHealth: '',
  oralHealthNote: '',
  nutrition: '',
  nutritionNote: '',
  sleep: '',
  sleepNote: '',
  stoolFrequency: '',
  stoolCondition: '',
  digestiveIssues: '',
  schedule: '',
  note: '',
  developmentMilestone: '',
  grossMotorSkills: '',
  fineMotorSkills: '',
  visualCognition: '',
  communicationEmotion: '',
  earlyWarning: '',
})

// Form rules
const formRules = {
  customerEmail: [
    { required: true, message: 'Vui lòng chọn khách hàng', trigger: 'change' }
  ],
  recordedAt: [
    { required: true, message: 'Vui lòng chọn ngày', trigger: 'change' }
  ],
}

// Health record options - Copy từ CRM form
const skinConditionOptions = [
  { label: 'Da bé bình thường', value: 'normal' },
  { label: 'Da khô', value: 'dry' },
  { label: 'Nổi mẩn đỏ', value: 'rash' },
  { label: 'Chàm sữa', value: 'eczema' },
  { label: 'Khác', value: 'other' },
]

const skinConditionNoteOptions = [
  { label: 'Da bé bình thường', value: 'normal' },
  { label: 'Cần theo dõi', value: 'monitor' },
  { label: 'Đang điều trị', value: 'treating' },
  { label: 'Khác', value: 'other' },
]

const oralHealthOptions = Array.from({ length: 21 }, (_, i) => ({
  label: `${i} răng`,
  value: `${i}_teeth`
}))

const oralHealthNoteOptions = Array.from({ length: 21 }, (_, i) => ({
  label: `${i} răng`,
  value: `${i}_teeth`
}))

const nutritionOptions = [
  { label: 'Sữa mẹ', value: 'breast_milk' },
  { label: 'Sữa công thức', value: 'formula' },
  { label: 'Ăn dặm', value: 'solid_food' },
  { label: 'Sữa mẹ + Sữa công thức', value: 'breast_milk_formula' },
  { label: 'Ăn dặm + Sữa công thức', value: 'solid_food_formula' },
  { label: 'Ăn dặm + Sữa mẹ', value: 'solid_food_breast_milk' },
  { label: 'Ăn dặm + Sữa mẹ + Sữa công thức', value: 'solid_food_breast_milk_formula' },
]

const nutritionNoteOptions = [
  { label: 'Ăn bình thường', value: 'normal' },
  { label: 'Ăn ít', value: 'eat_less' },
  { label: 'Ăn nhiều', value: 'eat_more' },
  { label: 'Chán ăn', value: 'loss_appetite' },
  { label: 'Bỏ ăn', value: 'refuse_eat' },
]

const sleepOptions = [
  { label: '1 cữ ngủ/ngày', value: '1_nap' },
  { label: '2 cữ ngủ/ngày', value: '2_naps' },
  { label: '3 cữ ngủ/ngày', value: '3_naps' },
  { label: '4 cữ ngủ/ngày', value: '4_naps' },
  { label: '5 cữ ngủ/ngày', value: '5_naps' },
  { label: '6 cữ ngủ/ngày', value: '6_naps' },
]

const sleepNoteOptions = [
  { label: 'Ngủ vặt', value: 'short_naps' },
  { label: 'Ngủ khó vào giấc', value: 'hard_to_sleep' },
  { label: 'Không chuyển giấc được', value: 'cant_transition' },
  { label: 'Ngủ hay giật mình', value: 'startled_sleep' },
  { label: 'Ngủ li bì', value: 'drowsy' },
  { label: 'Ngủ đủ giấc', value: 'enough_sleep' },
]

const stoolFrequencyOptions = [
  { label: '0 lần/ngày', value: '0_per_day' },
  { label: '1-2 lần/ngày', value: '1-2_per_day' },
  { label: '3-4 lần/ngày', value: '3-4_per_day' },
  { label: '5+ lần/ngày', value: '5+_per_day' },
]

const stoolConditionOptions = [
  { label: 'Cứng, đặc', value: 'hard' },
  { label: 'Mềm, bình thường', value: 'normal' },
  { label: 'Lỏng', value: 'loose' },
  { label: 'Nước', value: 'watery' },
]

const digestiveIssuesOptions = [
  { label: 'Không có', value: 'none' },
  { label: 'Bị táo bón nhẹ', value: 'mild_constipation' },
  { label: 'Táo bón', value: 'constipation' },
  { label: 'Tiêu chảy', value: 'diarrhea' },
  { label: 'Trào ngược', value: 'reflux' },
  { label: 'Đầy hơi', value: 'bloating' },
  { label: 'Khác', value: 'other' },
]

const scheduleOptions = [
  { label: 'EASY 3', value: 'easy_3' },
  { label: 'EASY 3.5', value: 'easy_3_5' },
  { label: 'EASY 4', value: 'easy_4' },
  { label: 'EASY 2-3-4', value: 'easy_2_3_4' },
  { label: 'EASY 5-6', value: 'easy_5_6' },
  { label: 'Khác', value: 'other' },
]

const developmentMilestoneOptions = [
  { label: '0-2 tháng', value: '0-2_months' },
  { label: '3-5 tháng', value: '3-5_months' },
  { label: '7-9 tháng', value: '7-9_months' },
  { label: '10-12 tháng', value: '10-12_months' },
  { label: '13-18 tháng', value: '13-18_months' },
  { label: '19-24 tháng', value: '19-24_months' },
]

const grossMotorSkillsOptions = [
  { label: 'Bé bò, ngồi, vỗ, dũng', value: 'crawling_sitting' },
  { label: 'Đi được', value: 'walking' },
  { label: 'Chạy được', value: 'running' },
  { label: 'Leo trèo được', value: 'climbing' },
  { label: 'Chậm phát triển', value: 'delayed' },
  { label: 'Khác', value: 'other' },
]

const fineMotorSkillsOptions = [
  { label: 'Bé bò, ngồi, vỗ, dũng', value: 'basic' },
  { label: 'Cầm nắm tốt', value: 'grasping' },
  { label: 'Sử dụng ngón tay', value: 'finger_use' },
  { label: 'Vẽ, viết', value: 'drawing_writing' },
  { label: 'Chậm phát triển', value: 'delayed' },
  { label: 'Khác', value: 'other' },
]

const visualCognitionOptions = [
  { label: 'Bé bò, ngồi, vỗ, dũng', value: 'basic' },
  { label: 'Nhận biết màu sắc', value: 'color_recognition' },
  { label: 'Nhận biết hình dạng', value: 'shape_recognition' },
  { label: 'Giải quyết vấn đề đơn giản', value: 'problem_solving' },
  { label: 'Chậm phát triển', value: 'delayed' },
  { label: 'Khác', value: 'other' },
]

const communicationEmotionOptions = [
  { label: 'Bé bò, ngồi, vỗ, dũng', value: 'basic' },
  { label: 'Nói được từ đơn', value: 'single_words' },
  { label: 'Nói câu ngắn', value: 'short_sentences' },
  { label: 'Giao tiếp tốt', value: 'good_communication' },
  { label: 'Chậm nói', value: 'speech_delay' },
  { label: 'Khác', value: 'other' },
]

const earlyWarningOptions = [
  { label: 'Bé bò, ngồi, vỗ, dũng', value: 'none' },
  { label: 'Không có', value: 'no_warning' },
  { label: 'Chậm phát triển vận động', value: 'motor_delay' },
  { label: 'Chậm phát triển ngôn ngữ', value: 'language_delay' },
  { label: 'Vấn đề về thị giác', value: 'vision_issue' },
  { label: 'Vấn đề về thính giác', value: 'hearing_issue' },
  { label: 'Khác', value: 'other' },
]

// Customer search
const customerSearchLoading = ref(false)
const customerSearchResults = ref<Customer[]>([]) // Đảm bảo luôn là array
const selectedCustomer = ref<Customer | null>(null)

// Computed để format options cho a-select
const customerSelectOptions = computed(() => {
  return customerSearchResults.value.map((customer: any) => {
    const name = customer.fullname || `${customer.firstname || ''} ${customer.lastname || ''}`.trim()
    return {
      label: name,
      value: customer.email,
      email: customer.email,
      customer: customer
    }
  })
})

// Table columns - Điều chỉnh theo dữ liệu thực tế
const columns = [
  {
    title: 'Ảnh',
    key: 'avatar',
    dataIndex: 'avatar',
    width: 80,
  },
  {
    title: 'Tên',
    key: 'name',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: 'Ngày sinh',
    key: 'dob',
    dataIndex: 'dob',
    width: 120,
  },
  {
    title: 'Giới tính',
    key: 'gender',
    dataIndex: 'gender',
    width: 100,
  },
  {
    title: 'Ngày tạo',
    key: 'createdAt',
    dataIndex: 'createdAt',
    width: 150,
  },
  {
    title: 'Cập nhật',
    key: 'updatedAt',
    dataIndex: 'updatedAt',
    width: 150,
  },
  {
    title: 'Thao tác',
    key: 'actions',
    width: 150,
    fixed: 'right',
  },
]

// Pagination config
const paginationConfig = computed(() => ({
  current: pagination.current,
  pageSize: pagination.pageSize,
  total: pagination.total,
  showSizeChanger: true,
  showTotal: (total: number) => `Tổng ${total} sổ SKĐT` as any,
  pageSizeOptions: ['10', '20', '50', '100'],
}))

// Fetch data
const fetchHealthBooks = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.current,
      limit: pagination.pageSize,
    }
    
    if (searchQuery.value) {
      params.searchKey = searchQuery.value
    }
    
    // Gửi createdAt thay vì date để filter theo ngày tạo
    if (filterDate.value) {
      // Format: YYYY-MM-DD để backend dễ xử lý
      params.createdAt = filterDate.value.format('YYYY-MM-DD')
    }

    const response = await healthBooksApi.getHealthBooks(params)
    
    if (response.status) {
      const responseData = response.data
      
      let healthBooksData = []
      let paginationData = { total: 0, page: 1, limit: 10 }
      
      if (responseData?.healthBooks) {
        healthBooksData = responseData.healthBooks
        paginationData = responseData.pagination || paginationData
      } else if (responseData?.data?.healthBooks) {
        healthBooksData = responseData.data.healthBooks
        paginationData = responseData.data.pagination || paginationData
      } else if (Array.isArray(responseData)) {
        healthBooksData = responseData
      } else if (responseData?.data && Array.isArray(responseData.data)) {
        healthBooksData = responseData.data
      }
      
      healthBooks.value = healthBooksData
      pagination.total = paginationData.total || 0
      stats.total = paginationData.total || 0
    } else {
      message.error(response.message || 'Không thể tải danh sách sổ SKĐT')
    }
  } catch (error: any) {
    message.error('Không thể tải danh sách sổ SKĐT')
  } finally {
    loading.value = false
  }
}

// Search handler
const handleSearch = () => {
  pagination.current = 1
  fetchHealthBooks()
}

// Filter handler
const handleFilter = () => {
  pagination.current = 1
  fetchHealthBooks()
}

// Table change handler
const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchHealthBooks()
}

// Refresh data
const refreshData = () => {
  searchQuery.value = ''
  filterDate.value = null
  pagination.current = 1
  fetchHealthBooks()
}

// Customer search handler
const handleCustomerSearch = debounce(async (searchValue: string) => {
  if (!searchValue || searchValue.length < 2) {
    customerSearchResults.value = []
    return
  }
  
  customerSearchLoading.value = true
  try {
    const params = {
      searchKey: searchValue,
      limit: 20,
      page: 1
    }
    
    
    const response = await customersApi.getCustomers(params)
    
    
    if (response.status && response.data) {
      // Xử lý nhiều cấu trúc response có thể
      let customers: Customer[] = []
      
      
      // Trường hợp 1: { data: { data: [], pagination: {} } } - Đây là format từ sendSuccess
      if (response.data.data) {
        if (Array.isArray(response.data.data)) {
          customers = response.data.data
        } 
        // Trường hợp 1b: { data: { data: { data: [], pagination: {} } } } - nested
        else if (response.data.data && typeof response.data.data === 'object') {
          
          if (response.data.data.data && Array.isArray(response.data.data.data)) {
            customers = response.data.data.data
          }
          // Trường hợp 1c: { data: { data: { customers: [] } } }
          else if (response.data.data.customers && Array.isArray(response.data.data.customers)) {
            customers = response.data.data.customers
          }
        }
      }
      // Trường hợp 2: { data: { items: [], pagination: {} } }
      else if (response.data.items && Array.isArray(response.data.items)) {
        customers = response.data.items
      }
      // Trường hợp 3: { data: [] } - data là array trực tiếp
      else if (Array.isArray(response.data)) {
        customers = response.data
      }
      // Trường hợp 4: { data: { customers: [] } }
      else if (response.data.customers && Array.isArray(response.data.customers)) {
        customers = response.data.customers
      }
      
      
      // Normalize customers để đảm bảo có firstname/lastname
      customers = customers.map((customer: any) => {
        // Nếu có fullname nhưng không có firstname/lastname, tách ra
        if (customer.fullname && (!customer.firstname || !customer.lastname)) {
          const nameParts = customer.fullname.trim().split(/\s+/)
          return {
            ...customer,
            firstname: nameParts[0] || '',
            lastname: nameParts.slice(1).join(' ') || '',
          }
        }
        // Nếu có firstname/lastname nhưng không có fullname, tạo fullname
        if ((customer.firstname || customer.lastname) && !customer.fullname) {
          return {
            ...customer,
            fullname: `${customer.firstname || ''} ${customer.lastname || ''}`.trim(),
          }
        }
        return customer
      })
      
      
      // Đảm bảo customers luôn là array
      customerSearchResults.value = Array.isArray(customers) ? customers : []
      
      // Force update để đảm bảo Vue detect thay đổi
      await nextTick()
    } else {
      customerSearchResults.value = []
    }
  } catch (error) {
    customerSearchResults.value = []
  } finally {
    customerSearchLoading.value = false
  }
}, 300)

// Customer select handler - Thêm kiểm tra an toàn
const handleCustomerSelect = (email: string) => {
  if (!email || !Array.isArray(customerSearchResults.value)) {
    selectedCustomer.value = null
    return
  }
  
  const customer = customerSearchResults.value.find(c => c && c.email === email)
  if (customer) {
    selectedCustomer.value = customer
  } else {
    selectedCustomer.value = null
  }
}

// Disabled future dates
const disabledDate = (current: Dayjs) => {
  return current && current > dayjs().endOf('day')
}

// Show create modal
const showCreateModal = () => {
  editingHealthBook.value = null
  selectedCustomer.value = null
  customerSearchResults.value = []
  Object.assign(formData, {
    customerEmail: '',
    recordedAt: dayjs(),
    temperature: null,
    height: null,
    weight: null,
    skinCondition: '',
    skinConditionNote: '',
    oralHealth: '',
    oralHealthNote: '',
    nutrition: '',
    nutritionNote: '',
    sleep: '',
    sleepNote: '',
    stoolFrequency: '',
    stoolCondition: '',
    digestiveIssues: '',
    schedule: '',
    note: '',
    developmentMilestone: '',
    grossMotorSkills: '',
    fineMotorSkills: '',
    visualCognition: '',
    communicationEmotion: '',
    earlyWarning: '',
  })
  modalVisible.value = true
}

// Edit health book
const editHealthBook = async (healthBook: HealthBook) => {
  editingHealthBook.value = healthBook
  try {
    const response = await healthBooksApi.getHealthBook(healthBook._id!)
    if (response.status && response.data) {
      const data = response.data.data || response.data
      Object.assign(formData, {
        customerEmail: data.customerEmail || '',
        recordedAt: data.recordedAt ? dayjs(data.recordedAt) : dayjs(),
        temperature: data.temperature || null,
        height: data.height || null,
        weight: data.weight || null,
        skinCondition: data.skinConditions || '',
        skinConditionNote: data.skinConditionNote || '',
        tooth: {
          count: formData.oralHealth,
          descriptions: formData.oralHealthNote,
        },
        nutrition: {
          count: formData.nutrition,
          descriptions: formData.nutritionNote,
        },
        sleep: {
          time: formData.sleep,
          descriptions: formData.sleepNote,
        },
        frequencyOfDefecation: formData.stoolFrequency,
        fecalCondition: formData.stoolCondition,
        digestiveProblems: formData.digestiveIssues,
        method: {
          status: formData.schedule,
          descriptions: formData.note,
        },
        exerciseAndSkills: formData.grossMotorSkills,
        note: formData.note,
        // Thêm các field phát triển nếu backend hỗ trợ
      })
    }
  } catch (error) {
    message.error('Không thể tải thông tin sổ SKĐT')
  }
  modalVisible.value = true
}

// View health book
const viewHealthBook = async (healthBook: HealthBook) => {
  viewingHealthBook.value = null
  try {
    const response = await healthBooksApi.getHealthBook(healthBook._id!)
    if (response.status && response.data) {
      viewingHealthBook.value = response.data.data || response.data
    }
  } catch (error) {
    message.error('Không thể tải thông tin sổ SKĐT')
  }
  viewModalVisible.value = true
}

// Delete health book
const deleteHealthBook = async (healthBook: HealthBook) => {
  try {
    const response = await healthBooksApi.deleteHealthBook(healthBook._id!)
    if (response.status) {
      message.success('Xóa sổ SKĐT thành công')
      fetchHealthBooks()
    }
  } catch (error: any) {
    message.error('Không thể xóa sổ SKĐT')
  }
}

// Modal OK handler - Cập nhật để gửi đầy đủ dữ liệu
const handleModalOk = async () => {
  try {
    await formRef.value?.validate()
    modalLoading.value = true

    const data: any = {
      customerEmail: formData.customerEmail,
      recordedAt: formData.recordedAt ? formData.recordedAt.format('DD/MM/YYYY') : dayjs().format('DD/MM/YYYY'),
      temperature: formData.temperature,
      height: formData.height,
      weight: formData.weight,
      skinConditions: formData.skinCondition,
      skinConditionNote: formData.skinConditionNote,
      tooth: {
        count: formData.oralHealth,
        descriptions: formData.oralHealthNote,
      },
      nutrition: {
        count: formData.nutrition,
        descriptions: formData.nutritionNote,
      },
      sleep: {
        time: formData.sleep,
        descriptions: formData.sleepNote,
      },
      frequencyOfDefecation: formData.stoolFrequency,
      fecalCondition: formData.stoolCondition,
      digestiveProblems: formData.digestiveIssues,
      method: {
        status: formData.schedule,
        descriptions: formData.note,
      },
      exerciseAndSkills: formData.grossMotorSkills,
      note: formData.note,
      // Thêm các field phát triển nếu backend hỗ trợ
    }
    
    if (editingHealthBook.value) {
      const response = await healthBooksApi.updateHealthBook(editingHealthBook.value._id!, data)
      if (response.status) {
        message.success('Cập nhật sổ SKĐT thành công')
        modalVisible.value = false
        fetchHealthBooks()
      }
    } else {
      const response = await healthBooksApi.createHealthBook(data)
      if (response.status) {
        message.success('Tạo sổ SKĐT thành công')
        modalVisible.value = false
        fetchHealthBooks()
      }
    }
  } catch (error: any) {
    if (error?.errorFields) {
      message.error('Vui lòng điền đầy đủ thông tin')
    } else {
      message.error('Không thể lưu sổ SKĐT')
    }
  } finally {
    modalLoading.value = false
  }
}

// Modal cancel handler
const handleModalCancel = () => {
  modalVisible.value = false
  editingHealthBook.value = null
}

// Format functions
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('vi-VN').format(num)
}

const formatDate = (date: string | Date | undefined) => {
  if (!date) return 'N/A'
  try {
    // Nếu là format YYYY-MM-DD, format lại
    if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dayjs(date).format('DD/MM/YYYY')
    }
    return dayjs(date).format('DD/MM/YYYY')
  } catch {
    return date.toString()
  }
}

// Vaccination columns
const vaccinationColumns = [
  {
    title: 'Tên vaccine',
    key: 'vaccineName',
    dataIndex: 'title',
    width: 200,
  },
  {
    title: 'Trạng thái',
    key: 'status',
    width: 120,
  },
  {
    title: 'Ngày dự kiến',
    key: 'scheduledDate',
    width: 150,
  },
  {
    title: 'Ngày tiêm',
    key: 'injectionDate',
    width: 150,
  },
  {
    title: 'Thao tác',
    key: 'actions',
    width: 250,
    fixed: 'right',
  },
]

// Vaccination form data
const vaccinationFormData = reactive({
  scheduledDate: null as Dayjs | null,
  injectionDate: null as Dayjs | null,
  status: 'pending' as 'pending' | 'completed' | 'cancelled' | 'missed',
  location: '',
  notes: '',
})

// Open vaccination modal
const openVaccinationModal = async (healthBook: HealthBook) => {
  currentHealthBook.value = healthBook
  vaccinationModalVisible.value = true
  await loadVaccinationSchedule(healthBook._id!)
}

// Close vaccination modal
const closeVaccinationModal = () => {
  vaccinationModalVisible.value = false
  currentHealthBook.value = null
  vaccinationSchedule.value = []
}

// Load vaccination schedule
const loadVaccinationSchedule = async (healthBookId: string) => {
  vaccinationLoading.value = true
  try {
    const response = await vaccinationRecordsApi.getVaccinationSchedule({ healthBookId })
    if (response.status && response.data) {
      const scheduleData = response.data as any
      vaccinationSchedule.value = scheduleData.scheduleVaccin || scheduleData.data?.scheduleVaccin || scheduleData || []
    } else {
      vaccinationSchedule.value = []
    }
  } catch (error: any) {
    message.error('Không thể tải lịch tiêm chủng')
    vaccinationSchedule.value = []
  } finally {
    vaccinationLoading.value = false
  }
}

// View vaccination detail
const viewVaccinationDetail = (record: VaccinationScheduleItem) => {
  editingVaccination.value = record
  if (record.vaccinationRecord) {
    vaccinationFormData.scheduledDate = record.vaccinationRecord.scheduledDate 
      ? dayjs(record.vaccinationRecord.scheduledDate) 
      : null
    vaccinationFormData.injectionDate = record.vaccinationRecord.injectionDate 
      ? dayjs(record.vaccinationRecord.injectionDate) 
      : null
    vaccinationFormData.status = (record.vaccinationRecord.status || 'pending') as any
    vaccinationFormData.location = record.vaccinationRecord.location || ''
    vaccinationFormData.notes = record.vaccinationRecord.notes || ''
  } else {
    vaccinationFormData.scheduledDate = record.scheduledDate ? dayjs(record.scheduledDate) : null
    vaccinationFormData.injectionDate = null
    vaccinationFormData.status = 'pending'
    vaccinationFormData.location = record.location || ''
    vaccinationFormData.notes = record.notes || ''
  }
  vaccinationFormVisible.value = true
}

// Edit vaccination
const editVaccination = (record: VaccinationScheduleItem) => {
  viewVaccinationDetail(record)
}

// Mark as completed (tick)
const markAsCompleted = async (record: VaccinationScheduleItem) => {
  if (!currentHealthBook.value) return
  
  vaccinationLoading.value = true
  try {
    const data = {
      healthBookId: currentHealthBook.value._id,
      vaccineId: record._id,
      scheduledDate: record.scheduledDate || new Date().toISOString(),
      injectionDate: new Date().toISOString(),
      status: 'completed' as const,
      injectionNumber: 1,
    }
    
    const response = await vaccinationRecordsApi.createVaccinationRecord(data)
    if (response.status) {
      message.success('Đã đánh dấu đã tiêm thành công')
      await loadVaccinationSchedule(currentHealthBook.value._id!)
    }
  } catch (error: any) {
    message.error('Không thể đánh dấu đã tiêm')
  } finally {
    vaccinationLoading.value = false
  }
}

// Delete vaccination record
const deleteVaccinationRecord = async (record: VaccinationScheduleItem) => {
  if (!record.vaccinationRecord?._id || !currentHealthBook.value) return
  
  vaccinationLoading.value = true
  try {
    const response = await vaccinationRecordsApi.deleteVaccinationRecord(record.vaccinationRecord._id)
    if (response.status) {
      message.success('Đã xóa bản ghi tiêm chủng thành công')
      await loadVaccinationSchedule(currentHealthBook.value._id!)
    }
  } catch (error: any) {
    message.error('Không thể xóa bản ghi tiêm chủng')
  } finally {
    vaccinationLoading.value = false
  }
}

// Handle vaccination form OK
const handleVaccinationFormOk = async () => {
  if (!editingVaccination.value || !currentHealthBook.value) return
  
  vaccinationLoading.value = true
  try {
    if (editingVaccination.value.vaccinationRecord?._id) {
      // Update existing record
      const data: any = {
        status: vaccinationFormData.status,
        location: vaccinationFormData.location,
        notes: vaccinationFormData.notes,
      }
      if (vaccinationFormData.scheduledDate) {
        data.scheduledDate = vaccinationFormData.scheduledDate.toISOString()
      }
      if (vaccinationFormData.injectionDate) {
        data.injectionDate = vaccinationFormData.injectionDate.toISOString()
      }
      
      const response = await vaccinationRecordsApi.updateVaccinationRecord(
        editingVaccination.value.vaccinationRecord._id,
        data
      )
      
      if (response.status) {
        message.success('Đã cập nhật bản ghi tiêm chủng thành công')
        vaccinationFormVisible.value = false
        await loadVaccinationSchedule(currentHealthBook.value._id!)
      }
    } else {
      // Create new record
      const data: any = {
        healthBookId: currentHealthBook.value._id,
        vaccineId: editingVaccination.value._id,
        status: vaccinationFormData.status,
        location: vaccinationFormData.location,
        notes: vaccinationFormData.notes,
        injectionNumber: 1,
      }
      if (vaccinationFormData.scheduledDate) {
        data.scheduledDate = vaccinationFormData.scheduledDate.toISOString()
      }
      if (vaccinationFormData.injectionDate) {
        data.injectionDate = vaccinationFormData.injectionDate.toISOString()
      }
      
      const response = await vaccinationRecordsApi.createVaccinationRecord(data)
      if (response.status) {
        message.success('Đã tạo bản ghi tiêm chủng thành công')
        vaccinationFormVisible.value = false
        await loadVaccinationSchedule(currentHealthBook.value._id!)
      }
    }
  } catch (error: any) {
    message.error('Không thể lưu bản ghi tiêm chủng')
  } finally {
    vaccinationLoading.value = false
  }
}

// Handle vaccination form cancel
const handleVaccinationFormCancel = () => {
  vaccinationFormVisible.value = false
  editingVaccination.value = null
  Object.assign(vaccinationFormData, {
    scheduledDate: null,
    injectionDate: null,
    status: 'pending',
    location: '',
    notes: '',
  })
}

// Get vaccination status color
const getVaccinationStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    completed: 'green',
    pending: 'orange',
    cancelled: 'red',
    missed: 'default',
  }
  return colors[status] || 'default'
}

// Get vaccination status label
const getVaccinationStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    completed: 'Đã tiêm',
    pending: 'Chờ tiêm',
    cancelled: 'Đã hủy',
    missed: 'Bỏ lỡ',
  }
  return labels[status] || status
}

// Lifecycle
onMounted(() => {
  fetchHealthBooks()
})
</script>

<style scoped>
.so-skdt-management-page {
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 8px;
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

.stat-card-blue {
  border-left: 4px solid #1890ff;
}

.stat-icon {
  font-size: 32px;
  color: #1890ff;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0 0 4px 0;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.filters-card {
  margin-bottom: 24px;
}

.filters-container {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.table-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.healthbook-info {
  display: flex;
  flex-direction: column;
}

.healthbook-name {
  font-weight: 500;
  color: #1a1a1a;
}

.healthbook-id {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
}

/* Desktop Table */
.desktop-table {
  display: block;
}

/* Mobile Cards */
.mobile-cards {
  display: none;
}

.mobile-healthbook-card {
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.mobile-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.mobile-card-title-section {
  flex: 1;
  min-width: 0;
}

.mobile-healthbook-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
  word-break: break-word;
}

.mobile-healthbook-id {
  font-size: 12px;
  color: #8c8c8c;
}

.mobile-card-body {
  margin-bottom: 16px;
}

.mobile-card-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
}

.mobile-card-row:last-child {
  border-bottom: none;
}

.mobile-label {
  font-size: 14px;
  color: #8c8c8c;
  font-weight: 500;
  min-width: 100px;
}

.mobile-value {
  font-size: 14px;
  color: #1a1a1a;
  text-align: right;
  flex: 1;
  word-break: break-word;
}

.mobile-pagination {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  padding: 16px 0;
}

/* Responsive */
@media (max-width: 1023px) {
  .desktop-table {
    display: none;
  }

  .mobile-cards {
    display: block;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .filters-container {
    flex-direction: column;
  }

  .filters-container > * {
    width: 100% !important;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 1024px) {
  .mobile-cards {
    display: none;
  }
}

/* Customer option styling */
.customer-option {
  display: flex;
  flex-direction: column;
}

.customer-name {
  font-weight: 500;
  color: #1a1a1a;
}

.customer-email {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 2px;
}

/* Form sections - Copy từ CRM */
.health-form {
  max-height: 80vh;
  overflow-y: auto;
  padding: 0 8px;
}

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

.form-section {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 14px;
  padding: 20px 24px;
  margin-bottom: 16px;
}

.section-1 {
  min-height: 200px;
}

.section-2 {
  min-height: 500px;
}

.section-3 {
  min-height: 200px;
}

.section-4 {
  min-height: 550px;
}

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

:deep(.ant-select-selector) {
  height: 40px !important;
}

:deep(.ant-select-selection-item) {
  line-height: 38px !important;
}

@media (max-width: 640px) {
  .grid-cols-3 {
    grid-template-columns: 1fr;
  }
  
  .form-section {
    padding: 16px;
    border-radius: 10px;
  }
}

/* Vaccination Modal Styles */
.vaccination-modal-content {
  padding: 8px 0;
}

.vaccination-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
}

.vaccination-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.vaccination-subtitle {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0;
}

.empty-vaccination {
  padding: 40px 0;
  text-align: center;
}

.vaccination-list {
  margin-top: 16px;
}

.vaccine-name-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.vaccine-name-cell strong {
  font-size: 14px;
  color: #1a1a1a;
}

.vaccine-age {
  font-size: 12px;
  color: #8c8c8c;
}

.vaccination-form {
  padding: 8px 0;
}
</style>
