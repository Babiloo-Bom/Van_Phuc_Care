<template>
  <div class="services-orders-management-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Quản lý Dịch vụ và Đơn hàng khoá học</h1>
        <p class="page-subtitle">Quản lý dịch vụ và đơn hàng khoá học</p>
      </div>
      <div class="header-actions">
        <a-button @click="refreshData" :loading="loading">
          <template #icon>
            <ReloadOutlined />
          </template>
          Làm mới
        </a-button>
      </div>
    </div>

    <!-- Tabs -->
    <a-tabs v-model:activeKey="activeTab" @change="handleTabChange" class="management-tabs">
      <!-- Leads Tab -->
      <a-tab-pane key="leads" tab="Quản lý khách hàng đăng ký dịch vụ">
        <!-- Leads Statistics -->
        <a-card class="stats-card" :bordered="false" style="margin-bottom: 16px">
          <a-row :gutter="16">
            <a-col :xs="24" :sm="12" :md="6">
              <div class="stat-item">
                <div class="stat-value">{{ leadStats.total || 0 }}</div>
                <div class="stat-label">Tổng số Lead</div>
              </div>
            </a-col>
            <a-col :xs="24" :sm="12" :md="6">
              <div class="stat-item stat-new">
                <div class="stat-value">{{ leadStats.new || 0 }}</div>
                <div class="stat-label">Mới</div>
              </div>
            </a-col>
            <a-col :xs="24" :sm="12" :md="6">
              <div class="stat-item stat-contacted">
                <div class="stat-value">{{ leadStats.contacted || 0 }}</div>
                <div class="stat-label">Đã liên hệ</div>
              </div>
            </a-col>
            <a-col :xs="24" :sm="12" :md="6">
              <div class="stat-item stat-crm">
                <div class="stat-value">{{ leadStats.inCrm || 0 }}</div>
                <div class="stat-label">Đã vào CRM</div>
              </div>
            </a-col>
          </a-row>
        </a-card>

        <!-- Leads Filters -->
        <a-card class="filters-card" :bordered="false">
          <div class="filters-container">
            <a-input-search
              v-model:value="leadSearchQuery"
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              style="width: 300px"
              allow-clear
              @search="handleLeadSearch"
              @pressEnter="handleLeadSearch"
            />
            <a-select
              v-model:value="leadStatusFilter"
              placeholder="Trạng thái Lead"
              style="width: 200px"
              allow-clear
              @change="handleLeadFilter"
            >
              <a-select-option value="new">Mới</a-select-option>
              <a-select-option value="contacted">Đã liên hệ</a-select-option>
              <a-select-option value="in_crm">Đã vào CRM</a-select-option>
            </a-select>
            <a-select
              v-model:value="leadServiceFilter"
              placeholder="Dịch vụ"
              style="width: 200px"
              allow-clear
              show-search
              :filter-option="(input: string, option: any) => {
                const label = option?.label || option?.children || ''
                return String(label).toLowerCase().includes(input.toLowerCase())
              }"
              @change="handleLeadFilter"
            >
              <a-select-option 
                v-for="service in services" 
                :key="service._id" 
                :value="service._id"
                :label="service.title"
              >
                {{ service.title }}
              </a-select-option>
            </a-select>
          </div>
        </a-card>

        <!-- Leads Table -->
        <a-card class="table-card" :bordered="false">
          <a-table
            :columns="leadColumns"
            :data-source="leads"
            :loading="loading"
            :pagination="leadPagination"
            :scroll="{ x: 1400 }"
            @change="handleLeadTableChange"
            class="desktop-table"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'customer'">
                <div>
                  <div class="font-medium">{{ getLeadCustomerName(record) || 'N/A' }}</div>
                  <div class="text-xs text-gray-500">{{ getLeadCustomerEmail(record) || '' }}</div>
                  <div class="text-xs text-gray-500">{{ getLeadCustomerPhone(record) || '' }}</div>
                </div>
              </template>
              <template v-else-if="column.key === 'service'">
                <div v-if="record.service">
                  <div class="font-medium">{{ record.service.title }}</div>
                </div>
                <span v-else class="text-gray-400">N/A</span>
              </template>
              <template v-else-if="column.key === 'leadStatus'">
                <a-tag :color="getLeadStatusColor(record.leadStatus)">
                  {{ getLeadStatusText(record.leadStatus) }}
                </a-tag>
              </template>
              <template v-else-if="column.key === 'status'">
                <a-tag :color="record.status === 'registered' ? 'green' : record.status === 'cancelled' ? 'red' : 'default'">
                  {{ record.status === 'registered' ? 'Đã đăng ký' : record.status === 'cancelled' ? 'Đã hủy' : 'Hoàn thành' }}
                </a-tag>
              </template>
              <template v-else-if="column.key === 'address'">
                <span>{{ getLeadAddress(record) || 'N/A' }}</span>
              </template>
              <template v-else-if="column.key === 'actions'">
                <a-space>
                  <a-button type="link" size="small" @click="handleViewLead(record)">
                    <EyeOutlined /> Xem
                  </a-button>
                  <a-dropdown>
                    <template #overlay>
                      <a-menu @click="(e: any) => handleLeadStatusChange(record, e.key)">
                        <a-menu-item key="new">Đánh dấu: Mới</a-menu-item>
                        <a-menu-item key="contacted">Đánh dấu: Đã liên hệ</a-menu-item>
                        <a-menu-item key="in_crm">Đánh dấu: Đã vào CRM</a-menu-item>
                        <a-menu-divider />
                        <a-menu-item key="delete" danger>Xóa</a-menu-item>
                      </a-menu>
                    </template>
                    <a-button type="link" size="small">
                      Thao tác <DownOutlined />
                    </a-button>
                  </a-dropdown>
                </a-space>
              </template>
            </template>
          </a-table>

          <!-- Mobile Cards for Leads -->
          <div class="mobile-cards">
            <a-card
              v-for="item in leads"
              :key="item._id"
              class="mobile-card"
              :bordered="false"
            >
              <div class="card-header">
                <div class="card-title-row">
                  <h3 class="card-title">{{ item.customerName || 'N/A' }}</h3>
                  <a-tag :color="getLeadStatusColor(item.leadStatus)">
                    {{ getLeadStatusText(item.leadStatus) }}
                  </a-tag>
                </div>
              </div>
              
              <div class="card-content">
                <div class="card-row">
                  <span class="card-label">Họ tên:</span>
                  <span>{{ getLeadCustomerName(item) || 'N/A' }}</span>
                </div>
                <div class="card-row">
                  <span class="card-label">Email:</span>
                  <span>{{ getLeadCustomerEmail(item) || 'N/A' }}</span>
                </div>
                <div class="card-row">
                  <span class="card-label">Số điện thoại:</span>
                  <span>{{ getLeadCustomerPhone(item) || 'N/A' }}</span>
                </div>
                <div class="card-row" v-if="item.service">
                  <span class="card-label">Dịch vụ:</span>
                  <span>{{ item.service.title }}</span>
                </div>
                <div class="card-row" v-if="getLeadAddress(item)">
                  <span class="card-label">Địa chỉ:</span>
                  <span>{{ getLeadAddress(item) }}</span>
                </div>
                <div class="card-row" v-if="item.notes">
                  <span class="card-label">Ghi chú:</span>
                  <span>{{ item.notes }}</span>
                </div>
                <div class="card-row" v-if="item.createdAt">
                  <span class="card-label">Ngày đăng ký:</span>
                  <span>{{ formatDate(item.createdAt) }}</span>
                </div>
              </div>

              <div class="card-actions">
                <a-button type="link" size="small" @click="handleViewLead(item)">
                  <EyeOutlined /> Xem
                </a-button>
                <a-dropdown>
                  <template #overlay>
                    <a-menu @click="(e: any) => handleLeadStatusChange(item, e.key)">
                      <a-menu-item key="new">Đánh dấu: Mới</a-menu-item>
                      <a-menu-item key="contacted">Đánh dấu: Đã liên hệ</a-menu-item>
                      <a-menu-item key="in_crm">Đánh dấu: Đã vào CRM</a-menu-item>
                      <a-menu-divider />
                      <a-menu-item key="delete" danger>Xóa</a-menu-item>
                    </a-menu>
                  </template>
                  <a-button type="link" size="small">
                    Thao tác <DownOutlined />
                  </a-button>
                </a-dropdown>
              </div>
            </a-card>
          </div>
        </a-card>
      </a-tab-pane>

      <!-- Services Tab -->
      <a-tab-pane key="services" tab="Dịch vụ">
        <!-- Services Header with Create Button -->
        <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
          <h2 style="margin: 0; font-size: 18px; font-weight: 600;">Danh sách dịch vụ</h2>
          <a-button type="primary" @click="handleCreateService">
            <template #icon>
              <PlusOutlined />
            </template>
            Tạo dịch vụ mới
          </a-button>
        </div>

        <!-- Services Filters -->
        <a-card class="filters-card" :bordered="false">
          <div class="filters-container">
            <a-input-search
              v-model:value="serviceSearchQuery"
              placeholder="Tìm kiếm theo tên dịch vụ..."
              style="width: 300px"
              allow-clear
              @search="handleServiceSearch"
              @pressEnter="handleServiceSearch"
            />
            <a-select
              v-model:value="serviceStatusFilter"
              placeholder="Trạng thái"
              style="width: 200px"
              allow-clear
              @change="handleServiceFilter"
            >
              <a-select-option value="active">Hoạt động</a-select-option>
              <a-select-option value="inactive">Không hoạt động</a-select-option>
            </a-select>
          </div>
        </a-card>

        <!-- Services Table -->
        <a-card class="table-card" :bordered="false">
          <a-table
            :columns="serviceColumns"
            :data-source="services"
            :loading="loading"
            :pagination="servicePagination"
            :scroll="{ x: 1200 }"
            @change="handleServiceTableChange"
            class="desktop-table"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'thumbnail'">
                <a-image
                  v-if="record.thumbnail"
                  :src="record.thumbnail"
                  :width="60"
                  :height="60"
                  :preview="false"
                  style="object-fit: cover; border-radius: 4px;"
                />
                <span v-else class="text-gray-400">Không có ảnh</span>
              </template>
              <template v-else-if="column.key === 'status'">
                <a-tag :color="record.status === 'active' ? 'green' : 'red'">
                  {{ record.status === 'active' ? 'Hoạt động' : 'Không hoạt động' }}
                </a-tag>
              </template>
              <template v-else-if="column.key === 'createdAt'">
                <span>{{ formatDate(record.createdAt) }}</span>
              </template>
              <template v-else-if="column.key === 'actions'">
                <a-space>
                  <a-button type="link" size="small" @click="handleEditService(record)">
                    <EditOutlined /> Sửa
                  </a-button>
                  <a-popconfirm
                    title="Bạn có chắc chắn muốn xóa dịch vụ này?"
                    ok-text="Xóa"
                    cancel-text="Hủy"
                    @confirm="handleDeleteService(record._id)"
                  >
                    <a-button type="link" size="small" danger>
                      <DeleteOutlined /> Xóa
                    </a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </template>
          </a-table>

          <!-- Mobile Cards for Services -->
          <div class="mobile-cards">
            <a-card
              v-for="item in services"
              :key="item._id"
              class="mobile-card"
              :bordered="false"
            >
              <div class="card-header">
                <div class="card-title-row">
                  <h3 class="card-title">{{ item.title || 'Không có tiêu đề' }}</h3>
                  <a-tag :color="item.status === 'active' ? 'green' : 'red'">
                    {{ item.status === 'active' ? 'Hoạt động' : 'Không hoạt động' }}
                  </a-tag>
                </div>
              </div>
              
              <div class="card-content">
                <div class="card-row" v-if="item.thumbnail">
                  <span class="card-label">Ảnh:</span>
                  <a-image
                    :src="item.thumbnail"
                    :width="80"
                    :height="80"
                    :preview="false"
                    style="object-fit: cover; border-radius: 4px;"
                  />
                </div>
                <div class="card-row" v-if="item.shortDescriptions">
                  <span class="card-label">Mô tả ngắn:</span>
                  <span class="card-content-text">{{ item.shortDescriptions }}</span>
                </div>
                <div class="card-row" v-if="item.slug">
                  <span class="card-label">Slug:</span>
                  <span>{{ item.slug }}</span>
                </div>
                <div class="card-row" v-if="item.reviews !== undefined">
                  <span class="card-label">Đánh giá:</span>
                  <span>{{ item.reviews }}</span>
                </div>
                <div class="card-row" v-if="item.createdAt">
                  <span class="card-label">Ngày tạo:</span>
                  <span>{{ formatDate(item.createdAt) }}</span>
                </div>
              </div>

              <div class="card-actions">
                <a-button type="link" size="small" @click="handleEditService(item)">
                  <EditOutlined /> Sửa
                </a-button>
                <a-popconfirm
                  title="Bạn có chắc chắn muốn xóa dịch vụ này?"
                  ok-text="Xóa"
                  cancel-text="Hủy"
                  @confirm="handleDeleteService(item._id)"
                >
                  <a-button type="link" size="small" danger>
                    <DeleteOutlined /> Xóa
                  </a-button>
                </a-popconfirm>
              </div>
            </a-card>
          </div>
        </a-card>
      </a-tab-pane>

      <!-- Course Orders Tab -->
      <a-tab-pane key="orders" tab="Đơn hàng khoá học">
        <!-- Orders Filters -->
        <a-card class="filters-card" :bordered="false">
          <div class="filters-container">
            <a-input-search
              v-model:value="orderSearchQuery"
              placeholder="Tìm kiếm theo mã đơn, tên khách hàng, email..."
              style="width: 300px"
              allow-clear
              @search="handleOrderSearch"
              @pressEnter="handleOrderSearch"
            />
            <a-select
              v-model:value="orderStatusFilter"
              placeholder="Trạng thái đơn hàng"
              style="width: 200px"
              allow-clear
              @change="handleOrderFilter"
            >
              <a-select-option value="pending">Đang chờ</a-select-option>
              <a-select-option value="processing">Đang xử lý</a-select-option>
              <a-select-option value="completed">Hoàn thành</a-select-option>
              <a-select-option value="cancelled">Đã hủy</a-select-option>
              <a-select-option value="refunded">Đã hoàn tiền</a-select-option>
            </a-select>
            <a-select
              v-model:value="orderPaymentStatusFilter"
              placeholder="Trạng thái thanh toán"
              style="width: 200px"
              allow-clear
              @change="handleOrderFilter"
            >
              <a-select-option value="pending">Chưa thanh toán</a-select-option>
              <a-select-option value="completed">Đã thanh toán</a-select-option>
              <a-select-option value="failed">Thanh toán thất bại</a-select-option>
              <a-select-option value="cancelled">Đã hủy</a-select-option>
            </a-select>
          </div>
        </a-card>

        <!-- Orders Table -->
        <a-card class="table-card" :bordered="false">
          <a-table
            :columns="orderColumns"
            :data-source="courseOrders"
            :loading="loading"
            :pagination="orderPagination"
            :scroll="{ x: 1400 }"
            @change="handleOrderTableChange"
            class="desktop-table"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'orderId'">
                <a-typography-text strong>{{ record.orderId }}</a-typography-text>
              </template>
              <template v-else-if="column.key === 'customer'">
                <div>
                  <div class="font-medium">{{ record.customerInfo?.fullName || 'N/A' }}</div>
                  <div class="text-xs text-gray-500">{{ record.customerInfo?.email || '' }}</div>
                  <div class="text-xs text-gray-500">{{ record.customerInfo?.phone || '' }}</div>
                </div>
              </template>
              <template v-else-if="column.key === 'items'">
                <div v-for="(item, index) in record.items" :key="index" class="mb-1">
                  <a-typography-text>{{ item.course?.title || item.course?.name || 'Khóa học' }}</a-typography-text>
                  <div class="text-xs text-gray-500">{{ formatCurrency(item.price) }}</div>
                </div>
              </template>
              <template v-else-if="column.key === 'totalAmount'">
                <a-typography-text strong class="text-green-600">
                  {{ formatCurrency(record.totalAmount) }}
                </a-typography-text>
              </template>
              <template v-else-if="column.key === 'paymentMethod'">
                <a-tag>{{ getPaymentMethodText(record.paymentMethod) }}</a-tag>
              </template>
              <template v-else-if="column.key === 'paymentStatus'">
                <a-tag :color="getPaymentStatusColor(record.paymentStatus)">
                  {{ getPaymentStatusText(record.paymentStatus) }}
                </a-tag>
              </template>
              <template v-else-if="column.key === 'status'">
                <a-tag :color="getOrderStatusColor(record.status)">
                  {{ getOrderStatusText(record.status) }}
                </a-tag>
              </template>
              <template v-else-if="column.key === 'actions'">
                <a-space>
                  <a-button type="link" size="small" @click="handleViewOrder(record)">
                    <EyeOutlined /> Xem
                  </a-button>
                  <a-button type="link" size="small" @click="handleEditOrder(record)">
                    <EditOutlined /> Sửa
                  </a-button>
                </a-space>
              </template>
            </template>
          </a-table>

          <!-- Mobile Cards for Orders -->
          <div class="mobile-cards">
            <a-card
              v-for="item in courseOrders"
              :key="item._id"
              class="mobile-card"
              :bordered="false"
            >
              <div class="card-header">
                <div class="card-title-row">
                  <h3 class="card-title">{{ item.orderId }}</h3>
                  <a-tag :color="getOrderStatusColor(item.status)">
                    {{ getOrderStatusText(item.status) }}
                  </a-tag>
                </div>
              </div>
              
              <div class="card-content">
                <div class="card-row">
                  <span class="card-label">Khách hàng:</span>
                  <div>
                    <div class="font-medium">{{ item.customerInfo?.fullName || 'N/A' }}</div>
                    <div class="text-xs text-gray-500">{{ item.customerInfo?.email || '' }}</div>
                    <div class="text-xs text-gray-500">{{ item.customerInfo?.phone || '' }}</div>
                  </div>
                </div>
                <div class="card-row" v-if="item.items && item.items.length > 0">
                  <span class="card-label">Khóa học:</span>
                  <div>
                    <div v-for="(orderItem, idx) in item.items" :key="idx" class="mb-1">
                      <div>{{ orderItem.course?.title || orderItem.course?.name || 'Khóa học' }}</div>
                      <div class="text-xs text-gray-500">{{ formatCurrency(orderItem.price) }}</div>
                    </div>
                  </div>
                </div>
                <div class="card-row">
                  <span class="card-label">Tổng tiền:</span>
                  <span class="font-medium text-green-600">{{ formatCurrency(item.totalAmount) }}</span>
                </div>
                <div class="card-row">
                  <span class="card-label">Phương thức thanh toán:</span>
                  <span>{{ getPaymentMethodText(item.paymentMethod) }}</span>
                </div>
                <div class="card-row">
                  <span class="card-label">Trạng thái thanh toán:</span>
                  <a-tag :color="getPaymentStatusColor(item.paymentStatus)">
                    {{ getPaymentStatusText(item.paymentStatus) }}
                  </a-tag>
                </div>
                <div class="card-row" v-if="item.createdAt">
                  <span class="card-label">Ngày tạo:</span>
                  <span>{{ formatDate(item.createdAt) }}</span>
                </div>
              </div>

              <div class="card-actions">
                <a-button type="link" size="small" @click="handleViewOrder(item)">
                  <EyeOutlined /> Xem
                </a-button>
                <a-button type="link" size="small" @click="handleEditOrder(item)">
                  <EditOutlined /> Sửa
                </a-button>
              </div>
            </a-card>
          </div>
        </a-card>
      </a-tab-pane>
    </a-tabs>

    <!-- Service Create/Edit Modal -->
    <a-modal
      v-model:open="serviceModalVisible"
      :title="serviceModalMode === 'create' ? 'Tạo dịch vụ mới' : 'Chỉnh sửa dịch vụ'"
      :width="800"
      @ok="handleServiceModalOk"
      @cancel="handleServiceModalCancel"
    >
      <a-form :model="serviceFormData" layout="vertical">
        <a-form-item label="Tên dịch vụ" required>
          <a-input 
            v-model:value="serviceFormData.title" 
            placeholder="Nhập tên dịch vụ"
            @blur="generateServiceSlug"
          />
        </a-form-item>
        <a-form-item label="Slug" required>
          <a-input 
            v-model:value="serviceFormData.slug" 
            placeholder="Slug sẽ được tạo tự động từ tên dịch vụ"
          />
        </a-form-item>
        <a-form-item label="Mô tả ngắn">
          <a-textarea
            v-model:value="serviceFormData.shortDescriptions"
            placeholder="Nhập mô tả ngắn"
            :rows="3"
          />
        </a-form-item>
        <a-form-item label="Mô tả đầy đủ">
          <a-textarea
            v-model:value="serviceFormData.descriptions"
            placeholder="Nhập mô tả đầy đủ"
            :rows="5"
          />
        </a-form-item>
        <a-form-item label="Ảnh đại diện">
          <a-upload
            v-model:file-list="serviceThumbnailFileList"
            list-type="picture-card"
            :max-count="1"
            :before-upload="beforeServiceUpload"
            @change="handleServiceThumbnailChange"
            @remove="handleRemoveServiceThumbnail"
          >
            <div v-if="serviceThumbnailFileList.length < 1">
              <PlusOutlined />
              <div style="margin-top: 8px">Upload</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item label="Link dịch vụ">
          <a-input v-model:value="serviceFormData.link" placeholder="Nhập link dịch vụ (nếu có)" />
        </a-form-item>
        <a-form-item label="Trạng thái">
          <a-select v-model:value="serviceFormData.status" placeholder="Chọn trạng thái">
            <a-select-option value="active">Hoạt động</a-select-option>
            <a-select-option value="inactive">Không hoạt động</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Order View/Edit Modal -->
    <a-modal
      v-model:open="orderModalVisible"
      :title="orderModalMode === 'view' ? 'Chi tiết đơn hàng' : 'Chỉnh sửa đơn hàng'"
      :width="900"
      @ok="handleOrderModalOk"
      @cancel="handleOrderModalCancel"
    >
      <a-form :model="orderFormData" layout="vertical" v-if="orderFormData">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Mã đơn hàng">
              <a-input :value="orderFormData?.orderId" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Trạng thái đơn hàng">
              <a-select v-model:value="orderFormData.status" placeholder="Chọn trạng thái">
                <a-select-option value="pending">Đang chờ</a-select-option>
                <a-select-option value="processing">Đang xử lý</a-select-option>
                <a-select-option value="completed">Hoàn thành</a-select-option>
                <a-select-option value="cancelled">Đã hủy</a-select-option>
                <a-select-option value="refunded">Đã hoàn tiền</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Trạng thái thanh toán">
              <a-select v-model:value="orderFormData.paymentStatus" placeholder="Chọn trạng thái thanh toán">
                <a-select-option value="pending">Chưa thanh toán</a-select-option>
                <a-select-option value="completed">Đã thanh toán</a-select-option>
                <a-select-option value="failed">Thanh toán thất bại</a-select-option>
                <a-select-option value="cancelled">Đã hủy</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Phương thức thanh toán">
              <a-input :value="orderFormData?.paymentMethod" disabled />
            </a-form-item>
          </a-col>
        </a-row>
        <a-divider>Thông tin khách hàng</a-divider>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Họ tên">
              <a-input :value="orderFormData?.customerInfo?.fullName" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Email">
              <a-input :value="orderFormData?.customerInfo?.email" disabled />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Số điện thoại">
              <a-input :value="orderFormData?.customerInfo?.phone" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Địa chỉ">
              <a-input :value="orderFormData?.customerInfo?.address" disabled />
            </a-form-item>
          </a-col>
        </a-row>
        <a-divider>Khóa học</a-divider>
        <div v-for="(item, index) in orderFormData.items" :key="index" class="mb-4 p-4 border border-gray-200 rounded">
          <div class="font-medium mb-2">{{ item.course?.title || item.course?.name || 'Khóa học' }}</div>
          <div class="text-sm text-gray-500">Giá: {{ formatCurrency(item.price) }}</div>
        </div>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="Tổng phụ">
              <a-input-number :value="orderFormData?.subtotal" disabled style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Giảm giá">
              <a-input-number :value="orderFormData?.discount?.amount" disabled style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Tổng tiền">
              <a-input-number :value="orderFormData?.totalAmount" disabled style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="Ghi chú">
          <a-textarea
            v-model:value="orderFormData.notes"
            placeholder="Nhập ghi chú"
            :rows="3"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Lead View Modal -->
    <a-modal
      v-model:open="leadModalVisible"
      title="Chi tiết khách hàng đăng ký"
      :width="700"
      @cancel="leadModalVisible = false"
      :footer="null"
    >
      <div v-if="leadFormData" class="lead-detail">
        <a-descriptions :column="1" bordered>
          <a-descriptions-item label="Họ tên">
            {{ getLeadCustomerName(leadFormData) || 'N/A' }}
          </a-descriptions-item>
          <a-descriptions-item label="Email">
            {{ getLeadCustomerEmail(leadFormData) || 'N/A' }}
          </a-descriptions-item>
          <a-descriptions-item label="Số điện thoại">
            {{ getLeadCustomerPhone(leadFormData) || 'N/A' }}
          </a-descriptions-item>
          <a-descriptions-item label="Dịch vụ">
            {{ leadFormData.service?.title || 'N/A' }}
          </a-descriptions-item>
          <a-descriptions-item label="Địa chỉ">
            {{ getLeadAddress(leadFormData) || 'N/A' }}
          </a-descriptions-item>
          <a-descriptions-item label="Trạng thái Lead">
            <a-tag :color="getLeadStatusColor(leadFormData.leadStatus)">
              {{ getLeadStatusText(leadFormData.leadStatus) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Trạng thái đăng ký">
            <a-tag :color="leadFormData.status === 'registered' ? 'green' : leadFormData.status === 'cancelled' ? 'red' : 'default'">
              {{ leadFormData.status === 'registered' ? 'Đã đăng ký' : leadFormData.status === 'cancelled' ? 'Đã hủy' : 'Hoàn thành' }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Ghi chú">
            {{ leadFormData.notes || 'N/A' }}
          </a-descriptions-item>
          <a-descriptions-item label="Ngày đăng ký">
            {{ formatDate(leadFormData.createdAt) }}
          </a-descriptions-item>
        </a-descriptions>
        
        <div style="margin-top: 24px; text-align: right">
          <a-space>
            <a-button @click="handleLeadStatusChange(leadFormData, 'new')">
              Đánh dấu: Mới
            </a-button>
            <a-button @click="handleLeadStatusChange(leadFormData, 'contacted')">
              Đánh dấu: Đã liên hệ
            </a-button>
            <a-button type="primary" @click="handleLeadStatusChange(leadFormData, 'in_crm')">
              Đánh dấu: Đã vào CRM
            </a-button>
          </a-space>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {
  PlusOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { Service } from '~/composables/api/useServicesApi'
import type { Order } from '~/composables/api/useOrdersApi'
import type { Lead } from '~/composables/api/useLeadsApi'
import { useServicesApi } from '~/composables/api/useServicesApi'
import { useOrdersApi } from '~/composables/api/useOrdersApi'
import { useLeadsApi } from '~/composables/api/useLeadsApi'
import { useUploadsApi } from '~/composables/api/useUploadsApi'
import type { UploadFile } from 'ant-design-vue'
import dayjs from 'dayjs'

definePageMeta({
  layout: 'default',
  middleware: ['auth', 'role'],
  requiredRole: ['admin', 'manager']
})

const servicesApi = useServicesApi()
const ordersApi = useOrdersApi()
const leadsApi = useLeadsApi()
const uploadsApi = useUploadsApi()

// Tab management
const activeTab = ref<string>('leads')

// Services state
const services = ref<Service[]>([])
const loading = ref(false)
const serviceSearchQuery = ref('')
const serviceStatusFilter = ref<string | undefined>()
const serviceModalVisible = ref(false)
const serviceModalMode = ref<'create' | 'edit'>('create')
const serviceFormData = ref<Partial<Service>>({
  title: '',
  slug: '',
  shortDescriptions: '',
  descriptions: '',
  thumbnail: '',
  link: '',
  status: 'active'
})
const serviceThumbnailFileList = ref<UploadFile[]>([])
const serviceUploading = ref(false)
const servicePagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `Tổng ${total} dịch vụ`
})

// Course Orders state
const courseOrders = ref<Order[]>([])
const orderSearchQuery = ref('')
const orderStatusFilter = ref<string | undefined>()
const orderPaymentStatusFilter = ref<string | undefined>()
const orderModalVisible = ref(false)
const orderModalMode = ref<'view' | 'edit'>('view')
const orderFormData = ref<Order | null>(null)
const orderPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `Tổng ${total} đơn hàng`
})

