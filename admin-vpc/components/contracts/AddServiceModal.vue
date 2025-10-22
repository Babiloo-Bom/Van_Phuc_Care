<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        :centered="true"
        :width="600"
        :title="form._id ? 'Chỉnh sửa' : 'Thêm dịch vụ'"
    >
        <a-form-model
            ref="form"
            :model="form"
            :rules="rules"
        >
            <div class="grid grid-cols-1 gap-y-2">
                <SelectServices :data="services" @submit="addServiceInContract" />
                <div v-if="form.services?.length" class="mt-4 overflow-scroll">
                    <div class="grid grid-cols-12 gap-4 min-w-[450px]">
                        <div class="lg:col-span-5 col-span-5 ">
                            <h6 class="font-bold">
                                {{ 'Dịch vụ' }}
                            </h6>
                        </div>
                        <div class="lg:col-span-3 col-span-2">
                            <h6 class="text-center font-bold">
                                {{ 'Số lượng' }}
                            </h6>
                        </div>
                        <div class="lg:col-span-3 col-span-5">
                            <h6 class="text-center font-bold">
                                {{ 'Tổng tiền' }}
                            </h6>
                        </div>
                        <div class="col-span-1">
                            <h6 class="text-center font-bold" />
                        </div>
                    </div>
                    <div
                        v-for="(record) in form.services"
                        :key="record._id"
                        class="grid grid-cols-12 gap-4 py-3 items-center min-w-[450px]"
                        style="border-top: 1px solid #ebebeb"
                    >
                        <div class="lg:col-span-5 col-span-5 flex items-start gap-2">
                            <img
                                class="w-[60px] h-[60px] rounded-md p-1"
                                style="border: 1px solid #ced4da;"
                                :src="record.thumbnail"
                                alt="/"
                            >
                            <div>
                                <h6 class="m-0">
                                    {{ record.title }}
                                </h6>
                                <!-- <p class="m-0">
                                    {{ Number(record.price).toLocaleString('de-DE') }} đ
                                </p> -->
                            </div>
                        </div>
                        <div class="lg:col-span-3 col-span-2 flex items-center justify-center">
                            <a-input-number
                                v-if="!form._id"
                                v-model="record.quantity"
                                step="1"
                                style="width: 100px;text-align: center;"
                                placeholder="Nhập số lượng"
                                @change="handleNumberInput(record._id)"
                            />
                            <span v-else>{{ record.quantity }}</span>
                        </div>
                        <div class="lg:col-span-3 col-span-5">
                            <p class="m-0 text-center">
                                {{ (parseInt(record.quantity || 1) * parseInt(record.pricings[0]?.price)).toLocaleString('de-DE') }} đ
                            </p>
                        </div>
                        <div v-if="!form._id" class="col-span-1">
                            <a-button type="text" class="!p-1 !w-[31px] flex items-center justify-center !h-[31px] !border-0 back !bg-[transparent]" @click="removeProductFromOrder(record._id)">
                                <svg
                                    viewBox="0 0 20 20"
                                    class="!m-0 w-[23px] h-[23px]"
                                    focusable="false"
                                    aria-hidden="true"
                                ><path fill="#8e8e8e" d="M11.5 8.25a.75.75 0 0 1 .75.75v4.25a.75.75 0 0 1-1.5 0v-4.25a.75.75 0 0 1 .75-.75Z" /><path fill="#8e8e8e" d="M9.25 9a.75.75 0 0 0-1.5 0v4.25a.75.75 0 0 0 1.5 0v-4.25Z" /><path fill="#8e8e8e" fill-rule="evenodd" d="M7.25 5.25a2.75 2.75 0 0 1 5.5 0h3a.75.75 0 0 1 0 1.5h-.75v5.45c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311c-.642.327-1.482.327-3.162.327h-.4c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311c-.327-.642-.327-1.482-.327-3.162v-5.45h-.75a.75.75 0 0 1 0-1.5h3Zm1.5 0a1.25 1.25 0 1 1 2.5 0h-2.5Zm-2.25 1.5h7v5.45c0 .865-.001 1.423-.036 1.848-.033.408-.09.559-.128.633a1.5 1.5 0 0 1-.655.655c-.074.038-.225.095-.633.128-.425.035-.983.036-1.848.036h-.4c-.865 0-1.423-.001-1.848-.036-.408-.033-.559-.09-.633-.128a1.5 1.5 0 0 1-.656-.655c-.037-.074-.094-.225-.127-.633-.035-.425-.036-.983-.036-1.848v-5.45Z" /></svg>
                            </a-button>
                        </div>
                    </div>
                    <div v-if="form.status === 'pending'" class="px-4 flex items-center justify-end">
                        <a-button
                            type="primary"
                            :loading="loadingUpdate"
                            class="!flex items-center gap-2 justify-center"
                            @click="fullfiled"
                        >
                            {{ 'Hoàn thành chuẩn bị đơn hàng' }}
                        </a-button>
                    </div>
                </div>
                <a-form-model-item label="Giảm giá" prop="discounts">
                    <a-input v-model="form.discounts" placeholder="Nhập giá trị giảm" @keyup.native.enter="handleSubmit" />
                </a-form-model-item>
                <a-form-model-item label="VAT(%)" prop="vat">
                    <a-input v-model="form.vat" placeholder="Nhập giá trị VAT" @keyup.native.enter="handleSubmit" />
                </a-form-model-item>
                <a-form-model-item label="Lưu ý" prop="notes">
                    <a-textarea
                        v-model="form.notes"
                        placeholder="Nội dung"
                        :auto-size="{ minRows: 4, maxRows: 5 }"
                    />
                </a-form-model-item>
            </div>
        </a-form-model>
        <div slot="footer" class="flex justify-end items-center gap-2">
            <a-button class="w-28" @click="close">
                {{ 'Hủy' }}
            </a-button>
            <a-button
                :loading="loading"
                class="w-28"
                type="primary"
                @click="handleSubmit"
            >
                {{ form._id ? `Cập nhật` : `Tạo mới` }}
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    import { mapState } from 'vuex';
    import _cloneDeep from 'lodash/cloneDeep';
    import _omit from 'lodash/omit';
    import SelectServices from '@/components/contracts/SelectServices.vue';

    const defaultForm = {
        servicesSelected: '',
        notes: '',
        discounts: '',
        vat: 0,
    };
    export default {
        components: {
            SelectServices,
        },
        data() {
            return {
                visible: false,
                loading: false,
                form: defaultForm,
                rules: {
                },
            };
        },

        computed: {
            ...mapState('services', ['services', 'serviceSelected']),
        },

        methods: {
            open(data) {
                this.form = data ? _cloneDeep(data) : defaultForm;
                this.visible = true;
            },

            close() {
                this.visible = false;
            },

            handlerUpload(file) {
                this.file = file;
            },

            async handleSubmit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        try {
                            this.loading = true;
                            if (this.form._id) {
                                await this.$store.dispatch('customers/update', {
                                    _id: this.form._id,
                                    data: _omit(this.form, ['_id', 'timeline']),
                                });
                                this.$message.success('Cập nhật thành công');
                                this.close();
                            } else {
                                await this.$api.customers.create({ ...this.form });
                                this.$message.success('Tạo bản ghi thành công');
                                this.close();
                            }
                        } catch (error) {
                            this.$handleError(error);
                        } finally {
                            this.loading = false;
                            await this.$store.dispatch('customers/fetchAll', this.$route.query);
                        }
                    }
                });
            },

            addServiceInContract(data) {
                this.form.services = data.map((e) => (
                    {
                        ...(JSON.parse(e)),
                        quantity: 1,
                    }
                ));
                console.log(this.form.services);
                this.$forceUpdate();
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
