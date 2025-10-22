<template>
    <div>
        <a-table
            :data-source="consultations"
            :pagination="false"
            :scroll="{ x: 1200 }"
            :row-key="(row) => row._id"
            :loading="loading"
        >
            <a-table-column
                key="index"
                title="STT"
                align="center"
                :width="40"
                :custom-render="
                    (text, record, index) =>index+1
                "
            />
            <a-table-column
                key="fullname"
                title="Họ và tên"
                :width="150"
                align="center"
                data-index="fullname"
            >
                <template #default="fullname">
                    <span>{{ fullname }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="phone"
                title="Số điện thoại"
                :width="150"
                align="center"
                data-index="phone"
            >
                <template #default="phone">
                    <p v-if="phone">
                        {{ phone }}
                    </p>
                    <p v-else>
                        {{ '--' }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="addressRegister"
                title="Nơi đăng ký"
                :width="150"
                align="center"
                data-index="addressRegister"
            >
                <template #default="addressRegister">
                    <p v-if="addressRegister">
                        {{ addressRegister }}
                    </p>
                    <p v-else>
                        {{ '--' }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="email"
                title="Email"
                :width="150"
                align="center"
                data-index="email"
            >
                <template #default="email">
                    <p v-if="email">
                        {{ email }}
                    </p>
                    <p v-else>
                        {{ '--' }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="symptom"
                title="Triệu chứng"
                :width="150"
                align="center"
                data-index="symptom"
            >
                <template #default="symptom">
                    <p v-if="symptom">
                        {{ symptom }}
                    </p>
                    <p v-else>
                        {{ '--' }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="createdAt"
                data-index="createdAt"
                title="Ngày tạo"
                align="center"
                :width="120"
            >
                <template #default="createdAt">
                    {{ createdAt | dateFormat('dd/MM/yyyy') }}
                </template>
            </a-table-column>
            <a-table-column
                key="action"
                title="Thao tác"
                align="center"
                :width="100"
                fixed="right"
            >
                <template #default="consultation">
                    <div class="flex gap-3">
                        <a-button
                            type="primary"
                            class="!bg-prim-100 !border-transparent !leading-[10px]"
                            shape="circle"
                            @click="() => {
                                consultationSelected = consultation,
                                $refs.Dialog.open(consultation)
                            }"
                        >
                            <i class="fas fa-pencil-alt" />
                        </a-button>
                        <a-button
                            type="primary"
                            shape="circle"
                            class="!bg-prim-100 !border-transparent !leading-[10px]"
                            @click="() => {
                                consultationSelected = consultation,
                                $refs.ConfirmDialog.open()}"
                        >
                            <i class="fas fa-trash" />
                        </a-button>
                    </div>
                </template>
            </a-table-column>
        </a-table>
        <ConfirmDialog
            ref="ConfirmDialog"
            title="Xóa bản ghi"
            content="Bạn chắc chắn xóa bản ghi này ?"
            @confirm="confirmDelete"
        />
        <Dialog ref="Dialog" />
    </div>
</template>

<script>
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
    import Dialog from '@/components/consultations/Dialog.vue';

    export default {
        components: {
            ConfirmDialog,
            Dialog,
        },

        props: {
            consultations: {
                type: Array,
                default: () => [],
            },
            loading: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                consultationSelected: null,
            };
        },
        computed: {
        },

        methods: {
            async confirmDelete() {
                try {
                    await this.$api.consultations.delete(this.consultationSelected._id);
                    this.$message.success('Xóa thành công');
                    this.$nuxt.refresh();
                } catch (e) {
                    this.$handleError(e);
                }
            },
        },
    };
</script>