// Leads state
const leads = ref<Lead[]>([])
const leadSearchQuery = ref('')
const leadStatusFilter = ref<string | undefined>()
const leadServiceFilter = ref<string | undefined>()
const leadStats = ref({ total: 0, new: 0, contacted: 0, inCrm: 0 })
const leadModalVisible = ref(false)
const leadFormData = ref<Lead | null>(null)
const leadPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `Tổng ${total} khách hàng đăng ký`
})

// Service columns
const serviceColumns = [
  {
    title: 'Ảnh',
    key: 'thumbnail',
    width: 100,
    fixed: 'left'
  },
  {
    title: 'Tên dịch vụ',
    dataIndex: 'title',
    key: 'title',
    width: 200
  },
  {
    title: 'Slug',
    dataIndex: 'slug',
    key: 'slug',
    width: 200
  },
  {
    title: 'Mô tả ngắn',
    dataIndex: 'shortDescriptions',
    key: 'shortDescriptions',
    width: 250,
    ellipsis: true
  },
  {
    title: 'Đánh giá',
    dataIndex: 'reviews',
    key: 'reviews',
    width: 100
  },
  {
    title: 'Trạng thái',
    key: 'status',
    width: 120
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 150
  },
  {
    title: 'Thao tác',
    key: 'actions',
    width: 150,
    fixed: 'right'
  }
]

