<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        :title="_isEmpty(consultation) ? 'Tạo lịch tư vấn' : 'Chỉnh sửa lịch tư vấn'"
    >
        <a-form-model
            ref="form"
            :model="form"
            layout="vertical"
            :colon="false"
        >
            <div class="grid grid-cols-1 gap-y-4">
                <a-form-model-item label="Họ và tên" prop="fullname">
                    <a-input v-model="form.fullname" placeholder="Nhập họ và tên" />
                </a-form-model-item>
                <a-form-model-item label="Số điện thoại" prop="phone">
                    <a-input v-model="form.phone" placeholder="Nhập số điện thoại" />
                </a-form-model-item>
                <a-form-model-item label="Email" prop="email">
                    <a-input v-model="form.email" placeholder="Nhập email" />
                </a-form-model-item>
                <a-form-model-item label="Triệu chứng" prop="symptom">
                    <a-textarea
                        v-model="form.symptom"
                        placeholder="Nhập triệu chứng"
                        :auto-size="{ minRows: 4, maxRows: 6 }"
                    />
                </a-form-model-item>
                <a-form-model-item label="Vấn đề cần tư vấn" prop="problemAdvice">
                    <a-textarea
                        v-model="form.problemAdvice"
                        placeholder="Nhập nộid dung"
                        :auto-size="{ minRows: 4, maxRows: 6 }"
                    />
                </a-form-model-item>
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
                {{ _isEmpty(consultation) ? "Tạo mới" : "Thay đổi" }}
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    import _isEmpty from 'lodash/isEmpty';
    import _omit from 'lodash/omit';

    export default {
        components: {
        },
        props: {
        },
        data() {
            return {
                previewVisible: false,
                visible: false,
                loading: false,
                room: null,
                form: {
                    fullname: '',
                    phone: '',
                    problemAdvice: '',
                    email: '',
                    symptom: '',
                    _id: '',
                },
                consultation: null,
            };
        },
        methods: {
            _isEmpty,
            open(consultation) {
                this.consultation = consultation;
                this.form = {
                    fullname: consultation ? consultation.fullname : '',
                    phone: consultation ? consultation.phone : '',
                    problemAdvice: consultation ? consultation.problemAdvice : '',
                    email: consultation ? consultation.email : '',
                    symptom: consultation ? consultation.symptom : '',
                    _id: consultation ? consultation._id : null,
                };
                this.visible = true;
            },

            close() {
                this.visible = false;
            },

            async submit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        try {
                            this.loading = true;
                            if (!this.form._id) {
                                await this.$api.consultations.create({ ...this.form, status: 'active' });
                                this.$message.success('Thêm thành công');
                            } else {
                                await this.$api.consultations.update(this.form._id, _omit(this.form, ['_id']));
                                this.$message.success('Sửa thành công');
                            }
                            this.close();
                            await this.$store.dispatch('consultations/fetchAll', this.$route.query);
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
