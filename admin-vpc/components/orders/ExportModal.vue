<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        title="Export Đơn hàng"
    >
        <a-form-model
            ref="form"
            :model="form"
            :rules="rules"
            class="w-full"
        >
            <div class="grid grid-cols-1 mb-[2px]">
                <p>Export</p>
                <a-radio-group v-model="form.type" name="radioGroup">
                    <a-radio value="current_page" :style="radioStyle">
                        {{ 'Trang hiện tại' }}
                    </a-radio>
                    <a-radio value="all" :style="radioStyle">
                        {{ 'Tất cả bản ghi' }}
                    </a-radio>
                    <a-radio value="selected" :disabled="!orderSelected.length" :style="radioStyle">
                        {{ `Đã chọn` }} {{ cartSelected?.length }} {{ 'bản ghi' }}
                    </a-radio>
                    <a-radio value="time" :style="radioStyle">
                        {{ 'Thời gian cụ thể' }}
                    </a-radio>
                </a-radio-group>
            </div>
            <a-range-picker
                v-if="form.type === 'time'"
                style="width: 100%; margin-top: 16px;"
                format="YYYY-MM-DD"
                :ranges="presetRanges"
                @change="onRangeChange"
            />
        </a-form-model>
        <div slot="footer" class="flex flex-row-reverse justify-between items-center gap-2">
            <a-button
                :loading="loading"
                class="min-w-28"
                type="primary"
                @click="handleConfirm"
            >
                Export
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    import { mapState } from 'vuex';
    import moment from 'moment';
    import ExcelJS from 'exceljs';

    export default {
        props: {
            data: {
                type: String,
                default: () => '',
            },
            title: {
                type: String,
                default: 'shared.save',
            },
        },

        data() {
            return {
                visible: false,
                loading: false,
                radioStyle: {
                    display: 'flex',
                    height: '19px',
                    lineHeight: '18px',
                    marginBottom: '12px',
                    alignItems: 'center',
                },
                form: {
                    type: 'all',
                },
                rules: {
                    name: [
                        {
                            required: true,
                            message: 'Vui lòng nhập tên phương thức',
                            trigger: 'blur',
                        },
                    ],
                    price: [
                        {
                            required: true,
                            message: 'Vui lòng nhập giá',
                            trigger: 'blur',
                        },
                    ],
                },
                columnsDownload: [
                    { header: 'Mã đơn hàng', key: '_id', width: 30 },
                    { header: 'Số sản phẩm', key: 'products', width: 15 },
                    { header: 'Khách hàng', key: 'customerEmail', width: 30 },
                    { header: 'Số điện thoại khách hàng', key: 'customerPhone', width: 30 },
                    { header: 'Địa chỉ khách hàng', key: 'customerAddress', width: 30 },
                    { header: 'Phương thức thanh toán', key: 'paymentMethod', width: 15 },
                    { header: 'Giảm giá', key: 'discountPrice', width: 15 },
                    { header: 'Loại giảm giá', key: 'discountType', width: 15 },
                    { header: 'Vận chuyển', key: 'transport', width: 15 },
                ],
            };
        },
        computed: {
            ...mapState('orders', ['orders', 'pagination', 'orderSelected']),
            presetRanges() {
                return {
                    'Tuần trước': [moment().subtract(7, 'd'), moment()],
                    '14 ngày trước': [moment().subtract(14, 'd'), moment()],
                    '1 tháng trước': [moment().subtract(30, 'd'), moment()],
                    '90 ngày trước': [moment().subtract(90, 'd'), moment()],
                };
            },
        },

        methods: {
            moment,
            open() {
                this.visible = true;
            },

            close() {
                this.visible = false;
            },

            async handleConfirm() {
                if (this.form.type === 'current_page') {
                    this.downloadExcel(this.orders);
                } else if (this.form.type === 'selected') {
                    this.downloadExcel(this.orders.filter((e) => this.orderSelected.includes(e._id)));
                } else {
                    try {
                        this.loading = true;
                        const { data: { orders } } = await this.$api.orders.getAll({ limit: 1000 });
                        this.downloadExcel(orders);
                        this.loading = false;
                        this.close();
                    } catch (error) {
                        this.$handleError(error);
                        this.loading = false;
                        this.close();
                    }
                }
            },

            handleCancel() {
                this.$emit('cancel');
                this.close();
            },

            onRangeChange(dates, dateStrings) {
                if (dates) {
                    console.log('From: ', dates[0], ', to: ', dates[1]);
                    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
                } else {
                    console.log('Clear');
                }
            },

            downloadExcel(orders) {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Order');
                // Define column widths
                worksheet.columns = this.columnsDownload;
                // Add data to the worksheet
                worksheet.addRows(orders?.map((record) => ({
                    _id: record._id,
                    products: record.products?.length,
                    customerEmail: record.customer?.email,
                    customerPhone: record.customer?.phone,
                    customerAddress: record.customer?.address,
                    paymentMethod: record.paymentMethod,
                    discountPrice: record.discount?.price,
                    discountType: record.discount?.type,
                    discountCode: record.discount?.code,
                    transport: record.transport?.name,
                })));
                // Generate a blob
                workbook.xlsx.writeBuffer().then((data) => {
                    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    // Save the Excel file
                    this.saveAs(blob, 'Orders.xlsx');
                });
            },
            saveAs(blob, filename) {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            },
        },
    };
</script>
