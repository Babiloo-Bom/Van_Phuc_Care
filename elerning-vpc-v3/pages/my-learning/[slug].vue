<template>
  <div class="my-learning-detail">
    <!-- Header Bar (màu xanh) -->
    <div class="my-learning-detail-head">
      <div class="container mx-auto">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4"
        >
          <!-- Course Topic (bên trái) -->
          <div class="flex-1 min-w-0 flex flex-col md:flex-row  items-center md:gap-3">
            <div v-if="isQuiz==true" class="bg-transparent md:border flex gap-1 md:border-white rounded-lg px-3 py-1 md:py-[7px] text-[#1A75BB] text-xl font-semibold md:text-white md:text-base md:font-medium whitespace-nowrap">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="hidden md:inline-block">
                <path d="M12 15.5C11.7374 15.5005 11.4772 15.449 11.2346 15.3486C10.9919 15.2483 10.7715 15.1009 10.586 14.915L5.29297 9.62103L6.70697 8.20703L12 13.5L17.293 8.20703L18.707 9.62103L13.414 14.914C13.2285 15.1001 13.0081 15.2476 12.7655 15.3482C12.5228 15.4488 12.2626 15.5004 12 15.5Z" fill="white"/>
              </svg>
              <span>Trắc nghiệm</span>
            </div>
            <h2
              :class="['truncate mb-0', {
                'md:text-white text-sm md:text-xl md:font-semibold': isQuiz,
                'text-left text-xl font-bold': !isQuiz,
                'hidden md:block': course?.progress?.isCompleted === true 
              }]"
              :style="!isQuiz ? { color: '#1A75BB' } : {}"
            >
              {{ currentChapter?.title || "Chưa có chủ đề" }}
            </h2>
          </div>

          <!-- Nút Trang chủ khóa học (bên phải) -->
          <button
            class="hidden md:flex items-center justify-center sm:justify-start gap-2 bg-[#F48283] border-0 rounded-lg px-3 py-2 sm:px-4 text-[#FFFFFF] hover:bg-[#e06d6e] transition-colors font-medium text-xs sm:text-sm md:text-base whitespace-nowrap flex-shrink-0"
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
    <div class="container mx-auto py-4 md:py-6">
      <div class="flex flex-col lg:flex-row gap-4 lg:gap-6">
        <div v-if="!isQuiz && !showCertificate" class="flex-1 lg:w-[65%] bg-white rounded-lg shadow-lg p-4 md:p-8">
          <!-- Lesson Title -->
          <h1
            class="text-xl md:text-2xl lg:text-3xl font-bold mb-4"
            style="color: #1A75BB;"
          >
            {{ currentLesson?.title || "Chưa có bài học" }}
          </h1>

          <!-- Progress Bar -->
          <div class="mb-6">
            <ProgressBar :percentage="courseProgress" />
          </div>
          <!-- Video Player - Chỉ hiển thị nếu lesson có video -->
          <div v-if="(currentVideoUrl || currentThumbnail || hasVideo) && currentLesson" class="mb-4 md:mb-6">
            <div class="video-wrapper">
              <div
                class="relative w-full rounded-lg overflow-hidden shadow-lg bg-gray-900"
                :style="{ aspectRatio: '16/9' }"
                @mousemove="handleMouseMove"
                @mouseenter="handleMouseEnter"
                @mouseleave="handleMouseLeave"
                @touchstart.passive="handleTouchStart"
              >
                <!-- Loading indicator khi đang lấy video token -->
                <div
                  v-if="hasVideo && videoTokenLoading"
                  class="absolute inset-0 flex items-center justify-center bg-gray-900 z-10"
                >
                  <div class="flex flex-col items-center gap-3">
                    <div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span class="text-white text-sm">Đang xác thực video...</span>
                  </div>
                </div>

                <!-- Video Element với chặn tải xuống và context menu -->
                <!-- Stream qua HLS (hls.js) để stream theo chunks - chống download tốt hơn -->
                <!-- CHỈ render khi video ready và component đã mounted để tránh hydration mismatch -->
                <video
                  v-if="isMounted && currentVideoUrl && !videoTokenLoading && videoReady"
                  ref="videoRef"
                  :poster="currentThumbnail || undefined"
                  class="w-full h-full object-cover video-element"
                  preload="none"
                  playsinline
                  controlslist="nodownload noplaybackrate"
                  disablePictureInPicture
                  :controls="false"
                  @timeupdate="onTimeUpdate"
                  @loadedmetadata="onLoadedMetadata"
                  @ended="handleEnded"
                  @contextmenu.prevent
                  @dragstart.prevent
                  @selectstart.prevent
                  @copy.prevent
                ></video>
                
                <!-- Watermark Overlay -->
                <div
                  v-if="isMounted && currentVideoUrl && !videoTokenLoading && videoReady"
                  class="absolute top-4 right-4 pointer-events-none select-none"
                  style="user-select: none; -webkit-user-select: none;"
                >
                  <div class="bg-black bg-opacity-50 text-white px-3 py-1 rounded text-xs font-semibold">
                    {{ authStore.user?.email || 'Van Phuc Care' }}
                  </div>
                </div>

                <!-- Thumbnail với nút Play (nếu có video nhưng chưa click play) -->
                <div
                  v-else-if="hasVideo && !videoTokenLoading"
                  class="relative w-full h-full"
                >
                  <!-- Hiển thị thumbnail nếu có -->
                  <img
                    v-if="currentThumbnail"
                    :src="currentThumbnail"
                    :alt="currentLesson?.title || 'Video'"
                    class="w-full h-full object-cover"
                  />
                  <!-- Background đen nếu không có thumbnail -->
                  <div v-else class="w-full h-full bg-gray-900"></div>
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

                <!-- Placeholder nếu không có video -->
                <div
                  v-else-if="!hasVideo"
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

                <!-- Custom Controls -->
                <div
                  v-show="isMounted && currentVideoUrl && videoReady && (showControls || !playerState.playing)"
                  :class="[ 'absolute inset-x-0 bottom-0 bg-black bg-opacity-60 px-4 py-3 flex items-center gap-3 transition-opacity duration-200', showControls || !playerState.playing ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none' ]"
                >
                  <!-- Play / Pause -->
                  <button
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-white bg-opacity-90 hover:bg-opacity-100 transition"
                    @click.stop="togglePlay"
                  >
                    <svg
                      v-if="!playerState.playing"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      class="fill-gray-800 ml-0.5"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      class="fill-gray-800"
                    >
                      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                    </svg>
                  </button>

                  <!-- Rewind 15s -->
                  <button
                    class="w-9 h-9 flex items-center justify-center rounded-full bg-white bg-opacity-90 hover:bg-opacity-100 transition z-20"
                    @click.stop="skipBackward"
                    title="Tua lại 15 giây"
                  >
                    <div class="flex items-center gap-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="text-gray-800"
                      >
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="text-gray-800"
                      >
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                      </svg>
                    </div>
                    <span class="absolute -bottom-0.5 text-[8px] font-bold text-gray-800">15</span>
                  </button>

                  <!-- Forward 15s -->
                  <button
                    class="w-9 h-9 flex items-center justify-center rounded-full bg-white bg-opacity-90 hover:bg-opacity-100 transition z-20"
                    @click.stop="skipForward"
                    title="Tua tới 15 giây"
                  >
                    <div class="flex items-center gap-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="text-gray-800"
                      >
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="text-gray-800"
                      >
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                      </svg>
                    </div>
                    <span class="absolute -bottom-0.5 text-[8px] font-bold text-gray-800">15</span>
                  </button>

                  <!-- Progress / Seek bar -->
                  <div class="flex-1 flex items-center gap-3">
                    <span class="text-xs text-gray-200 whitespace-nowrap min-w-[45px] text-right">
                      {{ formatTime(playerState.currentTime) }}
                    </span>
                    <div class="flex-1 relative">
                      <!-- Progress bar background -->
                      <div class="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                        <!-- Progress fill (phần đã xem) -->
                        <div 
                          class="h-full bg-[#15CF74] rounded-full transition-all duration-150"
                          :style="{ width: playerState.duration > 0 ? `${(playerState.currentTime / playerState.duration) * 100}%` : '0%' }"
                        ></div>
                      </div>
                      <!-- Seek input (invisible, chỉ để handle click) -->
                      <input
                        type="range"
                        min="0"
                        :max="playerState.duration || 0"
                        step="0.1"
                        v-model.number="playerState.currentTime"
                        @input.stop="onSeek"
                        class="absolute inset-0 w-full h-2 opacity-0 cursor-pointer z-10"
                        style="-webkit-appearance: none; appearance: none;"
                      />
                    </div>
                    <span class="text-xs text-gray-200 whitespace-nowrap min-w-[45px]">
                      {{ formatTime(playerState.duration) }}
                    </span>
                  </div>

                  <!-- Fullscreen -->
                  <button
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-white bg-opacity-90 hover:bg-opacity-100 transition"
                    @click.stop="toggleFullscreen"
                    title="Mở rộng màn hình"
                  >
                    <svg
                      v-if="!isFullscreen"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      class="fill-gray-800"
                    >
                      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                    </svg>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      class="fill-gray-800"
                    >
                      <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                    </svg>
                  </button>
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
                <h3 class="text-lg md:text-xl font-bold mb-4" style="color: #1A75BB;">
                  {{ currentLesson?.title || "Chưa có bài học" }}
                </h3>
                <div 
                  class="course-description-content prose max-w-none text-gray-700 leading-relaxed text-sm md:text-base"
                  v-html="normalizedLessonContent || currentLesson?.content || 'Chưa có nội dung'"
                ></div>
              </div>

              <!-- Quiz Card (Desktop) - Hiển thị ở cuối lesson nếu chapter có quiz -->
              <div v-if="currentChapter && hasQuizInChapter(currentChapter)" class="mt-6">
                <QuizCard
                  :chapter="currentChapter"
                  :chapter-index="currentChapterIndex"
                  :course-slug="slug"
                />
              </div>

              <!-- Navigation Buttons: Bài trước / Bài tiếp theo (Desktop) -->
              <div class="flex justify-center gap-4 mt-8">
                <button
                  :disabled="isFirstLesson"
                  :class="[
                    'flex items-center gap-2 px-6 py-3 rounded-lg border-2 font-semibold transition-all',
                    isFirstLesson 
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50' 
                      : 'border-[#1A75BB] text-[#1A75BB] hover:bg-[#1A75BB] hover:text-white cursor-pointer'
                  ]"
                  @click="goToPreviousLesson"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                  <span>Bài trước</span>
                </button>
                <button
                  :disabled="isLastLesson"
                  :class="[
                    'flex items-center gap-2 px-6 py-3 rounded-lg border-2 font-semibold transition-all',
                    isLastLesson 
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50' 
                      : 'border-[#1A75BB] text-[#1A75BB] hover:bg-[#1A75BB] hover:text-white cursor-pointer'
                  ]"
                  @click="goToNextLesson"
                >
                  <span>Bài tiếp theo</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
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
                        class="text-base md:text-lg font-bold mb-4"
                        style="color: #1A75BB;"
                      >
                        {{ currentLesson?.title || "Chưa có bài học" }}
                      </h3>
                      <div 
                        class="course-description-content prose max-w-none text-gray-700 leading-relaxed text-sm md:text-base"
                        v-html="normalizedLessonContent || currentLesson?.content || 'Chưa có nội dung'"
                      ></div>
                    </div>

                    <!-- Quiz Card (Mobile) - Hiển thị ở cuối lesson nếu chapter có quiz -->
                    <div v-if="currentChapter && hasQuizInChapter(currentChapter)" class="mt-6">
                      <QuizCard
                        :chapter="currentChapter"
                        :chapter-index="currentChapterIndex"
                        :course-slug="slug"
                      />
                    </div>

                    <!-- Navigation Buttons: Bài trước / Bài tiếp theo (Mobile) -->
                    <div class="flex justify-center gap-3 mt-6">
                      <button
                        :disabled="isFirstLesson"
                        :class="[
                          'flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 font-semibold text-sm transition-all',
                          isFirstLesson 
                            ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50' 
                            : 'border-[#1A75BB] text-[#1A75BB] hover:bg-[#1A75BB] hover:text-white cursor-pointer'
                        ]"
                        @click="goToPreviousLesson"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        <span>Bài trước</span>
                      </button>
                      <button
                        :disabled="isLastLesson"
                        :class="[
                          'flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 font-semibold text-sm transition-all',
                          isLastLesson 
                            ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50' 
                            : 'border-[#1A75BB] text-[#1A75BB] hover:bg-[#1A75BB] hover:text-white cursor-pointer'
                        ]"
                        @click="goToNextLesson"
                      >
                        <span>Bài tiếp theo</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </button>
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
                  <NavCourse :chapters="((course?.chapters || []) as any)" />
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
        <div v-if="isQuiz && (!course?.progress?.isCompleted || isReviewMode)" class="flex-1">
          <QuizzesComponent
            v-if="currentLesson?._id"
            :course-id="course?._id || ''"
            :chapter-id="currentChapter?._id || ''"
            :lesson-id="currentLesson?._id || ''"
            :quiz-complete="currentLesson?.isCompleted || false"
            :is-review-mode="isReviewMode"
            @completed="(quizResult) => handleFinishQuiz(quizResult)"
          />
        </div>
        <div v-if="showCertificate" class="flex-1">
          <CourseCertificateComponent
            :course="course"
            @is-repeating="handleRepeat"
          />
        </div>

        <!-- Right: Sidebar Navigation (Desktop only) -->
        <div
          :class="['hidden lg:block lg:w-[35%] lg:sticky lg:top-6 lg:self-start', isQuiz && !currentLesson?.isCompleted ? '!hidden' : '']"
        >
          <NavCourse 
            :chapters="((course?.chapters || []) as any)" 
            :force-review-mode="showCertificate"
            :course-slug="course?.slug || ''"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useCoursesStore } from "~/stores/courses";
