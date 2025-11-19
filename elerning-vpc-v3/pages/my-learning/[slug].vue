<template>
  <div class="my-learning-detail">
    <!-- Header Bar (màu xanh) -->
    <div class="bg-[#1A75BB] py-3 md:py-4 lg:py-6">
      <div class="container mx-auto px-4">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4"
        >
          <!-- Course Topic (bên trái) -->
          <div class="flex-1 min-w-0">
            <h2
              class="text-white text-base sm:text-lg md:text-xl font-semibold truncate"
            >
              {{ currentChapter?.title || "Chưa có chủ đề" }}
            </h2>
          </div>

          <!-- Nút Trang chủ khóa học (bên phải) -->
          <button
            class="flex items-center justify-center sm:justify-start gap-2 bg-[#F48283] border-0 rounded-lg px-3 py-2 sm:px-4 text-[#FFFFFF] hover:bg-[#e06d6e] transition-colors font-medium text-xs sm:text-sm md:text-base whitespace-nowrap flex-shrink-0"
            @click="goToCourseHome"
          >
            <img
              src="../../public/images/svg/store.svg"
              alt="store-icon"
              class="w-3 h-3 sm:w-4 sm:h-4"
            />
            <span class="hidden sm:inline">Trang chủ khóa học</span>
            <span class="sm:hidden">Trang chủ</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="container mx-auto px-4 py-4 md:py-6">
      <div class="flex flex-col lg:flex-row gap-4 lg:gap-6">
        <!-- Left: Main Content -->
        <div class="flex-1 lg:w-[65%] bg-white rounded-lg shadow-lg p-4 md:p-8">
          <!-- Lesson Title -->
          <h1
            class="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-4"
          >
            {{ currentLesson?.title || "Chưa có bài học" }}
          </h1>

          <!-- Progress Bar -->
          <div class="mb-6">
            <ProgressBar :percentage="courseProgress" />
          </div>
          <!-- Video Player -->
          <div class="mb-4 md:mb-6">
            <div v-if="currentLesson" class="video-wrapper">
              <div
                v-if="currentVideoUrl || currentThumbnail"
                class="relative w-full rounded-lg overflow-hidden shadow-lg bg-gray-900"
                :style="{ aspectRatio: '16/9' }"
              >
                <!-- Video Element -->
                <video
                  v-if="currentVideoUrl"
                  ref="videoRef"
                  :src="currentVideoUrl"
                  :poster="currentThumbnail"
                  class="w-full h-full object-cover"
                  controls
                  preload="metadata"
                  crossorigin="anonymous"
                />

                <!-- Thumbnail with Play Button (nếu không có video) -->
                <div
                  v-else-if="currentThumbnail"
                  class="relative w-full h-full"
                >
                  <img
                    :src="currentThumbnail"
                    :alt="currentLesson.title"
                    class="w-full h-full object-cover"
                  />
                  <!-- Play Button Overlay -->
                  <div
                    class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer hover:bg-opacity-40 transition-all"
                    @click="playVideo"
                  >
                    <div
                      class="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        class="fill-gray-800 ml-1"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Placeholder nếu không có video và thumbnail -->
                <div
                  v-else
                  class="w-full h-full bg-gray-800 flex items-center justify-center"
                >
                  <div class="text-center text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      class="fill-none stroke-white mx-auto mb-4"
                    >
                      <path
                        d="M23 7l-7 5 7 5V7z"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M14 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <p class="text-lg font-semibold">Không có video</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Desktop: Content without tabs -->
          <div class="hidden lg:block">
            <!-- Documents Section -->
            <div v-if="currentLesson" class="space-y-6 mb-6">
              <!-- Documents Component (if documents exist) -->
              <div class="mt-6">
                <DocumentsComponent
                  :course-id="course?._id || ''"
                  :chapter-id="currentChapter?._id || ''"
                  :lesson-id="currentLesson?._id || ''"
                />
              </div>
              <div
                class="bg-white rounded-lg border border-gray-200 p-4 md:p-6"
              >
                <!-- Document 2: Text Content -->
                <h3 class="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                  {{ currentLesson?.title || "Chưa có bài học" }}
                </h3>
                <div 
                  class="prose max-w-none text-gray-700 leading-relaxed text-sm md:text-base"
                  v-html="currentLesson?.content || 'Chưa có nội dung'"
                ></div>
              </div>
            </div>
          </div>

          <!-- Mobile/Tablet: Tabs -->
          <div class="lg:hidden bg-white rounded-lg shadow-sm mb-4 md:mb-6">
            <a-tabs
              v-model:activeKey="activeTab"
              type="line"
              class="course-tabs"
              @change="handleTabChange"
            >
              <a-tab-pane key="content" tab="Nội dung bài học">
                <!-- Lesson Content -->
                <div class="py-4 md:py-6">
                  <!-- Progress Section -->
                  <div class="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">
                      Tiến trình
                    </h3>
                    <div class="flex items-center gap-4">
                      <div class="flex-1">
                        <div
                          class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden"
                        >
                          <div
                            class="h-full bg-gradient-to-r from-[#15CF74] to-[#15CF74] rounded-full transition-all duration-500 ease-out"
                            :style="{ width: `${courseProgress}%` }"
                          />
                        </div>
                      </div>
                      <span
                        class="text-sm font-medium text-gray-700 whitespace-nowrap"
                        >{{ courseProgress }}%</span
                      >
                    </div>
                    <div
                      v-if="course?.progress"
                      class="mt-2 text-sm text-gray-600"
                    >
                      <span>{{ course.progress.completedLessons }}</span> /
                      <span>{{ course.progress.totalLessons }}</span> bài học đã
                      hoàn thành
                    </div>
                  </div>

                  <!-- Documents Section -->
                  <div v-if="currentLesson" class="space-y-6">
                    <!-- Document 2: Text Content -->
                    <div
                      class="bg-white rounded-lg border border-gray-200 p-4 md:p-6"
                    >
                      <h3
                        class="text-base md:text-lg font-semibold text-gray-800 mb-4"
                      >
                        {{ currentLesson?.title || "Chưa có bài học" }}
                      </h3>
                      <div 
                        class="prose max-w-none text-gray-700 leading-relaxed text-sm md:text-base"
                        v-html="currentLesson?.content || 'Chưa có nội dung'"
                      ></div>
                    </div>
                  </div>
                </div>
              </a-tab-pane>

              <a-tab-pane key="modules" tab="Học phần">
                <!-- Progress Section -->
                <div class="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-4">
                  <h3 class="text-lg font-semibold text-gray-800 mb-4">
                    Tiến trình
                  </h3>
                  <div class="flex items-center gap-4">
                    <div class="flex-1">
                      <div
                        class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden"
                      >
                        <div
                          class="h-full bg-gradient-to-r from-[#15CF74] to-[#15CF74] rounded-full transition-all duration-500 ease-out"
                          :style="{ width: `${courseProgress}%` }"
                        />
                      </div>
                    </div>
                    <span
                      class="text-sm font-medium text-gray-700 whitespace-nowrap"
                      >{{ courseProgress }}%</span
                    >
                  </div>
                  <div
                    v-if="course?.progress"
                    class="mt-2 text-sm text-gray-600"
                  >
                    <span>{{ course.progress.completedLessons }}</span> /
                    <span>{{ course.progress.totalLessons }}</span> bài học đã
                    hoàn thành
                  </div>
                </div>

                <!-- NavCourse Component -->
                <div class="bg-white rounded-lg shadow-sm">
                  <NavCourse :chapters="(course?.chapters || []) as any" />
                </div>
              </a-tab-pane>

              <a-tab-pane key="documents" tab="Tài liệu">
                <div class="p-4 md:p-6">
                  <DocumentsComponent
                    :course-id="course?._id || ''"
                    :chapter-id="currentChapter?._id || ''"
                    :lesson-id="currentLesson?._id || ''"
                  />
                </div>
              </a-tab-pane>
            </a-tabs>
          </div>
        </div>

        <!-- Right: Sidebar Navigation (Desktop only) -->
        <div
          class="hidden lg:block lg:w-[35%] lg:sticky lg:top-6 lg:self-start"
        >
          <NavCourse :chapters="(course?.chapters || []) as any" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useCoursesStore } from "~/stores/courses";
