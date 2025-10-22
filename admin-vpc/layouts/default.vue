<template>
    <div v-if="$auth.user.role === 'manager'" class="flex justify-between bg-[#f8f8fb] min-h-screen">
        <div class="hidden md:block">
            <TheSidebar ref="sidebar" />
        </div>
        <div class="flex-grow flex flex-col h-screen overflow-x-hidden">
            <TheHeader @toggleSidebar="$refs.sidebar.toggleCollapsed()" />
            <div :class="`flex-grow ${needUpgrade ? 'overflow-y-hidden' : 'overflow-y-auto' } max-h-screen custom-scroll flex flex-col`">
                <nuxt :class="`m-4 flex-grow relative `" />
            </div>
            <TheFooter />
        </div>
    </div>
    <div v-else class="flex items-center justify-center h-screen w-screen">
        <img src="/images/access_denied.png" alt="/">
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
        data() {
            return {
                needUpgrade: false,
            };
        },
        watch: {
            '$route.path': {
                handler() {
                    if (['/thong-ke', '/marketing/automation', '/marketing/form'].includes(this.$route.path)) {
                        this.needUpgrade = true;
                    } else {
                        this.needUpgrade = false;
                    }
                    console.log(this.$route.path);
                },
                deep: true,
            },
        },
    };
</script>
