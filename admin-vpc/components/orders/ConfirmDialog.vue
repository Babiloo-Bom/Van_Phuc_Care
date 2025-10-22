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
        <div class="mt-4">
            <span class="font-bold">{{ $t('order.notifi_content') }}</span>
            <ul
                class="mb-0"
                style="
                list-style-type: disc;
                padding-left: 18px;"
            >
                <li>{{ 'Đơn đặt hàng đã bị hủy' }}</li>
                <li>{{ 'Đơn đặt hàng đã hoàn thành' }}</li>
                <li>{{ 'Đơn hàng từ dịch vụ bên thứ ba' }}</li>
            </ul>
        </div>
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
                <i :class="confirmIcon" /> {{ confirmBtn }}
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                default: 'Xóa đơn hàng',
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
            open(roomType) {
                this.roomType = roomType;
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