import NavCourse from "~/components/courses/NavCourse.vue";
import DocumentsComponent from "~/components/lessons/DocumentsComponent.vue";
import ProgressBar from "~/components/common/ProgressBar.vue";
import type { Course, Chapter, Lesson } from "~/stores/courses";
import { useProgressTracking } from "~/composables/useProgressTracking";

definePageMeta({
  middleware: "auth",
});

const route = useRoute();
const coursesStore = useCoursesStore();
const progressTracking = useProgressTracking();

// State
const loading = ref(false);
const currentChapterIndex = ref(0);
const currentLessonIndex = ref(0);
const videoRef = ref<HTMLVideoElement | null>(null);
const activeTab = ref("modules"); // Default to "Học phần" tab
const markingCompleted = ref(false);

// Computed
const course = computed<Course | null>(() => coursesStore.course);
const slug = computed(() => route.params.slug as string);

const currentChapter = computed<Chapter | null>(() => {
  if (!course.value?.chapters || course.value.chapters.length === 0)
    return null;
  const chapter =
    course.value.chapters[currentChapterIndex.value] ||
    course.value.chapters[0];
  return chapter || null;
});

const currentLesson = computed<Lesson | null>(() => {
  if (
    !currentChapter.value?.lessons ||
    currentChapter.value.lessons.length === 0
  )
    return null;
  const lesson =
    currentChapter.value.lessons[currentLessonIndex.value] ||
    currentChapter.value.lessons[0];
  return lesson || null;
});