// Lead columns
const leadColumns = [
  {
    title: 'Khách hàng',
    key: 'customer',
    width: 200,
    fixed: 'left'
  },
  {
    title: 'Dịch vụ',
    key: 'service',
    width: 200
  },
  {
    title: 'Trạng thái Lead',
    key: 'leadStatus',
    width: 150
  },
  {
    title: 'Trạng thái đăng ký',
    key: 'status',
    width: 150
  },
  {
    title: 'Địa chỉ',
    dataIndex: 'address',
    key: 'address',
    width: 200,
    ellipsis: true
  },
  {
    title: 'Ghi chú',
    dataIndex: 'notes',
    key: 'notes',
    width: 200,
    ellipsis: true
  },
  {
    title: 'Ngày đăng ký',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 150
  },
  {
    title: 'Thao tác',
    key: 'actions',
    width: 150,
    fixed: 'right'
  }
]

// Order columns
const orderColumns = [
  {
    title: 'Mã đơn',
    key: 'orderId',
    width: 150,
    fixed: 'left'
  },
  {
    title: 'Khách hàng',
    key: 'customer',
    width: 200
  },
  {
    title: 'Khóa học',
    key: 'items',
    width: 250
  },
  {
    title: 'Tổng tiền',
    key: 'totalAmount',
    width: 150
  },
  {
    title: 'Phương thức thanh toán',
    key: 'paymentMethod',
    width: 150
  },
  {
    title: 'Trạng thái thanh toán',
    key: 'paymentStatus',
    width: 150
  },
  {
    title: 'Trạng thái đơn hàng',
    key: 'status',
    width: 150
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 150
  },
  {
    title: 'Thao tác',
    key: 'actions',
    width: 150,
    fixed: 'right'
  }
]

