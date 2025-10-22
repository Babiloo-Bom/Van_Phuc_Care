<template>
    <a-table
        :data-source="transactions"
        :pagination="false"
    >
        <a-table-column
            key="title"
            title="Tên giao dịch"
            align="left"
            :width="280"
        >
            <template #default="record">
                <div class="text-prim-100 font-semibold">
                    {{ record.title || '' }}
                </div>
            </template>
        </a-table-column>
        <a-table-column
            key="type"
            title="Loại hình"
            align="center"
            :width="120"
        >
            <template #default="record">
                <div>
                    {{ record.type }}
                </div>
            </template>
        </a-table-column>
        <a-table-column
            key="status"
            title="Trạng thái"
            align="center"
            :width="150"
        >
            <template #default="record">
                <p :style="`color: ${STATUS_TRANS_COLOR[record.status]}`" class="mb-0">
                    {{ STATUS_TRANS_LABEL[record.status] || '' }}
                </p>
            </template>
        </a-table-column>
        <a-table-column
            key="price"
            title="Giá tiền"
            align="center"
            :width="150"
        >
            <template #default="record">
                <p class="mb-0" :style="`color: ${STATUS_TRANS_COLOR[record.status]}`">
                    {{ record.total | currencyFormat }}
                </p>
            </template>
        </a-table-column>
    </a-table>
</template>

<script>
    import { STATUS_TRANSACTION_OPTIONS, STATUS_TRANSACTION } from '@/constants/transactionHistory/status-transaction';
    import { TYPE_OPTIONS, TYPE } from '@/constants/transactionHistory/type';
    import { mapDataFromOptions } from '@/utils/data';

    export default {
        props: {
            transactions: {
                type: Array,
                default: () => [],
            },
        },

        data() {
            return {
                TYPE_OPTIONS,
                TYPE,
                STATUS_TRANSACTION_OPTIONS,
                STATUS_TRANSACTION,
            };
        },

        computed: {
            TYPE_LABEL() {
                return mapDataFromOptions(TYPE_OPTIONS, 'value', 'label');
            },
            STATUS_TRANS_LABEL() {
                return mapDataFromOptions(STATUS_TRANSACTION_OPTIONS, 'value', 'label');
            },
            STATUS_TRANS_COLOR() {
                return mapDataFromOptions(STATUS_TRANSACTION_OPTIONS, 'value', 'color');
            },
        },

        methods: {
        },
    };
</script>
