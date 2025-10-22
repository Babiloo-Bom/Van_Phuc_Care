<template>
    <div>
        <h3 class="text-xl font-semibold">
            Hợp đồng dịch vụ
        </h3>
        <p>File đã upload: <a-button type="link" class="font-bold" @click="openFile">{{ fileProp?.name || fileProp?.originalname }}</a-button></p>
        <a-upload-dragger
            name="file"
            :multiple="true"
            :show-upload-list="false"
            :accept="CONTRACT_FILE_TYPES.toString()"
            @change="handleChange"
        >
            <p class="ant-upload-text mb-0">
                Thêm tệp hoặc thả tệp vào đây
            </p>
        </a-upload-dragger>
        <div v-if="file" class="mt-4">
            <a :href="file.source" target="_blank">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="80"
                    height="80"
                    viewBox="0 0 24 24"
                    class="fill-none stroke-[#868686]"
                ><path
                    d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                /><path
                    d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                /></svg>
                <span class="block mt-1 text-left">
                    File: {{ file.name || fileProp?.originalname}}
                </span>
            </a>
        </div>
    </div>
</template>

<script>
    import _cloneDeep from 'lodash/cloneDeep';
    import { CONTRACT_FILE_TYPES } from '@/constants/fileTypes';

    export default {
        props: {
            fileProp: {
                type: [String, Object, Array],
            },
        },

        data() {
            return {
                CONTRACT_FILE_TYPES,
                file: this.fileProp ? _cloneDeep(this.fileProp) : null,
            };
        },

        methods: {
            handleChange({ file }) {
                this.file = file;
                this.file.source = URL.createObjectURL(file.originFileObj);
            },
            openFile() {
                window.open(this.fileProp.source, '_blank');
            },

            submit() {
                this.$emit('submit', { contract: this.file });
            },
        },
    };
</script>
