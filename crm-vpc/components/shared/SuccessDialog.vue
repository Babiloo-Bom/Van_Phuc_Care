<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        :title="false"
        centerd
        :footer="false"
    >
        <div class="text-center pb-4 pt-4">
            <h2 class="text-prim-900 text-3xl mb-3">
                Gửi Thông Tin Thành Công.
            </h2>
            <p class="max-w-[90%] text-lg mx-auto">
                Thông tin của bạn đã được ghi nhận.
            </p>
            <div class="mt-5">
                <img class="max-w-[200px] mx-auto" src="/images/check-icon.png" alt="/">
            </div>
        </div>
    </a-modal>
</template>

<script>
    export default {
        data() {
            return {
                visible: false,
            };
        },

        methods: {
            open() {
                this.visible = true;
            },

            close() {
                this.visible = false;
            },
        },
    };
</script>