// Fetch services
const fetchServices = async () => {
  loading.value = true
  try {
    const params: any = {
      page: servicePagination.current,
      limit: servicePagination.pageSize
    }
    if (serviceSearchQuery.value) {
      params.searchKey = serviceSearchQuery.value
    }
    // Note: Status filter will be applied on frontend since backend doesn't support it in query params

    const response = await servicesApi.getServices(params)
    
    if (response.status) {
      const responseData = (response as any).data?.data || (response as any).data || response
      let allServices = responseData.data || []
      
      // Apply status filter on frontend
      if (serviceStatusFilter.value) {
        allServices = allServices.filter((s: Service) => s.status === serviceStatusFilter.value)
      }
      
      services.value = allServices
      servicePagination.total = serviceStatusFilter.value 
        ? allServices.length 
        : (responseData.pagination?.total || 0)
    }
  } catch (error) {
    message.error('Không thể tải danh sách dịch vụ')
  } finally {
    loading.value = false
  }
}

// Fetch course orders
const fetchCourseOrders = async () => {
  loading.value = true
  try {
    const params: any = {
      page: orderPagination.current,
      limit: orderPagination.pageSize
    }
    if (orderSearchQuery.value) {
      params.search = orderSearchQuery.value
    }
    if (orderStatusFilter.value) {
      params.status = orderStatusFilter.value
    }
    if (orderPaymentStatusFilter.value) {
      params.paymentStatus = orderPaymentStatusFilter.value
    }

    const response = await ordersApi.getOrders(params)
    
    if (response.status) {
      const responseData = (response as any).data?.data || (response as any).data || response
      // Filter only orders with courses
      const allOrders = responseData.data || []
      courseOrders.value = allOrders.filter((order: Order) => 
        order.items && order.items.some((item: any) => item.courseId || item.course)
      )
      orderPagination.total = courseOrders.value.length
    }
  } catch (error) {
    message.error('Không thể tải danh sách đơn hàng khoá học')
  } finally {
    loading.value = false
  }
}

