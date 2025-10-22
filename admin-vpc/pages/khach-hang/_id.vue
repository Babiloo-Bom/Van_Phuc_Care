<template>
    <div v-if="!loading" class="max-w-[1200px] !mx-auto w-full block p-4 pt-0 detail-customer">
        <div v-if="emptyData" class="flex-col gap-4 flex items-center justify-center h-full">
            <a-empty :description="false" />
            <h4 class="text-[20px] font-bold text-center">
                Không tìm thấy khách hàng
            </h4>
        </div>
        <div v-else>
            <div class="flex items-center justify-start gap-3">
                <a-button type="text" class="!p-0 !w-[25px] !h-[25px] !border-0 back !bg-[transparent]" @click="$router.push('/khach-hang')">
                    <svg
                        viewBox="0 0 20 20"
                        class="m-0 w-[20px] h-[20px]"
                        focusable="false"
                        aria-hidden="true"
                    ><path fill-rule="evenodd" d="M16.75 10a.75.75 0 0 1-.75.75h-9.69l2.72 2.72a.75.75 0 0 1-1.06 1.06l-4-4a.75.75 0 0 1 0-1.06l4-4a.75.75 0 0 1 1.06 1.06l-2.72 2.72h9.69a.75.75 0 0 1 .75.75Z" /></svg>
                </a-button>
                <div class="flex items-center justify-between w-full">
                    <div class="flex items-center gap-3">
                        <h4 v-if="customer.fullname" class="m-0 text-[20px] font-bold">
                            {{ `${customer.fullname}` }}
                        </h4>
                        <h4 v-else class="m-0 text-[20px] font-bold">
                            {{ `${customer.firstname || ''} ${customer.lastname || ''}` }}
                        </h4>
                        <div class="flex items-center synck-select">
                            <div class="flex items-center gap-1">
                                <span :class="`block !min-w-2 !w-2 !h-2 rounded-full`" :style="`background-color: ${STATUS_COLOR[customer.status]}`" />
                                <span class="w-fit block font-[600]" :style="`color: ${STATUS_COLOR[customer.status]}`">{{ STATUS_LABEL[customer.status] }}</span>
                            </div>
                            <a-select
                                :default-value="customer.status"
                                style="width: 120px"
                                @change="handleChangeStatus"
                            >
                                <template #suffixIcon>
                                    <div class="flex p-1 items-center justify-center rounded-full bg-[#f8f8fb] border border-[#dce1e5] relative top-[-5px] right-[-40px]">
                                        <svg
                                            v-if="!loadingSave"
                                            class="transition-all duration-300"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                stroke="#262626"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-miterlimit="10"
                                                stroke-width="1.5"
                                                d="M19.92 8.95l-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
                                            />
                                        </svg>
                                        <a-icon v-else type="loading" />
                                    </div>
                                </template>
                                <a-select-option v-for="(option, index) in CUSTOMER_STATUS_OPTIONS" :key="`customer_status_${index}`" :value="option.value">
                                    <div class="flex items-center gap-1">
                                        <span class="w-fit block font-[600]">{{ option.label }}</span>
                                    </div>
                                </a-select-option>
                            </a-select>
                        </div>
                    </div>
                    <div class="flex items-center justify-center gap-4">
                        <a-button
                            type="primary"
                            class="flex items-center justify-center !h-[31px]"
                            :loading="loadingSave"
                            @click="handleSave"
                        >
                            Lưu
                        </a-button>
                        <a-button type="text" class="!p-1 !w-[31px] flex items-center justify-center !h-[31px] !border-0 back !bg-[transparent]" @click="$refs.confirmDelete.open()">
                            <svg
                                viewBox="0 0 20 20"
                                class="!m-0 w-[23px] h-[23px]"
                                focusable="false"
                                aria-hidden="true"
                            ><path fill="#8e8e8e" d="M11.5 8.25a.75.75 0 0 1 .75.75v4.25a.75.75 0 0 1-1.5 0v-4.25a.75.75 0 0 1 .75-.75Z" /><path fill="#8e8e8e" d="M9.25 9a.75.75 0 0 0-1.5 0v4.25a.75.75 0 0 0 1.5 0v-4.25Z" /><path fill="#8e8e8e" fill-rule="evenodd" d="M7.25 5.25a2.75 2.75 0 0 1 5.5 0h3a.75.75 0 0 1 0 1.5h-.75v5.45c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311c-.642.327-1.482.327-3.162.327h-.4c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311c-.327-.642-.327-1.482-.327-3.162v-5.45h-.75a.75.75 0 0 1 0-1.5h3Zm1.5 0a1.25 1.25 0 1 1 2.5 0h-2.5Zm-2.25 1.5h7v5.45c0 .865-.001 1.423-.036 1.848-.033.408-.09.559-.128.633a1.5 1.5 0 0 1-.655.655c-.074.038-.225.095-.633.128-.425.035-.983.036-1.848.036h-.4c-.865 0-1.423-.001-1.848-.036-.408-.033-.559-.09-.633-.128a1.5 1.5 0 0 1-.656-.655c-.037-.074-.094-.225-.127-.633-.035-.425-.036-.983-.036-1.848v-5.45Z" /></svg>
                        </a-button>
                    </div>
                </div>
            </div>
            <div class="pl-10">
                <span v-if="customer.address" class="text-[12px] text-[#616161]">{{ customer.address }} - </span>
                <span v-if="customer.createdAt" class="text-[12px] text-[#616161]">Ngày tạo: {{ customer.createdAt | dateFormat('HH:mm dd/MM/yyyy') }}</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-12 mt-4 gap-5">
                <div class="col-span-1 md:col-span-8">
                    <div class="card mb-4 relative">
                        <div>
                            <div class="flex items-center justify-between">
                                <div>
                                    <h4 class="text-[14px] font-[600] m-0">
                                        {{ 'Đơn hàng gần nhất' }}
                                    </h4>
                                    <span v-if="!customer.orders?.length">{{ customer.fullname }} {{ 'Chưa có đơn hàng nào' }}</span>
                                </div>
                                <a-button
                                    type="primary"
                                    :disabled="true"
                                    @click="$router.push(`/orders/create?customerId=${customer._id}`)"
                                >
                                    {{ 'Tạo mới' }}
                                </a-button>
                            </div>
                            <div v-if="customer.orders?.length">
                                <OrderLastest :data="customer.orders[customer.orders.length - 1]" />
                            </div>
                        </div>
                        <div class="rounded-sm absolute w-full flex items-center justify-center h-full bg-[#00000038] top-0 left-0 ">
                            <a-button class="!rounded-full !bg-[#1351d8]" type="primary">
                                Upgrade
                            </a-button>
                        </div>
                    </div>
                    <div class="card mt-4">
                        <h4 class="text-[14px] font-[600] m-0">
                            {{ 'Thông tin bé' }}
                        </h4>
                        <div class="pt-3 mt-3" style="border-top: 1px solid #ced4da">
                            <a-form-model
                                ref="form"
                                :model="children"
                            >
                                <div class="flex justify-start gap-6 placeholder:pb-6 mb-3 mt-4">
                                    <div class="flex flex-col gap-4 justify-start flex-shrink-0">
                                        <div>
                                            <h3 class="font-semibold text-center mb-2 text-sm">
                                                Ảnh của bé
                                            </h3>
                                            <div class="flex flex-col items-center gap-y-2 mb-2 w-full">
                                                <img
                                                    v-if="children.avatar"
                                                    :src="children.avatar"
                                                    alt=""
                                                    class="!w-[120px] !h-[120px] rounded-md object-cover"
                                                >
                                                <div v-else class="!w-[120px] !h-[120px] rounded-md border-dashed border border-gray-400 flex justify-center items-center">
                                                    <span><i class="fas fa-plus" /></span>
                                                </div>
                                                <div class="flex gap-x-2">
                                                    <a-upload
                                                        :show-upload-list="false"
                                                        action=""
                                                        class="mx-auto block text-center"
                                                        :transform-file="handlerThumbnail"
                                                    >
                                                        <div class="flex gap-x-2">
                                                            <img src="/images/upload.svg" class="w-4" alt="avatar">
                                                            Upload
                                                        </div>
                                                    </a-upload>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 w-full flex-1">
                                        <div class="grid grid-cols-1">
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <a-form-model-item label="Tên bé" prop="title">
                                                    <a-input v-model="children.name" placeholder="VD: Nguyen Huy Hoang" />
                                                </a-form-model-item>
                                                <a-form-model-item label="Giới tính">
                                                    <a-radio-group
                                                        v-model="children.gender"
                                                        :options="genders"
                                                        default-value="male"
                                                        @change="(e) => children.gender = e.target.value"
                                                    />
                                                </a-form-model-item>
                                            </div>
                                            <a-form-model-item label="Ngày sinh" prop="dob">
                                                <a-date-picker
                                                    v-model="children.dob"
                                                    class="w-full"
                                                    format="DD/MM/YYYY"
                                                    value-format="DD/MM/YYYY"
                                                    placeholder="Chọn ngày sinh"
                                                    @change="(val) => handleUpdateDOB(val)"
                                                >
                                                    <a-icon slot="suffixIcon" type="calendar" />
                                                </a-date-picker>
                                            </a-form-model-item>
                                        </div>
                                    </div>
                                </div>
                            </a-form-model>
                        </div>
                    </div>
                    <div class="card mt-4 !pt-0">
                        <a-tabs default-active-key="1" @change="handleChangeTab">
                            <a-tab-pane key="1" tab="Trao đổi">
                                <Communicates />
                            </a-tab-pane>
                            <a-tab-pane key="2" tab="Đơn hàng">
                                <div v-if="customer.orders?.length">
                                    <OrderLastest :data="customer.orders[customer.orders.length - 1]" />
                                </div>
                                <span v-else>
                                    <a-empty :description="`${customer.fullname} chưa có đơn hàng nào`" />
                                </span>
                            </a-tab-pane>
                            <a-tab-pane key="3" tab="Mũi tiêm">
                                <VaccinSchedules :data="schedules" />
                            </a-tab-pane>
                            <a-tab-pane key="4" tab="Tickets">
                                <TableTicket
                                    :data="tickets"
                                    :loading="loadingTicket"
                                />
                                <ct-pagination :data="pagination" />
                            </a-tab-pane>
                            <a-tab-pane key="5" tab="Timeline">
                                <div class="mt-0">
                                    <div>
                                        <div class="card flex items-center justify-between gap-4 relative z-[10] shadow-none !pb-0" style="box-shadow: none">
                                            <a-input v-model="form.timelineContent" placeholder="Nhập nội dung" />
                                            <a-button
                                                :loading="loadingTimeline"
                                                :disabled="!form.timelineContent"
                                                class="w-28"
                                                type="primary"
                                                @click="createTimeline"
                                            >
                                                Thêm
                                            </a-button>
                                        </div>
                                        <a-timeline class="!-mt-3 !pl-6 !pr-6">
                                            <a-timeline-item>
                                                <div class="h-6" />
                                            </a-timeline-item>
                                            <a-timeline-item v-for="(record, index) in sortTimeline([ ...(customer.timeline || []) ])" :key="index">
                                                <div class="flex items-center justify-between gap-4">
                                                    <span>{{ record.content }}</span>
                                                    <span class="min-w-fit block">{{ record.createdAt | dateFormat('HH:mm dd/MM/yyyy') }}</span>
                                                </div>
                                            </a-timeline-item>
                                            <a-timeline-item>
                                                <div class="flex items-center justify-between">
                                                    <span>{{ 'Ngày tạo' }}</span>
                                                    <span>{{ customer.createdAt | dateFormat('HH:mm dd/MM/yyyy') }}</span>
                                                </div>
                                            </a-timeline-item>
                                        </a-timeline>
                                    </div>
                                </div>
                            </a-tab-pane>
                        </a-tabs>
                    </div>
                </div>
                <div class="col-span-1 md:col-span-4">
                    <div class="card">
                        <div class="flex items-center justify-between">
                            <h4 class="m-0 text-[14px] font-[600]">
                                {{ 'Thông tin' }}
                            </h4>
                            <a-button type="text" class="!p-0 !w-[23px] flex items-center justify-center !h-[23px] !border-0 back !bg-[transparent]" @click="editInfors(customer)">
                                <svg
                                    viewBox="0 0 20 20"
                                    class="!m-0 w-[23px] h-[23px]"
                                    focusable="false"
                                    aria-hidden="true"
                                ><path fill="#8e8e8e" fill-rule="evenodd" d="M15.655 4.344a2.695 2.695 0 0 0-3.81 0l-.599.599-.009-.009-1.06 1.06.008.01-5.88 5.88a2.75 2.75 0 0 0-.805 1.944v1.922a.75.75 0 0 0 .75.75h1.922a2.75 2.75 0 0 0 1.944-.806l7.54-7.539a2.695 2.695 0 0 0 0-3.81Zm-4.409 2.72-5.88 5.88a1.25 1.25 0 0 0-.366.884v1.172h1.172c.331 0 .65-.132.883-.366l5.88-5.88-1.689-1.69Zm2.75.629.599-.599a1.195 1.195 0 1 0-1.69-1.689l-.598.599 1.69 1.689Z" /></svg>
                            </a-button>
                        </div>
                        <div class="pt-4 mt-1" style="border-top: 1px solid #ced4da">
                            <p>Email: {{ customer._doc.email }}</p>
                            <p>{{ 'Số điện thoại' }}: {{ customer._doc.phone }}</p>
                            <p>{{ 'Giới tính' }}: {{ customer._doc.gender ? (customer._doc.gender === 'male' ? 'Nam' : 'Nữ') : 'Khác' }}</p>
                            <p>{{ 'Địa chỉ' }}: {{ customer._doc.address }}</p>
                            <p>{{ 'Nguồn' }}: {{ customer.source || '--' }}</p>
                            <p>
                                {{ 'Tổng đơn hàng' }}: {{ customer.total_order || 0 }}
                            </p>
                            <p>{{ 'Tổng giá trị' }}: {{ customer.total_spent ? (customer.total_spent?.toLocaleString('de-DE')) : 0 }} đ</p>
                        </div>
                        <div class="pt-4 mt-1" style="border-top: 1px solid #ced4da">
                            <p class="m-0">
                                {{ 'Lưu ý' }}: {{ customer.note ? customer.note : 'Trống' }}
                            </p>
                        </div>
                    </div>
                    <div class="card mt-4">
                        <div class="flex items-center justify-between">
                            <h4 class="m-0 text-[14px] font-[600]">
                                {{ 'Tags' }}
                            </h4>
                            <a-button class="!rounded-full !bg-[#1351d8]" type="primary">
                                Upgrade
                            </a-button>
                            <!-- <a-button type="text" :disabled="true" class="!p-0 !w-[23px] flex items-center justify-center !h-[23px] !border-0 back !bg-[transparent]" @click="editTags({tagSelecteds: customer.tags})">
                                <svg
                                    viewBox="0 0 20 20"
                                    class="!m-0 w-[23px] h-[23px]"
                                    focusable="false"
                                    aria-hidden="true"
                                ><path fill="#8e8e8e" fill-rule="evenodd" d="M15.655 4.344a2.695 2.695 0 0 0-3.81 0l-.599.599-.009-.009-1.06 1.06.008.01-5.88 5.88a2.75 2.75 0 0 0-.805 1.944v1.922a.75.75 0 0 0 .75.75h1.922a2.75 2.75 0 0 0 1.944-.806l7.54-7.539a2.695 2.695 0 0 0 0-3.81Zm-4.409 2.72-5.88 5.88a1.25 1.25 0 0 0-.366.884v1.172h1.172c.331 0 .65-.132.883-.366l5.88-5.88-1.689-1.69Zm2.75.629.599-.599a1.195 1.195 0 1 0-1.69-1.689l-.598.599 1.69 1.689Z" /></svg>
                            </a-button> -->
                        </div>
                        <div v-if="customer.tags?.filter(e => e !== '').length" class="mt-2">
                            <a-tag
                                v-for="(tag, index) in customer.tags?.filter(e => e !== '')"
                                :key="`customer_tag_${index}`"
                                :closable="true"
                                class="!bg-[#53c66e21] !border-[#53c66e] py-1 px-2 !mb-2"
                                @close="() => handleClose(tag)"
                            >
                                <span class="text-[#000]">{{ tag.name }}</span>
                            </a-tag>
                        </div>
                        <div v-else class="pt-3 mt-2" style="border-top: 1px solid #ced4da">
                            <p class="m-0">
                                {{ 'Chưa có thẻ nào' }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <CustomerCreateModal ref="create" />
            <ConfirmDialog
                ref="confirmDelete"
                title="Xóa bản ghi"
                content="Bạn chắc chắn xóa bản ghi này?"
                @confirm="confirmDelete"
            />
        </div>
    </div>
    <div v-else class="flex items-center justify-center h-full">
        <div class="race-by " />
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex';
    import CustomerCreateModal from '@/components/customers/CreateModal.vue';
    import OrderLastest from '@/components/customers/OrderLastest.vue';
    import VaccinSchedules from '@/components/customers/VaccinSchedules.vue';
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
    import Communicates from '@/components/customers/communicates/index.vue';
    import TableTicket from '@/components/tickets/Table.vue';
    import { convertToFormData } from '@/utils/form';
    import {
        CUSTOMER_STATUS, CUSTOMER_STATUS_OPTIONS,
    } from '@/constants/customers/status';
    import { mapDataFromOptions } from '@/utils/data';
    // import TagsModal from '@/components/customers/TagsModal.vue';

    export default {
        components: {
            TableTicket,
            CustomerCreateModal,
            OrderLastest,
            ConfirmDialog,
            VaccinSchedules,
            Communicates,
            // TagsModal,
        },
        async fetch() {
            await this.fetchData();
        },
        data() {
            return {
                CUSTOMER_STATUS,
                CUSTOMER_STATUS_OPTIONS,
                loading: false,
                loadingTicket: false,
                emptyData: false,
                loadingSave: false,
                loadingTimeline: false,
                form: {
                },
                children: {},
                data: [],
                thumbnailFile: '',
                options: [],
                totalSpent: 0,
                genders: [
                    { label: 'Nam', value: 'male' },
                    { label: 'Nữ', value: 'female' },
                ],
            };
        },
        computed: {
            ...mapState('tickets', ['tickets', 'pagination']),
            ...mapState('customers', ['customer']),
            ...mapState('schedule-vaccins', ['schedules', 'scheduleSelected']),
            STATUS_LABEL() {
                return this.mapDataFromOptions(CUSTOMER_STATUS_OPTIONS, 'value', 'label');
            },

            STATUS_COLOR() {
                return this.mapDataFromOptions(CUSTOMER_STATUS_OPTIONS, 'value', 'color');
            },
        },
        watch: {
            '$route.query': {
                handler() {
                },
            },
        },
        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Chi tiết khách hàng',
                link: '/customers',
            }]);
        },

        methods: {
            ...mapActions('customers', ['selectedCustomer']),
            ...mapActions('schedule-vaccins', ['selectedSchedule']),
            mapDataFromOptions,
            async fetchTickets() {
                try {
                    this.loadingTicket = true;
                    await this.$store.dispatch('tickets/fetchAll', { customerId: this.$route.params.id });
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loadingTicket = false;
                }
            },
            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('customers/fetchDetail', this.$route.params.id);
                    this.children = this.customer.children || {};
                    this.selectedCustomer([]);
                    this.selectedSchedule(this.customer.injected || []);
                    this.fetchSchedules();
                    this.handleTotalSpent(this.customer.orders);
                    console.log(this.customer._doc);
                } catch (error) {
                    this.emptyData = false;
                } finally {
                    this.loading = false;
                }
            },
            async fetchSchedules() {
                try {
                    this.loading = true;
                    if (!this.schedules?.length) {
                        await this.$store.dispatch('schedule-vaccins/fetchAll');
                    }
                } catch (error) {
                    this.emptyData = false;
                } finally {
                    this.loading = false;
                }
            },
            async createTimeline() {
                try {
                    this.loadingTimeline = true;
                    await this.$store.dispatch('customers/update', {
                        _id: this.$route.params.id,
                        data: {
                            timeline: this.form.timelineContent,
                        },
                    });
                    this.form.timelineContent = '';
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loadingTimeline = false;
                }
            },

            editInfors(data) {
                this.$refs.create.open(data);
            },

            editTags(data) {
                this.selectedCustomer(this.customer._id);
                this.$refs.tagsModal.open(data, 'edit');
            },

            totalPrice(data) {
                return data.reduce((accumulator, product) => accumulator + (product.price * product.quantity), 0);
            },

            totalOrder(data) {
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

                return Number(productTotal + transportPrice);
            },

            handleTotalSpent(data) {
                data.forEach((item) => {
                    this.totalSpent += this.totalOrder(item);
                });
            },
            async confirmDelete() {
                try {
                    await this.$api.customers.delete(this.customer._id);
                    this.$message.success('Xóa thành công');
                    await this.$store.dispatch('customers/fetchAll', { ...this.$route.query });
                    this.$router.push('/khach-hang');
                } catch (e) {
                    this.$handleError(e);
                }
            },

            sortTimeline(data) {
                return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            },

            async handleClose(tag) {
                this.$store.dispatch('customers/update', {
                    _id: this.$route.params.id,
                    data: {
                        tags: this.customer.tags?.filter((e) => e.name !== tag.name),
                    },
                });
            },

            async handleSave() {
                try {
                    this.loadingSave = true;
                    if (this.thumbnailFile) {
                        const { data: { fileAttributes } } = await this.$api.uploaders.uploadFile(convertToFormData({
                            files: this.thumbnailFile,
                        }));
                        this.children = { ...this.children, avatar: fileAttributes[0]?.source };
                    }
                    await this.$api.customers.update(this.customer._doc._id, {
                        children: this.children,
                    });
                    this.$message.success('Cập nhật thành công');
                } catch (e) {
                    this.$handleError(e);
                } finally {
                    this.loadingSave = false;
                }
            },

            handleChangeTab(value) {
                if (value === '4') {
                    this.fetchTickets();
                }
            },

            async handleChangeStatus(value) {
                try {
                    this.loadingSave = true;
                    this.$store.dispatch('customers/update', {
                        _id: this.$route.params.id,
                        data: {
                            status: value,
                        },
                    });
                    await this.$api.customers.update(this.customer._id, {
                        status: value,
                    });
                    this.$message.success('Cập nhật thành công');
                } catch (e) {
                    this.$handleError(e);
                } finally {
                    this.loadingSave = false;
                }
            },

            handlerThumbnail(file) {
                this.thumbnailFile = file;
                this.children.avatar = URL.createObjectURL(file);
                this.$forceUpdate();
            },

            async handleRecordedAtChange() {
                try {
                    this.loadingForm = true;
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loadingForm = false;
                }
            },

            handleUpdateDOB(val) {
                this.children.dob = val;
            },

        },

        head() {
            return {
                title: 'Chi tiết khách hàng',
            };
        },
    };
</script>
<style lang="scss">
.detail-customer {
    button.back:hover {
        background-color: #e3e3e3 !important;
    }
}
</style>