import { useAuthStore } from "~/stores/auth";
import NavCourse from "~/components/courses/NavCourse.vue";
import DocumentsComponent from "~/components/lessons/DocumentsComponent.vue";
import QuizzesComponent from "~/components/lessons/QuizzesComponent.vue";
import QuizCard from "~/components/lessons/QuizCard.vue";
import CourseCertificateComponent from "~/components/lessons/CourseCertificateComponent.vue";
import ProgressBar from "~/components/common/ProgressBar.vue";
import type { Course, Chapter, Lesson } from "~/stores/courses";
import { useProgressTracking } from "~/composables/useProgressTracking";
import { useApiBase } from "~/composables/useApiBase";
// @ts-ignore - hls.js types
import Hls from 'hls.js';

definePageMeta({
  middleware: "auth",
});

const route = useRoute();
const coursesStore = useCoursesStore();
const progressTracking = useProgressTracking();
const authStore = useAuthStore();
const { apiUser } = useApiBase();

// State for video proxy
const videoToken = ref<string | null>(null);
const videoTokenLoading = ref(false);
let tokenRefreshInterval: ReturnType<typeof setInterval> | null = null;
const TOKEN_EXPIRY_SECONDS = 300; // Token hết hạn sau 5 phút (revert về 5 phút vì dùng DevTools detection)
const TOKEN_REFRESH_INTERVAL = 240000; // Refresh token mỗi 4 phút (trước khi hết hạn 1 phút)

