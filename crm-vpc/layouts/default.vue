<template>
    <div class="flex justify-between bg-[#f4f7f9] min-h-screen">
        <div v-if="$auth.user" class="hidden md:block">
            <TheSidebar ref="sidebar" />
        </div>
        <div class="flex-grow flex flex-col h-screen overflow-x-hidden">
            <TheHeader @toggleSidebar="$refs.sidebar.toggleCollapsed()" />
            <div v-if="$auth.user" id="main-content" class="flex-grow overflow-y-auto max-h-screen custom-scroll flex flex-col !overflow-x-hidden">
                <nuxt class="my-4 mx-2 md:my-4 xl:my-4 xl:mx-4 flex-grow" />
                <TheFooter />
            </div>
            <div v-else>
                <nuxt class="my-4 mx-2 md:my-4 xl:my-4 xl:mx-4 flex-grow" />
                <TheFooter />
            </div>
        </div>
    </div>
</template>

<script>
    import TheSidebar from '@/components/layout/TheSidebar.vue';
    import TheHeader from '@/components/layout/TheHeader.vue';
    import TheFooter from '@/components/layout/TheFooter.vue';

    export default {
        components: {
            TheSidebar,
            TheHeader,
            TheFooter,
        },
        watch: {
            '$route.path': {
                handler() {
                    document.querySelector('#main-content')?.scrollTo({
                        top: 0,
                        behavior: 'smooth', // Optional, smooth scrolling animation
                    });
                },
                immediate: true,
            },
        },
    };
</script>
