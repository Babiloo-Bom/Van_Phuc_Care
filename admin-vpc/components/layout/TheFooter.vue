<template>
    <div class="flex justify-between items-center bg-white border-t border-gray-20 py-2 px-4 md:px-8 text-xs md:text-base">
        <div>
            &copy; {{ currentYear }} - <a href="#" class="text-prim-100 hover:underline">Vạn Phúc Care</a>
        </div>
        <div>
            Powered by <a href="https://synck.io.vn?ref=admin.vanphuccare.vn" target="_blank">
                Synck </a>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            currentYear() {
                return (new Date()).getFullYear();
            },
        },
    };
</script>