// Chỉ lấy token khi user click play - ẩn video URL khỏi Cốc Cốc
const userClickedPlay = ref(false);
const videoReady = ref(false); // Chỉ set video src khi ready (delay để tránh Cốc Cốc)
let hlsInstance: Hls | null = null; // HLS instance để stream video theo chunks

// Client-side mounted flag để tránh hydration mismatch
const isMounted = ref(false);

// State
const loading = ref(false);
const currentChapterIndex = ref(0);
const currentLessonIndex = ref(0);
const isQuiz = ref(false);
const videoRef = ref<HTMLVideoElement | null>(null);
const activeTab = ref("modules"); // Default to "Học phần" tab
const markingCompleted = ref(false);

const playerState = ref({
  duration: 0,
  currentTime: 0,
  playing: false,
});

// Controls visibility
const showControls = ref(true);
let hideControlsTimer: ReturnType<typeof setTimeout> | null = null;
const HIDE_DELAY = 3000; // ms

const isFullscreen = ref(false);

// Computed
const course = computed<Course | null>(() => coursesStore.course);
const isRepeat = computed<boolean>(() => coursesStore.isRepeatLearn);
const slug = computed(() => route.params.slug as string);

// Chế độ Review: cho phép xem lại tất cả bài mà không cần reset progress
const isReviewMode = computed(() => route.query.review === "true");

const hasCertificate = computed(() => {
  const id = course.value?._id?.toString?.();
  return !!(id && authStore.user?.courseCompleted?.includes(id));
});

// Kiểm tra xem user đã mua hoặc đã hoàn thành khóa học chưa
const isPurchasedOrCompleted = computed(() => {
  if (!course.value) return false;
  const courseId = course.value._id?.toString();
  
  return (
    course.value.isPurchased === true ||
    course.value.progress?.isCompleted === true ||
    (courseId && authStore.user?.courseRegister?.includes(courseId)) ||
    (courseId && authStore.user?.courseCompleted?.includes(courseId))
  );
});

const showCertificate = computed(() => {
  // Ẩn chứng chỉ khi ở chế độ review
  if (isReviewMode.value) return false;
  if (course.value?.progress?.isCompleted === true) return true;
  const certQuery = route.query.certificate === "true";
  return certQuery && hasCertificate.value;
});
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

// Kiểm tra xem có phải bài học đầu tiên không (chapter 0, lesson 0)
const isFirstLesson = computed(() => {
  return currentChapterIndex.value === 0 && currentLessonIndex.value === 0;
});

// Kiểm tra xem có phải bài học cuối cùng không
const isLastLesson = computed(() => {
  if (!course.value?.chapters || course.value.chapters.length === 0) return true;
  
  const chapters = course.value.chapters;
  const lastChapterIndex = chapters.length - 1;
  const lastChapter = chapters[lastChapterIndex];
  
  if (!lastChapter?.lessons || lastChapter.lessons.length === 0) return true;
  
  const lastLessonIndex = lastChapter.lessons.length - 1;
  
  return currentChapterIndex.value === lastChapterIndex && currentLessonIndex.value === lastLessonIndex;
});

// Normalize lesson content HTML to ensure ul displays as bullets
// Convert <ol> without type/start attributes to <ul> (likely bullet lists created incorrectly)
const normalizedLessonContent = computed(() => {
  if (!currentLesson.value?.content) return '';
  
  let html = currentLesson.value.content;
  
  // If running on client side, use DOM parser for more accurate conversion
  if (process.client && typeof DOMParser !== 'undefined') {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Find all <ol> elements without type or start attributes
      const olElements = doc.querySelectorAll('ol:not([type]):not([start])');
      olElements.forEach((ol) => {
        const ul = doc.createElement('ul');
        // Copy all attributes except type and start
        Array.from(ol.attributes).forEach((attr) => {
          if (attr.name !== 'type' && attr.name !== 'start') {
            ul.setAttribute(attr.name, attr.value);
          }
        });
        // Move all children
        while (ol.firstChild) {
          ul.appendChild(ol.firstChild);
        }
        // Replace ol with ul
        ol.parentNode?.replaceChild(ul, ol);
      });
      
      html = doc.body.innerHTML;
    } catch (e) {
      // Fallback to regex if DOM parsing fails
      html = html.replace(/<ol(?![^>]*\s(type|start)=[^>]*)>/gi, '<ul>');
      html = html.replace(/<\/ol>/gi, '</ul>');
    }
  } else {
    // Server-side or fallback: use regex
    // Convert <ol> without type/start to <ul> - these are likely bullet lists created incorrectly
    html = html.replace(/<ol(?![^>]*\s(type|start)=[^>]*)>/gi, '<ul>');
    html = html.replace(/<\/ol>/gi, '</ul>');
  }
  
  return html;
});


