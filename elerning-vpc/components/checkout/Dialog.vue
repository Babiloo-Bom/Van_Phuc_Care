<template>
    <a-modal
        v-model="visible"
        title="Thanh toán giỏ hàng"
        :width="isBank ? '600px' : '360px'"
        centerd
        class="checkout-modal"
        :mask-closable="false"
    >
        <div class="grid" :class="[isBank ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1']">
            <div class="text-center bg-white rounded-md p-4" :class="[isBank ? 'hidden sm:block' : '']">
                <div>
                    <h2 class="mb-0 font-semibold text-xl">
                        Công Ty TNHH Vạn Phúc Care
                    </h2>
                    <h3 class="mb-0 text-xl text-prim-100">
                        655123456888 - Ngân hàng thương mại cổ phần Quân Đội
                    </h3>
                    <img class="mx-auto max-w-[240px] h-auto object-cover" src="/images/QR.png" alt="">
                </div>
                <p class="text-prim-100">
                    Chuyển khoản theo thông tin trên
                </p>
                <p>Lưu ý: </p>
                <ul>
                    <li>Nội dung chuyển khoản: <b>VANPHUC-{{ code }}</b></li>
                    <li>Khách hàng chụp lại hình ảnh giao dịch thành công</li>
                </ul>
            </div>
            <div v-show="isBank" class="flex flex-col items-center gap-y-5 w-full">
                <img
                    v-if="resultImage"
                    :src="resultImage"
                    onerror="this.src='/images/default-avatar.png'"
                    alt=""
                    class="w-full h-[340px] rounded-md object-cover"
                >
                <div v-else class="w-full h-[340px] bg-gray-20 rounded-md border-dashed border border-gray-400 flex justify-center items-center">
                    <span><i class="fas fa-plus" /></span>
                </div>
                <div class="flex gap-x-2">
                    <a-upload
                        :show-upload-list="false"
                        action=""
                        class="mx-auto block text-center"
                        :transform-file="handlerThumbnail"
                    >
                        <div class="flex gap-x-2">
                            <img src="/images/upload.svg" alt="avatar">
                            Tải lên ảnh chứng thực
                        </div>
                    </a-upload>
                </div>
            </div>
        </div>
        <div slot="footer" class="flex justify-center items-center gap-2">
            <a-button
                v-if="isBank"
                @click="isBank = !isBank"
            >
                Quay lại
            </a-button>
            <a-button v-else class="w-28" @click="close">
                Hủy bỏ
            </a-button>
            <a-button
                v-if="!isBank"
                :loading="loading"
                type="primary"
                @click="isBank = !isBank"
            >
                Tôi đã chuyển khoản
            </a-button>
            <a-button
                v-else
                :loading="loading"
                class="w-28"
                type="primary"
                @click="submit"
            >
                Đồng ý
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    export default {
        props: {
            user: {
                type: Object,
                default: () => {},
            },
            loading: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                visible: false,
                isBank: false,
                resultFile: null,
                code: '',
                resultImage: null,
            };
        },
        methods: {
            handlerThumbnail(file) {
                this.resultFile = file;
                this.resultImage = URL.createObjectURL(file);
            },
            open() {
                this.visible = true;
                this.generateRandomString();
            },
            close() {
                this.visible = false;
            },
            async submit() {
                if (this.resultFile) this.$emit('submit', this.resultFile);
                else this.$message.info('Cần ảnh chứng thực thanh toán');
            },
            generateRandomString() {
                const characters = '0123456789';
                let result = '';
                for (let i = 0; i < 6; i += 1) {
                    result += characters.charAt(Math.floor(Math.random() * characters.length));
                }
                this.code = result;
            },
        },
    };
</script>
<style lang="scss">
    .checkout-modal .ant-modal-body {
        // @apply bg-prim-100
    }
</style>
