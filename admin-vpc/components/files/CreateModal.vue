<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        :centered="true"
        :title="form._id ? 'Chỉnh sửa' : 'Thêm thư mục'"
    >
        <a-form-model
            ref="form"
            :model="form"
            :rules="rules"
        >
            <div class="grid grid-cols-1 gap-y-2">
                <a-form-model-item label="Tên thư mục" prop="name">
                    <a-input v-model="form.name" placeholder="Nhập tên thư mục" @keyup.native.enter="handleSubmit" />
                </a-form-model-item>
                <a-form-model-item label="Mô tả" prop="descriptions">
                    <a-textarea
                        v-model="form.descriptions"
                        placeholder="Nhập mô tả"
                        :auto-size="{ minRows: 4, maxRows: 5 }"
                        @keyup.native.enter="handleSubmit"
                    />
                </a-form-model-item>
            </div>
        </a-form-model>
        <div slot="footer" class="flex justify-end items-center gap-2">
            <a-button class="w-28" @click="close">
                {{ 'Hủy' }}
            </a-button>
            <a-button
                :loading="loading"
                class="w-28"
                type="primary"
                @click="handleSubmit"
            >
                {{ form._id ? `Cập nhật` : `Tạo mới` }}
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    import _cloneDeep from 'lodash/cloneDeep';
    import _omit from 'lodash/omit';

    const defaultForm = {
        name: '',
        descriptions: '',
    };
    export default {
        data() {
            return {
                visible: false,
                loading: false,
                form: defaultForm,
                rules: {
                    name: [{
                        required: true, message: 'Vui lòng tên thư mục', trigger: 'blur',
                    }],
                },
            };
        },

        methods: {
            open(data) {
                this.form = data._id ? _cloneDeep(data) : { ...defaultForm, ...data };
                this.visible = true;
            },

            close() {
                this.visible = false;
            },

            handlerUpload(file) {
                this.file = file;
            },

            async handleSubmit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        try {
                            this.loading = true;
                            if (this.form._id) {
                                await this.$store.dispatch('documents/update', {
                                    _id: this.form._id,
                                    data: _omit(this.form, ['_id']),
                                });
                                this.$message.success('Cập nhật thành công');
                                this.close();
                            } else {
                                await this.$api.documents.create({ ...this.form, type: 'folder' });
                                this.$message.success('Tạo bản ghi thành công');
                                this.close();
                            }
                        } catch (error) {
                            this.$handleError(error);
                        } finally {
                            this.loading = false;
                            this.form = {};
                            await this.$store.dispatch('documents/fetchFolders', this.$route.query);
                        }
                    }
                });
            },
        },
    };
</script>

<style lang="scss">
.inport-user {
    .ant-upload {
        @apply w-full;
    }
}
</style>
