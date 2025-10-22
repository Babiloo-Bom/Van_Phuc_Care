<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        :dialog-style="{ top: '20px' }"
        width="800px"
        :title="_isEmpty(record) ? 'Tạo sổ sức khỏe' : 'Chỉnh sửa bản ghi'"
    >
        <a-form-model
            ref="form"
            :model="form"
            :rules="rules"
            :colon="false"
        >
            <div class="grid grid-cols-12 gap-4 border-b-[1px] border-[#ececec] pb-6 mb-3">
                <div class="flex flex-col col-span-3 justify-start">
                    <div>
                        <h3 class="font-semibold text-center mb-2 text-sm">
                            Ảnh của bé
                        </h3>
                        <div class="flex flex-col items-center gap-y-5 mb-2 w-full">
                            <img
                                v-if="form && form.avatar"
                                :src="form.avatar"
                                onerror="this.src='/images/avatar-empty.webp'"
                                alt=""
                                class="w-full h-[200px] rounded-md object-cover"
                            >
                            <div v-else class="w-[80px] h-[80px] rounded-md border-dashed border border-gray-400 flex justify-center items-center">
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
                                        <img src="/images/upload.svg" alt="avatar">
                                        Upload
                                    </div>
                                </a-upload>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-span-9 grid grid-cols-1 gap-4">
                    <a-form-model-item label="Khách hàng" prop="title">
                        <a-input v-model="form.customerEmail" placeholder="VD: harveynguyen@gmail.com" />
                    </a-form-model-item>
                    <div class="grid grid-cols-1 gap-4">
                        <div class="grid grid-cols-2 gap-4">
                            <a-form-model-item label="Tên bé" prop="title">
                                <a-input v-model="form.name" placeholder="VD: Nguyen Huy Hoang" />
                            </a-form-model-item>
                            <a-form-model-item label="Giới tính">
                                <a-radio-group
                                    v-model="form.gender"
                                    :options="genders"
                                    default-value="male"
                                    @change="(e) => form.gender = e.target.value"
                                />
                            </a-form-model-item>
                        </div>
                        <div class="grid grid-cols-3 gap-4">
                            <a-form-model-item label="Chiều cao(cm)" prop="height">
                                <a-input
                                    v-model="form.height"
                                    size="large"
                                    placeholder="VD: 170"
                                />
                            </a-form-model-item>
                            <a-form-model-item label="Cân nặng(kg)" prop="weight">
                                <a-input
                                    v-model="form.weight"
                                    size="large"
                                    placeholder="VD: 3,5"
                                />
                            </a-form-model-item>
                            <a-form-model-item label="Nhiệt độ (độ C)" prop="temperature">
                                <a-input
                                    v-model="form.temperature"
                                    size="large"
                                    placeholder="VD: 36,5"
                                />
                            </a-form-model-item>
                        </div>
                        <a-form-model-item label="Ngày sinh" prop="dob">
                            <a-date-picker
                                v-model="form.dob"
                                class="w-full"
                                format="DD/MM/YYYY"
                                value-format="DD/MM/YYYY"
                                placeholder="Chọn ngày sinh"
                            >
                                <a-icon slot="suffixIcon" type="calendar" />
                            </a-date-picker>
                        </a-form-model-item>
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-12 gap-4 mt-4">
                <div class="col-span-4">
                    <span class="text-[13px] font-bold text-[#000] mb-[7px] block">Dữ liệu ngày</span>
                    <a-form-model-item label="" prop="recordedAt">
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
                </div>
                <div class="col-span-8">
                    <a-form-model-item label="Tình trạng sức khỏe" prop="healthCondition">
                        <a-input
                            v-model="form.healthCondition"
                            placeholder=""
                        />
                    </a-form-model-item>
                </div>
            </div>
            <div class="grid grid-cols-12 gap-4 mt-4">
                <div class="col-span-4">
                    <a-form-model-item label="Tình trạng da" prop="skinConitionsTitle">
                        <a-input
                            v-model="form.skinConitionsTitle"
                            placeholder=""
                        />
                    </a-form-model-item>
                </div>
                <div class="col-span-8">
                    <a-form-model-item label="Mô tả" prop="skinConitionsDescription">
                        <div class="mt-1">
                            <vue-editor v-model="form.skinConitionsDescription" :editor-toolbar="customToolbar" />
                        </div>
                    </a-form-model-item>
                </div>
            </div>
            <div class="grid grid-cols-12 gap-4 mt-4">
                <div class="col-span-4">
                    <a-form-model-item label="Sức khỏe răng miệng" prop="toothTitle">
                        <a-input
                            v-model="form.toothTitle"
                            placeholder=""
                        />
                    </a-form-model-item>
                </div>
                <div class="col-span-8">
                    <a-form-model-item label="Mô tả" prop="toothDescription">
                        <div class="mt-1">
                            <vue-editor v-model="form.toothDescription" :editor-toolbar="customToolbar" />
                        </div>
                    </a-form-model-item>
                </div>
            </div>
            <div class="grid grid-cols-12 gap-4 mt-4">
                <div class="col-span-4">
                    <a-form-model-item label="Dinh dưỡng" prop="nutritionTitle">
                        <a-input
                            v-model="form.nutritionTitle"
                            placeholder=""
                        />
                    </a-form-model-item>
                </div>
                <div class="col-span-8">
                    <a-form-model-item label="Mô tả" prop="nutritionDescription">
                        <div class="mt-1">
                            <vue-editor v-model="form.nutritionDescription" :editor-toolbar="customToolbar" />
                        </div>
                    </a-form-model-item>
                </div>
            </div>
            <div class="grid grid-cols-12 gap-4 mt-4">
                <div class="col-span-4">
                    <a-form-model-item label="Giấc ngủ" prop="sleepingTitle">
                        <a-input
                            v-model="form.sleepingTitle"
                            placeholder=""
                        />
                    </a-form-model-item>
                </div>
                <div class="col-span-8">
                    <a-form-model-item label="Mô tả" prop="sleepingDescription">
                        <div class="mt-1">
                            <vue-editor v-model="form.sleepingDescription" :editor-toolbar="customToolbar" />
                        </div>
                    </a-form-model-item>
                </div>
            </div>
            <div class="grid grid-cols-3 gap-4 my-4">
                <a-form-model-item label="Tần suất đại tiện" prop="frequencyOfDefecation">
                    <div class="mt-1">
                        <vue-editor v-model="form.frequencyOfDefecation" :editor-toolbar="customToolbar" />
                    </div>
                </a-form-model-item>
                <a-form-model-item label="Tình trạng phân" prop="fecalCondition">
                    <div class="mt-1">
                        <vue-editor v-model="form.fecalCondition" :editor-toolbar="customToolbar" />
                    </div>
                </a-form-model-item>
                <a-form-model-item label="Vấn đề tiêu hóa" prop="digestiveProblems">
                    <div class="mt-1">
                        <vue-editor v-model="form.digestiveProblems" :editor-toolbar="customToolbar" />
                    </div>
                </a-form-model-item>
            </div>
            <a-form-model-item label="Tập vận động và kỹ năng" prop="symptom">
                <div class="mt-1">
                    <vue-editor v-model="form.symptom" :editor-toolbar="customToolbar" />
                </div>
            </a-form-model-item>
            <div class="mt-4">
                <a-form-model-item label="Phương pháp" prop="methods">
                    <div class="mt-1">
                        <vue-editor v-model="form.methods" :editor-toolbar="customToolbar" />
                    </div>
                </a-form-model-item>
            </div>
            <div class="mt-4">
                <a-form-model-item label="Lưu ý" prop="note">
                    <div class="mt-1">
                        <vue-editor v-model="form.note" :editor-toolbar="customToolbar" />
                    </div>
                </a-form-model-item>
                <!-- <a-form-model-item label="Tiêm chủng">
                    <a-radio-group :options="vaccination" default-value="no" @change="(e) => form.vaccination = e.target.value" />
                </a-form-model-item> -->
            </div>
        </a-form-model>
        <div slot="footer" class="flex justify-center items-center gap-2">
            <a-button class="w-28" @click="close">
                Hủy bỏ
            </a-button>
            <a-button
                :loading="loading"
                class="px-2"
                type="primary"
                @click="submit"
            >
                {{ _isEmpty(record) ? "Tạo mới" : "Thay đổi" }}
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    import _isEmpty from 'lodash/isEmpty';
    import _omit from 'lodash/omit';
    import _cloneDeep from 'lodash/cloneDeep';
    import moment from 'moment';
    import { convertToFormData } from '@/utils/form';
    import { VueEditor } from 'vue2-editor';

    const defaultForm = {
        status: 'active',
        tooth: {},
    };

    export default {
        components: {
            VueEditor,
        },
        data() {
            return {
                visible: false,
                loading: false,
                loadingForm: false,
                form: this.record ? _cloneDeep({
                    ...this.record,
                    recordedAt: this.record.recordedAt || this.record.updatedAt,
                }) : _cloneDeep({
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
                    { label: 'Khác', value: null },
                ],
                customToolbar: [
                    ['bold', 'italic', 'underline'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                ],
                record: null,
                thumbnailFile: null,
            };
        },

        watch: {
            record() {
                this.form = this.record
                    ? _cloneDeep({
                        ...this.record,
                        recordedAt: this.record.recordedAt
                            ? moment(this.record.recordedAt, 'DD/MM/YYYY').format('DD/MM/YYYY')
                            : moment(this.record.updatedAt).format('DD/MM/YYYY'),
                    })
                    : _cloneDeep({
                        ...defaultForm,
                        recordedAt: moment().format('DD/MM/YYYY'),
                    });

                console.log(this.form);
                console.log(this.record);
            },
        },
        methods: {
            _isEmpty,
            open(record) {
                this.record = record || {};
                this.form = _cloneDeep(record);
                this.visible = true;
            },

            close() {
                this.visible = false;
            },

            handlerThumbnail(file) {
                this.thumbnailFile = file;
                this.form.avatar = URL.createObjectURL(file);
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

            async submit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        try {
                            this.loading = true;
                            if (this.thumbnailFile) {
                                const { data: { fileAttributes } } = await this.$api.uploaders.uploadFile(convertToFormData({
                                    files: this.thumbnailFile,
                                }));
                                this.form = { ...this.form, avatar: fileAttributes[0]?.source };
                            }
                            if (!this.form._id) {
                                await this.$api.healthBooks.create({
                                    ...this.form,
                                    status: 'active',
                                    updatedAt: new Date(),
                                    origin: 'vanphuccare.gensi.vn',
                                });
                                this.$message.success('Tạo bản ghi thành công');
                            } else {
                                await this.$api.healthBooks.update(this.form._id, _omit({
                                    ...this.form,
                                    updatedAt: new Date(),
                                    origin: 'vanphuccare.gensi.vn',
                                }, ['_id', 'updatedAt', 'createdAt', 'domain', 'origin']));
                                await this.$store.dispatch('health-book/fetchDetail', this.form._id);
                                this.$message.success('Sửa thành công');
                            }
                            await this.$store.dispatch('health-book/fetchAll', { ...this.$route.query });
                            this.close();
                        } catch (error) {
                            if (error.response?.status === 400) {
                                this.$message.error(error.response?.data?.error?.data);
                            } else {
                                this.$handleError(error);
                            }
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
</style>
