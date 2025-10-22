<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        :title="title"
        centerd
    >
        <template v-if="content">
            {{ content }}
        </template>
        <slot v-else />
        <div slot="footer" class="flex justify-center items-center gap-2">
            <a-button class="w-28" @click="handleCancel">
                {{ cancelBtn }}
            </a-button>
            <a-button
                :loading="loading"
                class="w-28"
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
                default: 'Confirmation',
            },
            content: String,
            confirmBtn: {
                type: String,
                default: 'Đồng ý',
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
                roomType: '',
            };
        },

        methods: {
            open() {
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