// Check if lesson has video (any video - R2 or external)
// Backend trả về videoUrl: null và needsProxy: true để ẩn URL gốc
const hasVideo = computed(() => {
  if (!currentLesson.value) return false;

  // Check needsProxy flag (backend set khi có video)
  if (currentLesson.value.needsProxy) return true;

  // Check videos array - nếu có video object trong array thì có video
  if (
    currentLesson.value.videos &&
    Array.isArray(currentLesson.value.videos) &&
    currentLesson.value.videos.length > 0
  ) {
    // Có video object trong array = có video (videoUrl có thể null nhưng vẫn có video)
    return true;
  }
  
  // Legacy: check videoUrl (có thể là external URL chưa được migrate)
  if (currentLesson.value.videoUrl) return true;
  
  return false;
});

// Check if chapter has quiz (kiểm tra bất kỳ lesson nào trong chapter có quiz)
const hasQuizInChapter = (chapter: any) => {
  if (!chapter?.lessons) return false
  
  // Tìm lesson có quiz trong chapter
  return chapter.lessons.some((lesson: any) => {
    return lesson?.type === 'quiz' || lesson?.quizId || lesson?.quiz
  })
};

// Get video URL - Stream trực tiếp từ proxy (token ẩn URL gốc)
// CHỈ tạo URL khi user click play VÀ video ready - ẩn URL khỏi Cốc Cốc
const currentVideoUrl = computed(() => {
  // CHỈ tạo video URL khi user đã click play VÀ video ready - ẩn URL khỏi Cốc Cốc
  if (!userClickedPlay.value || !videoReady.value) {
    return null; // Không có URL cho đến khi user click play và video ready
  }

  if (!currentLesson.value || !hasVideo.value) return null;

  // Tất cả video (HLS và MP4) đều stream qua proxy để tránh CORS và ẩn URL gốc
  if (videoToken.value) {
    return `${apiUser}/video/stream/${videoToken.value}`;
  }

  return null; // Chưa có token, sẽ hiển thị loading
});

// Get thumbnail from lesson
const currentThumbnail = computed(() => {
  if (!currentLesson.value) return null;

  // If lesson has videos array, get thumbnail from first video
  if (
    currentLesson.value.videos &&
    Array.isArray(currentLesson.value.videos) &&
    currentLesson.value.videos.length > 0
  ) {
    const firstVideo = currentLesson.value.videos[0];
    return firstVideo?.thumbnail || null;
  }

  // If lesson has thumbnail directly
  if (currentLesson.value.thumbnail) {
    return currentLesson.value.thumbnail;
  }

  // Chỉ trả về course thumbnail nếu lesson có video
  if (currentLesson.value.videoUrl || (currentLesson.value.videos && currentLesson.value.videos.length > 0)) {
    return course.value?.thumbnail || null;
  }

  return null;
});

// Course progress percentage from backend (capped at 100%)
const courseProgress = computed(() => {
  if (!course.value || !course.value.progress) return 0;
  const progress = course.value.progress.progressPercentage || 0;
  return Math.min(progress, 100); // Ensure never exceeds 100%
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
  navigateTo(`/courses/${slug.value}`);
};

// Điều hướng đến bài học trước đó
const goToPreviousLesson = () => {
  if (isFirstLesson.value || !course.value?.chapters) return;
  
  let newChapterIndex = currentChapterIndex.value;
  let newLessonIndex = currentLessonIndex.value - 1;
  
  // Nếu đang ở bài đầu của chapter, chuyển về bài cuối của chapter trước
  if (newLessonIndex < 0) {
    newChapterIndex--;
    if (newChapterIndex >= 0) {
      const prevChapter = course.value.chapters[newChapterIndex];
      newLessonIndex = (prevChapter?.lessons?.length || 1) - 1;
    } else {
      return; // Đã ở bài đầu tiên
    }
  }
  
  // Giữ lại query review nếu đang ở chế độ review
  const query: Record<string, string> = {
    chapter: String(newChapterIndex),
    lesson: String(newLessonIndex),
  };
  if (isReviewMode.value) {
    query.review = 'true';
  }
  
  navigateTo({
    path: `/my-learning/${slug.value}`,
    query,
  });
};

// Điều hướng đến bài học tiếp theo
const goToNextLesson = () => {
  if (isLastLesson.value || !course.value?.chapters) return;
  
  const currentChapterData = course.value.chapters[currentChapterIndex.value];
  const currentChapterLessonsCount = currentChapterData?.lessons?.length || 0;
  
  let newChapterIndex = currentChapterIndex.value;
  let newLessonIndex = currentLessonIndex.value + 1;
  
  // Nếu đang ở bài cuối của chapter, chuyển sang bài đầu của chapter tiếp theo
  if (newLessonIndex >= currentChapterLessonsCount) {
    newChapterIndex++;
    newLessonIndex = 0;
    
    // Kiểm tra xem chapter mới có tồn tại không
    if (newChapterIndex >= course.value.chapters.length) {
      return; // Đã ở bài cuối cùng
    }
  }
  
  // Giữ lại query review nếu đang ở chế độ review
  const query: Record<string, string> = {
    chapter: String(newChapterIndex),
    lesson: String(newLessonIndex),
  };
  if (isReviewMode.value) {
    query.review = 'true';
  }
  
  navigateTo({
    path: `/my-learning/${slug.value}`,
    query,
  });
};

const downloadDocument = (docType: string) => {
  // TODO: Implement document download
};

// Load video - HLS hoặc MP4
const loadVideoWithHls = async () => {
  if (!videoRef.value || !currentVideoUrl.value) return;

  // Cleanup previous HLS instance
  if (hlsInstance) {
    hlsInstance.destroy();
    hlsInstance = null;
  }

  // Check if video is HLS format
  const firstVideo = currentLesson.value?.videos?.[0];
  const isHls = firstVideo?.isHls || currentVideoUrl.value.endsWith('.m3u8') || false;

  if (isHls) {
    // HLS: Use hls.js to load HLS manifest (.m3u8)
    if (Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90,
        xhrSetup: (xhr: XMLHttpRequest, url: string) => {
          xhr.withCredentials = false;
        },
        fragLoadingTimeOut: 20000,
        manifestLoadingTimeOut: 10000,
      });

      // Load HLS manifest
      hlsInstance.loadSource(currentVideoUrl.value);
      hlsInstance.attachMedia(videoRef.value);

      hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
        // Video ready to play
  if (videoRef.value) {
          videoRef.value.play().catch(console.error);
          playerState.value.playing = true;
        }
      });

      hlsInstance.on(Hls.Events.ERROR, (event: string, data: any) => {
        console.error('HLS error:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hlsInstance?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hlsInstance?.recoverMediaError();
              break;
            default:
              hlsInstance?.destroy();
              hlsInstance = null;
              break;
          }
        }
      });
    } else if (videoRef.value.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS support
      videoRef.value.src = currentVideoUrl.value;
      videoRef.value.play().catch(console.error);
      playerState.value.playing = true;
    } else {
      console.error('HLS is not supported in this browser');
    }
  } else {
    // MP4: Use native video element (streamed via proxy)
    videoRef.value.src = currentVideoUrl.value;
    videoRef.value.play().catch(console.error);
    playerState.value.playing = true;
  }
};

