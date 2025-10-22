<template>
    <div class="bg-white">
        <a-form-model
            ref="form"
            :model="form"
            :rules="rules"
        >
            <div class="grid grid-cols-2 gap-12">
                <div>
                    <h3 class="mb-0 border-solid border-b-[1px] border-b-gray-40 pb-2">
                        1. Khi khách hàng đăng ký vào Form, bạn muốn tạo cơ hội kinh doanh
                    </h3>
                    <div class="grid grid-cols-1 gap-4 mt-4">
                        <a-form-model-item label="Cơ hội sẽ được tạo ra trong chiến dịch" prop="title">
                            <a-input v-model="form.title" />
                        </a-form-model-item>
                        <a-form-model-item label="Cơ hội sẽ nằm ở trạng thái" prop="">
                            <a-select default-value="lucy">
                                <a-select-option value="jack">
                                    Jack
                                </a-select-option>
                                <a-select-option value="lucy">
                                    Lucy
                                </a-select-option>
                                <a-select-option value="Yiminghe">
                                    yiminghe
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item label="Ai sẽ là người tạo ta cơ hội này" prop="">
                            <a-select default-value="lucy">
                                <a-select-option value="jack">
                                    Jack
                                </a-select-option>
                                <a-select-option value="lucy">
                                    Lucy
                                </a-select-option>
                                <a-select-option value="Yiminghe">
                                    yiminghe
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item label="Bạn muốn chỉ định một người nào đó phụ trách cơ hội này không" prop="">
                            <a-select default-value="lucy">
                                <a-select-option value="jack">
                                    Jack
                                </a-select-option>
                                <a-select-option value="lucy">
                                    Lucy
                                </a-select-option>
                                <a-select-option value="Yiminghe">
                                    yiminghe
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-checkbox>Chỉ định người giới thiệu là người phụ trách khách hàng</a-checkbox>
                    </div>
                </div>
                <div>
                    <div class="grid grid-cols-1 gap-8">
                        <div>
                            <h3 class="mb-0 border-solid border-b-[1px] border-b-gray-40 pb-2">
                                2. Trước khi gửi thông tin
                            </h3>
                            <div class="grid grid-cols-1 gap-4 mt-4">
                                <a-checkbox>Hiển thị thông tin đã nhập</a-checkbox>
                            </div>
                        </div>
                        <div>
                            <h3 class="mb-0 border-solid border-b-[1px] border-b-gray-40 pb-2">
                                3. Sau khi đăng ký thành công
                            </h3>
                            <div class="grid grid-cols-1 gap-4 mt-4">
                                <div>
                                    <a-radio-group>
                                        <a-radio :style="radioStyle" :value="1">
                                            Thông điệp sau khi đăng ký thành công
                                        </a-radio>
                                        <a-radio :style="radioStyle" :value="2">
                                            Điều hướng khách hàng sang trang cụ thể
                                        </a-radio>
                                    </a-radio-group>
                                </div>
                                <div>
                                    <a-form-model-item label="Thông điệp khi đăng ký thành công" prop="title">
                                        <a-textarea v-model="form.description" :auto-size="{ minRows: 3, maxRows: 5 }" />
                                    </a-form-model-item>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 class="mb-0 border-solid border-b-[1px] border-b-gray-40 pb-2">
                                4. Chỉ định thời gian sử dụng
                            </h3>
                            <div class="grid grid-cols-1 gap-4 mt-4">
                                <p class="mb-0 italic text-sm">
                                    <span class="text-danger-100">*</span> Thời gian cho phép nhập liệu <br>
                                    Chỉ dùng với những Form giới hạn thời gian đăng ký, Ví dụ: Form tặng quà,...
                                </p>
                                <div class="max-w-96">
                                    <a-range-picker
                                        class="w-full min-w-fit"
                                        :allow-clear="true"
                                        :ranges="presetRanges"
                                        :placeholder="['Từ ngày', 'Đến ngày']"
                                        format="DD/MM/YYYY"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </a-form-model>
    </div>
</template>

<script>
    import moment from 'moment';

    export default {
        data() {
            return {
                form: {
                    pass: '',
                    checkPass: '',
                    age: '',
                },
                rules: {},
            };
        },

        computed: {
            presetRanges() {
                return {
                    'Hôm nay': [moment(), moment()],
                    'Tuần này': [moment().startOf('isoWeek'), moment().endOf('isoWeek')],
                    'Tháng này': [moment().startOf('month'), moment().endOf('month')],
                    'Năm này': [moment().startOf('year'), moment().endOf('year')],
                };
            },
        },

        methods: {
            submitForm() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        console.log('submit!');
                    } else {
                        return false;
                    }
                });
            },
            resetForm() {
                this.$refs.form.resetFields();
            },
        },
    };
</script>
