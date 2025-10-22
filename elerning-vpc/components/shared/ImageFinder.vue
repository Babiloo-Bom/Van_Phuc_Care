<template>
    <div class="upload-wrapper">
        <a-spin :spinning="loading">
            <a-upload
                v-if="type === 'image'"
                name="avatar"
                list-type="picture-card"
                class="image-uploader"
                :show-upload-list="false"
                action=""
                :transform-file="handlerFile"
            >
                <img
                    v-if="url"
                    :src="url"
                    alt="avatar"
                    class="w-full h-[18rem] object-cover"
                >
                <div v-else>
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">
                        Upload
                    </div>
                </div>
            </a-upload>
            <div v-if="type === 'audio'">
                <a-upload
                    action=""
                    :show-upload-list="false"
                    :transform-file="handlerFile"
                >
                    <a-button> <a-icon type="upload" /> Upload </a-button>
                </a-upload>
                <audio
                    v-if="url"
                    :key="url"
                    controls
                    class="mt-4"
                >
                    <source :src="url">
                </audio>
            </div>
            <div v-if="type === 'video'">
                <a-upload
                    action=""
                    :show-upload-list="false"
                    :transform-file="handlerFile"
                >
                    <a-button> <a-icon type="upload" /> Upload </a-button>
                </a-upload>
                <video
                    v-if="url"
                    :key="url"
                    controls
                    class="mt-4"
                ><source :src="url"></video>
            </div>
        </a-spin>
        <div v-if="data" class="flex justify-end gap-4 mt-4">
            <a-button type="primary" ghost @click="$emit('close')">
                Cancel
            </a-button>
            <a-button type="primary" @click="$emit('upload')">
                Upload
            </a-button>
        </div>
    </div>
</template>

<script>
    import _includes from 'lodash/includes';
    import { IMAGE_TYPES, VIDEO_TYPES, AUDIO_TYPES } from '@/constants/fileTypes';
    import { image as toImage } from '@/utils/url';
    import { convertToFormData } from '@/utils/form';

    export default {
        props: {
            type: {
                type: String,
                required: true,
            },
        },
        data() {
            return {
                IMAGE_TYPES,
                VIDEO_TYPES,
                AUDIO_TYPES,
                loading: false,
                data: undefined,
                url: '',
            };
        },

        methods: {
            toImage,

            async handlerFile(file) {
                try {
                    this.loading = true;
                    // eslint-disable-next-line no-nested-ternary
                    if (_includes(this.type === 'image' ? this.IMAGE_TYPES : this.type === 'audio' ? this.AUDIO_TYPES : this.VIDEO_TYPES, file.type)) {
                        const { data: { fileAttributes } } = await this.$api.uploaders.uploadFile(convertToFormData({
                            files: file,
                        }));
                        this.data = fileAttributes[0]?.source;
                        this.confirmPick(fileAttributes[0]?.source);
                        this.url = URL.createObjectURL(file);
                    } else {
                        this.$message.error(`Please enter the correct ${this.type} format`);
                    }
                } catch (error) {
                    this.$handleError(error, this.$message);
                } finally {
                    this.loading = false;
                }
            },

            confirmPick(imageUrl) {
                this.$emit('confirmPick', imageUrl);
            },
        },
    };
</script>

<style lang="scss">
    .image-uploader {
        .ant-upload {
            @apply w-full h-[18rem];
        }
    }
</style>