const playVideo = async () => {
  // Set flag để cho phép lấy token
  userClickedPlay.value = true;
  videoReady.value = false; // Reset video ready state
  
  // Lấy token ngay khi user click play
  await getVideoToken();
  startTokenRefresh();
  
  // Đợi token được set
  await nextTick();
  
  // Delay một chút trước khi set video src để tránh Cốc Cốc bắt được
  // Cốc Cốc thường scan Network tab ngay khi page load, delay này giúp tránh bị bắt
  await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay
  
  // Sau delay, set video ready để video URL được tạo và video element được render
  videoReady.value = true;
  
  // Đợi video element được render
  await nextTick();
  
  // Load video qua HLS (stream theo chunks - chống download tốt hơn)
  await loadVideoWithHls();
};

const handleTabChange = (key: string) => {
  activeTab.value = key;
};

// Cho phép nhảy cóc: chỉ chặn mark completed cho quiz hoặc bài đã hoàn thành
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

  // Không tự động mark cho quiz
  const hasQuiz = currentLesson.hasQuiz || !!currentLesson.quizId || !!currentLesson.quiz;
  if (hasQuiz) return false;

  // Không mark lại bài đã hoàn thành
  if (currentLesson.isCompleted) return false;

  return true;
};

const handleRepeat = async () => {
  // Chế độ Review: chỉ điều hướng về bài học đầu tiên với query review=true
  // Không reset progress, không reset chứng chỉ
  await navigateTo(`/my-learning/${slug.value}?chapter=0&lesson=0&review=true`);
}
// Tìm bài học đầu tiên chưa hoàn thành (không cần check khóa hay bài trước)
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
    
    const chapterParam = route.query.chapter;
    const lessonParam = route.query.lesson;

    if (chapterParam !== undefined) {
      currentChapterIndex.value = parseInt(chapterParam as string) || 0;
    }
    if (lessonParam !== undefined) {
      currentLessonIndex.value = parseInt(lessonParam as string) || 0;
    }

    // Nếu user chưa mua, dùng API public để lấy thông tin khóa học (cho phép xem preview)
    // Nếu user đã mua, dùng API my-courses để lấy thông tin đầy đủ với progress
    try {
      await coursesStore.fetchDetail(slug.value);
      
      // Sau khi fetch, kiểm tra lại isPurchased hoặc đã hoàn thành
      if (!isPurchasedOrCompleted.value) {
        // Nếu chưa mua, chỉ cho phép xem bài preview
        if (currentLesson.value && (!currentLesson.value.isPreview || currentLesson.value.isLocked)) {
          // Redirect về trang chi tiết khóa học với query parameter để tự động hiện popup
          navigateTo(`/courses/${slug.value}?showPurchaseModal=true`);
          return;
        }
      } else {
        // Nếu đã mua, fetch lại bằng my-courses để có progress đầy đủ
        await coursesStore.fetchMyCourseBySlug(slug.value, currentChapterIndex.value, currentLessonIndex.value);
      }
    } catch (error: any) {
      // Nếu API public cũng fail, thử dùng my-courses (có thể user đã mua nhưng API public có vấn đề)
      if (error?.statusCode === 403 || error?.data?.error?.includes('chưa mua')) {
        // User chưa mua, redirect về trang chi tiết
        navigateTo(`/courses/${slug.value}`);
        return;
      }
      await coursesStore.fetchMyCourseBySlug(slug.value, currentChapterIndex.value, currentLessonIndex.value);
    }

    // Set lại chapter và lesson index sau khi fetch
    if (chapterParam === undefined && course.value?.chapters && course.value.chapters.length > 0) {
      currentChapterIndex.value = 0;
    }
    if (lessonParam === undefined && currentChapter.value?.lessons && currentChapter.value.lessons.length > 0) {
      currentLessonIndex.value = 0;
    }
    
  } catch (error) {
    console.error('Error fetching course detail:', error);
    navigateTo("/my-learning");
  } finally {
    loading.value = false;
  }
};


const handleFinishQuiz = async (quizResult: any) => {
  const chapterParam = route.query.chapter;
  const lessonParam = route.query.lesson;
  navigateTo(
    `/my-learning/${slug.value}?chapter=${chapterParam || 0}&lesson=${lessonParam || 0}`
  );
  await fetchCourseDetail();
  // Đồng bộ cache courses để trang /courses cập nhật đúng trạng thái
  await coursesStore.fetchAll();
};

const onLoadedMetadata = () => {
  if (!videoRef.value) return;
  playerState.value.duration = videoRef.value.duration || 0;
};

const onTimeUpdate = () => {
  if (!videoRef.value) return;
  playerState.value.currentTime = videoRef.value.currentTime || 0;
};

const onSeek = () => {
  if (!videoRef.value) return;
  videoRef.value.currentTime = playerState.value.currentTime;
};

const togglePlay = () => {
  if (!videoRef.value) return;
  if (playerState.value.playing) {
    videoRef.value.pause();
    playerState.value.playing = false;
    // When paused, always show controls
    showControls.value = true;
    if (hideControlsTimer) { clearTimeout(hideControlsTimer); hideControlsTimer = null; }
  } else {
    videoRef.value.play();
    playerState.value.playing = true;
    // When start playing, auto-hide after delay
    hideControlsAfterDelay();
  }
};

