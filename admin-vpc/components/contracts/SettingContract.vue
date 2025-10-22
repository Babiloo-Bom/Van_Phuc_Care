<template>
    <div class="grid grid-cols-1 gap-3">
        <a-checkbox :checked="data.autoExtension">
            Tự động gia hạn hợp đồng
        </a-checkbox>
        <a-checkbox :checked="data.autoCreateOrder">
            Tự động tạo đơn hàng
        </a-checkbox>
        <a-checkbox :checked="data.autoNotificationExprise">
            Tự động báo động sắp hết hạn hợp đồng
        </a-checkbox>
        <a-checkbox :checked="data.autoSendEmail">
            Tự động gửi email hợp đồng mới
        </a-checkbox>
    </div>
</template>

<script>
    export default {
        props: {
            data: {
                type: String,
            },
        },
    };
</script>
<style>
.ant-checkbox-wrapper + .ant-checkbox-wrapper {
    margin-left: 0 !important;
}
</style>
