<template>
    <a-upload
        action="#"
        class="ct-image-upload"
        :accept="accept"
        list-type="picture-card"
        :show-upload-list="false"
        @change="handleChange"
    >
        <a-spin :spinning="loading">
            <div v-if="value">
                <div>{{ fileAttributes.originalname }}</div>
                <div class="text-sm">
                    {{ fileAttributes.size / 1000 | numberFormat }}KB
                </div>
            </div>
            <div v-else>
                <i class="fas fa-upload mr-2" /> Tải tệp lên
                <div class="text-sm text-gray-60">
                    Vui lòng chọn file có kích thước dưới {{ sizeLimit }}MB
                </div>
            </div>
        </a-spin>
    </a-upload>
</template>

<script>
    import { convertToFormData } from '@/utils/form';

    export default {
        model: {
            prop: 'value',
            event: 'change',
        },

        props: {
            value: String,
            aspectRatio: {
                type: String,
                default: 'video',
            },
            sizeLimit: {
                type: Number,
                default: 5, // limit by MB
            },
            accept: {
                type: String,
                default: '*',
            },
        },

        data() {
            return {
                fileAttributes: {},
                loading: false,
            };
        },

        methods: {
            async handleChange({ file, event }) {
                try {
                    this.loading = true;
                    if (event?.percent === 100) {
                        if (file.size > this.sizeLimit * 1000000) {
                            this.$message.warning(`Vui lòng chọn file có kích thước < ${this.sizeLimit}MB`);
                            return;
                        }
                        if (this.accept !== '*' && !this.accept.includes(file.type)) {
                            this.$message.warning(`Vui lòng chọn đúng định dạng file ${this.accept}`);
                            return;
                        }
                        const { data: { fileAttributes } } = await this.$api.uploader.uploadFile(convertToFormData({
                            files: file,
                        }));
                        this.fileAttributes = fileAttributes?.[0];
                        this.$emit('change', fileAttributes?.[0]?.source, this.fileAttributes);
                    }
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },
    };
</script>

<style lang="scss">
    .ct-image-upload {
        @apply aspect-video #{!important};
        .ant-upload {
            @apply flex justify-center items-center w-full h-full m-0 p-0 overflow-hidden #{!important};
        }
    }
</style>
