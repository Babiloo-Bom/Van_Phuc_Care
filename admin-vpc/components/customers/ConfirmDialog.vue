<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        :title="title"
        centered
        :mask-closable="false"
    >
        <template v-if="content">
            {{ content }}
        </template>
        <slot v-else />
        <div slot="footer" class="flex justify-end items-center gap-2">
            <a-button class="w-28" @click="handleCancel">
                {{ 'Hủy' }}
            </a-button>
            <a-button
                :loading="loading"
                class="w-28 !bg-[#e51c00] !border-[#e51c00]"
                :type="confirmBtnType"
                @click="handleConfirm"
            >
                {{ confirmBtn }}
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                default: 'shared.save',
            },
            content: String,
            confirmBtn: {
                type: String,
                default: 'Xóa',
            },
            confirmIcon: String,
            confirmBtnType: {
                type: String,
                default: 'primary',
            },
            cancelBtn: {
                type: String,
                default: 'Hủy',
            },
        },

        data() {
            return {
                visible: false,
                loading: false,
            };
        },

        methods: {
            open(data) {
                console.log(data);
                this.visible = true;
            },

            close() {
                this.visible = false;
            },

            async handleConfirm() {
                this.loading = true;
                await this.$emit('confirm');
                this.loading = false;
                this.close();
            },

            handleCancel() {
                this.$emit('cancel');
                this.close();
            },
        },
    };
</script>
