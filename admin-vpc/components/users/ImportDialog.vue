<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        title="Import khách hàng"
    >
        <div class="mb-6">
            {{ 'Tải xuống bản mẫu' }}
            <span class="text-[#1a77ba] cursor-pointer uppercase" @click="downloadTemplate"> tại đây </span>
        </div>
        <a-upload
            v-if="!file"
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader inport-user"
            accept=".xlsx"
            :show-upload-list="false"
            :transform-file="handlerUpload"
            action="#"
        >
            <div class="bg-gray-300 w-8 h-8 rounded-full mx-auto flex items-center justify-center">
                <i class="far fa-file-alt mr-2" />
            </div>
            <div class="text-base">
                {{ 'Tải lên file xlsx' }}
            </div>
        </a-upload>
        <div v-else class="flex justify-between p-2 border rounded-md border-second-400">
            <span><i class="far fa-file-alt mr-2" />{{ file.name }}</span>
            <span class="cursor-pointer" @click="removeFile"><i class="fa-solid fa-xmark pr-2" /></span>
        </div>
        <div slot="footer" class="flex justify-end items-center gap-2">
            <a-button class="w-28" @click="close">
                {{ 'Hủy' }}
            </a-button>
            <a-button
                :loading="loading"
                class="w-28"
                type="primary"
                @click="importUser"
            >
                {{ 'Import' }}
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    import { convertToFormData } from '@/utils/form';

    export default {
        data() {
            return {
                visible: false,
                loading: false,
                file: null,
            };
        },

        methods: {
            open() {
                this.visible = true;
            },

            close() {
                this.visible = false;
                this.removeFile();
            },

            handlerUpload(file) {
                this.file = file;
            },

            removeFile() {
                this.file = null;
            },

            async importUser() {
                try {
                    this.loading = true;
                    await this.$api.account.users.import(convertToFormData({
                        file: this.file,
                    }));
                    this.$message.success('Import thành công');
                    this.close();
                    this.$nuxt.refresh();
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },

            async downloadTemplate() {
                try {
                    await this.$api.account.users.downloadTemplate();
                } catch (error) {
                    this.$handleError(error);
                }
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
