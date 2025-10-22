<template>
    <div class="mb-20 mt-20">
        <main class="container py-10 lg:pt-0">
            <div class="mb-6 md:mb-12">
                <h2 class="block text-2xl sm:text-3xl lg:text-4xl font-semibold ">
                    Giỏ hàng của bạn
                </h2>
            </div>
            <hr class="border-gray-50/70 my-4 md:my-10 xl:my-12">
            <div class="flex flex-col lg:flex-row">
                <div class="w-full lg:w-[60%] xl:w-[55%] divide-y divide-gray-50/70">
                    <template v-if="cart.length > 0">
                        <div v-for="(_course, index) in cart" :key="`items_cart_${index}`" class="flex justify-between gap-6 flex-wrap py-4">
                            <div class="w-[120px] h-[80px] order-1 md:order-none">
                                <img
                                    class="w-full h-full object-cover rounded-sm"
                                    :src="_course.thumbnail"
                                    alt=""
                                >
                            </div>
                            <div class="w-full sm:w-auto sm:flex-1 order-3 md:order-none">
                                <h3 class="mb-2 font-medium text-lg">
                                    {{ _course.title }}
                                </h3>
                                <a-rate
                                    style="fontSize: 14px;color: #FFD74B; marginRight: 0px"
                                    :default-value="5"
                                    disabled
                                />
                                <span class="relative top-0.5 ml-2 inline-block text-[#868686]">({{ (_course.reviewsCount || 0)?.toLocaleString('en-US') }} lượt đánh giá)</span>
                            </div>
                            <div class="order-2 md:order-none">
                                <h3 v-if="_course.price" class="text-xl mb-0 font-bold text-prim-100 text-end">
                                    {{ Number(_course.price).toLocaleString('de-DE') || 0 }}đ
                                </h3>
                                <h3 v-else class="text-xl mb-0 font-bold text-[#15CF74] text-end">
                                    Miễn phí
                                </h3>
                                <h3 class="text-xl mb-0 line-through font-light text-[#868686]">
                                    {{ Number(_course.priceSale).toLocaleString('de-DE') || 0 }}đ
                                </h3>
                                <div
                                    class="text-danger-100 mt-2 text-right cursor-pointer"
                                    @click="() => {
                                        $refs.ConfirmDialog.open(),
                                        courseSelected = _course
                                    }"
                                >
                                    Xóa
                                </div>
                            </div>
                        </div>
                    </template>
                    <div v-else class="text-center">
                        <img class="mx-auto" src="/images/empty-card.png" alt="/">
                    </div>
                </div>

                <div class="border-t lg:border-t-0 lg:border-l border-gray-50/70 my-10 lg:my-0 lg:mx-10 xl:mx-16 2xl:mx-20 flex-shrink-0" />
                <div class="flex-1">
                    <div class="inherit md:sticky top-28">
                        <h3 class="text-xl ">
                            Chi tiết đơn hàng
                        </h3>
                        <div class="mt-7 text-sm text-gray-50 divide-y divide-gray-50/70">
                            <div class="flex justify-between pb-4">
                                <span class="text-gray-70 text-lg">Số sản phẩm</span>
                                <span class="text-gray-100 text-lg">{{ dashboard.countCart }} sản phẩm</span>
                            </div>
                            <div class="flex justify-between py-4">
                                <span class="text-gray-70 text-lg">Phí vận chuyển</span>
                                <span class="text-lg text-prim-100">Miễn phí vận chuyển</span>
                            </div>
                            <div class="flex justify-between text-gray-100 text-base pt-4">
                                <span class="text-gray-100 text-lg">Thành tiền</span>
                                <span class="text-gray-100 text-lg">{{ dashboard.sumPrice | currencyFormat }}</span>
                            </div>
                        </div>
                        <nuxt-link
                            class="mt-6 block"
                            to="/thanh-toan"
                        >
                            <a-button class="!w-full !bg-prim-100 !py-2 !h-[45px] !text-white !border-prim-100">
                                Thanh toán ngay
                            </a-button>
                        </nuxt-link>
                    </div>
                </div>
            </div>
        </main>

        <ConfirmDialog
            ref="ConfirmDialog"
            title="Xác nhận"
            content="Bạn chắc chắn xóa khóa học này chứ"
            @confirm="() => removeToCart(courseSelected)"
        />
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';

    export default {
        auth: false,
        components: {
            ConfirmDialog,
        },

        async fetch() {
            await this.fetchData();
        },

        data() {
            return {
                loading: false,
                courseSelected: null,
            };
        },

        computed: {
            ...mapGetters('courses', ['cart', 'dashboard']),
        },

        methods: {
            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('courses/fetchCart');
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },

            async removeToCart(course) {
                await this.$store.dispatch('courses/removeToCart', course);
            },
        },
    };
</script>
