<template>
    <div class="relative min-h-[90vh] bg-[#fff] max-w-[450px] w-full !mx-auto p-4">
        <h4 class="font-[600] text-[18px] text-center mb-3">
            Báo cáo ngày {{ moment().format('DD/MM/YYYY') }}
        </h4>
        <a-form-model
            ref="form"
            :model="form"
            :rules="rules"
            :colon="false"
        >
            <div class="grid grid-cols-1 gap-4">
                <a-form-model-item label="Mã khách hàng" prop="account_code">
                    <a-input v-model="form.account_code" placeholder="VD: KH0453" @change="handleChangeAccountCode" />
                </a-form-model-item>
                <a-form-model-item label="Chiều dài của bé(cm)" prop="height">
                    <a-input
                        v-model="form.height"
                        size="large"
                        placeholder="VD: 170"
                    />
                </a-form-model-item>
                <a-form-model-item label="Cân nặng của bé(kg)" prop="weight">
                    <a-input
                        v-model="form.weight"
                        size="large"
                        placeholder="VD: 3.5"
                    />
                </a-form-model-item>
                <a-form-model-item label="Nhiệt độ của bé(độ C)" prop="temperature">
                    <a-input
                        v-model="form.temperature"
                        size="large"
                        placeholder="VD: 36.5"
                    />
                </a-form-model-item>
                <a-form-model-item label="Dữ liệu ngày" prop="recordedAt">
                    <a-date-picker
                        v-model="form.recordedAt"
                        class="w-full"
                        format="DD/MM/YYYY"
                        value-format="DD/MM/YYYY"
                        placeholder="Chọn ngày"
                        @change="handleRecordedAtChange"
                    >
                        <a-icon slot="suffixIcon" type="calendar" />
                    </a-date-picker>
                </a-form-model-item>
                <a-form-model-item label="Tình trạng sức khỏe" prop="healthCondition">
                    <a-input
                        v-model="form.healthCondition"
                        placeholder="Tình trạng sức khỏe của bé"
                    />
                </a-form-model-item>
            </div>
            <div class="border-t-[1px] border-[#ececec] my-3" />
            <div class="">
                <a-form-model-item label="Tình trạng da" prop="skinConitionsTitle">
                    <a-input
                        v-model="form.skinConitionsTitle"
                        placeholder="Tình trạng da của bé"
                    />
                </a-form-model-item>
                <a-form-model-item label="Mô tả tình trạng da" prop="skinConitionsDescription">
                    <div class="mt-1">
                        <a-textarea v-model="form.skinConitionsDescription" placeholder="Nhập mô tả về tình trạng da trong ngày" :auto-size="{ minRows: 3, maxRows: 5 }" />
                    </div>
                </a-form-model-item>
            </div>
            <div class="border-t-[1px] border-[#ececec] my-3" />
            <div class="">
                <a-form-model-item label="Sức khỏe răng miệng" prop="toothTitle">
                    <a-input
                        v-model="form.toothTitle"
                        placeholder="Tình trạng sức khỏe răng miệng của bé"
                    />
                </a-form-model-item>
                <a-form-model-item label="Mô tả sức khỏe răng miệng" prop="toothDescription">
                    <div class="mt-1">
                        <a-textarea v-model="form.toothDescription" placeholder="Nhập mô tả về sức khỏe răng miệng trong ngày" :auto-size="{ minRows: 3, maxRows: 5 }" />
                    </div>
                </a-form-model-item>
            </div>
            <div class="border-t-[1px] border-[#ececec] my-3" />
            <div class="">
                <a-form-model-item label="Dinh dưỡng" prop="nutritionTitle">
                    <a-input
                        v-model="form.nutritionTitle"
                        placeholder="Tình trạng dinh dưỡng của bé"
                    />
                </a-form-model-item>
                <a-form-model-item label="Mô tả chế độ dinh dưỡng" prop="nutritionDescription">
                    <div class="mt-1">
                        <a-textarea v-model="form.nutritionDescription" placeholder="Nhập mô tả về dinh dưỡng, cữ ăn, bú trong ngày" :auto-size="{ minRows: 3, maxRows: 5 }" />
                    </div>
                </a-form-model-item>
            </div>
            <div class="border-t-[1px] border-[#ececec] my-3" />
            <div class="">
                <a-form-model-item label="Giấc ngủ" prop="sleepingTitle">
                    <a-input
                        v-model="form.sleepingTitle"
                        placeholder="Tình trạng giấc ngủ của bé"
                    />
                </a-form-model-item>
                <a-form-model-item label="Mô tả cữ ngủ, giấc ngủ trong ngày" prop="sleepingDescription">
                    <div class="mt-1">
                        <a-textarea v-model="form.sleepingDescription" placeholder="Nhập mô tả về giấc ngủ, cữ ngủ trong ngày" :auto-size="{ minRows: 3, maxRows: 5 }" />
                    </div>
                </a-form-model-item>
            </div>
            <div class="border-t-[1px] border-[#ececec] my-3" />
            <div class="">
                <a-form-model-item label="Vấn đề tiêu hóa của bé" prop="digestiveProblems">
                    <div class="mt-1">
                        <a-textarea v-model="form.digestiveProblems" placeholder="Vấn đề tiêu hóa của bé" :auto-size="{ minRows: 3, maxRows: 5 }" />
                    </div>
                </a-form-model-item>
                <a-form-model-item label="Tần suất đại tiện" prop="frequencyOfDefecation">
                    <div class="mt-1">
                        <a-textarea v-model="form.frequencyOfDefecation" placeholder="Tần suất đại tiện trong ngày" :auto-size="{ minRows: 3, maxRows: 5 }" />
                    </div>
                </a-form-model-item>
                <a-form-model-item label="Tình trạng phân" prop="fecalCondition">
                    <div class="mt-1">
                        <a-textarea v-model="form.fecalCondition" placeholder="Tình trạng phân, màu, độ cứng" :auto-size="{ minRows: 3, maxRows: 5 }" />
                    </div>
                </a-form-model-item>
            </div>
            <div class="border-t-[1px] border-[#ececec] my-3" />
            <div class="">
                <a-form-model-item label="Tập vận động và kỹ năng" prop="symptom">
                    <div class="mt-1">
                        <a-textarea v-model="form.symptom" placeholder="Phương pháp, cách thức, kỹ năng,..." :auto-size="{ minRows: 3, maxRows: 5 }" />
                    </div>
                </a-form-model-item>
                <a-form-model-item label="Phương pháp" prop="methods">
                    <div class="mt-1">
                        <a-textarea v-model="form.methods" placeholder="Phương pháp sử dụng" :auto-size="{ minRows: 3, maxRows: 5 }" />
                    </div>
                </a-form-model-item>
                <a-form-model-item label="Lưu ý" prop="note">
                    <div class="mt-1">
                        <a-textarea v-model="form.note" placeholder="Điều cần chú ý" :auto-size="{ minRows: 3, maxRows: 5 }" />
                    </div>
                </a-form-model-item>
            </div>
        </a-form-model>

        <div class="flex justify-end mt-5">
            <a-button type="primary" class="!w-full !h-[40px]" @click="submit">
                Gửi
            </a-button>
        </div>
        <div class="flex justify-center mt-4 text-center">
            Powered by <a class="!ml-1" href="https://synck.io.vn?ref=ticket.vanphuccare.vn" target="_blank">Synck</a>
        </div>

        <SuccessDialog
            ref="SuccessDialog"
        />
    </div>
