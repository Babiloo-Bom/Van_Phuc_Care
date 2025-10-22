<template>
    <div v-if="(processing?.complete && processing?.complete.length) === totalLessonCount" class="pt-5 py-20">
        <div class="container">
            <div>
                <ul class="text-prim-100 flex items-center gap-3 font-semibold">
                    <li>
                        <nuxt-link to="/khoa-hoc-cua-toi">
                            Khóa học của tôi
                        </nuxt-link>
                    </li>
                    <li>
                        <span>|</span>
                    </li>
                    <li>
                        <span>Nuôi con theo phương pháp Easy</span>
                    </li>
                </ul>
                <div class="flex items-center gap-3">
                    <a-button class="!w-8 !px-1" type="primary" @click="back">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            class="fill-none stroke-white"
                        ><path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-miterlimit="10"
                            stroke-width="1.5"
                            d="M15 19.92L8.48 13.4c-.77-.77-.77-2.03 0-2.8L15 4.08"
                        /></svg>
                    </a-button>
                    <span class="text-xl text-prim-100 font-semibold">Về bài học của tôi</span>
                </div>
            </div>
            <section class="mt-0 sm:mt-10">
                <div class="grid grid-cols-12 md:gap-12">
                    <div class="col-span-12 lg:col-span-8">
                        <div>
                            <div class="mt-6 text-center">
                                <h3 class="text-green-100 mb-0 text-xl">
                                    Chúc mừng bạn đã hoàn thành khóa học
                                </h3>
                                <h2 class="text-prim-100 font-semibold text-3xl">
                                    Nuôi con theo phương pháp EASY
                                </h2>
                                <img class="mx-auto mt-4" src="/images/courses/congurations.png" alt="/">
                            </div>
                            <div class="mt-6">
                                <div class="border-[1px] border-solid border-gray-80 p-4 rounded">
                                    <div class="flex justify-between items-center flex-wrap">
                                        <span class="text-prim-100 font-semibold">Tiến trình</span>
                                        <span class="font-semibold text-[#787d84]">100% Hoàn thành</span>
                                        <div class="w-full flex h-2 rounded-full mt-1 overflow-hidden">
                                            <div class="bg-[#14cf76]" :class="`w-full`" />
                                            <div class="flex-1 bg-[#d9d9d9]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-6">
                                <div id="certificate" class="relative w-[100%]">
                                    <img class="w-full" src="/images/courses/certificate.png" alt="/">
                                    <p class="absolute font-[400] text-[1.4rem] sm:text-[32px] top-[32%] sm:top-[37%] text-center w-full" style="left: 50%; font-family: Synck;transform: translate(-50%, 50%)">
                                        {{ `${$auth.user.fullname}` }}
                                    </p>
                                    <p class="absolute font-bold top-[52%] sm:top-[57%] text-[1rem] sm:text-[28px] text-center w-full text-[#1674bc]" style="left: 50%;transform: translate(-50%, 50%)">
                                        {{ course.title }}
                                    </p>
                                    <p class="absolute font-bold text-[10px] sm:text-[12px] bottom-[23%] sm:bottom-[25%]" style="right: 21%; transform: translate(50%, 50%);">
                                        {{ (new Date()).toLocaleDateString('en-GB') }}
                                    </p>
                                </div>
                                <a-button class="!bg-prim-100 !mt-4 !text-white !flex items-center gap-2" @click="handleDownloadDocuments">
                                    <span class="text-[16px] font-[500]">Tải xuống</span>
                                </a-button>
                            </div>
                            <div class="mt-10 sm:mt-20 pt-4 border-t-[1px] border-dashed border-gray-80">
                                <h2 class="text-prim-100 font-semibold text-3xl">
                                    Thư ngỏ
                                </h2>
                                <p class="my-4 text-lg">
                                    Thông qua các học phần đào tạo trực tuyến tại Vạn Phúc Care Academy, đội ngũ giảng viên chúng tôi hy vọng sẽ góp phần giúp bạn làm chủ hoàn toàn bộ kỹ năng chăm sóc sức khỏe mẹ và bé. Hệ thống bài giảng được xây dựng từ cơ bản đến chuyên sâu, thiết kế đơn giản & dễ hiểu, phù hợp với đa dạng học viên có nhu cầu học tập ngay tại nhà.
                                </p>
                                <ul class="!ml-6 mb-5 list-disc text-lg">
                                    <li>
                                        Bài học kết hợp video và lý thuyết cô đọng, minh họa dễ hiểu.
                                    </li>
                                    <li>
                                        Mỗi học phần bài giảng đều được đính kèm tài liệu giúp học viên chủ động nghiên cứu, mở rộng vốn tri thức.
                                    </li>
                                </ul>
                                <div class="!w-full bg-prim-100 py-3 rounded-sm cursor-pointer text-center">
                                    <span class="text-white text-lg" @click="$router.push('/')"> Tìm hiểu tất cả khóa học
                                    </span>
                                </div>
                            </div>
                            <div class="mt-8">
                                <h2 class="text-prim-100 font-semibold text-3xl mb-2">
                                    Cập nhật kiến thức mới nhất
                                </h2>
                                <p class="mb-1 text-lg">
                                    Các học phần đào tạo được biên soạn bởi đội ngũ giảng viên Vạn Phúc Care không chỉ cung cấp kiến thức chuyên sâu và khoa học từ các chuyên gia đầu ngành, mà còn giúp bạn tự tin áp dụng vào thực tế. Cùng với đó, bạn còn có thể liên tục cập nhật thông tin mới bằng cách truy cập chuyên trang tin tức, kiến thức của chúng tôi. Các chủ đề được xây dựng xung quanh lĩnh vực chăm sóc sức khỏe mẹ và bé, dinh dưỡng và các phương pháp chăm sóc tiên tiến khác. Tất cả nội dung đều được cập nhật hàng tuần, mang đến cho bạn nguồn thông tin đáng tin cậy và hữu ích, hỗ trợ bạn hoàn thiện kỹ năng điều dưỡng, chăm sóc sức khỏe mẹ và bé
                                </p>
                                <div class="mb-4 sm:mb-0 !w-full bg-prim-100 py-3 rounded-sm cursor-pointer text-center mt-4">
                                    <span class="text-white text-lg" @click="$router.push('/')">Xem thêm kiến thức mới nhất tại đây
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-12 lg:col-span-4">
                        <div>
                            <NavCourse :chapters="course.chapters" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import moment from 'moment';
    import NavCourse from '@/components/courses/NavCourse.vue';
    import html2canvas from 'html2canvas';

    export default {
        components: {
            NavCourse,
        },
        async fetch() {
            await this.fetchData();
        },

        data() {
            return {
                backUrl: '',
                totalLessonCount: 0,
            };
        },

        computed: {
            courses() {
                return [{
                    thumbnail: 'https://cdn.synck.io.vn/vanphuccare/banner/main.webp',
                    slug: 'nuoi-con-theo-phuong-phap-easy',
                    title: 'Nuôi con theo phương pháp EASY',
                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s',
                    videos: [{}, {}, {}, {}, {}, {}],
                    documents: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
                    exams: [{}, {}, {}],
                    price: 1000000,
                    rate: 5,
                    reviews: 10,
                }, {
                    thumbnail: 'https://cdn.synck.io.vn/vanphuccare/banner/main.webp',
                    slug: 'nuoi-con-theo-phuong-phap-easy',
                    title: 'Nuôi con theo phương pháp EASY',
                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s',
                    videos: [{}, {}, {}, {}, {}, {}],
                    documents: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
                    exams: [{}, {}, {}],
                    price: 1000000,
                    rate: 5,
                    reviews: 10,
                }, {
                    thumbnail: 'https://cdn.synck.io.vn/vanphuccare/banner/main.webp',
                    slug: 'nuoi-con-theo-phuong-phap-easy',
                    title: 'Nuôi con theo phương pháp EASY',
                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s',
                    videos: [{}, {}, {}, {}, {}, {}],
                    documents: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
                    exams: [{}, {}, {}],
                    price: 1000000,
                    rate: 5,
                    reviews: 10,
                }, {
                    thumbnail: 'https://cdn.synck.io.vn/vanphuccare/banner/main.webp',
                    slug: 'nuoi-con-theo-phuong-phap-easy',
                    title: 'Nuôi con theo phương pháp EASY',
                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s',
                    videos: [{}, {}, {}, {}, {}, {}],
                    documents: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
                    exams: [{}, {}, {}],
                    price: 1000000,
                    rate: 5,
                    reviews: 10,
                }, {
                    thumbnail: 'https://cdn.synck.io.vn/vanphuccare/banner/main.webp',
                    slug: 'nuoi-con-theo-phuong-phap-easy',
                    title: 'Nuôi con theo phương pháp EASY',
                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s',
                    videos: [{}, {}, {}, {}, {}, {}],
                    documents: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
                    exams: [{}, {}, {}],
                    price: 1000000,
                    rate: 5,
                    reviews: 10,
                }, {
                    thumbnail: 'https://cdn.synck.io.vn/vanphuccare/banner/main.webp',
                    slug: 'nuoi-con-theo-phuong-phap-easy',
                    title: 'Nuôi con theo phương pháp EASY',
                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s',
                    videos: [{}, {}, {}, {}, {}, {}],
                    documents: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
                    exams: [{}, {}, {}],
                    price: 1000000,
                    rate: 5,
                    reviews: 10,
                }, {
                    thumbnail: 'https://cdn.synck.io.vn/vanphuccare/banner/main.webp',
                    slug: 'nuoi-con-theo-phuong-phap-easy',
                    title: 'Nuôi con theo phương pháp EASY',
                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s',
                    videos: [{}, {}, {}, {}, {}, {}],
                    documents: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
                    exams: [{}, {}, {}],
                    price: 1000000,
                    rate: 5,
                    reviews: 10,
                }, {
                    thumbnail: 'https://cdn.synck.io.vn/vanphuccare/banner/main.webp',
                    slug: 'nuoi-con-theo-phuong-phap-easy',
                    title: 'Nuôi con theo phương pháp EASY',
                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s',
                    videos: [{}, {}, {}, {}, {}, {}],
                    documents: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
                    exams: [{}, {}, {}],
                    price: 1000000,
                    rate: 5,
                    reviews: 10,
                }];
            },
            ...mapState('courses', ['course', 'reviews', 'processing']),
        },

        methods: {
            moment,
            async fetchData() {
                try {
                    this.loading = true;
                    await Promise.all([
                        this.$store.dispatch('courses/fetchDetail', this.$route.params.id),
                    ]);
                    this.totalLessons(this.course.chapters);
                    await this.$store.dispatch('courses/fetchProcessing', this.course._id);
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
            totalLessons(chapters = []) {
                this.totalLessonCount = chapters.reduce((total, chapter) => total + chapter.lessons.length, 0);
            },
            pushRouter(path) {
                this.$router.push(path);
            },
            handleDownloadDocuments() {
                const certificateElement = document.getElementById('certificate');

                html2canvas(certificateElement).then((canvas) => {
                    // Convert canvas to data URL
                    const imageData = canvas.toDataURL('image/png');

                    // Create a link to download the image
                    const link = document.createElement('a');
                    link.href = imageData;
                    link.download = 'certificate.png'; // Specify the filename

                    // Append to the body, click to download and remove from the DOM
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                });
            },
            back() {
                if (this.backUrl) {
                    this.$router.push(this.backUrl);
                } else {
                    this.$router.go(-1);
                }
            },
        },

        head() {
            return {
                title: 'Khóa học của tôi',
            };
        },
    };
</script>
<style lang="scss">
    .custom_input .ant-input {
        @apply bg-transparent placeholder:text-white rounded-full hover:border-white focus:border-white outline-none text-white py-6 px-4 #{!important}
    }
</style>
