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
            <div class="grid grid-cols-2 gap-4">
                <a-form-model-item
                    prop="typeDiscount"
                    class="!mb-5 col-span-2"
                    :label="`Cách thức giảm`"
                >
                    <a-radio-group v-model="form.typeDiscount" @change="handleTypeDiscount">
                        <a-radio value="amount" class="h-[30px]">
                            {{ 'Giá' }}
                        </a-radio>
                        <a-radio value="percentage">
                            {{ 'Phần trăm' }}
                        </a-radio>
                    </a-radio-group>
                </a-form-model-item>
                <a-form-model-item :label="`Lý do giảm giá`" prop="name">
                    <a-input
                        v-model="form.name"
                        size="large"
                        :placeholder="`Nhập lý do hoặc mã giảm giá`"
                        @keyup.native.enter="handleSubmit"
                    />
                </a-form-model-item>
                <a-form-model-item
                    :label="`Giá`"
                    prop="price"
                >
                    <a-input
                        v-model="form.price"
                        size="large"
                        :placeholder="`Nhập giá trị`"
                    />
                </a-form-model-item>
            </div>
        </a-form-model>
        <div slot="footer" class="flex flex-row-reverse justify-between items-center gap-2">
            <a-button
                :loading="loading"
                class="min-w-28"
                type="primary"
                :disabled="!form.name.length || !form.price.length"
                @click="handleConfirm"
            >
                {{ 'Áp dụng' }}
            </a-button>
            <a-button
                v-if="data"
                type="primary"
                class="min-w-28 !m-0"
                danger
                ghost
                @click="handleDelete"
            >
                {{ 'Xóa' }}
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    export default {
        props: {
            data: {
                type: Object,
                default: () => {},
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
                form: {
                    name: '',
                    price: '',
                    typeDiscount: 'amount',
                },
                rules: {
                    name: [
                        {
                            required: true,
                            message: 'Vui lòng nhập lý do hoặc mã giảm giá',
                            trigger: 'blur',
                        },
                    ],
                    price: [
                        {
                            required: true,
                            message: 'Vui lòng nhập giá',
                            trigger: 'blur',
                        },
                        {
                            type: 'number', // Ensure it's a number input
                            message: 'Giá trị phải là số', // Custom error message for non-numeric input
                            transform(value) {
                                if (value === '') return undefined; // Allow empty input
                                return Number(value); // Convert to a number
                            },
                            trigger: 'change',
                        },
                        {
                            validator: (rule, value) => {
                                if (value > 100 && this.form.typeDiscount === 'percentage') {
                                    // eslint-disable-next-line prefer-promise-reject-errors
                                    return Promise.reject('Giá trị không được lớn hơn 100');
                                }
                                return Promise.resolve();
                            },
                            trigger: 'change',
                        },
                    ],
                },
            };
        },

        methods: {
            open() {
                this.visible = true;
            },

            close() {
                this.visible = false;
            },

            async handleConfirm() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        try {
                            this.close();
                            await this.$emit('confirm', this.form);
                        } catch (error) {
                            this.$handleError(error);
                        }
                    }
                });
            },
            handleTypeDiscount() {
                this.form.price = 0;
            },

            handleCancel() {
                this.$emit('cancel');
                this.close();
            },

            handleDelete() {
                this.$emit('delete');
                this.close();
            },
        },
    };
</script>
