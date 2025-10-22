<template>
    <div>
        <div v-if="target === null" class="rounded-md h-[200px] flex flex-col md:flex-row items-stretch md:items-center justify-center gap-4">
            <a-button class="!flex items-center justify-center !text-[#fff] !px-8 !py-6 !bg-prim-100" @click="handleAction('create')">
                TẠO PHIẾU NGAY
            </a-button>
            <a-button class="!flex items-center justify-center !text-[#fff] !px-8 !py-6 !bg-prim-100" @click="handleAction('list')">
                THEO DÕI PHIẾU HỖ TRỢ
            </a-button>
        </div>
        <div v-else class="flex items-center gap-4 mb-4">
            <a-button class="!w-[27px] !h-[27px] !p-0 !flex !items-center justify-center" type="primary" @click="handleAction(null)">
                <svg
                    class="transition-all duration-300"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                ><path
                    stroke="#fff"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                    d="M15 19.92L8.48 13.4c-.77-.77-.77-2.03 0-2.8L15 4.08"
                /></svg>
            </a-button>
            <h6 class="text-[#1A75BB] m-0 font-bold">
                Ticket | {{ target === 'create' ? 'Tạo phiếu hỗ trợ' : 'Theo dõi phiếu hỗ trợ' }}
            </h6>
        </div>
        <div v-if="target === 'create'" class="bg-[#f8fcff] rounded-md p-2 md:px-6 md:py-3 md:pb-6">
            <a-form-model
                ref="form"
                :model="form"
                :rules="rules"
                class="space-y-4 w-full"
            >
                <a-form-model-item label="Danh mục" prop="type">
                    <a-select
                        :value="form.type"
                        class="w-full"
                        :options="[{
                            value: 'support_parent',
                            label: 'Hỗ trợ cha mẹ',
                        }]"
                    />
                </a-form-model-item>
                <a-form-model-item
                    v-if="!$auth.user.phone"
                    label="Số điện thoại"
                    prop="phone"
                >
                    <a-input
                        v-model="form.phone"
                        size="large"
                        placeholder="Nhập số điện thoại"
                        @keyup.native.enter="handleSubmit"
                    />
                </a-form-model-item>
                <a-form-model-item label="Vấn đề của bạn" prop="content">
                    <a-textarea
                        v-model="form.content"
                        placeholder="Nhập nội dung"
                        :auto-size="{ minRows: 6, maxRows: 8 }"
                    />
                </a-form-model-item>
                <p class="!m-0 font-[600] !mt-4 !mb-1">
                    Tệp đính kèm (Tùy chọn)
                </p>
                <a-upload-dragger
                    name="file"
                    :multiple="true"
                    action=""
                    @change="handleChange"
                >
                    <p class="ant-upload-text">
                        Thêm tệp hoặc thả tệp vào đây
                    </p>
                </a-upload-dragger>
                <div class="w-full flex items-center justify-center">
                    <a-button
                        :loading="loading"
                        type="primary"
                        size="large"
                        class="!w-fit !mx-auto block"
                        @click="handleSubmit"
                    >
                        Tạo phiếu ngay
                    </a-button>
                </div>
            </a-form-model>
        </div>
        <div v-if="target === 'list'" class="bg-[#f8fcff] rounded-md p-2 md:px-6 md:py-3 md:pb-6">
            <div v-if="!loadingTicket">
                <h4 class="font-[600] text-[24px] text-center text-prim-100">
                    DANH SÁCH PHIẾU HỖ TRỢ
                </h4>
                <div class="my-4 grid grid-cols-3 w-fit mx-auto">
                    <a-button :class="`!flex items-center justify-center !rounded-r-none !px-6 !py-6 ${typeList === 'all' ? '!text-[#fff] !bg-prim-100' : '!text-[#8D8D8D] !bg-[#D9D9D9]'}`" @click="handleList('all')">
                        TẤT CẢ
                    </a-button>
                    <a-button :class="`!flex items-center justify-center !rounded-none !px-6 !py-6 ${typeList === 'process' ? '!text-[#fff] !bg-prim-100' : '!text-[#8D8D8D] !bg-[#D9D9D9]'}`" @click="handleList('process')">
                        ĐANG XỬ LÝ
                    </a-button>
                    <a-button :class="`!flex items-center justify-center !rounded-l-none  !px-6 !py-6 ${typeList === 'done' ? '!text-[#fff] !bg-prim-100' : '!text-[#8D8D8D] !bg-[#D9D9D9]'}`" @click="handleList('done')">
                        HOÀN THÀNH
                    </a-button>
                </div>

                <a-collapse
                    v-if="handleTicket(tickets)?.length"
                    :default-active-key="['3']"
                    :bordered="false"
                    :show-arrow="false"
                >
                    <a-collapse-panel v-for="(record, index) in handleTicket(tickets)" :key="`tickets_${index}`">
                        <template #header>
                            <div class="flex items-center justify-between border-b pb-3 !border-[#ADA0A0]">
                                <span class="font-[600] w-[200px] truncate">{{ record.content }}</span>
                                <!-- Custom expand icon -->
                                <span class="font-[600]" :style="`color: ${handleColor(record.status)}`">
                                    {{ handleStatus(record.status) }}
                                </span>
                            </div>
                            <div class="flex items-center justify-between">
                                <div class="text-[#7C7C7C]">
                                    <span>Loại hỗ trợ: <span class="font-[600]">{{ handleType(record.type) }}</span> </span>
                                    <span>|</span>
                                    <span class="font-[600]">Ngày: {{ record.createdAt | dateFormat('HH:mm dd/MM/yyyy') }}</span>
                                </div>
                                <a-button type="link" class="!p-0 !text-prim-100 !flex items-center justify-end gap-3">
                                    Chi tiết
                                    <svg
                                        class="transition-all duration-300"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    ><path
                                        stroke="#1A75BB"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-miterlimit="10"
                                        stroke-width="2"
                                        d="M19.92 8.95l-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
                                    /></svg>
                                </a-button>
                            </div>
                        </template>
                        <div class="">
                            <div>
                                <p class="m-0 font-[600]">
                                    Danh mục:
                                </p>
                                <p class="m-0">
                                    {{ handleType(record.type) }}
                                </p>
                            </div>
                            <div class="mt-4">
                                <p class="m-0 font-[600]">
                                    Vấn đề của bạn (mô tả) :
                                </p>
                                <p class="m-0">
                                    {{ record.content }}
                                </p>
                            </div>
                            <div v-if="record.reply" class="mt-4">
                                <p class="m-0 font-[600]">
                                    Phản hồi:
                                </p>
                                <div v-html="record.reply" />
                            </div>
                            <CoolLightBox
                                v-if="record.files && record.files.length"
                                :items="record.files.map((item) => (item.source))"
                                :index="indexCool"
                                @close="indexCool = null"
                            />
                            <div class="mt-4">
                                <p class="m-0 font-[600]">
                                    File đính kèm:
                                </p>
                                <div v-if="record.files && record.files.length" class="flex items-center gap-2 mt-2">
                                    <div
                                        v-for="file, _index in record.files"
                                        :key="_index"
                                        class="cursor-pointer"
                                        @click="indexCool = file.type === 'video' || file.type === 'image' ? _index : null"
                                    >
                                        <template v-if="file.type === 'image'">
                                            <img class="w-32 h-32 object-cover rounded-sm" :src="file.source" alt="">
                                        </template>
                                        <template v-else-if="file.type === 'video'">
                                            <div class="w-32 h-32 bg-[#d3d3d3] rounded-sm relative">
                                                <video class="w-full h-full bg-[#d3d3d3] rounded-sm" :src="file.source" />
                                                <span class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="32"
                                                        height="32"
                                                        viewBox="0 0 24 24"
                                                        class="fill-none stroke-white"
                                                    ><path
                                                        d="M11.97 22c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10Z"
                                                        stroke-width="1.5"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                    /><path
                                                        d="M8.74 12.23v-1.67c0-2.08 1.47-2.93 3.27-1.89l1.45.84 1.45.84c1.8 1.04 1.8 2.74 0 3.78l-1.45.84-1.45.84c-1.8 1.04-3.27.19-3.27-1.89v-1.69Z"
                                                        stroke-width="1.5"
                                                        stroke-miterlimit="10"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                    /></svg>
                                                </span>
                                            </div>
                                        </template>
                                        <template v-else>
                                            <a :href="file.source" target="_blank">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="80"
                                                    height="80"
                                                    viewBox="0 0 24 24"
                                                    class="fill-none stroke-[#868686]"
                                                ><path
                                                    d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z"
                                                    stroke-width="1.5"
                                                    stroke-miterlimit="10"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                /><path
                                                    d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8"
                                                    stroke-width="1.5"
                                                    stroke-miterlimit="10"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                /></svg>
                                                <span class="block mt-1 text-center">
                                                    Application
                                                </span>
                                            </a>
                                        </template>
                                    </div>
                                </div>
                                <p v-else class="m-0 font-[600]">
                                    Không có
                                </p>
                            </div>
                        </div>
                    </a-collapse-panel>
                </a-collapse>
                <div v-else class="">
                    <a-empty description="Không có dữ liệu" />
                </div>
            </div>
            <div v-else class="flex items-center justify-center h-full min-h-[450px]">
                <span class="genstech-loader" />
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { convertToFormData } from '@/utils/form';

    export default {
        components: {
        },
        props: {
            data: {
                type: Object,
                default: () => {},
            },
        },
        data() {
            return {
                loadingTicket: false,
                loading: false,
                target: null,
                typeList: 'all',
                form: {
                    type: 'support_parent',
                },
                rules: {
                    type: [
                        {
                            required: true,
                            message: 'Vui lòng chọn danh mục',
                            trigger: 'blur',
                        },
                    ],
                    phone: [
                        {
                            required: true,
                            message: 'Vui lòng nhập số điện thoại',
                            trigger: 'blur',
                        },
                    ],
                    content: [
                        {
                            required: true,
                            message: 'Vui lòng nhập nội dung',
                            trigger: 'blur',
                        },
                    ],
                },
                fileList: null,
                indexCool: null,
            };
        },

        computed: {
            ...mapState('tickets', ['tickets']),
        },
        methods: {
            async fetchTicket() {
                try {
                    this.loadingTicket = true;
                    await this.$store.dispatch('tickets/fetchDetail', this.$auth.user._id);
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loadingTicket = false;
                }
            },
            handleChange({ fileList }) {
                this.fileList = fileList;
            },
            handleList(value) {
                this.typeList = value;
            },
            handleAction(value) {
                this.target = value;
                if (value === 'list') {
                    this.fetchTicket();
                }
            },
            handleType(value) {
                if (value === 'support_parent') {
                    return 'Hỗ trợ cha mẹ';
                }
                return '';
            },
            handleStatus(value) {
                if (value === 'process') {
                    return 'Đang xử lý';
                } if (value === 'done') {
                    return 'Hoàn thành';
                }
                return 'Hủy';
            },

            handleColor(value) {
                if (value === 'process') {
                    return '#FFA500';
                } if (value === 'done') {
                    return '#008000';
                }
                return '#777777';
            },

            handleTicket(data) {
                if (this.typeList === 'all') {
                    return data;
                }
                return data.filter((e) => e.status === this.typeList);
            },
            async handleSubmit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        try {
                            this.loading = true;
                            if (this.fileList) {
                                const { data: { fileAttributes } } = await this.$api.uploader.uploadFile(convertToFormData({
                                    files: this.fileList.map((item) => (item.originFileObj)),
                                }));
                                this.form.files = fileAttributes;
                            }
                            await this.$api.tickets.create({ ...this.form, status: 'process' });
                            this.$message.success('Tạo thành công');
                            await this.$store.dispatch('tickets/fetchAll', { ...this.$route.query });
                            this.form.content = '';
                            this.handleAction('list');
                        } catch (error) {
                            this.$handleError(error);
                        } finally {
                            this.loading = false;
                        }
                    }
                });
            },
        },
    };
</script>

<style lang="scss">
.ant-upload.ant-upload-drag .ant-upload-btn {
    min-height: 80px !important;
}
.ant-upload.ant-upload-drag {
    background-color: #fff;
}
.ant-collapse-borderless {
    background: transparent !important;
}
.ant-collapse-arrow {
    display: none !important;
}
.ant-collapse > .ant-collapse-item > .ant-collapse-header {
    padding-left: 0;
}
.ant-collapse-borderless > .ant-collapse-item {
    border-color: #1A75BB !important;
    border: 1px solid #ADA0A0 !important;
    margin-bottom: 34px !important;
    padding: 0 16px !important;
    border-radius: 5px !important;
}
</style>
