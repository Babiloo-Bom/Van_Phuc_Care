<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        title="Thêm mã vận chuyển"
    >
        <template>
            <a-form-model
                ref="form"
                :model="form"
                :rules="rules"
                layout="vertical"
                :colon="false"
            >
                <div class="grid grid-cols-2 gap-4 mb-2">
                    <a-form-model-item
                        prop="code"
                        class="!mb-5"
                        :label="$t('shipping.code')"
                    >
                        <a-input
                            v-model="form.code"
                            :placeholder="$t('shipping.enter_the_shipping_code')"
                        />
                    </a-form-model-item>
                    <a-form-model-item
                        prop="name"
                        class="!mb-5"
                        :label="$t('shipping.shipping_carrier')"
                    >
                        <a-select
                            show-search
                            :placeholder="$t('shipping.shipping_carrier')"
                            option-filter-prop="children"
                            style="width: 100%"
                            :filter-option="filterOption"
                            @change="handleChange"
                        >
                            <a-select-option v-for="transport in transports" :key="`transport_${transport.value}`" :value="transport.value">
                                {{ transport.label }}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                </div>
            </a-form-model>
        </template>
        <div slot="footer" class="flex justify-end items-center gap-2">
            <a-button class="w-28" @click="handleCancel">
                Hủy bỏ
            </a-button>
            <a-button
                :loading="loading"
                class="w-28"
                :type="confirmBtnType"
                @click="handleConfirm"
            >
                <i :class="confirmIcon" /> {{ $t(confirmBtn) }}
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                default: 'shared.save',
            },
            content: String,
            confirmBtn: {
                type: String,
                default: 'shared.save',
            },
            confirmIcon: String,
            confirmBtnType: {
                type: String,
                default: 'primary',
            },
            cancelBtn: {
                type: String,
                default: 'Hủy',
            },
        },

        data() {
            return {
                visible: false,
                loading: false,
                form: {},
                rules: {},
                transports: [
                    { label: 'Giao Hàng Nhanh', value: 'giao-hang-nhanh', trackingLink: 'https://donhang.ghn.vn/?order_code={code}' },
                    { label: 'Bưu điện Việt Nam (Vietnam Post)', value: 'vietnam-post', trackingLink: 'http://ipostal.vnpost.vn/vi-vn/dinh-vi/buu-pham?key={code}' },
                    { label: 'Giao Hàng Tiết Kiệm', value: 'giao-hang-tiet-kiem', trackingLink: '' },
                    { label: 'Viettel Post', value: 'viettel-post', trackingLink: '' },
                    { label: 'J&T Express', value: 'jt-express', trackingLink: 'https://jtexpress.vn/vi/tracking?type=track&billcode={code}&cellphone={phone}' },
                    { label: 'Ninja Van', value: 'ninja-van', trackingLink: 'https://www.ninjavan.co/vi-vn/tracking?id={code}' },
                    { label: 'DHL Express', value: 'dhl-express', trackingLink: 'https://www.dhl.com/vn-en/home/tracking.html?tracking-id=' },
                    { label: 'Nhất Tín Express', value: 'nhat-tin-express', trackingLink: 'https://ntlogistics.vn/tra-van-don.html?bill={code}' },
                ],
            };
        },

        methods: {
            open(roomType) {
                this.roomType = roomType;
                this.visible = true;
            },

            close() {
                this.visible = false;
            },

            async handleConfirm() {
                this.loading = true;
                await this.$emit('confirm', this.form);
                this.loading = false;
                this.close();
            },

            handleCancel() {
                this.$emit('cancel');
                this.close();
            },
            handleChange(value) {
                this.form.name = value;
                this.form.label = this.transports.find((e) => e.value === value).label;
                this.form.trackingLink = this.transports.find((e) => e.value === value).trackingLink;
            },
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
        },
    };
</script>
<style lang="scss">
.ant-select-selection__placeholder {
    font-size: 12px;
}
</style>