// Get video URL from lesson (could be from videoUrl or videos array)
const currentVideoUrl = computed(() => {
  if (!currentLesson.value) return null;

  // If lesson has videoUrl directly
  if (currentLesson.value.videoUrl) {
    return currentLesson.value.videoUrl;
  }

  // If lesson has videos array, get first video
  if (
    currentLesson.value.videos &&
    Array.isArray(currentLesson.value.videos) &&
    currentLesson.value.videos.length > 0
  ) {
    const firstVideo = currentLesson.value.videos[0];
    return firstVideo?.videoUrl || null;
  }

  return null;
});

// Get thumbnail from lesson
const currentThumbnail = computed(() => {
  if (!currentLesson.value) return course.value?.thumbnail || "";

  // If lesson has videos array, get thumbnail from first video
  if (
    currentLesson.value.videos &&
    Array.isArray(currentLesson.value.videos) &&
    currentLesson.value.videos.length > 0
  ) {
    const firstVideo = currentLesson.value.videos[0];
    return firstVideo?.thumbnail || course.value?.thumbnail || "";
  }

  // If lesson has thumbnail directly
  if (currentLesson.value.thumbnail) {
    return currentLesson.value.thumbnail;
  }

  return course.value?.thumbnail || "";
});

// Course progress percentage from backend
const courseProgress = computed(() => {
  if (!course.value || !course.value.progress) return 0;
  return course.value.progress.progressPercentage || 0;
});

// SEO - Must be after all computed properties are defined
useHead({
  title: computed(() => {
    const lessonTitle = currentLesson.value?.title || "";
    const courseTitle = course.value?.title || "";
    return lessonTitle
      ? `${lessonTitle} - ${courseTitle} - Van Phuc Care E-Learning`
      : "Học khóa học - Van Phuc Care E-Learning";
  }),
});

// Methods
const goToCourseHome = () => {
  // Navigate to course detail page
  navigateTo(`/my-learning/`);
};

const downloadDocument = (docType: string) => {
  // TODO: Implement document download
};

const playVideo = () => {
  if (videoRef.value) {
    videoRef.value.play();
  }
};

const handleTabChange = (key: string) => {
  activeTab.value = key;
};

const canMarkLessonCompleted = (
  chapterIndex: number,
  lessonIndex: number
): boolean => {
  if (!course.value?.chapters) return false;

  const chapters = course.value.chapters;
  const currentChapter = chapters[chapterIndex];

  if (!currentChapter?.lessons) return false;

  const lessons = currentChapter.lessons;
  const currentLesson = lessons[lessonIndex];

  if (!currentLesson) return false;

  if (currentLesson.isLocked) return false;

  if (currentLesson.isCompleted) return false;

  if (lessonIndex > 0) {
    const prevLesson = lessons[lessonIndex - 1];
    if (!prevLesson?.isCompleted) {
      return false;
    }
  }

  if (chapterIndex > 0 && lessonIndex === 0) {
    const prevChapter = chapters[chapterIndex - 1];
    if (prevChapter?.lessons && prevChapter.lessons.length > 0) {
      const lastPrevLesson =
        prevChapter.lessons[prevChapter.lessons.length - 1];
      if (!lastPrevLesson?.isCompleted) {
        return false;
      }
    }
  }

  return true;
};

const findValidLesson = (): {
  chapterIndex: number;
  lessonIndex: number;
} | null => {
  if (!course.value?.chapters || course.value.chapters.length === 0) {
    return null;
  }

  const chapters = course.value.chapters;

  for (let chIdx = 0; chIdx < chapters.length; chIdx++) {
    const chapter = chapters[chIdx];
    if (!chapter?.lessons || chapter.lessons.length === 0) continue;

    const lessons = chapter.lessons;

    for (let lesIdx = 0; lesIdx < lessons.length; lesIdx++) {
      const lesson = lessons[lesIdx];

      if (!lesson) continue;

      if (lesson.isCompleted) continue;

      if (lesson.isLocked) continue;

      if (lesIdx > 0) {
        const prevLesson = lessons[lesIdx - 1];
        if (!prevLesson?.isCompleted) {
          continue;
        }
      }

      if (chIdx > 0 && lesIdx === 0) {
        const prevChapter = chapters[chIdx - 1];
        if (prevChapter?.lessons && prevChapter.lessons.length > 0) {
          const lastPrevLesson =
            prevChapter.lessons[prevChapter.lessons.length - 1];
          if (!lastPrevLesson?.isCompleted) {
            continue;
          }
        }
      }

      return { chapterIndex: chIdx, lessonIndex: lesIdx };
    }
  }

  if (chapters[0]?.lessons && chapters[0].lessons.length > 0) {
    return { chapterIndex: 0, lessonIndex: 0 };
  }

  return null;
};

