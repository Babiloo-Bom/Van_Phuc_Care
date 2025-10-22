<template>
    <transition name="toast-transition">
        <div v-if="status" class="fixed right-0 md:right-5 top-24 max-w-md w-full rounded-[24px] ring-1 ring-black/5 shadow-lg overflow-hidden flex flex-col justify-start items-center z-[9999999]">
            <div class="p-4 max-w-md w-full bg-white pointer-events-auto text-slate-900 opacity-100 translate-x-0">
                <p class="block text-base font-semibold leading-none">
                    Đã thêm vào giỏ hàng
                </p>
                <hr class="border-gray-50/70 my-4"><div class="flex ">
                    <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded bg-slate-100">
                        <img :src="course.thumbnail" :alt="course.title" class="h-full w-full object-cover object-center">
                    </div>
                    <div class="ml-4 flex flex-1 flex-col">
                        <div>
                            <div class="">
                                <div>
                                    <h3 class="font-medium">
                                        {{ course.title || '' }}
                                    </h3>
                                </div>
                                <div class="mt-2">
                                    <div class="flex items-center rounded-lg font-medium">
                                        <span class="text-prim-100 !leading-none">{{ course.price | currencyFormat }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-1 items-end justify-between text-sm">
                            <div class="flex">
                                <nuxt-link to="/gio-hang" class="!text-prim-900 font-semibold">
                                    Xem giỏ hàng
                                </nuxt-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        props: {
            status: {
                type: Boolean,
                default: false,
            },
            type: {
                type: String,
                default: 'success',
            },
            course: {
                type: Object,
                default: () => {},
            },
        },

        data() {
            return {

            };
        },
    };
</script>
