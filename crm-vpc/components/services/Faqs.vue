<template>
    <div class="py-4">
        <h4 class="faqs-section text-[#1A75BB] text-[18px] font-[600] m-0 text-center mb-4">
            Câu hỏi thường gặp
        </h4>
        <a-collapse :bordered="false" :show-arrow="false">
            <a-collapse-panel v-for="(record, index) in data" :key="`faqs_${index}`">
                <template #header>
                    <div class="flex items-center justify-between">
                        <span class="font-[600]">{{ record.title }}</span>
                        <svg
                            class="transition-all duration-300"
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                        ><path
                            stroke="#1A75BB"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-miterlimit="10"
                            stroke-width="2"
                            d="M19.92 8.95l-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
                        /></svg>
                    </div>
                </template>
                <div v-html="record.content" />
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<script>
    export default {
        props: {
            data: {
                type: Array,
                default: () => [],
            },
        },
    };
</script>
<style lang="scss">
.ant-collapse-borderless {
    background: transparent !important;
}
.ant-collapse-arrow {
    display: none !important;
}
.ant-collapse > .ant-collapse-item > .ant-collapse-header {
    padding-left: 0;
}
.ant-collapse-borderless > .ant-collapse-item {
    border-color: #1A75BB;
}
.faqs-section {
    ul {
        padding-left: 20px !important;
    }
}
</style>
