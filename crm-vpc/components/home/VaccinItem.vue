<template>
    <div class="grid grid-cols-12 gap-2 p-3 bg-[#f8fcff] rounded-md border-[1px] border-solid border-prim-100">
        <div class="col-span-12 lg:col-span-9">
            <div class="md:flex gap-6">
                <div class="md:w-[120px] mb-2 md:mb-0 w-full h-[120px]">
                    <img class="w-full h-full object-cover rounded-md" :src="data.thumbnail" alt="">
                </div>
                <div class="flex-1 flex flex-col">
                    <div>
                        <div>
                            <h3 class="text-2xl leading-6 mb-0 text-prim-100 font-semibold inline-block">
                                {{ data.title }}
                            </h3>
                        </div>
                        <p class="mb-0">
                            {{ data.content }}
                        </p>
                        <div class="col-span-12 mt-2 lg:flex items-center text-prim-100 font-semibold">
                            <p class="mb-0 text-[#868686]">
                                Mũi tiêm {{ data.numberOfInjections }}
                            </p>
                            <template v-if="data.link">
                                <span class="mx-4 hidden lg:block">|</span>
                                <p class="mb-0 cursor-pointer">
                                    <a :href="data.link" class="text-prim-100 font-semibold">
                                        Xem chi tiết
                                    </a>
                                </p>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-3">
            <div class="text-right pr-0 md:pr-6 md:flex md:items-center md:justify-between md:mt-2 lg:flex-col lg:items-end">
                <p class="mb-0 text-prim-100">
                    Thời gian: {{ data.time }}
                </p>
                <div class="mt-0 lg:mt-5">
                    <span class="text-xl lg:mr-2 uppercase" :class="[data.status ? 'text-green-100' : '']">
                        {{ data.status ? 'Đã tiêm phòng' : 'Chưa tiêm phòng' }}
                    </span>
                    <a-checkbox
                        :checked="data.status"
                        class="relative -top-[2px]"
                    />
                </div>
            </div>
        </div>
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
        data() {
            return {
            };
        },

        methods: {
            openLink(link) {
                window.open(link, '_blank');
            },
        },
    };
</script>

<style lang="scss">
    .ant-checkbox-checked .ant-checkbox-inner {
        @apply bg-green-100 border-green-100;
    }
</style>
