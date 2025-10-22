<template>
    <div class="rounded-sm mt-4" style="border: 1px solid #ebebeb">
        <div class="p-3">
            <div class="flex items-center gap-2">
                <nuxt-link :to="`/orders/${data.code}`" class="font-bold m-0 !text-[#2363eb]">
                    #{{ data.code }}
                </nuxt-link>
                <span>-</span>
                <span>{{ data.createdAt | dateFormat('HH:mm dd/MM/yyyy') }}</span>
                <span>-</span>
                <span v-if="data.status === 'pending'" class="inline-flex items-center gap-1.5 py-1 px-4 rounded-full text-xs font-medium bg-[#eab308] text-white">
                    Đang xử lý
                </span>
                <span v-if="data.status === 'canceled'" class="inline-flex items-center gap-1.5 py-1 px-4 rounded-full text-xs font-medium bg-[#ff4d4f] text-white">
                    Đã hủy
                </span>
            </div>
        </div>
        <div class="px-3" style="border-top: 1px solid #ebebeb">
            <div
                v-for="(record, index) in data.products"
                :key="record._id"
                class="grid grid-cols-12 gap-4 py-3 items-center"
                :style="`border-top: 1px solid ${ index ===0 ? '#fff':'#ebebeb'}`"
            >
                <div class="col-span-7 flex items-start gap-2">
                    <img
                        class="w-[60px] h-[60px] rounded-md p-2"
                        style="border: 1px solid #ced4da;"
                        :src="record.thumbnail"
                        alt="/"
                    >
                    <div>
                        <h6 class="m-0">
                            {{ record.name }}
                        </h6>
                        <p class="m-0">
                            {{ Number(record.price) | currencyFormat }}
                        </p>
                    </div>
                </div>
                <div class="col-span-2 flex items-center justify-center">
                    <span>x {{ record.quantity }}</span>
                </div>
                <div class="col-span-3">
                    <p class="m-0 text-center">
                        {{ (parseInt(record.quantity || 1) * parseInt(record.price)) | currencyFormat }}
                    </p>
                </div>
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

        data() {
            return {
            };
        },

        methods: {
        },
    };
</script>
