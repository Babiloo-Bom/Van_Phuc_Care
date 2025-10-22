<template>
    <div class="p-y pb-2 rounded-md min-h-full">
        <div v-if="loading">
            <Skeleton />
        </div>
        <div v-else>
            <div v-if="data.length > 0" class="min-h-[300px] flex flex-col items-start justify-start mt-4">
                <div class="grid grid-cols-12 gap-3 w-full mb-4 pb-1" style="border-bottom: 1px solid #c5c5c5">
                    <div class="col-span-2 text-[14px] font-bold text-center">
                        {{ $t('shared.serial') }}
                    </div>
                    <div class="col-span-8 text-[14px] font-bold ml-5">
                        {{ $t('shared.product') }}
                    </div>
                    <div class="col-span-2 text-[14px] font-bold text-center">
                        {{ $t('shared.selled') }}
                    </div>
                </div>
                <div class="h-full max-h-[300px] overflow-auto w-full">
                    <div
                        v-for="(product, index) in data"
                        :key="product._id"
                        class="grid grid-cols-12 gap-3 w-full py-2 hover:bg-[#f1f1f1] rounded-md row-product"
                        style="transition: all .1s ease-in-out"
                    >
                        <div class="col-span-2 text-[14px] font-bold text-center">
                            {{ index + 1 }}
                        </div>
                        <div class="flex col-span-8 text-[14px] font-bold gap-3">
                            <img class="min-w-[100px] h-[60px] object-cover rounded-md" :src="product.thumbnail">
                            <div>
                                <a :href="$auth.user?.domain + product.slug" target="_blank" class="title-product-analystic hover:!text-[#1351d8]">
                                    {{ product.name }}
                                </a>
                            </div>
                        </div>
                        <div class="col-span-2 text-[14px] font-bold text-center">
                            {{ product.quantitySelled || 0 }}
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="min-h-[300px] flex items-center justify-center">
                <a-empty description="Chưa có dữ liệu"/>
            </div>
        </div>
    </div>
</template>

<script>
    import Skeleton from '@/components/analystics/Skeleton.vue';

    export default {
        components: {
            Skeleton,
        },
        props: {
            data: {
                type: Array,
                default: () => [],
            },
            loading: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
            };
        },
        watch: {
            '$route.query': {
                handler() {
                },
            },
        },
    };
</script>
<style scoped lang="scss">
.card-analystic {
    background-color:#fff;
    box-shadow: 0rem 0.125rem 0.25rem rgba(31,33,36,.1),0rem 0.0625rem 0.375rem rgba(31,33,36,.05);
}
.title-product-analystic {
 overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical
}
.row-product:hover a {
    color: #1351d8 !important;
}

</style>
