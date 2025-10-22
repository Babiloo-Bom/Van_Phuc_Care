<template>
    <div>
        <a-form-model
            ref="form"
            :model="form"
            :rules="rules"
            layout="vertical"
            :colon="false"
        >
            <div class="card-container">
                <a-tabs type="card" :default-active-key="$route.query.type" @change="changeTab">
                    <a-tab-pane key="information">
                        <span slot="tab">{{ 'Thông tin cá nhân' }}</span>
                        <div class="flex items-center justify-between mb-6">
                            <div class="flex items-center gap-x-8">
                                <img
                                    v-if="form.avatar"
                                    :src="form.avatar"
                                    onerror="this.src='/images/avatar-empty.webp'"
                                    alt=""
                                    class="w-32 h-32 rounded-full object-cover"
                                >
                                <div v-else class="w-32 h-32 rounded-full border-dashed border border-gray-400 flex justify-center items-center">
                                    <span><i class="fas fa-plus" /></span>
                                </div>
                                <a-upload
                                    :show-upload-list="false"
                                    action=""
                                    :transform-file="handlerAvatar"
                                >
                                    <div class="flex gap-x-2">
                                        <img src="/images/upload.svg" alt="avatar">
                                        {{ `Upload` }}
                                    </div>
                                </a-upload>
                            </div>
                            <a-button type="primary">
                                Sửa thông tin
                            </a-button>
                        </div>
                        <div class="px-4">
                            <div class="grid grid-cols-2 gap-4 max-w-[1400px]">
                                <div>
                                    <div class="grid grid-cols-8 gap-4 mb-4">
                                        <p class="col-span-2 m-0 font-[600] text-[14px] text-[#000]">
                                            Họ và tên:
                                        </p>
                                        <p class="col-span-6 m-0 font-[400] text-[14px] text-[#818181]">
                                            {{ form.fullname }}
                                        </p>
                                    </div>
                                    <div class="grid grid-cols-8 gap-4 mb-4">
                                        <p class="col-span-2 m-0 font-[600] text-[14px] text-[#000]">
                                            Điện thoại:
                                        </p>
                                        <p class="col-span-6 m-0 font-[400] text-[14px] text-[#818181]">
                                            {{ form.phone }}
                                        </p>
                                    </div>
                                    <div class="grid grid-cols-8 gap-4 mb-4">
                                        <p class="col-span-2 m-0 font-[600] text-[14px] text-[#000]">
                                            Email:
                                        </p>
                                        <p class="col-span-6 m-0 font-[400] text-[14px] text-[#818181]">
                                            {{ form.email }}
                                        </p>
                                    </div>
                                    <div class="grid grid-cols-8 gap-4 mb-4">
                                        <p class="col-span-2 m-0 font-[600] text-[14px] text-[#000]">
                                            Giới tính:
                                        </p>
                                        <p class="col-span-6 m-0 font-[400] text-[14px] text-[#818181]">
                                            {{ form.gender || '(Chưa cập nhật)' }}
                                        </p>
                                    </div>
                                    <div class="grid grid-cols-8 gap-4 mb-4">
                                        <p class="col-span-2 m-0 font-[600] text-[14px] text-[#000]">
                                            Ngày cấp:
                                        </p>
                                        <p class="col-span-6 m-0 font-[400] text-[14px] text-[#818181]">
                                            {{ form.day || '(Chưa cập nhật)' }}
                                        </p>
                                    </div>
                                    <div class="grid grid-cols-8 gap-4 mb-4">
                                        <p class="col-span-2 m-0 font-[600] text-[14px] text-[#000]">
                                            Dân tộc:
                                        </p>
                                        <p class="col-span-6 m-0 font-[400] text-[14px] text-[#818181]">
                                            {{ form.nation || '(Chưa cập nhật)' }}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <div class="grid grid-cols-8 gap-4 mb-4">
                                        <p class="col-span-2 m-0 font-[600] text-[14px] text-[#000]">
                                            Nơi sinh:
                                        </p>
                                        <p class="col-span-6 m-0 font-[400] text-[14px] text-[#818181]">
                                            {{ form.born || '(Chưa cập nhật)' }}
                                        </p>
                                    </div>
                                    <div class="grid grid-cols-8 gap-4 mb-4">
                                        <p class="col-span-2 m-0 font-[600] text-[14px] text-[#000]">
                                            Ngày sinh:
                                        </p>
                                        <p class="col-span-6 m-0 font-[400] text-[14px] text-[#818181]">
                                            {{ form.dob || '(Chưa cập nhật)' }}
                                        </p>
                                    </div>
                                    <div class="grid grid-cols-8 gap-4 mb-4">
                                        <p class="col-span-2 m-0 font-[600] text-[14px] text-[#000]">
                                            Nguyên quán:
                                        </p>
                                        <p class="col-span-6 m-0 font-[400] text-[14px] text-[#818181]">
                                            {{ form.address || '(Chưa cập nhật)' }}
                                        </p>
                                    </div>
                                    <div class="grid grid-cols-8 gap-4 mb-4">
                                        <p class="col-span-2 m-0 font-[600] text-[14px] text-[#000]">
                                            Chứng minh nhân dân:
                                        </p>
                                        <p class="col-span-6 m-0 font-[400] text-[14px] text-[#818181]">
                                            {{ form.identify || '(Chưa cập nhật)' }}
                                        </p>
                                    </div>
                                    <div class="grid grid-cols-8 gap-4 mb-4">
                                        <p class="col-span-2 m-0 font-[600] text-[14px] text-[#000]">
                                            Nơi cấp:
                                        </p>
                                        <p class="col-span-6 m-0 font-[400] text-[14px] text-[#818181]">
                                            {{ form.addressIndentify || '(Chưa cập nhật)' }}
                                        </p>
                                    </div>
                                    <div class="grid grid-cols-8 gap-4 mb-4">
                                        <p class="col-span-2 m-0 font-[600] text-[14px] text-[#000]">
                                            Tôn giáo:
                                        </p>
                                        <p class="col-span-6 m-0 font-[400] text-[14px] text-[#818181]">
                                            {{ form.religion || '(Chưa cập nhật)' }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="px-4 border-t-[1px] border-[#e8e8e8] mt-4 pt-4">
                            <h6 class="font-[600] text-[18x]">
                                Kinh nghiệm làm việc
                            </h6>
                            <a-empty description="Chưa có dữ liệu" />
                        </div>
                        <!-- <div class="grid grid-cols-12 gap-4">
                            <a-form-model-item class="lg:col-span-6 col-span-12" :label="`Họ đệm`" prop="firstName">
                                <a-input v-model="form.firstName" :placeholder="`Ví dụ: Nguyễn Huy`" />
                            </a-form-model-item>
                            <a-form-model-item class="lg:col-span-6 col-span-12" :label="`Tên`" prop="lastName">
                                <a-input v-model="form.lastName" :placeholder="`Ví dụ: Hoàng`" />
                            </a-form-model-item>
                            <a-form-model-item class="lg:col-span-6 col-span-12" :label="`Giới tính`" prop="gender">
                                <a-select
                                    v-model="form.gender"
                                    :placeholder="`Chọn giới tính`"
                                >
                                    <a-select-option v-for="item in GENDERS_OPTIONS" :key="item.value" :value="item.value">
                                        {{ item.label }}
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>
                            <a-form-model-item class="lg:col-span-6 col-span-12" :label="`Ngày sinh`" prop="dateOfBirth">
                                <a-date-picker
                                    v-model="form.dateOfBirth"
                                    class="w-full"
                                    :disabled-date="disabledDate"
                                    format="DD/MM/YYYY"
                                    :placeholder="`Nhập ngày sinh`"
                                />
                            </a-form-model-item>
                            <a-form-model-item class="lg:col-span-6 col-span-12" :label="`Email`" prop="email">
                                <a-input v-model="form.email" :placeholder="`Nhập email`" />
                            </a-form-model-item>
                            <a-form-model-item class="lg:col-span-6 col-span-12" :label="`Số điện thoại`" prop="phoneNumber">
                                <a-input v-model="form.phoneNumber" :placeholder="`Nhập số điện thoại`" />
                            </a-form-model-item>
                        </div> -->
                    </a-tab-pane>
                    <a-tab-pane key="history">
                        <span slot="tab">{{ 'Lịch sử đăng nhập' }}</span>
                        <LoginActivity />
                    </a-tab-pane>
                </a-tabs>
            </div>
        </a-form-model>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { mapDataFromOptions } from '@/utils/data';
    import _cloneDeep from 'lodash/cloneDeep';
    import { phoneValidator, validEmail } from '@/utils/form';
    import { GENDERS_OPTIONS } from '@/constants/users/genders';
    import moment from 'moment';
    import LoginActivity from '@/components/profiles/LoginActivity.vue';

    export default {
        components: {
            LoginActivity,
        },

        async fetch() {
            this.checking = true;
            await this.fetchData();
            this.checking = false;
        },
        data() {
            return {
                GENDERS_OPTIONS,
                loading: false,
                search: false,
                checking: false,
                loadingTable: false,
                form: {},
                rules: {
                    firstName: [
                        { required: true, message: 'Vui lòng không để trống trường này', trigger: 'change' },
                    ],
                    lastName: [
                        { required: true, message: 'Vui lòng không để trống trường này', trigger: 'change' },
                    ],
                    dateOfBirth: [
                        { required: true, message: 'Vui lòng không để trống trường này', trigger: 'change' },
                    ],
                    phoneNumber: [
                        { required: true, message: 'Vui lòng nhập giá trị hợp lệ', trigger: 'change' },
                        { validator: phoneValidator, trigger: 'change' },
                    ],
                    email: [
                        { required: true, message: 'Vui lòng nhập giá trị hợp lệ', trigger: 'change' },
                        { validator: validEmail, trigger: 'change' },
                    ],
                },
            };
        },

        computed: {
            ...mapState('transactions', ['transactions', 'pagination']),
        },
        watch: {
        },

        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Tài khoản',
                link: '/profile?type=information',
            }]);
            this.form = this.$auth.user;
        },

        methods: {
            mapDataFromOptions,

            async fetchData() {
                try {
                    this.loading = true;
                    // await this.$store.dispatch('transactions/fetchAll');
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
            handlerAvatar(file) {
                this.fileAvatar = file;
                this.form.avatar = URL.createObjectURL(file); // tạo ra cái ảnh
            },

            empty() {
                this.form = _cloneDeep(this.user);
            },
            async changeTab(key) {
                this.activeKey = key;
                this.$router.push({
                    query: {
                        type: key,
                    },
                });
            },
            disabledDate(current) {
                // Can not select days before today and today
                return current && current > moment().endOf('day');
            },

        },

        head() {
            return {
                title: 'Tài khoản',
            };
        },
    };
</script>

<style lang="scss">
.card-container {
  overflow: hidden;
}
.card-container > .ant-tabs-card > .ant-tabs-content {
  margin-top: -16px;
}

.card-container > .ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane {
  background: #fff;
  padding: 16px;
  border-radius: 16px;
  border-top-left-radius: 0px;
}

.card-container > .ant-tabs-card > .ant-tabs-bar {
  border-color: #fff;
}

.card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab {
  border-color: transparent;
  background: rgb(230, 230, 230);
  border-radius: 0;
  margin-right: 6px;
}
.card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab.ant-tabs-tab-active {
  border-top: 2px solid;
}

.card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active {
  border-color: #fff;
  background: #fff;
}
</style>
