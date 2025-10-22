<template>
    <div>
        <div class="max-w-[1200px] !mx-auto w-full block p-4 pt-0 detail-collection">
            <div class="flex items-center justify-start gap-3">
                <a-button type="text" class="!p-0 !w-[25px] !h-[25px] !border-0 back !bg-[transparent]" @click="$router.push('/settings')">
                    <svg
                        viewBox="0 0 20 20"
                        class="m-0 w-[20px] h-[20px]"
                        focusable="false"
                        aria-hidden="true"
                    ><path fill-rule="evenodd" d="M16.75 10a.75.75 0 0 1-.75.75h-9.69l2.72 2.72a.75.75 0 0 1-1.06 1.06l-4-4a.75.75 0 0 1 0-1.06l4-4a.75.75 0 0 1 1.06 1.06l-2.72 2.72h9.69a.75.75 0 0 1 .75.75Z" /></svg>
                </a-button>
                <div class="flex items-center justify-between w-full">
                    <div class="flex items-center justify-between w-full">
                        <div class="flex items-center gap-3">
                            <h4 class="m-0 text-[20px] font-bold">
                                {{ 'API & Developments' }}
                            </h4>
                        </div>
                        <a-button
                            type="primary"
                            :loading="loadingUpdate"
                            class="!flex items-center gap-2 justify-center"
                            @click="updateSetting"
                        >
                            {{ 'Lưu' }}
                        </a-button>
                    </div>
                </div>
            </div>
            <div class="card mt-4 grid grid-cols-4 gap-4">
                <h1>API</h1>
            </div>
        </div>
    </div>
</template>

<script>
    import _cloneDeep from 'lodash/cloneDeep';

    export default {
        components: {
        },

        data() {
            return {
                loading: false,
                rules: {},
                form: {},
                data: [],
            };
        },
        computed: {
        },

        watch: {
        },

        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'API & Development',
                link: '/settings/api-development',
            }]);
        },
        methods: {
            _cloneDeep,
        },

        head() {
            return {
                title: 'API & Development',
            };
        },
    };
</script>
<style lang="scss">
</style>