const fetchCourseDetail = async () => {
  try {
    loading.value = true;
    await coursesStore.fetchMyCourseBySlug(slug.value);

    const chapterParam = route.query.chapter;
    const lessonParam = route.query.lesson;

    if (chapterParam !== undefined) {
      currentChapterIndex.value = parseInt(chapterParam as string) || 0;
    } else if (course.value?.chapters && course.value.chapters.length > 0) {
      currentChapterIndex.value = 0;
    }

    if (lessonParam !== undefined) {
      currentLessonIndex.value = parseInt(lessonParam as string) || 0;
    } else if (
      currentChapter.value?.lessons &&
      currentChapter.value.lessons.length > 0
    ) {
      currentLessonIndex.value = 0;
    }
  } catch (error) {
    navigateTo("/my-learning");
  } finally {
    loading.value = false;
  }
};

watch(
  currentLesson,
  async (lesson) => {
    if (
      !lesson ||
      !course.value ||
      !currentChapter.value ||
      markingCompleted.value ||
      lesson.isCompleted
    )
      return;

    if (
      !canMarkLessonCompleted(
        currentChapterIndex.value,
        currentLessonIndex.value
      )
    ) {
      const validLesson = findValidLesson();
      if (validLesson) {
        navigateTo(
          `/my-learning/${slug.value}?chapter=${validLesson.chapterIndex}&lesson=${validLesson.lessonIndex}`
        );
      }
      return;
    }

    const hasQuiz = lesson.hasQuiz || !!lesson.quizId || !!lesson.quiz;

    if (!hasQuiz && !lesson.isCompleted) {
      try {
        markingCompleted.value = true;

        await progressTracking.markLessonCompleted(
          course.value._id,
          currentChapter.value._id,
          lesson._id,
          0
        );

        await coursesStore.fetchMyCourseBySlug(slug.value);
      } catch (error) {
      } finally {
        markingCompleted.value = false;
      }
    }
  },
  { immediate: false }
);

// Watch route query changes
watch(
  () => route.query,
  (query) => {
    if (query.chapter !== undefined) {
      currentChapterIndex.value = parseInt(query.chapter as string) || 0;
    }
    if (query.lesson !== undefined) {
      currentLessonIndex.value = parseInt(query.lesson as string) || 0;
    }
  },
  { immediate: true }
);

// Lifecycle
onMounted(async () => {
  await fetchCourseDetail();
});
</script>

<style scoped>
.my-learning-detail {
  min-height: 100vh;
  background-color: #f4f7f9;
}

/* Custom styles for video component */
:deep(.video-container) {
  border-radius: 0.5rem;
  overflow: hidden;
}

:deep(.video-player) {
  border-radius: 0.5rem;
}

/* Tabs styling */
.course-tabs :deep(.ant-tabs-nav) {
  margin-bottom: 0;
  padding: 0 16px;
  background: #fff;
  border-radius: 8px 8px 0 0;
}

.course-tabs :deep(.ant-tabs-tab) {
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  transition: all 0.3s;
}

.course-tabs :deep(.ant-tabs-tab-active) {
  color: #1a75bb;
  font-weight: 600;
}

.course-tabs :deep(.ant-tabs-ink-bar) {
  background: #1a75bb;
  height: 3px;
}

.course-tabs :deep(.ant-tabs-content-holder) {
  padding: 0;
}

.course-tabs :deep(.ant-tabs-content) {
  padding: 0;
}

.course-tabs :deep(.ant-tabs-tabpane) {
  padding: 0;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .course-tabs :deep(.ant-tabs-nav) {
    padding: 0 12px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .course-tabs :deep(.ant-tabs-tab) {
    padding: 10px 12px;
    font-size: 13px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .course-tabs :deep(.ant-tabs-nav-list) {
    flex-wrap: nowrap;
  }
}

/* Video wrapper responsive */
.video-wrapper {
  width: 100%;
  margin-bottom: 1rem;
}

@media (max-width: 640px) {
  .video-wrapper {
    margin-bottom: 0.75rem;
  }
}
</style>
