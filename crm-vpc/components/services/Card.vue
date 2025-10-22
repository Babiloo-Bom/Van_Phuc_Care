<template>
    <div class="card !p-2 bg-white rounded-[12px] h-full">
        <div class="h-full pb-2 flex flex-col justify-between">
            <div class="relative">
                <img class="rounded-t-md h-[201px] w-[100%] object-cover" :src="data.thumbnail" :alt="data.slug">
                <div class="absolute bg-[#F48284] top-0 left-[5%] h-[27px] w-[27px] flex items-center justify-center">
                    <img src="/images/icon.png" alt="/">
                </div>
                <div class="p-2">
                    <h4 class="text-[18px] m-0 font-bold text-[#1A75BB]">
                        {{ data.title }}
                    </h4>
                    <p class="line-clamp-4">
                        {{ data.shortDescriptions }}
                    </p>
                </div>
            </div>
            <div class="flex items-center justify-between px-2">
                <div>
                    <a-rate style="fontSize: 14px;color: #FFD74B; marginRight: 0px" :default-value="data.rate" disabled />
                    <p class="m-0 mt-[1px]">
                        ({{ data.reviews }} đánh giá)
                    </p>
                </div>
                <a-button type="link" class="!underline font-[600] !text-[#1A75BB] !h-auto !p-0">
                    <span class="underline">Chi tiết</span>
                </a-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            data: {
                type: Object,
                default: () => {},
            },
        },
    };
</script>