function clearHideTimer() {
  if (hideControlsTimer) { clearTimeout(hideControlsTimer); hideControlsTimer = null; }
}

function hideControlsAfterDelay() {
  clearHideTimer();
  // Only hide when playing
  if (!playerState.value.playing) return;
  hideControlsTimer = setTimeout(() => {
    // If still playing, hide controls
    if (playerState.value.playing) showControls.value = false;
    hideControlsTimer = null;
  }, HIDE_DELAY);
}

function showControlsTemporarily() {
  showControls.value = true;
  // If playing, schedule auto-hide
  if (playerState.value.playing) hideControlsAfterDelay();
}

function handleMouseMove(e: MouseEvent) {
  // Only react on desktop devices
  if (('ontouchstart' in window) && navigator.maxTouchPoints > 0) return;
  const target = (e.currentTarget as HTMLElement);
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const y = e.clientY;
  const nearBottom = rect.bottom - y <= 120; // 120px zone at bottom
  if (nearBottom || !playerState.value.playing) {
    showControlsTemporarily();
  } else {
    // Hide if playing and cursor away from bottom
    if (playerState.value.playing) {
      showControls.value = false;
    }
  }
}

function handleMouseEnter() {
  // show controls on enter
  showControlsTemporarily();
}

function handleMouseLeave() {
  if (playerState.value.playing) {
    hideControlsAfterDelay();
  } else {
    showControls.value = true;
  }
}

function handleTouchStart(e: TouchEvent) {
  // On mobile, toggle controls visible on touch
  // But don't toggle when tapping on control buttons (they have stopPropagation)
  showControls.value = !showControls.value;
  if (showControls.value && playerState.value.playing) {
    hideControlsAfterDelay();
  } else {
    clearHideTimer();
  }
}

function handleEnded() {
  // Called when video playback reaches end
  // Ensure UI reflects stopped playback and cleanup background work
  try {
    if (videoRef.value) {
      videoRef.value.pause();
      // set time to duration (should already be at end)
      videoRef.value.currentTime = videoRef.value.duration || 0;
    }
  } catch (e) {
    // ignore
  }
  playerState.value.playing = false;
  // show controls so user can replay
  showControls.value = true;
  // clear any auto-hide timer
  clearHideTimer();
  // stop refreshing token when playback finished
  stopTokenRefresh();
}

// Ensure controls behavior responds to play/pause state
watch(
  () => playerState.value.playing,
  (playing) => {
    if (playing) {
      hideControlsAfterDelay();
    } else {
      showControls.value = true;
      clearHideTimer();
    }
  }
);

// Clean up timer on unmount
onUnmounted(() => {
  clearHideTimer();
});

const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const mm = m < 10 ? `0${m}` : `${m}`;
  const ss = s < 10 ? `0${s}` : `${s}`;
  return `${mm}:${ss}`;
};

const skipBackward = () => {
  if (!videoRef.value) return;
  const newTime = Math.max(0, videoRef.value.currentTime - 15);
  videoRef.value.currentTime = newTime;
  playerState.value.currentTime = newTime;
};

const skipForward = () => {
  if (!videoRef.value) return;
  const newTime = Math.min(videoRef.value.duration, videoRef.value.currentTime + 15);
  videoRef.value.currentTime = newTime;
  playerState.value.currentTime = newTime;
};

const toggleFullscreen = () => {
  if (!videoRef.value) return;
  
  const videoWrapper = videoRef.value.closest('.video-wrapper') || videoRef.value.parentElement;
  if (!videoWrapper) return;

  if (!isFullscreen.value) {
    // Enter fullscreen
    if (videoWrapper.requestFullscreen) {
      videoWrapper.requestFullscreen();
    } else if ((videoWrapper as any).webkitRequestFullscreen) {
      (videoWrapper as any).webkitRequestFullscreen();
    } else if ((videoWrapper as any).mozRequestFullScreen) {
      (videoWrapper as any).mozRequestFullScreen();
    } else if ((videoWrapper as any).msRequestFullscreen) {
      (videoWrapper as any).msRequestFullscreen();
    }
  } else {
    // Exit fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  }
};

// Handle fullscreen change events
const handleFullscreenChange = () => {
  isFullscreen.value = !!(
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).msFullscreenElement
  );
};


// Get video token for proxy streaming - CHỈ lấy khi user click play
const getVideoToken = async () => {
  // CHỈ lấy token khi user đã click play - ẩn URL khỏi Cốc Cốc
  if (!userClickedPlay.value) {
    videoToken.value = null;
    return;
  }

  if (!currentLesson.value || !course.value || !hasVideo.value) {
    videoToken.value = null;
    return;
  }

  try {
    videoTokenLoading.value = true;
    const response = await fetch(`${apiUser}/video/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        lessonId: currentLesson.value._id,
        courseId: course.value._id,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get video token: ${response.status}`);
    }

    const data = await response.json();
    videoToken.value = data.data?.token || null;
  } catch (error) {
    console.error('❌ Error getting video token:', error);
    videoToken.value = null;
  } finally {
    videoTokenLoading.value = false;
  }
};

// Start/Stop token refresh interval
const startTokenRefresh = () => {
  stopTokenRefresh(); // Clear existing interval
  
  if (!hasVideo.value || !currentLesson.value || !course.value) {
    return;
  }

  // Refresh token mỗi 2 giây (trước khi hết hạn 1 giây)
  tokenRefreshInterval = setInterval(async () => {
    if (hasVideo.value && currentLesson.value && course.value) {
      await getVideoToken();
    }
  }, TOKEN_REFRESH_INTERVAL);
};

const stopTokenRefresh = () => {
  if (tokenRefreshInterval) {
    clearInterval(tokenRefreshInterval);
    tokenRefreshInterval = null;
  }
};

// Watch lesson changes - Reset play state và clear token
// KHÔNG tự động lấy token - chỉ lấy khi user click play
watch(
  [() => currentLesson.value?._id, () => course.value?._id],
  () => {
    // Reset play state khi lesson thay đổi
    userClickedPlay.value = false;
    videoReady.value = false; // Reset video ready state
    videoToken.value = null;
    stopTokenRefresh();
    
    // Cleanup HLS instance
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
    
    // Clear video src để ẩn URL khỏi Cốc Cốc
    if (videoRef.value) {
      videoRef.value.src = '';
      videoRef.value.load();
      playerState.value.playing = false;
      playerState.value.currentTime = 0;
    }
  },
  { immediate: false }
);

