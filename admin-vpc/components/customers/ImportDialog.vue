<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        title="Import"
    >
        <div class="mb-4">
            {{ 'Import' }}
            <span class="text-second-600 cursor-pointer text-[#53c66e] uppercase" @click="downloadExcel(customersExample)"> {{ 'tại đây' }} </span>
        </div>
        <a-input
            id="fileUploadExcel"
            ref="fileUploadExcel"
            type="file"
            accept=".csv"
            hidden
            @change="handleUploadFileExcel"
        />
        <a-button
            v-if="fileData === null"
            type="primary"
            class="w-full !h-[110px] rounded-sm !bg-[#fafafa]"
            style="border: 1px dashed #ced4da;"
            :loading="loading"
            @click="choooseFile"
        >
            <div class="bg-gray-300 w-8 h-8 rounded-full mx-auto flex items-center justify-center">
                <svg
                    class="transition-all duration-300"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                ><path
                    d="M9 17v-6l-2 2M9 11l2 2"
                    stroke="#53c66e"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                /><path
                    d="M22 10v5c0 5-2 7-7 7H9c-5 0-7-2-7-7V9c0-5 2-7 7-7h5"
                    stroke="#53c66e"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                /><path
                    d="M22 10h-4c-3 0-4-1-4-4V2l8 8Z"
                    stroke="#53c66e"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                /></svg>
            </div>
            <div class="text-base text-[#161a21]">
                {{ `$t('product.dialog_import_content')` }}
            </div>
        </a-button>
        <div v-else class="flex justify-between p-2 border rounded-sm border-none bg-[#53c66e21] font-[600]">
            <span class="flex items-center justify-start gap-3 text-[#53c66e]">
                <svg
                    class="transition-all duration-300"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                ><path
                    d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z"
                    stroke="#53c66e"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                /><path
                    d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8"
                    stroke="#53c66e"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                /></svg>
                {{ fileData?.name }}</span>
            <span class="cursor-pointer" @click="removeFile"><i class="fa-solid fa-xmark pr-2" /></span>
        </div>
        <div slot="footer" class="flex justify-end items-center gap-2">
            <a-button class="w-28" @click="close">
                {{ 'Hủy' }}
            </a-button>
            <a-button
                :loading="loading"
                class="w-28"
                type="primary"
                @click="importFile"
            >
                {{ 'Import' }}
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    // import ExcelJS from 'exceljs';

    export default {
        data() {
            return {
                visible: false,
                loading: false,
                file: null,
                fileData: null,
                customersExample: [
                    {
                        firstname: 'Kanes',
                        lastname: 'Nguyen',
                        phone: '963395764',
                        email: 'nguyenhuyhoangdevelop@gmail.com',
                        status: 'verified',
                        address: '',
                        address1: '',
                        address2: '',
                        company: 'GensTech',
                        accepts_email_marketing: true,
                        accepts_sms_marketing: true,
                        city: 'Ha Noi',
                        province: '',
                        province_code: '',
                        country: 'VietNam',
                        country_code: '',
                        zip: '',
                        total_order: 0,
                        total_spent: 0.0,
                        tags: '',
                        notes: '',
                    },
                    {
                        firstname: 'Harvey',
                        lastname: 'Nguyen',
                        phone: '987654356',
                        email: 'harveynguyen@gmail.com',
                        status: 'verified',
                        address: '',
                        address1: '',
                        address2: '',
                        company: 'GensTech',
                        accepts_email_marketing: true,
                        accepts_sms_marketing: true,
                        city: 'Ha Noi',
                        province: '',
                        province_code: '',
                        country: 'VietNam',
                        country_code: '',
                        zip: '',
                        total_order: 0,
                        total_spent: 0.0,
                        tags: '',
                        notes: '',
                    },
                    {
                        firstname: 'Ekkos',
                        lastname: 'Nguyen',
                        phone: '679865342',
                        email: 'ekkogens@gmail.com',
                        status: 'verified',
                        address: '',
                        address1: '',
                        address2: '',
                        company: 'GensTech',
                        accepts_email_marketing: true,
                        accepts_sms_marketing: true,
                        city: 'Ha Noi',
                        province: '',
                        province_code: '',
                        country: 'VietNam',
                        country_code: '',
                        zip: '',
                        total_order: 0,
                        total_spent: 0.0,
                        tags: '',
                        notes: '',
                    },
                ],
                columnsDownload: [
                    { header: 'firstname', key: 'firstname', width: 30 },
                    { header: 'lastname', key: 'lastname', width: 30 },
                    { header: 'phone', key: 'phone', width: 30 },
                    { header: 'email', key: 'email', width: 30 },
                    { header: 'status', key: 'status', width: 30 },
                    { header: 'address', key: 'address', width: 30 },
                    { header: 'address1', key: 'address1', width: 30 },
                    { header: 'address2', key: 'address2', width: 30 },
                    { header: 'company', key: 'company', width: 30 },
                    { header: 'accepts_email_marketing', key: 'accepts_email_marketing', width: 30 },
                    { header: 'accepts_sms_marketing', key: 'accepts_sms_marketing', width: 30 },
                    { header: 'city', key: 'city', width: 30 },
                    { header: 'province', key: 'province', width: 30 },
                    { header: 'province_code', key: 'province_code', width: 30 },
                    { header: 'country', key: 'country', width: 30 },
                    { header: 'country_code', key: 'country_code', width: 30 },
                    { header: 'zip', key: 'zip', width: 30 },
                    { header: 'total_order', key: 'total_order', width: 30 },
                    { header: 'total_spent', key: 'total_spent', width: 30 },
                    { header: 'tags', key: 'tags', width: 30 },
                    { header: 'notes', key: 'notes', width: 30 },
                ],
            };
        },

        methods: {
            open() {
                this.visible = true;
            },
            async handleUploadFileExcel(event) {
                try {
                    const file = event.target.files[0];
                    this.fileData = file;
                    this.loading = false;
                    this.$forceUpdate();
                } catch (error) {
                    this.loading = false;
                    this.$message.error('File cập nhật lỗi');
                }
            },
            choooseFile() {
                document.getElementById('fileUploadExcel').click();
            },

            close() {
                this.visible = false;
                this.removeFile();
            },

            removeFile() {
                this.fileData = null;
            },

            async importFile() {
                try {
                    this.loading = true;
                    if (this.fileData) {
                        this.loading = true;
                        await this.$store.dispatch('customers/uploadFileExcel', this.fileData);
                    }
                    this.$message.success('Import thành công');
                    this.$store.dispatch('customers/fetchAll', { ...this.$route.query });
                    this.close();
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },

            // downloadExcel(products) {
            //     const workbook = new ExcelJS.Workbook();
            //     const worksheet = workbook.addWorksheet('Products 1');
            //     // Define column widths
            //     worksheet.columns = this.columnsDownload;
            //     // Add data to the worksheet
            //     worksheet.addRows(products);
            //     // Generate a blob
            //     workbook.xlsx.writeBuffer().then((data) => {
            //         const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            //         // Save the Excel file
            //         this.saveAs(blob, 'Customer.csv');
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

<style lang="scss">
.inport-user {
    .ant-upload {
        @apply w-full;
    }
}
</style>