</template>

<script>
    import moment from 'moment';
    import _isEmpty from 'lodash/isEmpty';
    import _cloneDeep from 'lodash/cloneDeep';
    import SuccessDialog from '@/components/shared/SuccessDialog.vue';

    const defaultForm = {
        status: 'active',
        tooth: {},
    };

    export default {
        auth: false,
        layout: 'blank',

        components: {
            SuccessDialog,
        },

        data() {
            return {
                moment,
                loading: false,
                loadingForm: false,
                form: _cloneDeep({
                    ...defaultForm,
                    gender: 'male',
                    recordedAt: moment().format('DD/MM/YYYY'),
                }),
                rules: {
                    recordedAt: [{
                        required: true, message: 'Vui lòng không để trống', trigger: 'blur',
                    }],
                },
                genders: [
                    { label: 'Nam', value: 'male' },
                    { label: 'Nữ', value: 'female' },
                ],
            };
        },
        methods: {
            _isEmpty,

            async handleRecordedAtChange() {
                try {
                    this.loadingForm = true;
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loadingForm = false;
                }
            },

            clearForm() {
                this.form = _cloneDeep({
                    ...defaultForm,
                    recordedAt: moment().format('DD/MM/YYYY'),
                });
            },

            handleChangeAccountCode({ target }) {
                this.form.account_code = target.value?.toUpperCase()?.trim();
            },

            async submit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        try {
                            this.loading = true;
                            await this.$api.informations.createLogNotAuth({
                                ...this.form,
                                account_code: this.form?.account_code?.toUpperCase()?.trim(),
                                origin: 'vanphuccare.gensi.vn',
                            });
                            this.$refs.SuccessDialog.open();
                            this.clearForm();
                        } catch (error) {
                            const errorData = error?.response?.data;
                            this.$notification.error({
                                message: 'Đã có lỗi xảy ra',
                                description: errorData?.error?.data ? errorData?.error?.data : 'Đang tải',
                            });
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
.detail-customer {
    button.back:hover {
        background-color: #e3e3e3 !important;
    }
}
.ql-snow .ql-toolbar button svg, .quillWrapper .ql-snow.ql-toolbar button svg {
    width: 16px !important;
    height: 16px !important;
}
.ql-toolbar.ql-snow {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}
.ql-container.ql-snow {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
}
.ql-editor {
    min-height: fit-content !important;
}
.ql-toolbar.ql-snow+.ql-container.ql-snow {
}
.quillWrapper .ql-snow.ql-toolbar {
    height: 60px;
    padding-top: 4px !important;
}
.quillWrapper .ql-snow.ql-toolbar .ql-formats {
    margin-bottom: 0 !important;
}
.quillWrapper {
    height: 181px;
    padding-bottom: 70px;
}
.ant-form-item-label {
    padding-bottom: 0 !important;
}
.ant-form .ant-form-item {
    margin-bottom: 0 !important;
}
</style>