// Service handlers
const handleServiceSearch = () => {
  servicePagination.current = 1
  fetchServices()
}

const handleServiceFilter = () => {
  servicePagination.current = 1
  fetchServices()
}

const handleServiceTableChange = (pag: any) => {
  servicePagination.current = pag.current
  servicePagination.pageSize = pag.pageSize
  fetchServices()
}

// Generate slug from title
const generateServiceSlug = () => {
  if (serviceFormData.value.title && serviceModalMode.value === 'create') {
    // Only auto-generate when creating, not editing
    serviceFormData.value.slug = serviceFormData.value.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
}

const handleCreateService = () => {
  serviceModalMode.value = 'create'
  serviceFormData.value = {
    title: '',
    slug: '',
    shortDescriptions: '',
    descriptions: '',
    thumbnail: '',
    link: '',
    status: 'active'
  }
  serviceThumbnailFileList.value = []
  serviceModalVisible.value = true
}

const handleEditService = (record: Service) => {
  serviceModalMode.value = 'edit'
  serviceFormData.value = { ...record }
  serviceThumbnailFileList.value = record.thumbnail ? [{
    uid: '-1',
    name: 'image',
    status: 'done',
    url: record.thumbnail
  }] : []
  serviceModalVisible.value = true
}

const handleDeleteService = async (id?: string) => {
  if (!id) return
  try {
    await servicesApi.deleteServices([id])
    message.success('Xóa dịch vụ thành công')
    fetchServices()
  } catch (error) {
    message.error('Không thể xóa dịch vụ')
  }
}

const beforeServiceUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('Chỉ chấp nhận file ảnh!')
    return false
  }
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    message.error('Ảnh phải nhỏ hơn 5MB!')
    return false
  }
  return false // Prevent auto upload
}

