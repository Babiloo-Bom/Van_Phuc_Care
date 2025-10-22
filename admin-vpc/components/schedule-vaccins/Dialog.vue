<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        width="800px"
        :title="_isEmpty(record) ? 'Tạo lịch tiêm' : 'Chỉnh sửa lịch tiêm'"
    >
        <a-form-model
            ref="form"
            :model="form"
            :rules="rules"
            :colon="false"
        >
            <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col justify-between">
                    <div>
                        <h3 class="font-semibold mb-1 text-sm">
                            Ảnh Thumbnail
                        </h3>
                        <div class="flex flex-col items-center gap-y-5 mb-2 w-full">
                            <img
                                v-if="form.thumbnail"
                                :src="form.thumbnail"
                                onerror="this.src='/images/avatar-empty.webp'"
                                alt=""
                                class="w-full h-[200px] rounded-md object-cover"
                            >
                            <div v-else class="w-full h-[200px] rounded-md border-dashed border border-gray-400 flex justify-center items-center">
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
                    <a-form-model-item label="Thông tin Vắc xin" prop="link">
                        <a-input v-model="form.link" placeholder="Link thông tin" />
                    </a-form-model-item>
                </div>
                <div class="grid grid-cols-1 gap-2">
                    <a-form-model-item label="Tiêu đề" prop="title">
                        <a-input v-model="form.title" placeholder="Nhập tiêu đề" />
                    </a-form-model-item>
                    <div class="grid grid-cols-2 gap-4">
                        <a-form-model-item label="Mũi tiêm" prop="numberOfInjections">
                            <a-input v-model="form.numberOfInjections" placeholder="Nhập mũi tiêm" />
                        </a-form-model-item>
                        <a-form-model-item label="Danh mục" prop="category">
                            <a-select
                                v-model="form.category"
                                class="w-full max-w-[160px]"
                                :options="[{
                                    label: 'Tất cả',
                                    value: 'all'
                                }, {
                                    label: 'Trẻ sơ sinh',
                                    value: 'new-born'
                                }, {
                                    label: '2 tháng tuổi',
                                    value: '2-months'
                                }, {
                                    label: '3 tháng tuổi',
                                    value: '3-months'
                                }, {
                                    label: '4 tháng tuổi',
                                    value: '4-months'
                                }, {
                                    label: '6 tháng tuổi',
                                    value: '6-months'
                                }, {
                                    label: '7 tháng tuổi',
                                    value: '7-months'
                                }, {
                                    label: '8 tháng tuổi',
                                    value: '8-months'
                                }, {
                                    label: '9 tháng tuổi',
                                    value: '9-months'
                                }, {
                                    label: '12 tháng tuổi',
                                    value: '12-months'
                                }, {
                                    label: '18 tháng tuổi',
                                    value: '18-months'
                                }]"
                            />
                        </a-form-model-item>
                    </div>
                    <!-- <a-form-model-item label="Thời gian tiêm" prop="time">
                        <a-date-picker
                            v-model="form.time"
                            class="w-full"
                            format="DD/MM/YYYY"
                            value-format="DD/MM/YYYY"
                            placeholder="Chọn ngày tiêm"
                        >
                            <a-icon slot="suffixIcon" type="calendar" />
                        </a-date-picker>
                    </a-form-model-item> -->
                    <a-form-model-item label="Địa chỉ" prop="address">
                        <a-textarea
                            v-model="form.address"
                            placeholder="Nhập địa chỉ"
                            :auto-size="{ minRows: 4, maxRows: 4 }"
                            class="!mb-0"
                        />
                    </a-form-model-item>
                </div>
                <div class="col-span-2">
                    <a-form-model-item label="Nội dung" prop="content">
                        <a-textarea
                            v-model="form.content"
                            placeholder="Nhập nội dung"
                            :auto-size="{ minRows: 6, maxRows: 6 }"
                        />
                    </a-form-model-item>
                </div>
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
    import { convertToFormData, urlValidtor } from '@/utils/form';

    const defaultForm = {
        title: '',
        thumbnail: '',
        numberOfInjections: '01',
        // time: '',
        status: 'active',
        content: '',
        address: '',
        link: '',
        category: 'new-born',
    };

    export default {
        data() {
            return {
                visible: false,
                loading: false,
                form: this.record ? _cloneDeep(this.record) : _cloneDeep(defaultForm),
                rules: {
                    title: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    numberOfInjections: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    // time: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    content: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    address: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    link: [{ required: false, validtor: urlValidtor, trigger: 'blur' }],
                },
                record: null,
                thumbnailFile: null,
            };
        },

        watch: {
            record() {
                this.form = this.record ? _cloneDeep(this.record) : _cloneDeep(defaultForm);
            },
        },

        methods: {
            _isEmpty,
            open(record) {
                this.record = record;
                this.visible = true;
            },

            close() {
                this.visible = false;
            },

            handlerThumbnail(file) {
                this.thumbnailFile = file;
                this.form.thumbnail = URL.createObjectURL(file);
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
                                this.form = { ...this.form, thumbnail: fileAttributes[0]?.source };
                            }
                            if (!this.form._id) {
                                await this.$api.schedules.create({
                                    ...this.form,
                                    status: 'active',
                                });
                                this.$message.success('Thêm thông tin Vắc xin thành công');
                            } else {
                                await this.$api.schedules.update(this.form._id, _omit(this.form, ['_id']));
                                this.$message.success('Sửa thông tin Vắc xin thành công');
                            }
                            this.close();
                            await this.$store.dispatch('schedule-vaccins/fetchAll', { ...this.$route.query });
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
