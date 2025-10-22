<template>
    <div class="w-full text-gray-800">
        <a-breadcrumb v-if="links.length" :separator="null">
            <transition-group name="translate-x-transition">
                <template v-for="(item, index ) in links">
                    <a-breadcrumb-item

                        :key="item.link + index"
                        :href="item.link"
                    >
                        <nuxt-link v-if="item.link" :to="item.link">
                            <span class="hover:underline" v-html="item.label" />
                        </nuxt-link>
                        <span v-else class="hover:underline" v-html="item.label" />
                    </a-breadcrumb-item>
                    <i v-if="index !== links.length - 1" :key="`sperator_${item.link + index}`" class="fas fa-angle-right text-sm mx-2" />
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