const handleServiceThumbnailChange = async (info: any) => {
  if (info.file.status === 'uploading') {
    serviceUploading.value = true
    return
  }
  if (info.file.status === 'done' || info.file.status === 'removed') {
    serviceUploading.value = false
  }

  if (info.file.status === 'removed') {
    serviceFormData.value.thumbnail = ''
    return
  }

  const file = info.file.originFileObj || info.file
  if (!file) return

  try {
    const uploadResponse = await uploadsApi.uploadImage(file)
    
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
      }

      if (imageUrl) {
        serviceFormData.value.thumbnail = imageUrl
        serviceThumbnailFileList.value = [{
          uid: info.file.uid,
          name: info.file.name,
          status: 'done',
          url: imageUrl
        }]
        message.success('Upload ảnh thành công')
      } else {
        message.error('Không thể lấy URL ảnh từ response')
      }
    }
  } catch (error) {
    message.error('Upload ảnh thất bại')
  }
}

const handleRemoveServiceThumbnail = () => {
  serviceFormData.value.thumbnail = ''
}

const handleServiceModalOk = async () => {
  if (!serviceFormData.value.title || !serviceFormData.value.slug) {
    message.error('Vui lòng điền đầy đủ thông tin bắt buộc')
    return
  }

  try {
    if (serviceModalMode.value === 'create') {
      await servicesApi.createService(serviceFormData.value)
      message.success('Tạo dịch vụ thành công')
    } else {
      if (!serviceFormData.value._id) return
      await servicesApi.updateService(serviceFormData.value._id, serviceFormData.value)
      message.success('Cập nhật dịch vụ thành công')
    }
    serviceModalVisible.value = false
    fetchServices()
  } catch (error) {
    message.error('Không thể lưu dịch vụ')
  }
}

