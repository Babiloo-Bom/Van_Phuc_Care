<template>
    <div v-if="!loading">
        <div class="card-container !px-0 md:!px-4">
            <a-tabs type="card">
                <a-tab-pane v-if="!includeService" key="1" tab="Đăng ký">
                    <div class="p-6 bg-white rounded-b-md">
                        <div class="font-[600] text-[#1A75BB] mb-4">
                            <span>Dịch vụ</span>
                            <span class="mx-1">|</span>
                            <span>{{ service.title }}</span>
                        </div>
                        <div class="mt-4">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-4">
                                    <a-button class="!w-[27px] !h-[27px] !p-0 !flex !items-center justify-center" type="primary" @click="$router.push('/dich-vu')">
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
                                            stroke-width="2"
                                            d="M15 19.92L8.48 13.4c-.77-.77-.77-2.03 0-2.8L15 4.08"
                                        /></svg>
                                    </a-button>
                                    <h6 class="text-[#1A75BB] m-0 font-bold">
                                        Về trang đăng ký DV
                                    </h6>
                                </div>
                                <a-button
                                    v-if="includeService"
                                    class="!bg-[#1A75BB] !text-[#fff] !rounded-[6px]"
                                    type="primary"
                                    @click="registerService"
                                >
                                    Gia hạn dịch vụ
                                </a-button>
                                <div v-else class="flex items-center justify-center gap-4">
                                    <a
                                        href="tel:0908093198"
                                        type="primary"
                                    >
                                        Gặp tư vấn viên
                                    </a>
                                    <a-button
                                        class="!bg-[#1A75BB] !text-[#fff] !rounded-[6px]"
                                        type="primary"
                                        @click="registerService"
                                    >
                                        Đăng ký dịch vụ
                                    </a-button>
                                </div>
                            </div>
                            <div class="grid grid-cols-12 gap-4 rounded-[6px] mt-6">
                                <div class="col-span-12 lg:col-span-8">
                                    <div>
                                        <h4 class="font-[600] uppercase text-[28px] md:text-[38px] text-[#1A75BB] m-0">
                                            {{ service.title }}
                                        </h4>
                                    </div>
                                    <p class="text-[#737373] text-[14px]">
                                        {{ service.descriptions }}
                                    </p>
                                    <div v-html="service.content" />
                                </div>
                                <div class="col-span-12 lg:col-span-4">
                                    <div class="rounded-[6px] px-8 py-6 bg-[#F3F9FF]">
                                        <h5 class="text-[#1A75BB] text-[20px] font-bold m-0 mb-6">
                                            Chi tiết liệu trình
                                        </h5>
                                        <div v-for="(data, index) in service.progress" :key="`detail-process-${index}`" class="relative mb-6 border-[1px] rounded-[6px] border-[#1A75BB] grid grid-cols-12">
                                            <div class="col-span-4 relative">
                                                <img class="rounded-l-[6px]" :src="data.thumbnail" alt="/">
                                                <span
                                                    style="top: 50%;
                                                        transform: translate(-50%, -50%);
                                                        right: -20px;"
                                                    class="absolute flex items-center justify-center w-5 h-5 text-[12px] bg-[#1A75BB] text-[#fff] font-[600] rounded-[4px] border-[1px] border-[#fff]"
                                                >{{ index + 1 }}</span>
                                            </div>
                                            <div class="flex items-center justify-center col-span-8 pr-2 pl-5">
                                                <p class="text-[#1A75BB] m-0 font-bold">
                                                    {{ data.title }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="p-8">
                        <h6 class="text-[#1A75BB] text-[18px] font-[600] m-0 ">
                            Gói và dịch vụ
                        </h6>
                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                            <CardPrice v-for="(data, index) in service.pricings" :key="`card_price_${index}`" :data="data" />
                        </div>
                    </div>
                    <div class="bg-white p-8 rounded-md">
                        <div class="mb-8 mx-auto">
                            <Rate />
                        </div>
                        <div class="mb-8 max-w-[580px] mx-auto">
                            <div v-if="faqs?.length">
                                <Faqs :data="faqs" />
                            </div>
                            <a-empty v-else description="Không có dữ liệu" />
                        </div>
                        <h5 class="text-[#1A75BB] text-[20px] font-[600] m-0 mb-2">
                            Các dịch vụ khác
                        </h5>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 p-0 md:p-4">
                            <nuxt-link v-for="(data, index) in services?.filter(e => e._id !== service._id).slice(0,4)" :key="`card_service_${index}`" :to="`/dich-vu/${data.slug}`">
                                <CardService :data="data" />
                            </nuxt-link>
                        </div>
                        <a-button type="link" class="!underline font-[600] !text-[#1A75BB] !h-auto !p-0 !block mx-auto !mt-4" @click="openAllService">
                            <span class="underline">Xem tất cả</span>
                        </a-button>
                    </div>
                </a-tab-pane>
                <a-tab-pane v-if="includeService" key="2" tab="Đang sử dụng">
                    <div class="p-6 bg-white rounded-b-md">
                        <div>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-4">
                                    <a-button class="!w-[27px] !h-[27px] !p-0 !flex !items-center justify-center" type="primary" @click="$router.push('/dich-vu')">
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
                                            stroke-width="2"
                                            d="M15 19.92L8.48 13.4c-.77-.77-.77-2.03 0-2.8L15 4.08"
                                        /></svg>
                                    </a-button>
                                    <h6 class="text-[#1A75BB] m-0 font-bold">
                                        Về trang dịch vụ
                                    </h6>
                                </div>
                            </div>
                            <div class="font-[600] text-[#1A75BB] mt-4">
                                <span>Dịch vụ</span>
                                <span class="mx-1">|</span>
                                <span>{{ service.title }}</span>
                            </div>
                            <div class="grid grid-cols-12 items-center mt-4 md:mt-0">
                                <div class="col-span-8">
                                    <div class="md:flex justify-between items-end">
                                        <h3 class="text-xl font-semibold text-prim-100 mb-0">
                                            Thời gian còn lại:
                                        </h3>
                                        <h2 class="text-xl md:text-4xl font-bold text-prim-100 mb-0">
                                            {{ serviceDetailInfor.numberDayRemain || 0 }} ngày
                                        </h2>
                                    </div>
                                </div>
                                <div class="col-span-4">
                                    <div class="flex justify-end">
                                        <a-button
                                            class="!bg-[#1A75BB] !text-[#fff] !rounded-[6px]"
                                            type="primary"
                                            @click="registerService"
                                        >
                                            Gia hạn dịch vụ
                                        </a-button>
                                    </div>
                                </div>
                            </div>
                            <div class="grid md:grid-cols-12 mt-2 gap-6">
                                <div class="col-span-8">
                                    <div>
                                        <div class="bg-prim-100 text-white rounded-[6px] p-6">
                                            <div class="block md:flex justify-between items-end">
                                                <h2 class="uppercase text-white text-2xl md:text-4xl font-bold mb-0">
                                                    {{ service.title }}
                                                </h2>
                                                <span class="hidden md:block font-medium">/{{ service.usageTimeUnit === 'session' ? 'Theo buổi' : 'Theo ngày' }}</span>
                                            </div>
                                            <div class="flex justify-between items-center">
                                                <h3 class="text-white font-medium">
                                                    Thời gian đã sử dụng
                                                </h3>
                                                <span class="text-3xl font-medium  ">{{ serviceDetailInfor.numberDayUsed || 0 }} Buổi</span>
                                            </div>
                                            <div class="flex justify-between items-center">
                                                <h3 class="text-white font-medium">
                                                    Nhân sự thực hiện
                                                </h3>
                                                <span class="font-medium  ">{{ service.serviceDetailInfor?.specialize }}</span>
                                            </div>
                                            <div class="flex justify-between items-center">
                                                <h2 class="text-white font-medium">
                                                    Thời lượng
                                                </h2>
                                                <span class="font-medium  ">45-60p/1 buổi</span>
                                            </div>
                                        </div>
                                        <div v-if="!isMobile && serviceDetailInfor.status !== 'pending'" class="bg-[#f3f9ff] p-6 rounded-xl mt-4">
                                            <h3 class="font-semibold text-prim-100 mb-0 text-xl">
                                                Thông tin điều dưỡng viên
                                            </h3>
                                            <h2 class="text-3xl font-semibold text-prim-100 mb-0">
                                                {{ serviceDetailInfor.implementer?.fullname }}
                                            </h2>
                                            <div class="mt-2">
                                                <p class="mb-0 text-prim-100">
                                                    {{ serviceDetailInfor.implementer?.descriptions }}
                                                </p>
                                                <p class="text-prim-100 mb-0 mt-2">
                                                    <span class="font-semibold">Kỹ năng:</span>
                                                    {{ serviceDetailInfor.implementer?.skills }}
                                                </p>
                                            </div>
                                        </div>
                                        <div v-if="serviceDetailInfor.contract" class="flex justify-between items-center mt-6">
                                            <div>
                                                <h2 class="text-2xl font-semibold text-prim-100 mb-0">
                                                    Chi tiết hợp đồng dịch vụ
                                                </h2>
                                                <h4 class="font-semibold text-prim-100 mb-0">
                                                    Đính kèm bản Scan hợp đồng ký kết dịch vụ đã có chữ ký của hai bên
                                                </h4>
                                            </div>
                                            <a-button type="link" @click="openContract">
                                                <span class="cursor-pointer">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="32"
                                                        height="32"
                                                        viewBox="0 0 24 24"
                                                        class="stroke-prim-100 fill-none"
                                                    ><path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-miterlimit="10"
                                                        stroke-width="1.5"
                                                        d="M18.07 14.43L12 20.5l-6.07-6.07M12 3.5v16.83"
                                                    /></svg>
                                                </span>
                                            </a-button>
                                        </div>
                                        <div class="mt-8 pt-8 border-t-[1px] border-solid border-prim-100 grid grid-cols-1 gap-8">
                                            <div v-for="(data, index) in service.progress" :key="`detail-process-${index}`" class="relative flex gap-6">
                                                <div class="relative w-[90px] h-[75px]">
                                                    <img class="rounded-sm object-cover w-full h-full" :src="data.thumbnail" alt="/">
                                                    <span class="absolute flex items-center justify-center -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 text-[12px] bg-[#1A75BB] text-white font-[600] rounded-[4px] border-[1px] border-[#fff]">
                                                        {{ index + 1 }}
                                                    </span>
                                                </div>
                                                <div class="p-1 flex-1">
                                                    <h4 class="text-[#1A75BB] m-0 font-semibold text-lg">
                                                        {{ data.title }}
                                                    </h4>
                                                    <p class="text-[#1A75BB] m-0">
                                                        Massage body chuẩn IAIM giúp bé thoải mái, xoa dịu căng thẳng. Kết hợp các bài tập vận động, hỗ trợ khả năng phát triển, giúp bé cảm nhận về cơ thể mình
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-span-8 md:col-span-4">
                                    <div class="">
                                        <div v-if="serviceDetailInfor.status !== 'pending'" class="lg:h-[400px] rounded-t-lg overflow-hidden relative">
                                            <img class="w-full h-full object-contain bg-[#f3f9ff] pt-5" :src="serviceDetailInfor.implementer?.avatar" alt="">
                                            <div class="absolute w-full bottom-0 left-0 p-3 bg-prim-100/70 text-center">
                                                <h3 class="text-white mb-0 text-2xl font-bold">
                                                    {{ serviceDetailInfor.implementer?.fullname }}
                                                </h3>
                                                <p class="text-white mb-0 text-lg">
                                                    {{ serviceDetailInfor.implementer?.specialize }}
                                                </p>
                                            </div>
                                        </div>
                                        <div v-if="isMobile && serviceDetailInfor.status !== 'pending'" class="bg-[#f3f9ff] p-6 rounded-xl mt-4">
                                            <h3 class="font-semibold text-prim-100 mb-0 text-xl">
                                                Thông tin điều dưỡng viên
                                            </h3>
                                            <h2 class="text-3xl font-semibold text-prim-100 mb-0">
                                                {{ service.implementer?.fullname }}
                                            </h2>
                                            <div class="mt-2">
                                                <p class="mb-0 text-prim-100">
                                                    {{ service.implementer?.descriptions }}
                                                </p>
                                                <p class="text-prim-100 mb-0 mt-2">
                                                    <span class="font-semibold">Kỹ năng:</span>
                                                    {{ service.implementer?.skills }}
                                                </p>
                                            </div>
                                        </div>
                                        <div class="p-3 bg-[#f3f9ff] rounded mt-6">
                                            <h2 class="mb-0 text-2xl text-center font-bold text-prim-100">
                                                Gói dịch vụ
                                            </h2>
                                            <div class="grid grid-cols-1 gap-4 mt-4">
                                                <CardPrice v-for="(data, index) in service.pricings" :key="`card_price_${index}`" :data="data" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <a-form-model
                        ref="form"
                        :model="form"
                        layout="vertical"
                        :colon="false"
                    >
                        <div class="grid grid-cols-3 md:grid-cols-12 gap-4 my-6">
                            <div class="col-span-9 md:col-span-3 order-last  md:order-first">
                                <div class=" grid grid-cols-1 justify-center items-center text-center gap-2">
                                    <div class="mx-auto">
                                        <img
                                            class="w-[100px] h-[100px] object-cover rounded-full mx-auto"
                                            alt=""
                                            :src="$auth.user?.avatar || '/images/avatar-empty.webp'"
                                        >
                                    </div>
                                    <a-rate v-model="form.rate" />
                                    <span class="block text-prim-100">(Đánh giá)</span>
                                    <a-button
                                        class="!bg-[#1A75BB] !text-[#fff] !rounded-[6px] !w-[140px] mx-auto"
                                        type="primary"
                                        @click="submitFeedback"
                                    >
                                        Gửi phản hồi
                                    </a-button>
                                </div>
                            </div>
                            <div class="col-span-9 order-first md:order-last">
                                <div>
                                    <div class="md:flex justify-between items-end border-b-[1px] border-[#1A75BB] w-full pb-4 mb-4">
                                        <div class="flex flex-col">
                                            <div>
                                                <p class="m-0 font-semibold text-[#1A75BB] text-lg">
                                                    {{ $auth.user?.fullname || $auth.user?.fullName || $auth.user?.email?.replace('@gmail.com', '') }}
                                                </p>
                                                <p class="text-[12px] italic m-0 text-[#7C7C7C]">
                                                    {{ $auth.user.email }}
                                                </p>
                                            </div>
                                        </div>
                                        <h3 class="m-0 font-semibold text-[#1A75BB] mr-2 text-xl">
                                            Đánh giá của khách hàng
                                        </h3>
                                    </div>
                                    <div>
                                        <a-textarea
                                            v-model="form.content"
                                            placeholder="Đánh giá của bạn về dịch vụ"
                                            :auto-size="{ minRows: 5, maxRows: 5 }"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a-form-model>
                    <div class="bg-white p-8 rounded-md">
                        <h5 class="text-[#1A75BB] text-[20px] font-[600] m-0 mb-2">
                            Các dịch vụ khác
                        </h5>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 p-0 md:p-4">
                            <nuxt-link v-for="(data, index) in services?.filter(e => e._id !== service._id).slice(0,4)" :key="`card_service_${index}`" :to="`/dich-vu/${data.slug}`">
                                <CardService :data="data" />
                            </nuxt-link>
                        </div>
                        <a-button type="link" class="!underline font-[600] !text-[#1A75BB] !h-auto !p-0 !block mx-auto !mt-4" @click="openAllService">
                            <span class="underline">Xem tất cả</span>
                        </a-button>
                    </div>
                </a-tab-pane>
            </a-tabs>
        </div>
        <RegisterDialog
            ref="register"
            :title="`Đăng ký dịch vụ`"
            @confirm="confirmRegister"
        />
    </div>
    <div v-else class="flex items-center justify-center h-full min-h-[450px]">
        <span class="genstech-loader" />
    </div>
</template>

<script>
    import _cloneDeep from 'lodash/cloneDeep';
    import { mapState } from 'vuex';
    import CardService from '@/components/services/Card.vue';
    import CardPrice from '@/components/services/CardPrice.vue';
    import Faqs from '@/components/services/Faqs.vue';
    import Rate from '@/components/services/Rate.vue';
    import RegisterDialog from '@/components/services/RegisterDialog.vue';

    const defaultForm = {
        rate: 5,
        content: '',
    };

    export default {
        components: {
            CardPrice,
            CardService,
            Faqs,
            Rate,
            RegisterDialog,
        }, // This is executed when the component is navigated to
        beforeRouteEnter(to, from, next) {
            // Scroll to top when entering the route
            window.scrollTo(0, 0);
            next();
        },

        async fetch() {
            await this.fetchData();
            this.fetchFaqs();
            this.fetchFeedbacks();
        },

        data() {
            return {
                loading: false,
                isMobile: false,
                loadingSubmit: false,
                serviceDetailInfor: {}, // Get more contract and implementor
                form: _cloneDeep(defaultForm),
                includeService: false,
            };
        },

        computed: {
            ...mapState('services', ['service', 'rates', 'services', 'registeredService']),
            ...mapState('faqs', ['faqs']),
        },

        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Dịch vụ',
                link: '/dich-vu',
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 9.11v5.77C3 17 3 17 5 18.35l5.5 3.18c.83.48 2.18.48 3 0l5.5-3.18c2-1.35 2-1.35 2-3.46V9.11C21 7 21 7 19 5.65l-5.5-3.18c-.82-.48-2.17-.48-3 0L5 5.65C3 7 3 7 3 9.11Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
            }]);
            // Check the screen width on component mount
            this.checkScreenWidth();

            // Listen for window resize events to update the screen width
            window.addEventListener('resize', this.checkScreenWidth);
        },
        beforeDestroy() {
            // Remove the resize event listener to prevent memory leaks
            window.removeEventListener('resize', this.checkScreenWidth);
        },

        methods: {
            checkScreenWidth() {
                // Check if the screen width is less than or equal to 768px (adjust this value according to your needs)
                this.isMobile = window.innerWidth <= 768;
            },
            openAllService() {
                this.$router.push('/dich-vu');
            },
            openContract() {
                window.open(this.serviceDetailInfor.contract?.source, '_blank');
            },
            async registerService() {
                try {
                    this.loading = true;
                    await this.$api.services.register({
                        serviceId: this.service._id,
                        email: this.$auth.user.email,
                        domain: this.$auth.user.domain,
                        createdBy: {
                            _id: this.$auth.user._id,
                            fullname: this.$auth.user.fullname,
                        },
                    });
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                    this.$nuxt.refresh();
                }
            },
            confirmRegister() {
                console.log('ok');
            },
            async fetchData() {
                try {
                    this.loading = true;
                    if (this.services.length <= 0) {
                        await this.$store.dispatch('services/fetchAll', this.$route.query);
                    }
                    if (!this.registeredService.length) {
                        await this.$store.dispatch('services/fetchServiceUsing', { ...this.$route.query, email: this.$auth.user.email });
                    }
                    await this.$store.dispatch('services/fetchDetail', this.$route.params.id);
                    // this.$store.dispatch('services/fetchRates', this.$route.query);
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                    this.includeService = this.registeredService?.map((e) => e.serviceId)?.includes(this.service._id);
                    this.serviceDetailInfor = this.registeredService.find((e) => e.serviceId === this.service._id);
                    console.log(this.serviceDetailInfor);
                }
            },
            async fetchFaqs() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('faqs/fetchAll', { serviceId: this.service._id, origin: 'vanphuccare.gensi.vn' });
                    // this.$store.dispatch('services/fetchRates', this.$route.query);
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
            async fetchFeedbacks() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('feedbacks/fetchAll', { serviceId: this.service._id, origin: 'vanphuccare.gensi.vn' });
                    // this.$store.dispatch('services/fetchRates', this.$route.query);
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },

            async submitFeedback() {
                try {
                    this.loadingSubmit = true;
                    await this.$api.feedbacks.create({
                        serviceId: this.service._id,
                        avatar: this.$auth.user.avatar,
                        rate: this.form.rate,
                        fullname: this.$auth.user?.fullname || this.$auth.user?.fullName || this.$auth.user?.email?.replace('@gmail.com', ''),
                        content: this.form.content,
                        domain: 'vanphuccare.gensi.vn',
                    });
                    this.form = {
                        rate: 5,
                    };
                    this.$message.success('Cảm ơn bạn đã phản hồi!');
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loadingSubmit = false;
                }
            },
        },

        head() {
            return {
                title: 'Dịch vụ',
            };
        },
    };
</script>
<style lang="scss" >
.card-container {
  overflow: hidden;
  padding: 0 24px;
  .ant-tabs-nav.ant-tabs-nav-animated {
    margin-left: 24px;
  }
}
.card-container > .ant-tabs-card > .ant-tabs-content {
  margin-top: -16px;
}

.card-container > .ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane {
    border-radius: 10px;
}
@media only screen and (max-width: 600px) {
    .card-container > .ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane {
    padding: 0;
    }
}
.card-container > .ant-tabs-card > .ant-tabs-bar {
  border-color: #fff;
}

.card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab {
  border-color: transparent;
  background: transparent;
    color :#BABABA;
    font-weight: 500;
}

.card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active {
  border-color: #fff;
  background: #fff;
    font-weight: 600;
    color :#0C76BC;
}
.ant-collapse-content-box {
    ul, li {
        list-style: disc;
    }
}
.ant-collapse-content-box>div{
    margin-left: 1px;
}
</style>
