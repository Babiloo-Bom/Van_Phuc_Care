<template>
    <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :colon="false"
    >
        <div>
            <div class="grid grid-cols-4 gap-6">
                <a-form-model-item label="Tên Hợp đồng" prop="title">
                    <a-input v-model="form.title" placeholder="Nhập tên hợp đồng" />
                </a-form-model-item>
                <a-form-model-item label="Số hợp đồng" prop="numberContract">
                    <a-input v-model="form.numberContract" placeholder="Nhập số hợp đồng" />
                </a-form-model-item>
                <a-form-model-item label="Mã hợp đồng" prop="code">
                    <a-input v-model="form.code" placeholder="Nhập mã hợp đồng" />
                </a-form-model-item>
                <a-form-model-item label="Kiểu hợp đồng" prop="type">
                    <a-select v-model="form.type" placeholder="Chọn kiểu hợp đồng">
                        <a-select-option value="new">
                            Mới
                        </a-select-option>
                        <a-select-option value="extend">
                            Gia hạn
                        </a-select-option>
                        <a-select-option value="appendix">
                            Phụ lục hợp đồng
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item :label="`Ngày có hiệu lực`" prop="effectiveAt">
                    <a-date-picker
                        v-model="form.effectiveAt"
                        class="w-full"
                        format="DD/MM/YYYY"
                        :placeholder="`Nhập ngày có hiệu lực`"
                    />
                </a-form-model-item>
                <a-form-model-item :label="`Ngày hết hiệu lực`" prop="expirationAt">
                    <a-date-picker
                        v-model="form.expirationAt"
                        class="w-full"
                        format="DD/MM/YYYY"
                        :placeholder="`Nhập ngày hết hiệu lực`"
                    />
                </a-form-model-item>
                <a-form-model-item label="Hình thực thanh toán" prop="paymentType">
                    <a-select v-model="form.paymentType" placeholder="Chọn hình thức thanh toán">
                        <a-select-option value="cash">
                            Tiền mặt
                        </a-select-option>
                        <a-select-option value="money">
                            Chuyển khoản
                        </a-select-option>
                        <a-select-option value="creadit">
                            Thanh toán tín dụng
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="Hợp đồng sử dụng" prop="contactType">
                    <a-select v-model="form.contactType" placeholder="Chọn hình thức sử dụng">
                        <a-select-option value="multiple">
                            Nhiều lần
                        </a-select-option>
                        <a-select-option value="once">
                            Một lần
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <div class="col-span-4 grid grid-cols-4  gap-6 border-t-[1px] border-[#e8e8e8] pt-6 mt-2">
                    <div class="col-span-2">
                        <h6>Thông tin bên A</h6>
                        <div class="grid grid-cols-2 col-span-2 gap-2">
                            <div class="col-span-2 w-full">
                                <a-form-model-item label="Bên A" prop="partner.name" class="w-full">
                                    <a-input v-model="form.partner.name" placeholder="Nhập nội dung" />
                                </a-form-model-item>
                            </div>
                            <div class="col-span-2 w-full">
                                <a-form-model-item label="Địa chỉ" prop="partner.address">
                                    <a-input v-model="form.partner.address" placeholder="Nhập địa chỉ" />
                                </a-form-model-item>
                            </div>
                            <div class="grid grid-cols-2 col-span-2 gap-4">
                                <a-form-model-item label="Điện thoại" prop="partner.phone">
                                    <a-input v-model="form.partner.phone" placeholder="Nhập số điện thoại" />
                                </a-form-model-item>
                                <a-form-model-item label="Fax" prop="partner.fax">
                                    <a-input v-model="form.partner.fax" placeholder="Nhập số Fax" />
                                </a-form-model-item>
                            </div>
                            <div class="grid grid-cols-2 col-span-2 gap-4">
                                <a-form-model-item label="Người đại diện" prop="partner.representative.name">
                                    <a-input v-model="form.partner.representative.name" placeholder="Nhập tên người đại diện" />
                                </a-form-model-item>
                                <a-form-model-item label="Chức vụ" prop="partner.representative.position">
                                    <a-input v-model="form.partner.representative.position" placeholder="Nhập chức vụ" />
                                </a-form-model-item>
                            </div>
                            <div class="grid grid-cols-2 col-span-2 gap-4">
                                <a-form-model-item label="Số tài khoản" prop="partner.representative.bankAccount">
                                    <a-input v-model="form.partner.representative.bankAccount" placeholder="Nhập số tài khoản người đại diện" />
                                </a-form-model-item>
                                <a-form-model-item label="Ngân hàng" prop="partner.representative.bankName">
                                    <a-input v-model="form.partner.representative.bankName" placeholder="Nhập tên ngân hàng" />
                                </a-form-model-item>
                            </div>
                            <a-form-model-item label="Mã số thuế" prop="partner.taxCode">
                                <a-input v-model="form.partner.taxCode" placeholder="Nhập mã số thuế của đối tác" />
                            </a-form-model-item>
                        </div>
                    </div>
                    <div class="col-span-2">
                        <h6>Thông tin bên B</h6>
                        <div class="grid grid-cols-2 gap-2">
                            <div class="col-span-2 w-full">
                                <a-form-model-item label="Bên B" prop="company.name">
                                    <a-input v-model="form.company.name" placeholder="Nhập nội dung" />
                                </a-form-model-item>
                            </div>
                            <div class="col-span-2 w-full">
                                <a-form-model-item label="Địa chỉ" prop="company.address">
                                    <a-input v-model="form.company.address" placeholder="Nhập địa chỉ" />
                                </a-form-model-item>
                            </div>
                            <div class="grid grid-cols-2 col-span-2 gap-4">
                                <a-form-model-item label="Điện thoại" prop="company.phone">
                                    <a-input v-model="form.company.phone" placeholder="Nhập số điện thoại" />
                                </a-form-model-item>
                                <a-form-model-item label="Fax" prop="company.fax">
                                    <a-input v-model="form.company.fax" placeholder="Nhập số Fax" />
                                </a-form-model-item>
                            </div>
                            <div class="grid grid-cols-2 col-span-2 gap-4">
                                <a-form-model-item label="Người đại diện" prop="company.representative.name">
                                    <a-input v-model="form.company.representative.name" placeholder="Nhập tên người đại diện" />
                                </a-form-model-item>
                                <a-form-model-item label="Chức vụ" prop="company.representative.position">
                                    <a-input v-model="form.company.representative.position" placeholder="Nhập chức vụ" />
                                </a-form-model-item>
                            </div>
                            <div class="grid grid-cols-2 col-span-2 gap-4">
                                <a-form-model-item label="Số tài khoản" prop="company.representative.bankAccount">
                                    <a-input :v-model="form.company.representative.bankAccount" placeholder="Nhập số tài khoản người đại diện" />
                                </a-form-model-item>
                                <a-form-model-item label="Ngân hàng" prop="company.representative.bankName">
                                    <a-input :v-model="form.company.representative.bankName" placeholder="Nhập tên ngân hàng" />
                                </a-form-model-item>
                            </div>
                            <a-form-model-item label="Mã số thuế" prop="company.taxCode">
                                <a-input :v-model="form.company.taxCode" placeholder="Nhập mã số thuế của đối tác" />
                            </a-form-model-item>
                        </div>
                    </div>
                </div>
                <div class="col-span-4">
                    <Editor
                        v-if="editorStatus"
                        :value="form.descriptions"
                        title="Các điều khoản trong hợp đồng"
                        @contentChange="(val) => { form.descriptions = val }"
                    />
                </div>
            </div>
        </div>
    </a-form-model>