const handleServiceModalCancel = () => {
  serviceModalVisible.value = false
  serviceFormData.value = {
    title: '',
    slug: '',
    shortDescriptions: '',
    descriptions: '',
    thumbnail: '',
    link: '',
    status: 'active'
  }
  serviceThumbnailFileList.value = []
}

// Order handlers
const handleOrderSearch = () => {
  orderPagination.current = 1
  fetchCourseOrders()
}

const handleOrderFilter = () => {
  orderPagination.current = 1
  fetchCourseOrders()
}

const handleOrderTableChange = (pag: any) => {
  orderPagination.current = pag.current
  orderPagination.pageSize = pag.pageSize
  fetchCourseOrders()
}

const handleViewOrder = (record: Order) => {
  orderModalMode.value = 'view'
  orderFormData.value = { ...record }
  orderModalVisible.value = true
}

const handleEditOrder = (record: Order) => {
  orderModalMode.value = 'edit'
  orderFormData.value = { ...record }
  orderModalVisible.value = true
}

const handleOrderModalOk = async () => {
  if (!orderFormData.value?._id) return

  try {
    await ordersApi.updateOrderStatus(orderFormData.value._id, {
      status: orderFormData.value.status,
      paymentStatus: orderFormData.value.paymentStatus,
      notes: orderFormData.value.notes
    })
    message.success('Cập nhật đơn hàng thành công')
    orderModalVisible.value = false
    fetchCourseOrders()
  } catch (error) {
    message.error('Không thể cập nhật đơn hàng')
  }
}

const handleOrderModalCancel = () => {
  orderModalVisible.value = false
  orderFormData.value = null
}

// Fetch leads
const fetchLeads = async () => {
  loading.value = true
  try {
    const params: any = {
      page: leadPagination.current,
      limit: leadPagination.pageSize
    }
    if (leadSearchQuery.value) {
      params.search = leadSearchQuery.value
    }
    if (leadStatusFilter.value) {
      params.leadStatus = leadStatusFilter.value
    }
    if (leadServiceFilter.value) {
      params.serviceId = leadServiceFilter.value
    }

    const response = await leadsApi.getLeads(params)
    
    if (response.status && response.data) {
      const responseData = (response as any).data?.data || (response as any).data || response
      leads.value = responseData.leads || []
      leadPagination.total = responseData.pagination?.total || 0
    }
  } catch (error) {
    message.error('Không thể tải danh sách khách hàng đăng ký')
  } finally {
    loading.value = false
  }
}

// Fetch lead stats
const fetchLeadStats = async () => {
  try {
    const response = await leadsApi.getLeadStats()
    if (response.status && response.data) {
      const responseData = (response as any).data?.data || (response as any).data || response
      leadStats.value = responseData.stats || { total: 0, new: 0, contacted: 0, inCrm: 0 }
    }
  } catch (error) {
  }
}

// Lead handlers
const handleLeadSearch = () => {
  leadPagination.current = 1
  fetchLeads()
}

const handleLeadFilter = () => {
  leadPagination.current = 1
  fetchLeads()
}

const handleLeadTableChange = (pag: any) => {
  leadPagination.current = pag.current
  leadPagination.pageSize = pag.pageSize
  fetchLeads()
}

const handleViewLead = (record: Lead) => {
  leadFormData.value = { ...record }
  leadModalVisible.value = true
}

const handleLeadStatusChange = async (record: Lead, action: string) => {
  if (action === 'delete') {
    try {
      await leadsApi.deleteLead(record._id)
      message.success('Xóa khách hàng đăng ký thành công')
      fetchLeads()
      fetchLeadStats()
    } catch (error) {
      message.error('Không thể xóa khách hàng đăng ký')
    }
  } else if (['new', 'contacted', 'in_crm'].includes(action)) {
    try {
      await leadsApi.updateLeadStatus(record._id, { leadStatus: action as any })
      message.success('Cập nhật trạng thái thành công')
      fetchLeads()
      fetchLeadStats()
    } catch (error) {
      message.error('Không thể cập nhật trạng thái')
    }
  }
}

const getLeadStatusColor = (status?: string) => {
  const colors: Record<string, string> = {
    new: 'red',
    contacted: 'orange',
    in_crm: 'green'
  }
  return colors[status || ''] || 'default'
}

const getLeadStatusText = (status?: string) => {
  const texts: Record<string, string> = {
    new: 'Mới',
    contacted: 'Đã liên hệ',
    in_crm: 'Đã vào CRM'
  }
  return texts[status || ''] || status || 'N/A'
}

// Extract customer name from lead record (from customerName field or parse from notes)
const getLeadCustomerName = (record: Lead) => {
  if (record.customerName) {
    return record.customerName
  }
  
  if (record.notes) {
    // Look for "Họ tên: ..." or "Tên: ..." pattern
    const nameMatch = record.notes.match(/(?:Họ tên|Tên)[:\s]+(.+?)(?:\n|$)/i)
    if (nameMatch && nameMatch[1]) {
      return nameMatch[1].trim()
    }
  }
  
  return null
}

// Extract customer email from lead record (from customerEmail field or parse from notes)
const getLeadCustomerEmail = (record: Lead) => {
  if (record.customerEmail) {
    return record.customerEmail
  }
  
  if (record.notes) {
    // Look for "Email: ..." pattern
    const emailMatch = record.notes.match(/Email[:\s]+(.+?)(?:\n|$)/i)
    if (emailMatch && emailMatch[1]) {
      return emailMatch[1].trim()
    }
    
    // Also try to find email pattern directly
    const emailPattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g
    const emailFound = record.notes.match(emailPattern)
    if (emailFound && emailFound[0]) {
      return emailFound[0]
    }
  }
  
  return null
}

