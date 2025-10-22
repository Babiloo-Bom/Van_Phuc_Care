<template>
    <div class="bg-white">
        <a-form-model
            ref="form"
            :model="form"
            :rules="rules"
        >
            <div>
                <div>
                    <h3 class="mb-0 border-solid border-b-[1px] border-b-gray-40 pb-2">
                        Bạn có biết, Synck có thể hỗ trợ bạn ghi nhận ai đã giới thiệu khách hàng cho bạn (Affiliate Marketing)
                    </h3>
                    <div class="grid grid-cols-1 gap-4 mt-4">
                        <div>
                            Giả sử tại địa chỉ trang có đặt Opt-In Form <b>(Bắt buộc là JS Form)</b> là
                            <div class="inline-block w-[240px] px-2">
                                <a-input v-model="form.title" class="" />
                            </div> bạn muốn:
                        </div>
                        <ul class="list-decimal pl-5 grid grid-cols-1 gap-2">
                            <li>
                                <div>
                                    Chỉ định nhân viên
                                    <div class="inline-block w-[240px] px-2">
                                        <a-input v-model="form.title" class="" />
                                    </div>
                                    là người giới thiệu khách hàng thì URL khách hàng cần truy cập là:
                                    <div class="inline-block w-[240px] px-2">
                                        <a-input v-model="form.title" disabled class="" />
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div>
                                    Chỉ định khách hàng
                                    <div class="inline-block w-[240px] px-2">
                                        <a-input v-model="form.title" class="" />
                                    </div>
                                    là người giới thiệu khách hàng thì URL khách hàng cần truy cập là:
                                    <div class="inline-block w-[240px] px-2">
                                        <a-input v-model="form.title" disabled class="" />
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="mt-4">
                        <h3 class="mb-3 uppercase">
                            Nâng cao
                        </h3>
                        <p class="mb-1">
                            Nếu bạn muốn sử dụng Cookie để theo dõi:
                        </p>
                        <ul class="list-decimal pl-5 grid grid-cols-1 gap-2 mt-3">
                            <li>Nguồn truy cập của khách hàng (thông qua biến utm_source)</li>
                            <li>Các biến: UTM Campaign, UTM Medium, UTM Content, UTM Term</li>
                            <li>Các biến nhân viên giới thiệu utm_user</li>
                            <li>Các biến khách hàng giới thiệu (affiliate utm_account)</li>
                        </ul>
                        <p class="mb-0">
                            Bạn cần có một chút kỹ năng lập trình (coding), đối với website của bạn, bạn cần thêm đoạn code vào thẻ của website chứa opt-in form. Đối với Landing page của Getfly bạn cần cho
                            vào 1 trong 2 ô nhập Remarketing facebook hoặc Remarketing Google của phần Nâng cao. Cookies này sẽ tự động lưu trong 30 ngày, trong trường hợp khách hàng qua lại, cookies sẽ tự động được gia hạn.
                        </p>
                        <div class="max-w-[600px] my-4">
                            <a-textarea v-model="form.description" :auto-size="{ minRows: 3, maxRows: 5 }" />
                        </div>
                        <p class="mb-0">
                            Để xem thống kê ai giới thiệu khách hàng hãy vào link
                            <nuxt-link to="" class="!text-prim-100">
                                KPI > Thống kê Affiliate
                            </nuxt-link>
                        </p>
                        <p class="mb-0">
                            Để xem khách hàng đăng ký vào form đến từ nguồn nào, xem chi tiết cơ hội và các biến utm_source
                            <nuxt-link to="" class="!text-prim-100">
                                Marketing > Chiến dịch
                            </nuxt-link>
                        </p>
                    </div>
                </div>
            </div>
        </a-form-model>
    </div>
</template>

<script>
    import moment from 'moment';

    export default {
        data() {
            return {
                form: {
                    pass: '',
                    checkPass: '',
                    age: '',
                },
                rules: {},
            };
        },

        computed: {
            presetRanges() {
                return {
                    'Hôm nay': [moment(), moment()],
                    'Tuần này': [moment().startOf('isoWeek'), moment().endOf('isoWeek')],
                    'Tháng này': [moment().startOf('month'), moment().endOf('month')],
                    'Năm này': [moment().startOf('year'), moment().endOf('year')],
                };
            },
        },

        methods: {
            submitForm() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        console.log('submit!');
                    } else {
                        return false;
                    }
                });
            },
            resetForm() {
                this.$refs.form.resetFields();
            },
        },
    };
</script>
