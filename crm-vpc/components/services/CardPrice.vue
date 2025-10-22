<template>
    <div class="border-[0.5px] border-[#1A75BB] px-4 bg-white rounded-[12px] h-full">
        <div class="flex items-center justify-between pb-3 pt-3 border-b-[0.5px] border-b-[#1A75BB]">
            <p class="m-0 font-[600] text-[#1A75BB]">
                {{ data.title }}
            </p>
            <p class="m-0 font-[600] text-[#15CF74]">
                {{ Number(data.price).toLocaleString('de-DE') }}đ
            </p>
        </div>
        <div class="pt-4 package-price" v-html="data.descriptions" />
        <nuxt-link :to="`/dich-vu/${data.slug}`">
            <a-button type="link" class="!text-[#1A75BB] mx-auto !block mt-3 mb-3">
                ĐĂNG KÝ
            </a-button>
        </nuxt-link>
    </div>
</template>

<script>
    export default {
        props: {
            data: {
                type: Object,
                default: () => {},
            },
        },
    };
</script>
<style lang="scss">
.package-price {
    ul, li {
        list-style: disc !important;
    }
    li {
        margin-left: 16px;
    }
}
</style>