// Watch videoReady để tự động load HLS khi ready
watch(
  [videoReady, currentVideoUrl],
  async ([ready, url]) => {
    if (ready && url && videoRef.value && userClickedPlay.value) {
      await loadVideoWithHls();
    }
  },
  { immediate: false }
);

watch(
  currentLesson,
  async (lesson) => {
    if (
      !lesson ||
      !course.value ||
      !currentChapter.value ||
      markingCompleted.value
    )
      return;

    // Nếu chưa mua hoặc chưa hoàn thành khóa học
    if (!isPurchasedOrCompleted.value) {
      // Chỉ cho phép xem bài preview, không mark completed
      if (!lesson.isPreview || lesson.isLocked) {
        // Redirect về trang chi tiết với query parameter để tự động hiện popup mua khóa học
        navigateTo(`/courses/${slug.value}?showPurchaseModal=true`);
        return;
      }
      // Bài preview: không mark completed khi chưa mua
      return;
    }

    // Nếu đã mua khóa học, cho phép nhảy cóc - bỏ qua check bài trước
    // Chỉ mark completed nếu chưa hoàn thành (kể cả khi ở chế độ review/jump ahead)
    // Điều này đảm bảo khi nhảy cóc vẫn tính tiến độ
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
        // Reload course để cập nhật UI (tick, progress %)
        await coursesStore.fetchMyCourseBySlug(
          slug.value,
          currentChapterIndex.value,
          currentLessonIndex.value
        );
        
        // Đồng bộ cache courses để trang /courses cập nhật đúng trạng thái
        try {
          await coursesStore.fetchAll();
        } catch (e) {
          console.warn('Failed to sync courses cache:', e);
        }
      } catch (error) {
        console.error('Error marking lesson completed:', error);
      } finally {
        markingCompleted.value = false;
      }
    }
    // Nếu ở chế độ review (đã hoàn thành 100%), không làm gì thêm
    // Nhưng vẫn cho phép mark completed nếu bài chưa hoàn thành (nhảy cóc)
    return;
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
    isQuiz.value = query.quiz === 'true' ? true : false;
    // Khi vào chế độ review, load lại course để đảm bảo tất cả bài hiển thị đúng trạng thái
    if (query.review === 'true') {
      fetchCourseDetail();
    }
  },
  { immediate: true }
);

// Video Security: Block keyboard shortcuts and DevTools
const setupVideoSecurity = () => {
  if (!process.client) return;

  // Block common keyboard shortcuts
  const blockShortcuts = (e: KeyboardEvent) => {
    // Block F12 (DevTools)
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }
    
    // Block Ctrl+Shift+I (DevTools)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      e.preventDefault();
      return false;
    }
    
    // Block Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
      e.preventDefault();
      return false;
    }
    
    // Block Ctrl+U (View Source)
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      return false;
    }
    
    // Block Ctrl+S (Save Page)
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      return false;
    }
    
    // Block Ctrl+P (Print)
    if (e.ctrlKey && e.key === 'p') {
      e.preventDefault();
      return false;
    }
    
    // Block Ctrl+Shift+C (Inspect Element)
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
      e.preventDefault();
      return false;
    }
  };

  // Block right-click context menu globally (already handled on video element)
  const blockContextMenu = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target?.closest('.video-wrapper') || target?.tagName === 'VIDEO') {
      e.preventDefault();
      return false;
    }
  };

  // Block text selection on video
  const blockSelection = () => {
    if (window.getSelection) {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        const target = selection.anchorNode?.parentElement;
        if (target?.closest('.video-wrapper') || target?.tagName === 'VIDEO') {
          selection.removeAllRanges();
        }
      }
    }
  };

  document.addEventListener('keydown', blockShortcuts);
  document.addEventListener('contextmenu', blockContextMenu);
  document.addEventListener('selectstart', blockSelection);

  return () => {
    document.removeEventListener('keydown', blockShortcuts);
    document.removeEventListener('contextmenu', blockContextMenu);
    document.removeEventListener('selectstart', blockSelection);
  };
};

let securityCleanup: (() => void) | null | undefined = null;

// Lifecycle
onMounted(async () => {
  isMounted.value = true; // Set mounted flag để tránh hydration mismatch
  await fetchCourseDetail();
  securityCleanup = setupVideoSecurity() || null;
  
  // Add fullscreen change event listeners
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.addEventListener('mozfullscreenchange', handleFullscreenChange);
  document.addEventListener('MSFullscreenChange', handleFullscreenChange);
});

onUnmounted(() => {
  stopTokenRefresh(); // Cleanup token refresh interval
  
  // Cleanup HLS instance
  if (hlsInstance) {
    hlsInstance.destroy();
    hlsInstance = null;
  }
  
  // Remove fullscreen event listeners
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
  document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
  
  securityCleanup?.();
  coursesStore.setIsRepeatLearn(false);
});
</script>

<style scoped>
.my-learning-detail {
  min-height: 100vh;
  background-color: #f4f7f9;
}
.my-learning-detail-head {
  background: #1a75bb;
  padding: 16px 0px ;
}
@media screen and (max-width: 768px) {
  .my-learning-detail-head {
    padding: 12px 0px 12px 0;
    background: transparent;
  }
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
  position: relative;
}

@media (max-width: 640px) {
  .video-wrapper {
    margin-bottom: 0.75rem;
  }
}

/* Video Security Styles */
.video-element {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  pointer-events: auto;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}

