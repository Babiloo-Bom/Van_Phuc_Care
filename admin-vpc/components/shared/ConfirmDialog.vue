<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        :title="title"
    >
        <template v-if="content">
            {{ content }}
        </template>
        <slot v-else />
        <div v-if="footer" slot="footer" class="flex justify-end items-center gap-2">
            <a-button class="w-28" @click="handleCancel">
                Hủy bỏ
            </a-button>
            <a-button
                :loading="loading"
                class="w-28 !bg-[red] !border-[red]"
                :type="confirmBtnType"
                @click="handleConfirm"
            >
                {{ confirmBtn }}
            </a-button>
        </div>
        <div v-else slot="footer" clas="!p-0" />
    </a-modal>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                default: 'Xác nhận',
            },
            content: String,
            confirmBtn: {
                type: String,
                default: 'Xác nhận',
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
            footer: {
                type: Boolean,
                default: true,
            },
            loading: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                visible: false,
            };
        },

        methods: {
            open(roomType) {
                this.roomType = roomType;
                this.visible = true;
            },

            close() {
                this.visible = false;
            },

            async handleConfirm() {
                await this.$emit('confirm');
                this.close();
            },

            handleCancel() {
                this.$emit('cancel');
                this.close();
            },
        },
    };
</script>