// Extract customer phone from lead record (from customerPhone field or parse from notes)
const getLeadCustomerPhone = (record: Lead) => {
  if (record.customerPhone) {
    return record.customerPhone
  }
  
  if (record.notes) {
    // Look for "SĐT: ..." or "Phone: ..." or "Số điện thoại: ..." pattern
    const phoneMatch = record.notes.match(/(?:SĐT|Phone|Số điện thoại)[:\s]+(.+?)(?:\n|$)/i)
    if (phoneMatch && phoneMatch[1]) {
      return phoneMatch[1].trim()
    }
    
    // Also try to find phone pattern directly (Vietnamese phone numbers)
    const phonePattern = /(0[3|5|7|8|9][0-9]{8}|[0-9]{10,11})/g
    const phoneFound = record.notes.match(phonePattern)
    if (phoneFound && phoneFound[0]) {
      return phoneFound[0]
    }
  }
  
  return null
}

// Extract address from lead record (from address field or parse from notes)
const getLeadAddress = (record: Lead) => {
  // First try to get from address field
  if (record.address) {
    return record.address
  }
  
  // If not, try to parse from notes
  if (record.notes) {
    // Look for "Địa chỉ: ..." pattern
    const addressMatch = record.notes.match(/Địa chỉ[:\s]+(.+?)(?:\n|$)/i)
    if (addressMatch && addressMatch[1]) {
      return addressMatch[1].trim()
    }
    
    // If no pattern match, check if notes itself looks like an address
    // (contains common address keywords)
    const addressKeywords = ['đường', 'phố', 'quận', 'huyện', 'tỉnh', 'thành phố', 'xã', 'phường']
    const hasAddressKeywords = addressKeywords.some(keyword => 
      record.notes?.toLowerCase().includes(keyword) || false
    )
    
    if (hasAddressKeywords && record.notes.length < 200) {
      // Might be just an address
      return record.notes
    }
  }
  
  return null
}

// Tab change handler
const handleTabChange = (key: string) => {
  activeTab.value = key
  if (key === 'services') {
    fetchServices()
  } else if (key === 'orders') {
    fetchCourseOrders()
  } else if (key === 'leads') {
    fetchLeads()
    fetchLeadStats()
  }
}

// Refresh data
const refreshData = () => {
  if (activeTab.value === 'services') {
    fetchServices()
  } else if (activeTab.value === 'orders') {
    fetchCourseOrders()
  } else if (activeTab.value === 'leads') {
    fetchLeads()
    fetchLeadStats()
  }
}

// Utility functions
const formatDate = (date: string | Date) => {
  if (!date) return 'N/A'
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}

const formatCurrency = (amount: number | undefined) => {
  if (!amount) return '0 ₫'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatNumber = (num: number) => {
  if (!num) return '0'
  return new Intl.NumberFormat('vi-VN').format(num)
}

const getPaymentMethodText = (method?: string) => {
  const methods: Record<string, string> = {
    vnpay: 'VNPay',
    momo: 'MoMo',
    qr: 'QR Code',
    bank_transfer: 'Chuyển khoản',
    bypass: 'Bypass'
  }
  return methods[method || ''] || method || 'N/A'
}

const getPaymentStatusColor = (status?: string) => {
  const colors: Record<string, string> = {
    pending: 'orange',
    completed: 'green',
    failed: 'red',
    cancelled: 'default'
  }
  return colors[status || ''] || 'default'
}

const getPaymentStatusText = (status?: string) => {
  const texts: Record<string, string> = {
    pending: 'Chưa thanh toán',
    completed: 'Đã thanh toán',
    failed: 'Thanh toán thất bại',
    cancelled: 'Đã hủy'
  }
  return texts[status || ''] || status || 'N/A'
}

const getOrderStatusColor = (status?: string) => {
  const colors: Record<string, string> = {
    pending: 'orange',
    processing: 'blue',
    completed: 'green',
    cancelled: 'red',
    refunded: 'purple'
  }
  return colors[status || ''] || 'default'
}

const getOrderStatusText = (status?: string) => {
  const texts: Record<string, string> = {
    pending: 'Đang chờ',
    processing: 'Đang xử lý',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
    refunded: 'Đã hoàn tiền'
  }
  return texts[status || ''] || status || 'N/A'
}

// Lifecycle
onMounted(() => {
  if (activeTab.value === 'services') {
    fetchServices()
  } else if (activeTab.value === 'orders') {
    fetchCourseOrders()
  } else if (activeTab.value === 'leads') {
    fetchLeads()
    fetchLeadStats()
  }
})
</script>

<style scoped>
.services-orders-management-page {
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.management-tabs {
  margin-top: 24px;
}

.filters-card {
  margin-bottom: 16px;
}

.filters-container {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.table-card {
  margin-top: 16px;
}

.desktop-table {
  display: block;
}

.mobile-cards {
  display: none;
}

.mobile-card {
  margin-bottom: 16px;
}

.card-header {
  margin-bottom: 16px;
}

.card-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.card-content {
  margin-bottom: 16px;
}

.card-row {
  display: flex;
  margin-bottom: 12px;
  gap: 8px;
}

.card-label {
  font-weight: 500;
  color: #6b7280;
  min-width: 120px;
}

.card-content-text {
  color: #1f2937;
  word-break: break-word;
}

.card-actions {
  display: flex;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

@media (max-width: 768px) {
  .desktop-table {
    display: none;
  }

  .mobile-cards {
    display: block;
  }

  .filters-container {
    flex-direction: column;
  }

  .filters-container > * {
    width: 100% !important;
  }

  .page-header {
    flex-direction: column;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions button {
    flex: 1;
  }
}

.stats-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.stat-item.stat-new {
  background: rgba(255, 77, 79, 0.2);
}

.stat-item.stat-contacted {
  background: rgba(255, 193, 7, 0.2);
}

.stat-item.stat-crm {
  background: rgba(82, 196, 26, 0.2);
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  color: white;
}

.stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.lead-detail {
  padding: 8px 0;
}
</style>

