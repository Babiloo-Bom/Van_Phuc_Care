<template>
    <div class="workspace flex justify-between min-h-screen">
        <div class="flex-grow flex flex-col h-screen overflow-x-hidden">
            <div class="flex-grow overflow-y-auto overflow-x-hidden max-h-screen custom-scroll flex flex-col bg-[#f8f8fb]">
                <nuxt class="" />
            </div>
            <TheFooter />
        </div>
    </div>
</template>

<script>
    import TheFooter from '@/components/layout/TheFooter.vue';

    export default {
        components: {
            TheFooter,
        },
        methods: {
        },
    };
</script>
<style scoped lang="scss">
.workspace {
    position: relative;
    width: 100vw;
    height: 100vh;
    background-position: -1px -1px;
    background-repeat: repeat;
    background-size: 1.25rem 1.25rem;
    background-color: #f3f3f3;
    background-image: radial-gradient(circle at 2px 2px, #e3e3e3 0, #e3e3e3 1.25px, transparent 1.25px);
    transform-origin: top left;
    transition: transform .25s ease-in-out;
    overflow: hidden;
}
</style>