.video-wrapper * {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Prevent drag on video */
.video-element {
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
}

/* Custom range input for seek bar */
.custom-range {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

.custom-range::-webkit-slider-track {
  background: #4b5563;
  height: 4px;
  border-radius: 2px;
}

.custom-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: #15CF74;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  cursor: pointer;
  margin-top: -6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.custom-range::-webkit-slider-thumb:hover {
  background: #12b863;
  transform: scale(1.1);
}

.custom-range::-moz-range-track {
  background: #4b5563;
  height: 4px;
  border-radius: 2px;
}

.custom-range::-moz-range-thumb {
  background: #15CF74;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.custom-range::-moz-range-thumb:hover {
  background: #12b863;
  transform: scale(1.1);
}

/* Quill Editor Content Styles */
.prose :deep(p) {
  margin-bottom: 1em;
  line-height: 1.75;
}

.prose :deep(strong),
.prose :deep(b) {
  font-weight: 700;
}

.prose :deep(em),
.prose :deep(i) {
  font-style: italic;
}

.prose :deep(u) {
  text-decoration: underline;
}

.prose :deep(s),
.prose :deep(strike) {
  text-decoration: line-through;
}

.prose :deep(h1) {
  font-size: 2em;
  font-weight: 700;
  margin-top: 0.67em;
  margin-bottom: 0.67em;
  line-height: 1.2;
}

.prose :deep(h2) {
  font-size: 1.5em;
  font-weight: 700;
  margin-top: 0.83em;
  margin-bottom: 0.83em;
  line-height: 1.3;
}

.prose :deep(h3) {
  font-size: 1.17em;
  font-weight: 700;
  margin-top: 1em;
  margin-bottom: 1em;
  line-height: 1.4;
}

.prose :deep(h4) {
  font-size: 1em;
  font-weight: 700;
  margin-top: 1.33em;
  margin-bottom: 1.33em;
  line-height: 1.5;
}

.prose :deep(h5) {
  font-size: 0.83em;
  font-weight: 700;
  margin-top: 1.67em;
  margin-bottom: 1.67em;
  line-height: 1.6;
}

.prose :deep(h6) {
  font-size: 0.67em;
  font-weight: 700;
  margin-top: 2.33em;
  margin-bottom: 2.33em;
  line-height: 1.7;
}

.prose :deep(ul),
.prose :deep(ol) {
  margin: 1em 0;
  padding-left: 2em;
}

.prose :deep(ul) {
  list-style-type: disc;
}

.prose :deep(ol) {
  list-style-type: decimal;
}

.prose :deep(li) {
  margin: 0.5em 0;
  line-height: 1.75;
}

.prose :deep(blockquote) {
  border-left: 4px solid #e5e7eb;
  padding-left: 1em;
  margin: 1em 0;
  font-style: italic;
  color: #6b7280;
}

.prose :deep(code) {
  background-color: #f3f4f6;
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

/* Course Description Content Styles - Rich Text Editor Output */
/* Applied to both course description and lesson content */
.course-description-content {
  line-height: 1.8;
  color: #333;
  /* Reset any list styling that might interfere */
  counter-reset: none;
}

.course-description-content :deep(p) {
  margin-bottom: 1em;
  line-height: 1.8;
}

/* Ensure ul displays as bullet list - HIGH SPECIFICITY */
.course-description-content :deep(ul),
.course-description-content :deep(ul[class]),
.course-description-content :deep(ul[style]),
div.course-description-content :deep(ul) {
  margin: 1em 0 !important;
  padding-left: 2em !important;
  line-height: 1.8 !important;
  list-style-position: outside !important;
  list-style-type: disc !important;
  counter-reset: none !important;
}

.course-description-content :deep(ul li),
.course-description-content :deep(ul > li),
div.course-description-content :deep(ul li) {
  margin-bottom: 0.5em !important;
  padding-left: 0.5em !important;
  line-height: 1.8 !important;
  display: list-item !important;
  list-style-type: disc !important;
  list-style-position: outside !important;
  counter-increment: none !important;
}

/* Remove any ::before pseudo-elements that might be adding numbers */
.course-description-content :deep(ul li::before),
.course-description-content :deep(ul li::marker) {
  content: none !important;
  display: none !important;
}

/* Use ::marker for proper bullet display */
.course-description-content :deep(ul li::marker) {
  content: '• ' !important;
  color: #333 !important;
  font-weight: bold !important;
}

/* Ensure ol displays as numbered list */
.course-description-content :deep(ol) {
  margin: 1em 0 !important;
  padding-left: 2em !important;
  line-height: 1.8 !important;
  list-style-position: outside !important;
  list-style-type: decimal !important;
}

.course-description-content :deep(ol li) {
  margin-bottom: 0.5em !important;
  padding-left: 0.5em !important;
  line-height: 1.8 !important;
  display: list-item !important;
  list-style-type: decimal !important;
  list-style-position: outside !important;
}

/* General li styling */
.course-description-content :deep(li) {
  margin-bottom: 0.5em;
  padding-left: 0.5em;
  line-height: 1.8;
  display: list-item !important;
}

.course-description-content :deep(ul ul),
.course-description-content :deep(ol ol),
.course-description-content :deep(ul ol),
.course-description-content :deep(ol ul) {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.course-description-content :deep(ul ul) {
  list-style-type: circle !important;
}

.course-description-content :deep(ul ul ul) {
  list-style-type: square !important;
}

/* Force ul to show bullets even if it's nested or has classes */
.course-description-content :deep(ul[class]),
.course-description-content :deep(ul[style]) {
  list-style-type: disc !important;
}

/* Prevent any CSS from converting ul to ol styling */
.course-description-content :deep(ul) {
  counter-reset: none !important;
}

.course-description-content :deep(ul li::before) {
  content: none !important;
}

/* If Quill accidentally created <ol> for bullet lists, convert styling */
.course-description-content :deep(ol:not([type]):not([start])) {
  list-style-type: disc !important;
  counter-reset: none !important;
}

.course-description-content :deep(ol:not([type]):not([start]) li) {
  list-style-type: disc !important;
  counter-increment: none !important;
}

.course-description-content :deep(ol:not([type]):not([start]) li::marker) {
  content: '• ' !important;
  color: #333 !important;
  font-weight: bold !important;
}

.course-description-content :deep(strong),
.course-description-content :deep(b) {
  font-weight: 600;
}

.course-description-content :deep(em),
.course-description-content :deep(i) {
  font-style: italic;
}

.course-description-content :deep(h1),
.course-description-content :deep(h2),
.course-description-content :deep(h3),
.course-description-content :deep(h4),
.course-description-content :deep(h5),
.course-description-content :deep(h6) {
  margin-top: 1.5em;
  margin-bottom: 0.75em;
  font-weight: 600;
  line-height: 1.4;
}

.course-description-content :deep(h1) {
  font-size: 1.75em;
}

.course-description-content :deep(h2) {
  font-size: 1.5em;
}

.course-description-content :deep(h3) {
  font-size: 1.25em;
}

.course-description-content :deep(a) {
  color: #317BC4;
  text-decoration: underline;
}

.course-description-content :deep(a:hover) {
  color: #155a8f;
}

.prose :deep(pre) {
  background-color: #f3f4f6;
  padding: 1em;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1em 0;
}

.prose :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.prose :deep(a) {
  color: #1a75bb;
  text-decoration: underline;
}

.prose :deep(a:hover) {
  color: #155a8f;
}

.prose :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1em 0;
}

.prose :deep(video) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1em 0;
}

.prose :deep(sub) {
  vertical-align: sub;
  font-size: 0.8em;
}

.prose :deep(sup) {
  vertical-align: super;
  font-size: 0.8em;
}
</style>
