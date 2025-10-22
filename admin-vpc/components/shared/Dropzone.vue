<template>
    <div class="el-dropzone dropzone" />
</template>

<script>
    import _pick from 'lodash/pick';

    export default {
        props: {
            url: {
                type: String,
                default: `${process.env.API_HOST}/uploader`,
            },
            method: {
                type: String,
                default: 'post',
            },
            clickable: {
                type: Boolean,
                default: true,
            },
            acceptedFiles: {
                type: String,
                default: 'image/jpeg,image/png,image/gif,audio/*, video/*',
            },
            thumbnailHeight: {
                type: Number,
                default: 200,
            },
            thumbnailWidth: {
                type: Number,
                default: 200,
            },
            addRemoveLinks: {
                type: Boolean,
                default: true,
            },
            maxFilesize: {
                type: Number,
                default: 6,
            },
            maxFiles: {
                type: Number,
                default: 5,
            },
            autoProcessQueue: {
                type: Boolean,
                default: true,
            },
            parallelUploads: {
                type: Number,
                default: 2,
            },
            params: {
                type: Function,
                default: () => {},
            },
            uploadMultiple: Boolean,
            paramName: {
                type: String,
                default: 'files',
            },
        },
        data() {
            const options = _pick(this.$props, [
                'url', 'method', 'params',
                'maxFiles', 'maxFilesize', 'acceptedFiles',
                'parallelUploads', 'uploadMultiple', 'autoProcessQueue',
                'clickable', 'thumbnailWidth', 'thumbnailHeight', 'addRemoveLinks', 'paramName',
            ]);

            const authToken = this.$auth.strategy.token.get();

            return {
                authToken,
                dropzoneOptions: {
                    ...options,
                    dictRemoveFile: 'Remove',
                    dictDefaultMessage: '<i class="el-icon-upload fa-3x" aria-hidden="true"></i><br>Drag and drop files here or click to upload',
                    previewTemplate:
                        `<div class="dz-preview dz-file-preview">
                            <div class="dz__image">
                                <img data-dz-thumbnail alt=""/>
                                <div class="dz__upload-status">
                                    <div class="dz__upload-status__success"><i class="fa fa-check"></i></div>
                                    <div class="dz__upload-status__error"><i class="fa fa-times"></i></div>
                                </div>
                            </div>
                            <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                            <div class="dz-details">
                                <div class="dz-filename"><span data-dz-name></span></div>
                                <div class="dz-size" data-dz-size></div>
                            </div>
                        </div>`,
                    headers: {
                        Authorization: authToken,
                    },
                },
            };
        },
        mounted() {
            if (this.$isServer || this.$_dropzone) {
                return;
            }
            const { createDropzone } = require('@/libs/dropzone');
            this.$_dropzone = createDropzone(this.$el, this.dropzoneOptions, this.authToken);
            const events = ['addedfile', 'removedfile', 'success', 'error', 'processing', 'sending'];
            events.forEach((event) => {
                this.$_dropzone.on(event, this.$emit.bind(this, event));
            });
        },
        beforeDestroy() {
            if (this.$_dropzone) {
                this.$_dropzone.destroy();
            }
        },
    };
</script>

<style lang="scss" src="@/assets/components/dropzone.scss"/>
