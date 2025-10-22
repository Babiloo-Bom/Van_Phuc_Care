<template>
    <div class="nav-course">
        <ul class="flex flex-col gap-2 mb-0">
            <li
                v-for="chapter, index in chapters"
                :key="index"
                class="border-[1px] border-solid border-prim-20 py-2 px-4 rounded-md flex justify-between items-center cursor-pointer"
                :class="activeKey === index && `bg-[#f8fcff]`"
                @click="selectedChapter(chapter, index)"
            >
                <div>
                    <h3 class="font-semibold text-prim-100 mb-1">
                        {{ chapter.title }}
                    </h3>
                    <span class="text-sm font-normal">{{ chapter.lessons.length || 0 }} Lesson</span>
                </div>
                <div>
                    <span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            class="stroke-prim-100 fill-none"
                        ><path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-miterlimit="10"
                            stroke-width="1.5"
                            d="M8.91 19.92l6.52-6.52c.77-.77.77-2.03 0-2.8L8.91 4.08"
                        /></svg>
                    </span>
                </div>
            </li>
        </ul>
        <div class="mt-4 inline-block cursor-pointer mx-auto" @click="createChapter">
            <div class="text-center flex items-center gap-2 group hover:text-white hover:bg-prim-100 transition-all duration-300 px-3 py-2 rounded-sm">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    class="fill-none stroke-prim-100 group-hover:stroke-white transition-all duration-300"
                ><path
                    d="M6 12h12M12 18V6"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                /></svg>
                <span class="font-semibold text-prim-100 group-hover:text-white transition-all duration-300">
                    Thêm chương mới
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
                activeKey: 0,
            };
        },

        computed: {
            ...mapGetters('courses', ['chapters']),
        },

        mounted() {
            this.$store.dispatch('courses/selectedChapter', { ...(this.chapters && this.chapters[0]), index: 0 });
        },

        methods: {
            selectedChapter(chapter, index) {
                this.activeKey = index;
                this.$store.dispatch('courses/selectedChapter', { ...chapter, index });
            },

            createChapter() {
                this.$store.dispatch('courses/createChapter', {
                    title: 'Chương mới',
                    lessons: [],
                    index: this.chapters.length,
                });
                this.activeKey = this.chapters.length - 1;
                this.$store.dispatch('courses/selectedChapter', { ...this.chapters[this.chapters.length - 1], index: this.chapters.length - 1 });
                this.$forceUpdate();
            },
        },
    };
</script>

<style lang="scss">
</style>
