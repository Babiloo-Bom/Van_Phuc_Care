<template>
    <div class="w-full text-gray-800">
        <a-breadcrumb v-if="links.length" :separator="null">
            <transition-group name="translate-x-transition">
                <template v-for="(item, index ) in links">
                    <a-breadcrumb-item
                        :key="item.link + index"
                        :href="item.link"
                        class="flex items-center"
                    >
                        <nuxt-link v-if="item.link" :to="item.link" class="flex items-center gap-1">
                            <i v-html="item.icon" />
                            <span class="hover:underline text-lg font-medium uppercase" v-html="item.label" />
                        </nuxt-link>
                        <div v-else class="flex items-center gap-1">
                            <i v-html="item.icon" />
                            <span class="hover:underline text-lg font-medium uppercase" v-html="item.label" />
                        </div>
                    </a-breadcrumb-item>
                    <i v-if="index !== links.length - 1" :key="`sperator_${item.link + index}`" class="fas fa-angle-right text-sm mx-2 relative top-[1.5px]" />
                </template>
            </transition-group>
        </a-breadcrumb>
    </div>
</template>

<script>
    export default {
        props: {
            links: Array,
        },
    };
</script>

<style lang="scss">
.ant-breadcrumb > span:last-child a {
    color: #1A75BB;
    fill: none;
    stroke: #1A75BB;
}

.ant-breadcrumb > span:last-child a i {
    fill: none;
    stroke: #1A75BB;
}

.ant-breadcrumb > span {
    display: flex;
    align-items: center;
}

</style>
