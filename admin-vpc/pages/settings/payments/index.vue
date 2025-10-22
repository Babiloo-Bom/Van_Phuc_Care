<template>
    <div>
        <div class="max-w-[1200px] !mx-auto w-full block p-4 pt-0 detail-collection">
            <div class="flex items-center justify-start gap-3">
                <a-button type="text" class="!p-0 !w-[25px] !h-[25px] !border-0 back !bg-[transparent]" @click="$router.push('/settings')">
                    <svg
                        viewBox="0 0 20 20"
                        class="m-0 w-[20px] h-[20px]"
                        focusable="false"
                        aria-hidden="true"
                    ><path fill-rule="evenodd" d="M16.75 10a.75.75 0 0 1-.75.75h-9.69l2.72 2.72a.75.75 0 0 1-1.06 1.06l-4-4a.75.75 0 0 1 0-1.06l4-4a.75.75 0 0 1 1.06 1.06l-2.72 2.72h9.69a.75.75 0 0 1 .75.75Z" /></svg>
                </a-button>
                <div class="flex items-center justify-between w-full">
                    <div class="flex items-center justify-between w-full">
                        <div class="flex items-center gap-3">
                            <h4 class="m-0 text-[20px] font-bold">
                                {{ 'Thanh toán' }}
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
            <a-form-model
                ref="form"
                :model="form"
                :rules="rules"
                layout="vertical"
                :colon="false"
            >
                <div class="grid grid-cols-12 mt-4 gap-5">
                    <div class="col-span-12">
                        <div class="card p-4">
                            <h4 class="text-[14px] m-0 font-[600]">
                                {{ 'Mặc định' }}
                            </h4>
                            <div class="mt-3 p-3 rounded-md bg-[#f7f7f7] flex items-center justify-between gap-4 pr-5" :bordered="false" style="width: 100%">
                                <div class="flex items-center">
                                    <div>
                                        <img class="w-[44px] bg-[#fff] h-[44px] p-1 rounded-md" src="/images/payments/cash.png" alt="/">
                                    </div>
                                    <p class="font-bold m-0 ml-4">
                                        {{ 'Tiền mặt' }}
                                    </p>
                                </div>
                                <a-switch :checked="data?.find((e) => e.name === 'cash')?.status === true" @change="activePayment('cash')" />
                            </div>
                        </div>
                        <div class="card mt-4 p-4">
                            <h4 class="text-[14px] m-0 font-[600]">
                                {{ 'Phương thức khác' }}
                            </h4>
                            <div class="mt-3 p-3 rounded-md bg-[#f7f7f7] flex items-center justify-between gap-4 pr-5" :bordered="false" style="width: 100%">
                                <div class="flex items-center">
                                    <div>
                                        <img class="w-[44px] bg-[#fff] h-[44px] p-1 rounded-md" src="/images/payments/momo.png" alt="/">
                                    </div>
                                    <p class="font-bold m-0 ml-4">
                                        {{ 'Thanh toán qua Momo' }}
                                    </p>
                                </div>
                                <a-button class="!h-7 !text-[13px] !rounded-full !flex items-center justify-center gap-2" type="primary">
                                    {{ 'Kết nối' }}
                                    <svg
                                        class="transition-all duration-300"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    ><path
                                        stroke="#fff"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-miterlimit="10"
                                        stroke-width="1.5"
                                        d="M14.43 5.93L20.5 12l-6.07 6.07M3.5 12h16.83"
                                    /></svg>
                                </a-button>
                            </div>
                            <div class="mt-3 p-3 rounded-md bg-[#f7f7f7] flex items-center justify-between gap-4 pr-5" :bordered="false" style="width: 100%">
                                <div class="flex items-center">
                                    <div>
                                        <img class="w-[44px] bg-[#fff] h-[44px] p-1 rounded-md" src="/images/payments/vnpay.png" alt="/">
                                    </div>
                                    <p class="font-bold m-0 ml-4">
                                        {{ 'Thanh toán qua VNPay' }}
                                    </p>
                                </div>
                                <a-button class="!h-7 !text-[13px] !rounded-full !flex items-center justify-center gap-2" type="primary">
                                    {{ 'Kết nối' }}
                                    <svg
                                        class="transition-all duration-300"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    ><path
                                        stroke="#fff"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-miterlimit="10"
                                        stroke-width="1.5"
                                        d="M14.43 5.93L20.5 12l-6.07 6.07M3.5 12h16.83"
                                    /></svg>
                                </a-button>
                            </div>
                            <div class="mt-3 p-3 rounded-md bg-[#f7f7f7] flex items-center justify-between gap-4 pr-5" :bordered="false" style="width: 100%">
                                <div class="flex items-center">
                                    <div>
                                        <img class="w-[44px] bg-[#fff] h-[44px] p-1 rounded-md" src="/images/payments/paypal.jpg" alt="/">
                                    </div>
                                    <p class="font-bold m-0 ml-4">
                                        {{ 'Thanh toán qua Paypal' }}
                                    </p>
                                </div>
                                <a-button class="!h-7 !text-[13px] !rounded-full !flex items-center justify-center gap-2" type="primary">
                                    {{ 'Kết nối' }}
                                    <svg
                                        class="transition-all duration-300"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    ><path
                                        stroke="#fff"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-miterlimit="10"
                                        stroke-width="1.5"
                                        d="M14.43 5.93L20.5 12l-6.07 6.07M3.5 12h16.83"
                                    /></svg>
                                </a-button>
                            </div>
                        </div>
                    </div>
                </div>
            </a-form-model>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import _cloneDeep from 'lodash/cloneDeep';
    import _omit from 'lodash/omit';

    export default {
        components: {
        },

        data() {
            return {
                loading: false,
                rules: {},
                cash: true,
                form: {},
                data: [],
            };
        },
        computed: {
            ...mapState('settings/contacts', ['contacts']),
        },

        watch: {
            contacts() {
                this.data = this.contacts?.paymentMethods;
            },
        },

        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Cài đặt',
                link: '/settings',
            }, {
                label: 'Thanh toán',
                link: '/settings/payments',
            }]);
            this.data = this.contacts?.paymentMethods;
        },
        methods: {
            _cloneDeep,

            async updateSetting() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('settings/payments/update', _omit(this.form, ['_id']));
                    this.$message.success('Cập nhật thông tin thành công');
                } catch (error) {
                    // this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },

            async activePayment(type) {
                if (type === 'cash') {
                    if (this.data?.find((e) => e.name === 'cash')?.status === true) {
                        this.data = [...(this.data.filter((e) => e.name !== 'cash')), { name: 'cash', status: false }];
                    } else {
                        this.data = [...(this.data.filter((e) => e.name !== 'cash')), { name: 'cash', status: true }];
                    }
                    await this.$store.dispatch('settings/payments/update', _omit({ ...this.form, paymentMethods: this.data }, ['_id']));
                    const { data: { steps } } = await this.$api.dashboard.getSteps();
                    if (!steps.find((e) => e === 'payment')) {
                        await this.$store.dispatch('dashboard/updateSteps', { step: 'payment' });
                    }
                }
            },
        },

        head() {
            return {
                title: 'Phương thức thanh toán',
            };
        },
    };
</script>
<style lang="scss">
</style>
