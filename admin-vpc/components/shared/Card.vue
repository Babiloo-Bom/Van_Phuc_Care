<template>
    <div class=" bg-white rounded-sm">
        <div class="p-4 border-b border-gray-20 font-semibold text-lg text-prim-100">
            {{ title }}
        </div>
        <div class="p-4">
            <slot />
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
            },
        },
    };
</script>
