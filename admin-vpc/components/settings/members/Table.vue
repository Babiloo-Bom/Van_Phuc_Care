<template>
    <div>
        <a-table
            :data-source="members"
            :pagination="false"
            :scroll="{ x: 800 }"
            :row-key="(row) => row._id"
            :loading="loading"
            class="cursor-pointer !text-[13px]"
        >
            <a-table-column
                key="member"
                title="Tên thành viên"
                :width="120"
                align="left"
            >
                <template #default="member">
                    <a-avatar
                        v-if="member.avatar"
                        :src="member.avatar"
                        alt=""
                        class="rounded-full w-16 h-16 object-cover"
                    />
                    <a-avatar v-else>
                        {{ member.firstName?.charAt(0) }}{{ member.lastName?.charAt(0) }}
                    </a-avatar>
                    <a-button type="link" class="!font-[500] !p-0 !text-[13px] !m-0 !ml-2" @click="handleRowClick(member)">
                        {{ member.fullname || `${member.firstName || ''} ${member.lastName || ''}` }}
                    </a-button>
                </template>
            </a-table-column>
            <a-table-column
                key="email"
                data-index="email"
                title="Email"
                align="left"
                :width="150"
            >
                <template #default="email">
                    {{ email }}
                </template>
            </a-table-column>
            <a-table-column
                key="updatedAt"
                data-index="updatedAt"
                :title="`Ngày cập nhật`"
                align="left"
                :width="150"
            >
                <template #default="updatedAt">
                    {{ updatedAt | dateFormat('HH:mm dd/MM/yyyy') }}
                </template>
            </a-table-column>
            <a-table-column
                key="status"
                data-index="status"
                :title="`Trạng thái`"
                :width="150"
            >
                <template #default="status">
                    <span :class="`w-[160px] text-left inline-flex items-center justify-start gap-1.5 py-1 rounded-full text-[13px] font-[600] !text-[${STATUS_COLOR[status]}]`">
                        <span :class="`w-2 h-2 rounded-full`" :style="`background-color: ${STATUS_COLOR[status]}`" />
                        <span :style="`color: ${STATUS_COLOR[status]}`">{{ STATUS_LABEL[status] }}</span>
                    </span>
                </template>
            </a-table-column>
        </a-table>
    </div>
</template>

<script>
    import { mapDataFromOptions } from '@/utils/data';
    import {
        CUSTOMER_STATUS, CUSTOMER_STATUS_OPTIONS,
    } from '@/constants/customers/status';

    export default {
        components: {
        },

        props: {
            members: {
                type: Array,
                default: () => [],
            },
            loading: {
                type: Boolean,
                default: false,
            },
            pagination: {
                type: Object,
                required: false,
            },
        },

        async asyncData({ store, query }) {
            await store.dispatch('members/fetchAll', query);
        },

        data() {
            return {
                CUSTOMER_STATUS,
                CUSTOMER_STATUS_OPTIONS,
                selected: '',
                rowSelection: [],
            };
        },
        computed: {
            STATUS_LABEL() {
                return this.mapDataFromOptions(CUSTOMER_STATUS_OPTIONS, 'value', 'label');
            },

            STATUS_COLOR() {
                return this.mapDataFromOptions(CUSTOMER_STATUS_OPTIONS, 'value', 'color');
            },
        },
        mounted() {
            // this.addClickListenersToRows();
        },
        methods: {
            mapDataFromOptions,
            addClickListenersToRows() {
                // Get all table rows
                const rows = document.querySelectorAll('.ant-table-row');
                // Attach a click event listener to each row
                rows.forEach((row, index) => {
                    row.addEventListener('click', () => {
                        this.handleRowClick(this.members[index]); // Pass the clicked row data
                    });
                });
            },
            handleCheckboxChange(row, rowIndex) {
                // Handle checkbox change for a specific row
                console.log('Checkbox change for row:', row, rowIndex);
            },
            handleRowClick(row) {
                this.$router.push(`/settings/members/${row._id}`);
            },
        },
    };
</script>
