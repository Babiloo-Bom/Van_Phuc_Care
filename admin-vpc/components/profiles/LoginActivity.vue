<template>
    <div class="">
        <div ref="scrollLogin" class="scroll-target">
            <a-table
                :data-source="activeLogs"
                :pagination="false"
            >
                <a-table-column
                    key="device"
                    title="Thiết bị"
                    align="left"
                    :width="150"
                >
                    <template #default="record">
                        <div class="flex items-center gap-2">
                            <a-icon :type="record?.device.type === 'desktop' ? 'desktop' : 'mobile'" /><strong>{{ record.platform || 'Windows' }}</strong>
                        </div>
                    </template>
                </a-table-column>
                <a-table-column
                    key="location"
                    title="Vị trí"
                    align="left"
                    :width="150"
                >
                    <template #default="record">
                        <div>{{ record.address || '--' }}</div>
                    </template>
                </a-table-column>
                <a-table-column
                    key="session"
                    title="Địa chỉ IP"
                    align="left"
                    :width="150"
                >
                    <template #default="record">
                        <strong v-if="record.isCurrent">Hiện tại</strong>
                        <span v-else>{{ record.createdAt | dateFormat('HH:mm dd/MM/yyyy') }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    key="browser"
                    title="Trình duyệt"
                    align="left"
                    :width="150"
                >
                    <template #default="record">
                        {{ record.browser }}
                    </template>
                </a-table-column>
            </a-table>
            <ct-pagination v-if="activePagi.length < activePagi.limit" :data="activePagi" />
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        async fetch() {
            await this.fetchData();
        },
        data() {
            return {
            };
        },

        computed: {
            ...mapState('profiles', ['activeLogs', 'activePagi']),
        },

        methods: {
            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('profiles/fetchActiveLogs');
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
            scrollToTarget() {
                const targetElement = this.$refs.scrollLogin;
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    targetElement.classList.add('active');
                    setTimeout(() => {
                        targetElement.classList.remove('active');
                    }, 2000);
                }
            },
        },
    };
</script>
