<template>
    <div>
        <div class="md:grid grid-cols-2 gap-4 justify-between items-center mt-3">
            <h2 class="font-bold text-prim-100 text-xl md:text-3xl mb-0">
                Lịch tiêm đầy đủ cho trẻ từ 0-24 tháng tuổi
            </h2>
            <div class="w-auto text-right mt-4 md:mt-0">
                <a-select
                    :value="category"
                    class="w-full max-w-[160px]"
                    :options="categories"
                    @change="handleChange"
                />
            </div>
        </div>
        <div class="mt-6">
            <div>
                <div v-if="category !== 'all'">
                    <div v-if="!loading" class="grid grid-cols-1 gap-4">
                        <VaccinItem v-for="(record, index) in scheduleVaccin" :key="`vaccin_${index}`" :data="handleData(record)" />
                    </div>
                    <div v-else class="flex items-center justify-center h-full min-h-[450px]">
                        <span class="genstech-loader" />
                    </div>
                </div>
                <div v-else>
                    <div v-for="(categoryData, index) in mergedArray(scheduleVaccin || [])" :key="`categoryData_${index}`" class="mt-3">
                        <h3 class="font-semibold text-second-100 text-2xl">
                            {{ categories.find(e => e.value === categoryData.category).label }}
                        </h3>
                        <div v-if="!loading" class="grid grid-cols-1 gap-4">
                            <VaccinItem v-for="(record, indexItem) in categoryData.data" :key="`vaccin_${indexItem}`" :data="handleData(record)" />
                        </div>
                        <div v-else class="flex items-center justify-center h-full min-h-[450px]">
                            <span class="genstech-loader" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import _assign from 'lodash/assign';
    import _omit from 'lodash/omit';
    import VaccinItem from '@/components/home/VaccinItem.vue';

    export default {
        components: {
            VaccinItem,
        },
        props: {
            injected: {
                type: Array,
                default: () => [],
            },
        },
        async fetch() {
            await this.fetchData();
        },

        data() {
            return {
                loading: false,
                category: 'all',
                categories: [{
                    label: 'Tất cả',
                    value: 'all',
                }, {
                    label: 'Trẻ sơ sinh',
                    value: 'new-born',
                }, {
                    label: '2 tháng tuổi',
                    value: '2-months',
                }, {
                    label: '3 tháng tuổi',
                    value: '3-months',
                }, {
                    label: '4 tháng tuổi',
                    value: '4-months',
                }, {
                    label: '6 tháng tuổi',
                    value: '6-months',
                }, {
                    label: '7 tháng tuổi',
                    value: '7-months',
                }, {
                    label: '8 tháng tuổi',
                    value: '8-months',
                }, {
                    label: '9 tháng tuổi',
                    value: '9-months',
                }, {
                    label: '12 tháng tuổi',
                    value: '12-months',
                }, {
                    label: '18 tháng tuổi',
                    value: '18-months',
                }],
            };
        },
        computed: {
            ...mapState('informations', ['scheduleVaccin']),
        },
        watch: {
            '$route.query.category': {
                handler() {
                    this.fetchData();
                },
            },
        },
        methods: {
            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('informations/fetchScheduleVaccin', { ...this.$route.query });
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },

            handleData(data) {
                return {
                    ...data,
                    time: this.injected.find((e) => e.id === data._id)?.dateInjected,
                    status: this.injected.map((e) => e.id).includes(data._id),
                };
            },

            handleChange(value) {
                this.category = value;
                if (value !== 'all') {
                    this.$router.push({
                        query: _assign({ category: value }, _omit(this.$route.query, ['category'])),
                    });
                } else {
                    this.$router.push({
                        query: _omit(this.$route.query, ['category']),
                    });
                }
            },

            commonElements(array1, array2) {
                const commonElements = [];
                const map = {};

                // Populate the map with elements from array1
                // eslint-disable-next-line no-restricted-syntax
                for (const element of array1) {
                    map[element] = true;
                }

                // Check if each element in array2 exists in the map
                // eslint-disable-next-line no-restricted-syntax
                for (const element of array2) {
                    if (map[element]) {
                        commonElements.push(element);
                    }
                }

                return commonElements;
            },
            mergedArray(arr = []) {
                // Group objects by category
                const groupedByCategory = arr?.reduce((acc, obj) => {
                    const { category } = obj;
                    if (!acc[category]) {
                        acc[category] = [];
                    }
                    acc[category].push(obj);
                    return acc;
                }, {});
                const sortedCategories = this.categories.map((e) => e.value);
                // Convert grouped objects into the desired format
                return this.commonElements(sortedCategories, Object.keys(groupedByCategory)).map((category) => ({
                    category,
                    data: groupedByCategory[category],
                }));
            },
        },
    };
</script>
