<template>
    <div v-if="!loading" class="max-w-[1200px] !mx-auto w-full block p-4 pt-0 detail-order">
        <div class="flex items-center justify-start gap-3">
            <a-button type="text" class="!p-0 !w-[25px] !h-[25px] !border-0 back !bg-[transparent]" @click="$router.push('/orders')">
                <svg
                    viewBox="0 0 20 20"
                    class="m-0 w-[20px] h-[20px]"
                    focusable="false"
                    aria-hidden="true"
                ><path fill-rule="evenodd" d="M16.75 10a.75.75 0 0 1-.75.75h-9.69l2.72 2.72a.75.75 0 0 1-1.06 1.06l-4-4a.75.75 0 0 1 0-1.06l4-4a.75.75 0 0 1 1.06 1.06l-2.72 2.72h9.69a.75.75 0 0 1 .75.75Z" /></svg>
            </a-button>
            <div class="flex lg:items-center justify-between w-full lg:flex-row flex-col items-start">
                <div class="flex items-center gap-2">
                    <h4 class="m-0 sm:text-[20px] font-bold text-xl">
                        {{ form._id ? `#${form.code}` : 'Tạo đơn hàng' }}
                    </h4>
                    <span v-if="form._id">-</span>
                    <span v-if="form._id"> {{ form.createdAt | dateFormat('HH:mm dd/MM/yyyy') }}</span>
                </div>
                <div v-if="form._id" class="flex items-center gap-2">
                    <a-button class="!pl-0" type="link" @click="$router.push(`/orders/${form.code}/refund`)">
                        {{ 'Hoàn trả' }}
                    </a-button>
                    <!-- <a-button type="link">
                        {{ $t('order.create_invoice') }}
                    </a-button> -->
                    <a-button type="link">
                        {{ 'Chỉnh sửa' }}
                    </a-button>
                    <a-tooltip placement="topLeft" :title="'In phiếu đóng gói'" arrow-point-at-center>
                        <a-button
                            type="link"
                            class="group hover:!bg-[#53c66e] !rounded-full !w-[35px] !h-[35px] !p-0 transition hover:ease-in !flex items-center gap-2 justify-center"
                            @click="handleActionOrder({ key: 'printOrder'})"
                        >
                            <svg
                                class="transition-all duration-300"
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                            ><path
                                d="M7.25 7h9.5V5c0-2-.75-3-3-3h-3.5c-2.25 0-3 1-3 3v2ZM16 15v4c0 2-1 3-3 3h-2c-2 0-3-1-3-3v-4h8Z"
                                stroke="#53c66e"
                                stroke-width="1.5"
                                stroke-miterlimit="10"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            /><path
                                d="M21 10v5c0 2-1 3-3 3h-2v-3H8v3H6c-2 0-3-1-3-3v-5c0-2 1-3 3-3h12c2 0 3 1 3 3ZM17 15H7M7 11h3"
                                stroke="#53c66e"
                                stroke-width="1.5"
                                stroke-miterlimit="10"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            /></svg>
                        </a-button>
                    </a-tooltip>
                    <a-tooltip placement="topLeft" title="Lưu trữ" arrow-point-at-center>
                        <a-button
                            type="link"
                            class="ml-2 group hover:!bg-[#53c66e] !rounded-full !w-[35px] !h-[35px] !p-0 transition hover:ease-in !flex items-center gap-2 justify-center"
                            @click="handleActionOrder({ key: 'cancelOrder'})"
                        >
                            <svg
                                class="transition-all
                            duration-300"
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <path
                                    d="M19.5 10.22V19c0 2-.5 3-3 3h-9c-2.5 0-3-1-3-3v-8.78M5 2h14c2 0 3 1 3 3v2c0 2-1 3-3 3H5c-2 0-3-1-3-3V5c0-2 1-3 3-3ZM10.18 14h3.64"
                                    stroke="#53c66e"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                /></svg>
                        </a-button>
                    </a-tooltip>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-12 mt-4 gap-5">
            <div class="lg:col-span-8 col-span-12">
                <div class="card">
                    <div v-if="!form._id">
                        <SelectProducts :data="products" @submit="addProductInOrder" />
                    </div>
                    <div v-else>
                        <span v-if="order.status === 'pending'" class="inline-flex items-center gap-1.5 py-1 px-4 rounded-full text-xs font-medium bg-[#eab308] text-white">
                            {{ 'Đang chuẩn bị' }}
                        </span>
                        <span v-if="order.status === 'canceled'" class="inline-flex items-center gap-1.5 py-1 px-4 rounded-full text-xs font-medium bg-[#ff4d4f] text-white">
                            {{ 'Đã hủy' }}
                        </span>
                    </div>
                    <div v-if="form.products?.length" class="mt-4 overflow-scroll">
                        <div class="grid grid-cols-12 gap-4 min-w-[450px]">
                            <div class="lg:col-span-6 col-span-5 ">
                                <h6 class="font-bold">
                                    {{ 'Sản phẩm' }}
                                </h6>
                            </div>
                            <div class="lg:col-span-3 col-span-2">
                                <h6 class="text-center font-bold">
                                    {{ 'Số lượng' }}
                                </h6>
                            </div>
                            <div class="lg:col-span-3 col-span-5">
                                <h6 class="text-center font-bold">
                                    {{ 'Tổng tiền' }}
                                </h6>
                            </div>
                            <div class="col-span-1">
                                <h6 class="text-center font-bold" />
                            </div>
                        </div>
                        <div
                            v-for="(record) in form.products"
                            :key="record._id"
                            class="grid grid-cols-12 gap-4 py-3 items-center min-w-[450px]"
                            style="border-top: 1px solid #ebebeb"
                        >
                            <div class="lg:col-span-5 col-span-5 flex items-start gap-2">
                                <img
                                    class="w-[60px] h-[60px] rounded-md p-2"
                                    style="border: 1px solid #ced4da;"
                                    :src="record.thumbnail"
                                    alt="/"
                                >
                                <div>
                                    <h6 class="m-0">
                                        {{ record.name }}
                                    </h6>
                                    <p class="m-0">
                                        {{ Number(record.price).toLocaleString('de-DE') }} đ
                                    </p>
                                </div>
                            </div>
                            <div class="lg:col-span-3 col-span-2 flex items-center justify-center">
                                <a-input-number
                                    v-if="!form._id"
                                    v-model="record.quantity"
                                    step="1"
                                    style="width: 100px;text-align: center;"
                                    placeholder="Nhập số lượng"
                                    @change="handleNumberInput(record._id)"
                                />
                                <span v-else>{{ record.quantity }}</span>
                            </div>
                            <div class="lg:col-span-3 col-span-5">
                                <p class="m-0 text-center">
                                    {{ (parseInt(record.quantity || 1) * parseInt(record.price)).toLocaleString('de-DE') }} đ
                                </p>
                            </div>
                            <div v-if="!form._id" class="col-span-1">
                                <a-button type="text" class="!p-1 !w-[31px] flex items-center justify-center !h-[31px] !border-0 back !bg-[transparent]" @click="removeProductFromOrder(record._id)">
                                    <svg
                                        viewBox="0 0 20 20"
                                        class="!m-0 w-[23px] h-[23px]"
                                        focusable="false"
                                        aria-hidden="true"
                                    ><path fill="#8e8e8e" d="M11.5 8.25a.75.75 0 0 1 .75.75v4.25a.75.75 0 0 1-1.5 0v-4.25a.75.75 0 0 1 .75-.75Z" /><path fill="#8e8e8e" d="M9.25 9a.75.75 0 0 0-1.5 0v4.25a.75.75 0 0 0 1.5 0v-4.25Z" /><path fill="#8e8e8e" fill-rule="evenodd" d="M7.25 5.25a2.75 2.75 0 0 1 5.5 0h3a.75.75 0 0 1 0 1.5h-.75v5.45c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311c-.642.327-1.482.327-3.162.327h-.4c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311c-.327-.642-.327-1.482-.327-3.162v-5.45h-.75a.75.75 0 0 1 0-1.5h3Zm1.5 0a1.25 1.25 0 1 1 2.5 0h-2.5Zm-2.25 1.5h7v5.45c0 .865-.001 1.423-.036 1.848-.033.408-.09.559-.128.633a1.5 1.5 0 0 1-.655.655c-.074.038-.225.095-.633.128-.425.035-.983.036-1.848.036h-.4c-.865 0-1.423-.001-1.848-.036-.408-.033-.559-.09-.633-.128a1.5 1.5 0 0 1-.656-.655c-.037-.074-.094-.225-.127-.633-.035-.425-.036-.983-.036-1.848v-5.45Z" /></svg>
                                </a-button>
                            </div>
                        </div>
                        <div v-if="form.status === 'pending'" class="px-4 flex items-center justify-end">
                            <a-button
                                type="primary"
                                :loading="loadingUpdate"
                                class="!flex items-center gap-2 justify-center"
                                @click="fullfiled"
                            >
                                {{ 'Hoàn thành chuẩn bị đơn hàng' }}
                            </a-button>
                        </div>
                    </div>
                </div>
                <div class="card mt-4">
                    <div class="w-full pr-4">
                        <div class="flex items-center justify-between mb-3">
                            <h4 v-if="!form._id" class="text-[14px] m-0 font-[600]">
                                {{ 'Thanh toán' }}
                            </h4>
                            <div v-else>
                                <span v-if="form.payment?.status" class="inline-flex items-center gap-1.5 py-1 px-4 rounded-full text-xs font-medium bg-[#53c66e] text-white">
                                    {{ 'Đã thanh toán' }}
                                </span>
                                <span v-else class="inline-flex items-center gap-1.5 py-1 px-4 rounded-full text-xs font-medium bg-[#ff4d4f] text-white">
                                    {{ 'Chưa thanh toán' }}
                                </span>
                            </div>
                            <a-dropdown v-if="!form._id" placement="bottomRight">
                                <template #overlay>
                                    <a-menu @click="handleActionInforBill">
                                        <a-menu-item key="discount">
                                            {{ form.discount ? 'Chỉnh sửa giảm giá' : `${'Thêm mã giảm giá'}` }}
                                        </a-menu-item>
                                    </a-menu>
                                </template>
                                <a-button type="text" class="!p-0 !w-[23px] flex items-center justify-center !h-[23px] !border-0 back !bg-[transparent]">
                                    <svg
                                        viewBox="0 0 20 20"
                                        class="!m-0 w-[23px] h-[23px]"
                                        focusable="false"
                                        aria-hidden="true"
                                    ><path fill="#8e8e8e" fill-rule="evenodd" d="M15.655 4.344a2.695 2.695 0 0 0-3.81 0l-.599.599-.009-.009-1.06 1.06.008.01-5.88 5.88a2.75 2.75 0 0 0-.805 1.944v1.922a.75.75 0 0 0 .75.75h1.922a2.75 2.75 0 0 0 1.944-.806l7.54-7.539a2.695 2.695 0 0 0 0-3.81Zm-4.409 2.72-5.88 5.88a1.25 1.25 0 0 0-.366.884v1.172h1.172c.331 0 .65-.132.883-.366l5.88-5.88-1.689-1.69Zm2.75.629.599-.599a1.195 1.195 0 1 0-1.69-1.689l-.598.599 1.69 1.689Z" /></svg>
                                </a-button>
                            </a-dropdown>
                        </div>
                    </div>
                    <div class="rounded-sm p-3 mx-1" style="border:1px solid #e3e3e3">
                        <div class="flex items-center justify-between mb-3">
                            <p class="m-0">
                                {{ 'Tổng cộng' }}
                            </p>
                            <p class="m-0">
                                {{ totalPrice(form.products).toLocaleString('de-DE') }} đ
                            </p>
                        </div>
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex gap-[6px]">
                                <p class="m-0">
                                    {{ 'Giảm giá' }}
                                </p>
                                <p v-if="form.discount" class="m-0">
                                    - {{ form.discount.name }}
                                </p>
                            </div>
                            <p v-if="form.discount" class="m-0">
                                {{ Number(form.discount.price).toLocaleString('de-DE') }}
                                {{ form.discount.type === 'percentage' ? '%' : 'đ' }}
                            </p>
                            <p v-else class="m-0">
                                0 đ
                            </p>
                        </div>
                        <div v-if="form.refunded" class="flex items-center justify-between mb-3">
                            <p class="m-0">
                                {{ 'Hoàn tiền' }}
                            </p>
                            <p class="m-0">
                                - {{ form.refunded.reduce((a, b) => a + b.total, 0) }} đ
                            </p>
                        </div>
                        <div class="flex items-center justify-between">
                            <p class="m-0 font-bold text-[15px]">
                                {{ 'Tổng giá trị' }}
                            </p>
                            <p class="m-0 font-bold text-[15px]">
                                {{ totalBill(form).toLocaleString('de-DE') }} đ
                            </p>
                        </div>
                    </div>
                    <div v-if="!form._id" class="px-4 mt-4 flex items-center justify-between">
                        <a-checkbox v-model="form.payment.status">
                            {{ 'Thanh toán' }}
                        </a-checkbox>
                        <a-button
                            :loading="loadingCreate"
                            :disabled="!form.products?.length || !form.customer"
                            type="primary"
                            class="!flex items-center gap-2 justify-center"
                            @click="createOrder"
                        >
                            {{ 'Tạo đơn hàng' }}
                        </a-button>
                    </div>
                </div>
                <div v-if="form._id" class="mt-6 ">
                    <h4 class="text-[14px] font-[600]">
                        Timeline
                    </h4>
                    <div>
                        <div class="card flex items-center justify-between gap-4 relative z-[10]">
                            <a-input v-model="form.timelineContent" :placeholder="`Nhập nội dung`" />
                            <a-button
                                :loading="loadingTimeline"
                                :disabled="!form.timelineContent"
                                class="w-28"
                                type="primary"
                                @click="createTimeline"
                            >
                                {{ 'Thêm' }}
                            </a-button>
                        </div>
                        <a-timeline class="!-mt-3 !pl-6 !pr-6">
                            <a-timeline-item>
                                <div class="h-6" />
                            </a-timeline-item>
                            <a-timeline-item v-for="(record, index) in [ ...(order.timeline || []) ].reverse()" :key="index">
                                <div class="flex items-center justify-between">
                                    <span v-html="record.content" />
                                    <span>{{ record.createdAt | dateFormat('HH:mm dd/MM/yyyy') }}</span>
                                </div>
                            </a-timeline-item>
                            <a-timeline-item>
                                <div class="flex items-center justify-between">
                                    <span>{{ 'Ngày tạo' }}</span>
                                    <span>{{ order.createdAt | dateFormat('HH:mm dd/MM/yyyy') }}</span>
                                </div>
                            </a-timeline-item>
                        </a-timeline>
                    </div>
                </div>
            </div>
            <div class="lg:col-span-4 col-span-12">
                <div class="card">
                    <div class="flex items-center justify-between">
                        <h4 class="m-0 text-[14px] font-[600]">
                            {{ 'Ghi chú' }}
                        </h4>
                        <a-button type="text" class="!p-0 !w-[23px] flex items-center justify-center !h-[23px] !border-0 back !bg-[transparent]" @click="editNotes">
                            <svg
                                viewBox="0 0 20 20"
                                class="!m-0 w-[23px] h-[23px]"
                                focusable="false"
                                aria-hidden="true"
                            ><path fill="#8e8e8e" fill-rule="evenodd" d="M15.655 4.344a2.695 2.695 0 0 0-3.81 0l-.599.599-.009-.009-1.06 1.06.008.01-5.88 5.88a2.75 2.75 0 0 0-.805 1.944v1.922a.75.75 0 0 0 .75.75h1.922a2.75 2.75 0 0 0 1.944-.806l7.54-7.539a2.695 2.695 0 0 0 0-3.81Zm-4.409 2.72-5.88 5.88a1.25 1.25 0 0 0-.366.884v1.172h1.172c.331 0 .65-.132.883-.366l5.88-5.88-1.689-1.69Zm2.75.629.599-.599a1.195 1.195 0 1 0-1.69-1.689l-.598.599 1.69 1.689Z" /></svg>
                        </a-button>
                    </div>
                    <div class="mt-3 pt-3" style="border-top: 1px solid #e3e3e3">
                        <p v-if="!showEditNote" class="m-0">
                            {{ form.notes ? form.notes : 'Không có ghi chú nào' }}
                        </p>
                        <div v-else>
                            <a-textarea
                                v-model="form.notes"
                                :placeholder="`Nhập nội dung`"
                                :auto-size="{ minRows: 4, maxRows: 5 }"
                                @blur="submitNotes"
                            />
                        </div>
                    </div>
                </div>
                <div class="card mt-4 !pb-[1px]">
                    <div class="flex items-center justify-between">
                        <h4 class="m-0 text-[14px] font-[600]">
                            {{ 'Khách hàng' }}
                        </h4>
                        <a-dropdown v-if="form.customer" placement="bottomRight">
                            <template #overlay>
                                <a-menu @click="handleActionInforCustomer">
                                    <a-menu-item key="editCustomer">
                                        {{ 'Chỉnh sửa thông tin' }}
                                    </a-menu-item>
                                    <a-menu-item v-if="!form._id" key="deleteCustomer">
                                        <span class="text-[#ff4d4f]">{{ 'Xóa' }} {{ 'khách hàng' }}</span>
                                    </a-menu-item>
                                </a-menu>
                            </template>
                            <a-button
                                v-if="form.customer"
                                type="text"
                                class="!p-0 !w-[23px] flex items-center justify-center !h-[23px] !border-0 back !bg-[transparent]"
                            >
                                <svg
                                    viewBox="0 0 20 20"
                                    class="!m-0 w-[23px] h-[23px]"
                                    focusable="false"
                                    aria-hidden="true"
                                ><path fill="#8e8e8e" d="M6 10a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" /><path fill="#8e8e8e" d="M11.5 10a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" /><path fill="#8e8e8e" d="M15.5 11.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" /></svg>
                            </a-button>
                        </a-dropdown>
                    </div>
                    <div class="mt-3" style="border-top: 1px solid #e3e3e3">
                        <div v-if="form.customer">
                            <div class="pt-2 mt-1">
                                <p>Email: {{ form.customer.email }}</p>
                                <p>{{ 'Số điện thoại' }}: {{ form.customer.phone }}</p>
                                <p>{{ 'Địa chỉ' }}: {{ form.customer.address }}</p>
                            </div>
                            <div class="pt-4 mt-1" style="border-top: 1px solid #ced4da">
                                <p>{{ 'Ghi chú' }}: {{ form.customer.notes ? form.customer.notes : 'Không có ghi chú nào' }}</p>
                            </div>
                        </div>
                        <div v-else class="pb-4">
                            <a-select
                                v-model="form.customer"
                                show-search
                                placeholder="Chọn khách hàng"
                                style="width: 100%; margin-top: 16px;"
                                :filter-option="filterOption"
                                @focus="handleFocus"
                                @change="handleChange"
                            >
                                <div slot="dropdownRender" slot-scope="menu">
                                    <v-nodes :vnodes="menu" />
                                    <a-divider style="margin: 4px 0;" />
                                    <div
                                        style="padding: 4px 8px; cursor: pointer;"
                                        @mousedown="e => e.preventDefault()"
                                    >
                                        <a-button type="" class="mb-1 !flex items-center !w-full gap-2 justify-center" @click="$refs.create.open()">
                                            <svg
                                                viewBox="0 0 24 24"
                                                width="16"
                                                height="16"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                fill="none"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                class="m-0"
                                            ><line
                                                x1="12"
                                                y1="5"
                                                x2="12"
                                                y2="19"
                                            /><line
                                                x1="5"
                                                y1="12"
                                                x2="19"
                                                y2="12"
                                            /></svg>
                                            {{ 'Tạo khách hàng mớI' }}
                                        </a-button>
                                    </div>
                                </div>
                                <a-select-option v-for="customer in customers" :key="customer._id" :value="customer">
                                    <p class="m-1">
                                        {{ customer?.fullname }}
                                    </p>
                                    <p class="m-0">
                                        {{ customer?.email }}
                                    </p>
                                </a-select-option>
                            </a-select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <DiscountModal
            ref="discountModal"
            :title="`Thêm mã giảm giá`"
            :data="form.discount"
            @confirm="submitDiscount"
            @delete="deleteDiscount"
        />
        <CancelOrderModal
            ref="cancelOrderModal"
            :title="`Hủy đơn hàng`"
            :data="form"
            @confirm="submitCancelOrder"
        />
        <CustomerCreateModal ref="create" />
        <div class="fixed -right-[100%] z-20">
            <VueHtml2pdf
                ref="html2Pdf"
                :show-layout="false"
                :float-layout="false"
                :enable-download="false"
                :preview-modal="true"
                :paginate-elements-by-height="1900"
                :filename="`Order #${form.code}`"
                :pdf-quality="2"
                :manual-pagination="false"
                :html-to-pdf-options="htmlToPdfOptions"
                pdf-format="a5"
                pdf-orientation="landscape"
                @progress="onProgress($event)"
                @hasStartedGeneration="hasStartedGeneration()"
                @hasGenerated="hasGenerated($event)"
            >
                <section slot="pdf-content">
                    <OrderPrint :data="form" />
                </section>
            </VueHtml2pdf>
        </div>
    </div>
    <div v-else class="flex items-center justify-center h-full">
        <div class="race-by " />
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import SelectProducts from '@/components/orders/SelectProducts.vue';
    import DiscountModal from '@/components/orders/DiscountModal.vue';
    import OrderPrint from '@/components/orders/OrderPrint.vue';
    import CustomerCreateModal from '@/components/customers/CreateModal.vue';
    import CancelOrderModal from '@/components/orders/CancelOrderModal.vue';
    import _cloneDeep from 'lodash/cloneDeep';
    import _omit from 'lodash/omit';
    import VueHtml2pdf from 'vue-html2pdf';

    export default {
        components: {
            SelectProducts,
            DiscountModal,
            CustomerCreateModal,
            CancelOrderModal,
            VueHtml2pdf,
            OrderPrint,
            VNodes: {
                functional: true,
                render: (h, ctx) => ctx.props.vnodes,
            },
        },
        props: {
        },
        async fetch() {
            await this.fetchData();
        },
        data() {
            return {
                loading: false,
                loadingUpdate: false,
                loadingCreate: false,
                loadingTimeline: false,
                loadingAddTracking: false,
                form: {
                    products: [],
                    customer: null,
                    transportFee: null,
                    discount: null,
                    payment: {
                        status: false,
                    },
                    notes: '',
                },
                data: [],
                progress: 0,
                productsSelected: [],
                fetching: false,
                showEditNote: false,
            };
        },
        computed: {
            ...mapState('orders', ['order']),
            ...mapState('customers', ['customers', 'customer']),
            ...mapState('products', ['products']),
            ...mapState('settings/contacts', ['contacts']),
            htmlToPdfOptions() {
                return {
                    margin: 0,
                    image: {
                        type: 'jpeg',
                        quality: 2,
                    },
                    enableLinks: true,
                };
            },
        },
        watch: {
            '$route.query': {
                handler() {
                    this.fetchData();
                },
            },
            customer(newValue) {
                this.form.customer = _cloneDeep(newValue);
            },
            order(newValue) {
                this.form = _cloneDeep(newValue);
            },
        },
        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: this.$route.params.id !== 'create' ? 'Chi tiết đơn hàng' : 'Tạo đơn hàng',
                link: '/orders',
            }]);
        },

        methods: {
            async fetchData() {
                try {
                    this.loading = true;
                    // await this.$store.dispatch('orders/fetchDetail', this.$route.params.id);
                    if (this.$route.query.customerId) {
                        await this.$store.dispatch('customers/fetchDetail', this.$route.query.customerId);
                        this.form.customer = _cloneDeep(this.customer);
                    }
                    if (this.$route.params.id !== 'create') {
                        if (this.$route.params.id === 'detail') {
                            await this.$store.dispatch('orders/fetchDetail', this.$route.query.code);
                        } else {
                            await this.$store.dispatch('orders/fetchDetail', this.$route.params.id);
                        }
                        this.form = _cloneDeep(this.order);
                    } else if (this.products === null) {
                        await this.$store.dispatch('products/fetchAll', { limit: 100 });
                    }
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
            async handleFocus() {
                await this.$store.dispatch('customers/fetchAll');
            },
            filterOption(input, options) {
                console.log({ input, options });
            },
            handleChange(value) {
                console.log(value);
            },
            createTimeline() {
                console.log('createTimeline');
            },
            editNotes() {
                this.showEditNote = true;
            },
            onProgress(progress) {
                this.progress = progress;
                console.log(`PDF generation progress: ${progress}%`);
            },
            submitNotes() {
                this.showEditNote = false;
            },
            removeProductFromOrder(id) {
                this.form.products = this.form.products.filter((e) => e._id !== id);
            },
            handleActionInforCustomer(value) {
                if (value.key === 'editCustomer') {
                    this.$refs.create.open(this.form.customer);
                } else if (value.key === 'deleteCustomer') {
                    this.form.customer = null;
                } else {
                    // eslint-disable-next-line no-console
                    console.log(value.key);
                }
            },
            totalPrice(data) {
                return data.reduce((accumulator, product) => accumulator + (product.price * product.quantity), 0);
            },

            totalBill(data) {
                const transportPrice = data?.transportFee ? Number(data?.transportFee.price) : 0;
                const productTotal = Number(this.totalPrice(data.products));

                if (data.discount) {
                    if (data.discount.type === 'percentage') {
                        const discountPercentage = Number(data.discount.price) / 100;
                        return productTotal * (1 - discountPercentage) + transportPrice;
                    } if (data.discount.type === 'amount') {
                        return productTotal - Number(data.discount.price) + transportPrice;
                    }
                }

                return productTotal + transportPrice - (data.refunded ? data.refunded.reduce((a, b) => a + b.total, 0) : 0);
            },

            handleActionInforBill(value) {
                if (value.key === 'discount') {
                    this.$refs.discountModal.open();
                } else if (value.key === 'transportFee') {
                    this.$refs.transportFeeModal.open();
                } else {
                    // eslint-disable-next-line no-console
                    console.log(value.key);
                }
            },
            handleNumberInput(id) {
                // Find the index of the product with the specified _id
                const productIndex = this.form.products.findIndex((product) => product._id === id);

                // If the product is found in the array, update its quantity
                if (productIndex !== -1 && this.form.products[productIndex].quantity < 1) {
                    this.form.products[productIndex].quantity = 1;
                    return true; // Return true to indicate that the update was successful
                }
                return false; // Return false to indicate that the product was not found
            },
            submitDiscount(data) {
                this.form.discount = {
                    name: data.name,
                    price: data.price,
                    type: data.typeDiscount,
                };
            },
            deleteDiscount() {
                this.form.discount = null;
            },
            submitTransportFee(data) {
                this.form.transportFee = {
                    name: data.name,
                    price: data.price,
                };
            },

            deleteTransportFee() {
                this.form.transportFee = null;
            },
            addProductInOrder(data) {
                this.form.products = data.map((e) => (
                    {
                        ...(JSON.parse(e)),
                        quantity: 1,
                    }
                ));
            },
            async createOrder() {
                try {
                    this.loadingCreate = true;
                    await this.$store.dispatch('orders/create', {
                        ...this.form,
                        customer: {
                            _id: this.form.customer._id,
                            firstname: this.form.customer?.firstname,
                            lastname: this.form.customer?.lastname,
                            email: this.form.customer?.email,
                            address: this.form.customer?.address,
                            phone: this.form.customer?.phone,
                            notes: this.form.customer?.notes,
                        },
                        lang: this.contacts.languageAdmin || 'eng',
                    });
                    this.loadingCreate = false;
                    // this.$store.dispatch('orders/fetchAll');
                    // this.$router.push(`/orders/${this.order.code}`);
                } catch (e) {
                    this.$handleError(e);
                }
            },
            async handleActionOrder(value) {
                if (value.key === 'cancelOrder') {
                    this.$refs.cancelOrderModal.open();
                } else if (value.key === 'printOrder') {
                    this.$refs.html2Pdf.generatePdf();
                } else {
                    // eslint-disable-next-line no-console
                    console.log('Notfound Key');
                }
            },

            async submitCancelOrder() {
                try {
                    if (this.order.status !== 'canceled') {
                        await this.$store.dispatch('orders/update', {
                            _id: this.form._id,
                            data: _omit({
                                ...this.order,
                                timeline: 'Đơn hàng đã bị hủy',
                                status: 'canceled',
                            }, ['_id']),
                        });
                        this.$store.dispatch('orders/fetchAll');
                    }
                    this.$message.success('Cập nhật thành công');
                } catch (e) {
                    this.$handleError(e);
                }
            },

            async fullfiled() {
                try {
                    this.loadingUpdate = true;
                    if (this.order.status === 'pending') {
                        await this.$store.dispatch('orders/update', {
                            _id: this.form._id,
                            data: _omit({
                                ...this.order,
                                status: 'fullfilled',
                            }, ['_id']),
                        });
                        this.$store.dispatch('orders/fetchAll');
                    }
                    this.loadingUpdate = false;
                    this.$message.success('Cập nhật thành công');
                } catch (e) {
                    this.$handleError(e);
                    this.loadingUpdate = true;
                }
            },

            async submitAddTracking(data) {
                this.loadingAddTracking = true;
                if (this.order.status === 'fullfilled') {
                    await this.$store.dispatch('orders/update', {
                        _id: this.form._id,
                        data: _omit({
                            ...this.order,
                            transport: {
                                ...this.order.transport,
                                name: data.label,
                                partner: data.label,
                                trackingLink: data.trackingLink,
                                code: data.code,
                            },
                            status: 'shipping',
                        }, ['_id']),
                    });
                    this.$store.dispatch('orders/fetchAll');
                }
                this.loadingAddTracking = false;
            },
        },

        head() {
            return {
                title: this.$route.params.id !== 'create' ? 'Chi tiết đơn hàng' : 'Tạo đơn hàng',
            };
        },
    };
</script>
<style lang="scss">
.detail-order {
    button.back:hover {
        background-color: #e3e3e3 !important;
    }
}
.ant-select-dropdown-menu-item {
    padding: 5px 10px !important;
}
.ant-select-selection--multiple .ant-select-selection__choice__content {
    img {
        display: none;
    }
}
</style>
