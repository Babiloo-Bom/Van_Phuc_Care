<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        :title="title"
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
                    <!-- <a-radio value="current_page" :style="radioStyle">{{ $t('other.current_page') }}</a-radio>
                    <a-radio value="all" :style="radioStyle">{{ $t('other.all_record') }}</a-radio>
                    <a-radio value="selected" :disabled="!customerSelected.length" :style="radioStyle">{{ $t('order.selected') }} {{ customerSelected.length }} {{ $t('order.name_lowercase') }}</a-radio>
                    <a-radio value="time" :style="radioStyle">{{ $t('other.specific_period_of_time') }}</a-radio> -->
                </a-radio-group>
            </div>
            <a-range-picker
                v-if="form.type === 'time'"
                style="width: 100%; margin-top: 16px;"
                :show-time="form.type === 'time' ? true : false"
                format="YYYY/MM/DD HH:mm:ss"
                :presets="rangePresets"
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
    // import ExcelJS from 'exceljs';

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
                rangePresets: [
                    { label: 'Last 7 Days', value: [moment().subtract(7, 'd'), moment()] },
                    { label: 'Last 14 Days', value: [moment().subtract(14, 'd'), moment()] },
                    { label: 'Last 30 Days', value: [moment().subtract(30, 'd'), moment()] },
                    { label: 'Last 90 Days', value: [moment().subtract(90, 'd'), moment()] },
                ],
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
                    { header: 'Mã khách hàng', key: '_id', width: 30 },
                    { header: 'Tên khách hàng', key: 'fullname', width: 15 },
                    { header: 'Email', key: 'email', width: 30 },
                    { header: 'Số điện thoại', key: 'phone', width: 30 },
                    { header: 'Địa chỉ', key: 'address', width: 30 },
                    { header: 'Trạng thái', key: 'status', width: 15 },
                    { header: 'Ngày tạo', key: 'createdAt', width: 15 },
                ],
            };
        },
        computed: {
            ...mapState('customers', ['customers', 'customerSelected']),
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
                if (this.form.type !== 'all') {
                    this.downloadExcel(this.customers);
                } else {
                    try {
                        this.loading = true;
                        const { data: { customers } } = await this.$api.customers.getAll({ limit: 1000 });
                        this.downloadExcel(customers);
                        this.loading = false;
                    } catch (error) {
                        this.$handleError(error);
                    }
                }
            },

            handleCancel() {
                this.$emit('cancel');
                this.close();
            },

            handleDelete() {
                this.$emit('delete');
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

            // downloadExcel(customers) {
            //     const workbook = new ExcelJS.Workbook();
            //     const worksheet = workbook.addWorksheet('Customers');
            //     // Define column widths
            //     worksheet.columns = this.columnsDownload;
            //     // Add data to the worksheet
            //     worksheet.addRows(customers.map((record) => ({
            //         _id: record._id,
            //         fullname: record.fullname,
            //         email: record.email,
            //         phone: record.phone,
            //         address: record.address,
            //         status: record.status,
            //         createdAt: moment(record.createdAt).format('DD/MM/YYYY'),
            //     })));
            //     // Generate a blob
            //     workbook.xlsx.writeBuffer().then((data) => {
            //         const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            //         // Save the Excel file
            //         this.saveAs(blob, 'Customers.csv');
            //     });
            // },
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
