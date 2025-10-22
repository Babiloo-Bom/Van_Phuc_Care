<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        title="Chi tiết giao dịch"
        width="800px"
    >
        <div class="flex flex-col lg:flex-row">
            <div class="w-full lg:w-[60%] xl:w-[55%] divide-y divide-gray-50/70">
                <template v-if="cart?.length > 0">
                    <div v-for="(_course, index) in cart" :key="`items_cart_${index}`" class="flex justify-between gap-4 flex-wrap py-4">
                        <div class="w-[120px] h-[80px] order-1 md:order-none">
                            <img
                                class="w-full h-full object-cover rounded-sm"
                                :src="_course.thumbnail"
                                alt=""
                            >
                        </div>
                        <div class="w-full sm:w-auto sm:flex-1 order-3 md:order-none">
                            <h3 class="mb-2 font-medium">
                                {{ _course.title }}
                            </h3>
                            <div class="order-2 md:order-none">
                                <h3 v-if="_course.price" class="mb-0 font-bold text-prim-100">
                                    {{ Number(_course.price).toLocaleString('de-DE') || 0 }}đ
                                </h3>
                                <h3 v-else class="mb-0 font-bold text-[#15CF74]">
                                    Miễn phí
                                </h3>
                                <h3 class="mb-0 line-through font-light text-[#868686]">
                                    {{ Number(_course.priceSale).toLocaleString('de-DE') || 0 }}đ
                                </h3>
                            </div>
                        </div>
                    </div>
                </template>
                <div v-else class="text-center">
                    <img class="mx-auto" src="/images/empty-card.png" alt="/">
                </div>
            </div>
            <div class="border-t lg:border-t-0 lg:border-l border-gray-50/70 my-10 lg:my-0 lg:mx-5 flex-shrink-0" />
            <div class="flex-1">
                <div class="inherit md:sticky top-28">
                    <div class="mt-7 text-sm text-gray-50 divide-y divide-gray-50/70">
                        <div class="flex justify-between pb-4">
                            <span class="text-gray-70">Số sản phẩm</span>
                            <span class="text-gray-100">{{ dashboard.countCart }} sản phẩm</span>
                        </div>
                        <!-- <div class="flex justify-between py-4">
                            <span class="text-gray-70">Phí vận chuyển</span>
                            <span class="text-prim-100">Miễn phí vận chuyển</span>
                        </div> -->
                        <div class="flex justify-between text-gray-100 text-base pt-4">
                            <span class="text-gray-100 ">Thành tiền</span>
                            <span class="text-gray-100 ">{{ dashboard.sumPrice | currencyFormat }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div slot="footer" class="flex justify-end items-center gap-2">
            <a-button class="w-28" @click="close">
                Đóng
            </a-button>
            <a-button
                v-if="transaction && transaction.status !== 'active'"
                :loading="loading"
                class="px-2"
                type="primary"
                @click="submit"
            >
                Xác nhận & Mở khóa
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    export default {
        data() {
            return {
                visible: false,
                loading: false,
                cart: [],
                transaction: null,
            };
        },
        computed: {
            dashboard() {
                const cart = this.cart;
                const sumPrice = cart ? cart.map((item) => (+item.price)).reduce((a, b) => a + b, 0) : 0;
                const countCart = cart ? cart?.length : 0;
                return {
                    cart,
                    sumPrice,
                    countCart,
                };
            },
        },
        methods: {
            open(cart, transaction) {
                this.cart = cart;
                this.transaction = transaction;
                this.visible = true;
            },
            close() {
                this.visible = false;
            },
            async submit() {
                try {
                    this.loading = true;
                    this.$api.courses.openCourse({
                        registerId: this.transaction.registerId,
                        courseIds: this.cart.map((element) => (element._id)),
                    });
                    this.$api.transactions.update(this.transaction._id, {
                        status: 'active',
                    });
                    this.$message.success('Mở khóa thành công');
                    await this.$store.dispatch('transactions/fetchAll', this.$route.query);
                    this.close();
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },
    };
</script>
