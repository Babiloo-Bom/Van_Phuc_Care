<template>
    <div class="card !pt-0 relative min-h-[300px]">
        <div v-if="loading" class="h-full w-full absolute bg-[#ffffff36] z-[999] flex items-center justify-center flex-col">
            <span class="loader" />
        </div>
        <div v-else class="min-h-[300px]">
            <div class="flex items-center gap-4">
                <a-input
                    v-model="searchVaccin"
                    size="large"
                    placeholder="Nhập tên mũi tiêm"
                    @change="handleSearchVaccin"
                    @keyup.native.enter="handleSubmit"
                />
                <a-select
                    v-model="categorySearch"
                    class="w-full max-w-[160px]"
                    :options="[{
                        label: 'Tất cả',
                        value: 'all'
                    }, {
                        label: 'Trẻ sơ sinh',
                        value: 'new-born'
                    }, {
                        label: '2 tháng tuổi',
                        value: '2-months'
                    }, {
                        label: '3 tháng tuổi',
                        value: '3-months'
                    }, {
                        label: '4 tháng tuổi',
                        value: '4-months'
                    }, {
                        label: '6 tháng tuổi',
                        value: '6-months'
                    }, {
                        label: '7 tháng tuổi',
                        value: '7-months'
                    }, {
                        label: '8 tháng tuổi',
                        value: '8-months'
                    }, {
                        label: '9 tháng tuổi',
                        value: '9-months'
                    }, {
                        label: '12 tháng tuổi',
                        value: '12-months'
                    }, {
                        label: '18 tháng tuổi',
                        value: '18-months'
                    }]"
                    @change="handleFilterBycategory"
                />
            </div>
            <div class="list-vaccin mt-3">
                <div v-for="(item, index) in data.filter(e => e.title.includes(searchVaccin)).filter(e => categorySearch !== 'all' ? e.category === categorySearch : e.category)" :key="`vaccin_${index}`">
                    <a-checkbox :value="item._id" :checked="[...(customer?.injected || []),...scheduleSelected].map(e => e?.id).includes(item._id)" @change="onChange">
                        {{ item.title }} - (Mũi {{ item.numberOfInjections }})
                    </a-checkbox>
                </div>
            </div>
        </div>
        <DateDialog
            ref="dateDialog"
            :title="`Thêm ngày tiêm`"
            @confirm="confirm"
        />
        <ConfirmDialog
            ref="confirmModal"
            :title="`Bỏ mũi tiêm đã đánh dấu`"
            content="Bạn chắc chắn muốn bỏ mũi tiêm này"
            confirm-btn="Bỏ"
            @confirm="confirmDelete"
        />
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex';
    import { CUSTOMER_STATUS_OPTIONS } from '@/constants/customers/status';
    import DateDialog from '@/components/customers/DateDialog.vue';
    import ConfirmDialog from '@/components/customers/ConfirmDialog.vue';

    export default {
        components: {
            ConfirmDialog,
            DateDialog,
        },
        props: {
            data: {
                type: Array,
                default: () => [],
            },
        },
        data() {
            return {
                CUSTOMER_STATUS_OPTIONS,
                vaccinSelected: '',
                loading: false,
                searchVaccin: '',
                categorySearch: 'all',
                dateInjected: new Date(),
            };
        },
        computed: {
            ...mapState('customers', ['customer']),
            ...mapState('schedule-vaccins', ['scheduleSelected']),
        },

        methods: {
            ...mapActions('schedule-vaccins', ['selectedSchedule']),
            onChange(e) {
                this.vaccinSelected = e.target.value;
                if (this.scheduleSelected.includes(e.target.value)) {
                    this.$refs.confirmModal.open(e.target.value);
                    this.selectedSchedule(this.scheduleSelected.filter((id) => id !== e.target.value));
                } else {
                    this.selectedSchedule([...this.scheduleSelected, e.target.value]);
                    this.$refs.dateDialog.open(e.target.value);
                }
            },
            async confirm(data) {
                try {
                    this.loading = true;
                    await this.$api.customers.update(this.$route.params.id, {
                        injected: [
                            ...(this.customer.injected || []),
                            data,
                        ],
                    });
                    const vaccinData = this.data.find((e) => e._id === this.vaccinSelected);
                    await this.$api.customers.update(this.$route.params.id, {
                        timeline: `Admin chọn đã tiêm ${vaccinData.title} - (Mũi ${vaccinData.numberOfInjections})`,
                    });
                    this.$message.success('Cập nhật thành công');
                    await this.$store.dispatch('customers/fetchDetail', this.$route.params.id);
                } catch (e) {
                    this.$handleError(e);
                } finally {
                    this.loading = false;
                }
            },
            async confirmDelete() {
                try {
                    this.loading = true;
                    await this.$api.customers.update(this.$route.params.id, {
                        injected: (this.customer.injected || []).filter((e) => e.id !== this.vaccinSelected),
                    });
                    const vaccinData = this.data.find((e) => e._id === this.vaccinSelected);
                    await this.$api.customers.update(this.$route.params.id, {
                        timeline: `Admin bỏ chọn đã tiêm ${vaccinData.title} - (Mũi ${vaccinData.numberOfInjections})`,
                    });
                    this.$message.success('Cập nhật thành công');
                    await this.$store.dispatch('customers/fetchDetail', this.$route.params.id);
                } catch (e) {
                    this.$handleError(e);
                } finally {
                    this.loading = false;
                }
            },
            handleFilterBycategory(value) {
                console.log(value);
            },
            handleSearchVaccin() {
                console.log(this.searchVaccin);
            },
        },
    };
</script>
<style scoped lang="scss">
.list-vaccin {
    div {
        margin-bottom: 8px;
    }
}
.loader {
  width: 48px;
  height: 48px;
  border: 3px solid #FFF;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}
.loader::after {
  content: '';
  box-sizing: border-box;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid;
  border-color: #1351d8 transparent;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