</template>

<script>
    import _isEmpty from 'lodash/isEmpty';
    import _cloneDeep from 'lodash/cloneDeep';
    import Editor from '@/components/shared/TinyEditor.vue';

    const defaultForm = {
        title: '',
        partner: {
            representative: {},
        },
        company: {
            representative: {},
        },
    };

    export default {
        components: {
            Editor,
        },

        props: {
            contract: {
                type: Object,
                default: () => {},
            },
            editorStatus: {
                type: Boolean,
                default: true,
            },
        },

        data() {
            return {
                visible: false,
                loading: false,
                form: this.contract ? _cloneDeep(this.contract) : _cloneDeep(defaultForm),
                thumbnailFile: null,
                typePrice: 'default',
                rules: {
                    title: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    code: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    type: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    paymentType: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    contractType: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    'partner.name': [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    'partner.address': [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    'partner.phone': [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    'company.name': [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    'company.address': [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    'company.phone': [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                },
            };
        },

        watch: {
            contract() {
                this.form = this.contract ? _cloneDeep(this.contract) : _cloneDeep(defaultForm);
            },
        },

        methods: {
            _isEmpty,

            handlerThumbnail(file) {
                this.thumbnailFile = file;
                this.form.thumbnail = URL.createObjectURL(file);
            },

            submit() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$emit('submit', { form: this.form, thumbnailFile: this.thumbnailFile });
                    } else {
                        this.$message.info('Vui lòng nhập đầy đủ thông tin các trường của hợp đồng');
                        throw new Error();
                    }
                });
            },
        },
    };
</script>

<style>
    .ant-form-item-children, .ant-input-number {
        @apply block w-full
    }
    .ant-calendar-picker {
        margin-top: 5px !important;
    }
</style>
