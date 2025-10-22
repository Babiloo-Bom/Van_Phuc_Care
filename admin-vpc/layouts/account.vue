<template>
    <div class="flex justify-between bg-[#fff] min-h-screen">
        <div class="hidden md:block">
            <TheSidebarAccount ref="sidebarAccount" />
        </div>
        <div class="flex-grow flex flex-col h-screen overflow-x-hidden">
            <TheHeader v-if="$route.path !== '/appearances/themes/customize'" @toggleSidebar="$refs.sidebarAccount.toggleCollapsed()" />
            <div class="flex-grow overflow-y-auto overflow-x-hidden max-h-screen custom-scroll flex flex-col bg-[#f8f8fb]">
                <nuxt class="m-2 md:m-4 flex-grow" />
            </div>
            <TheFooter />
        </div>
    </div>
</template>

<script>
    import TheSidebarAccount from '@/components/layout/TheSidebarAccount.vue';
    import TheHeader from '@/components/layout/TheHeader.vue';
    import TheFooter from '@/components/layout/TheFooter.vue';

    export default {
        components: {
            TheSidebarAccount,
            TheHeader,
            TheFooter,
        },
        async fetch() {
            // await this.fetchData();
        },
        methods: {
            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('settings/contacts/fetchDetail');
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },
    };
</script>
