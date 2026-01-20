<template>
  <div>
    <!-- Hero Section -->
    <div
      class="min-h-[300px] lg:h-[450px] bg-cover bg-center bg-no-repeat relative z-[0] after:absolute after:content-[''] after:top-0 after:left-0 after:w-full after:h-full after:opacity-60 after:bg-prim-100"
      :style="{ background: heroBackgroundStyle }"
    >
      <div
        class="absolute top-0 left-0 w-full h-full bg-[#1A75BBB2] opacity-80"
      ></div>
      <div
        class="container h-full mx-auto flex items-center py-8 lg:py-0 px-4 sm:px-6"
      >
        <div class="grid grid-cols-12 gap-4 sm:gap-8 w-full">
          <div
            class="col-span-12 xl:col-span-8 relative z-[1] flex flex-col h-full gap-4 sm:gap-6"
          >
            <div class="text-white max-lg:w-full w-[66%]">
              <!-- Breadcrumb -->
              <div class="mb-3 sm:mb-6">
                <NuxtLink
                  to="/"
                  class="m-0 hover:underline text-sm sm:text-base"
                >
                  Tất cả khóa học |
                </NuxtLink>
                <span class="m-0 text-sm sm:text-base">
                  {{ course?.title }}
                </span>
              </div>

              <!-- Title -->
              <div class="flex items-center gap-4">
                <h1
                  class="max-lg:text-[28px] text-4xl font-bold text-white mb-1"
                >
                  {{ course?.title }}
                </h1>
              </div>

              <!-- Short Description -->
              <div class="mt-3 sm:mt-4 max-lg:hidden">
                <div
                  class="mb-0 text-sm sm:text-base md:max-w-[90%] line-clamp-3 sm:line-clamp-none"
                  v-html="course?.shortDescription"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="bg-[#f4f7f9] max-lg:mt-[616px]">
      <div class="container mx-auto px-4 sm:px-6 relative">
        <div class="grid grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          <!-- Left Content -->
          <div
            class="col-span-12 lg:col-span-8 max-[639px]:mt-0 max-md:mt-[11rem] max-lg:mt-[12rem]"
          >
            <div>
              <!-- Video or Thumbnail -->
              <div class="py-4 sm:py-6 md:py-8">
                <div
                  class="p-2 sm:p-4 rounded-md overflow-hidden shadow-md relative"
                >
                  <!-- Loading indicator khi đang lấy video token -->
                  <div
                    v-if="introVideoTokenLoading"
                    class="absolute inset-0 flex items-center justify-center bg-gray-900 z-10 rounded-[8px] sm:rounded-[12px]"
                  >
                    <div class="flex flex-col items-center gap-3">
                      <div
                        class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
                      ></div>
                      <span class="text-white text-sm"
                        >Đang xác thực video...</span
                      >
                    </div>
                  </div>

                  <!-- Video Element với chặn tải xuống và context menu -->
                  <!-- Stream qua HLS (hls.js) để stream theo chunks - chống download tốt hơn -->
                  <!-- CHỈ render khi video ready và component đã mounted để tránh hydration mismatch -->
                  <video
                    v-if="
                      isMounted &&
                      currentVideoUrl &&
                      !introVideoTokenLoading &&
                      introVideoReady
                    "
                    ref="videoRef"
                    :poster="
                      (course as any)?.introVideoThumbnail || course?.thumbnail
                    "
                    class="w-full aspect-[16/9] object-cover rounded-[8px] sm:rounded-[12px] video-element"
                    preload="none"
                    playsinline
                    controlslist="nodownload noplaybackrate"
                    disablePictureInPicture
                    controls
                    @contextmenu.prevent
                    @dragstart.prevent
                    @selectstart.prevent
                    @copy.prevent
                  ></video>

                  <!-- Thumbnail với nút Play (nếu có video nhưng chưa click play) -->
                  <div
                    v-else-if="
                      course?.introVideo || (course as any)?.introVideoHlsUrl
                    "
                    class="relative w-full aspect-[16/9] rounded-[8px] sm:rounded-[12px] overflow-hidden cursor-pointer group"
                    @click="playIntroVideo"
                  >
                    <img
                      class="w-full h-full object-cover"
                      :src="
                        (course as any)?.introVideoThumbnail ||
                        course?.thumbnail ||
                        '/images/courses/python-course.jpg'
                      "
                      alt="Course thumbnail"
                    />
                    <!-- Play button overlay -->
                    <div
                      class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all"
                    >
                      <div
                        class="w-16 h-16 sm:w-20 sm:h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:bg-opacity-100 transition-all"
                      >
                        <svg
                          class="w-8 h-8 sm:w-10 sm:h-10 text-primary-100 ml-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <!-- Fallback: Demo video hoặc thumbnail nếu không có intro video -->
                  <img
                    v-else
                    class="w-full aspect-[16/9] object-cover rounded-[8px] sm:rounded-md"
                    :src="
                      course?.thumbnail || '/images/courses/python-course.jpg'
                    "
                    alt="Course thumbnail"
                  />
                </div>
              </div>

              <!-- Tabs -->
              <div class="card-container">
                <a-tabs
                  v-model:activeKey="activeTab"
                  type="line"
                  @change="handleTabChange"
                  class="course-detail-tabs"
                >
                  <!-- Tab 1: Tổng quan -->
                  <a-tab-pane key="1" tab="Tổng quan">
                    <div class="pb-4 pt-5">
                      <h4
                        class="text-xl sm:text-2xl font-bold text-[#1A75BB] mb-4"
                      >
                        {{ course?.title }}
                      </h4>
                      <div
                        class="border-t-[1px] border-solid border-gray-40 pt-3 sm:pt-4"
                      >
                        <div
                          class="course-description-content text-base"
                          v-html="normalizedDescription || course?.description"
                        />
                      </div>
                    </div>
                  </a-tab-pane>

                  <!-- Tab 2: Nội dung khóa học -->
                  <a-tab-pane key="2" tab="Nội dung khóa học">
                    <div class="py-4 sm:py-5">
                      <!-- Course Summary Section -->
                      <div
                        class="mb-4 sm:mb-6"
                        style="
                          background-color: #f3f9ff;
                          padding: 12px 16px;
                          border-radius: 8px;
                        "
                      >
                        <div
                          class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 md:gap-6 flex-wrap"
                        >
                          <span
                            class="text-base font-semibold"
                            style="color: #1a75bb"
                            >Khóa học bao gồm:</span
                          >
                          <div class="flex items-center gap-1 sm:gap-2">
                            <svg
                              class="w-3 h-3 sm:w-4 sm:h-4 shrink-0"
                              width="11"
                              height="10"
                              viewBox="0 0 11 10"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M4.39496 9.34998H1.69838C0.953739 9.34997 0.350093 8.84629 0.350098 8.22497L0.35015 1.47497C0.350155 0.853653 0.953801 0.349976 1.69844 0.349976H7.76587C8.51051 0.349976 9.11416 0.853657 9.11416 1.47498V4.56874M6.4176 7.75625L7.65352 8.7875L10.3501 6.5374M2.70981 2.59998H6.75467M2.70981 4.28749H6.75467M2.70981 5.97499H4.73224"
                                stroke="#1A75BB"
                                stroke-width="0.7"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>

                            <span class="text-sm text-[#1a75bb]"
                              >{{ course?.examCount || 0 }} bài trắc
                              nghiệm</span
                            >
                          </div>
                          <div class="flex items-center gap-1 sm:gap-2">
                            <svg
                              class="w-3 h-3 sm:w-4 sm:h-4 shrink-0"
                              width="10"
                              height="10"
                              viewBox="0 0 10 10"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M6.53728 5.2294L6.34622 4.93591L6.33668 4.94258L6.53728 5.2294ZM6.53728 4.58431L6.32975 4.86615L6.34536 4.87765L6.36215 4.88735L6.53728 4.58431ZM3.95193 2.68058L4.15946 2.39875L4.14958 2.39148L4.13922 2.38491L3.95193 2.68058ZM3.40993 2.96493L3.75998 2.96392L3.75985 2.95779L3.40993 2.96493ZM3.42077 6.70448L3.07077 6.7055L3.0708 6.7154L3.07139 6.72528L3.42077 6.70448ZM3.98264 7.01611L4.15212 7.32234L4.16819 7.31345L4.18324 7.30292L3.98264 7.01611ZM4.8501 9.34998V8.99998C2.55812 8.99998 0.700098 7.14196 0.700098 4.84998H0.350098H9.76622e-05C9.76622e-05 7.52856 2.17152 9.69998 4.8501 9.69998V9.34998ZM9.3501 4.84998H9.0001C9.0001 7.14196 7.14208 8.99998 4.8501 8.99998V9.34998V9.69998C7.52868 9.69998 9.7001 7.52856 9.7001 4.84998H9.3501ZM4.8501 0.349976V0.699976C7.14208 0.699976 9.0001 2.55799 9.0001 4.84998H9.3501H9.7001C9.7001 2.17139 7.52868 -2.44081e-05 4.8501 -2.44081e-05V0.349976ZM4.8501 0.349976V-2.44081e-05C2.17152 -2.44081e-05 9.76622e-05 2.17139 9.76622e-05 4.84998H0.350098H0.700098C0.700098 2.55799 2.55812 0.699976 4.8501 0.699976V0.349976ZM6.53728 5.2294L6.72823 5.52272C6.92214 5.39648 7.13519 5.19115 7.13479 4.89706C7.13438 4.59511 6.91141 4.39629 6.7124 4.28128L6.53728 4.58431L6.36215 4.88735C6.38987 4.90337 6.41009 4.91759 6.42433 4.9292C6.43864 4.94085 6.4453 4.94855 6.44741 4.95124C6.44939 4.95376 6.44606 4.95018 6.44221 4.94009C6.43814 4.92943 6.43481 4.91485 6.43479 4.89801C6.43477 4.88128 6.43801 4.86804 6.44104 4.85982C6.44386 4.85215 6.44566 4.85108 6.44179 4.85631C6.43784 4.86163 6.42925 4.87182 6.41321 4.88607C6.39726 4.90025 6.37542 4.91714 6.34633 4.93607L6.53728 5.2294ZM6.53728 4.58431L6.74481 4.30248L4.15946 2.39875L3.95193 2.68058L3.7444 2.96242L6.32975 4.86615L6.53728 4.58431ZM3.95193 2.68058L4.13922 2.38491C3.94056 2.25907 3.67447 2.19488 3.42965 2.30919C3.16549 2.43253 3.05446 2.70077 3.06 2.97207L3.40993 2.96493L3.75985 2.95779C3.75898 2.91487 3.76735 2.90309 3.76407 2.90937C3.76236 2.91265 3.75835 2.91898 3.75099 2.92611C3.74359 2.93327 3.73486 2.93922 3.7258 2.94346C3.70718 2.95215 3.69743 2.94921 3.70459 2.95022C3.70816 2.95072 3.71528 2.95218 3.72573 2.9562C3.73615 2.96021 3.74931 2.96655 3.76463 2.97625L3.95193 2.68058ZM3.40993 2.96493L3.05993 2.96595L3.07077 6.7055L3.42077 6.70448L3.77077 6.70347L3.75992 2.96392L3.40993 2.96493ZM3.42077 6.70448L3.07139 6.72528C3.08542 6.96098 3.16569 7.24127 3.42503 7.37978C3.68076 7.51636 3.95544 7.43119 4.15212 7.32234L3.98264 7.01611L3.81317 6.70988C3.78654 6.72462 3.76463 6.73438 3.74745 6.74064C3.73021 6.74692 3.71942 6.74906 3.71458 6.74973C3.70989 6.75038 3.71246 6.74943 3.7206 6.75063C3.72923 6.75189 3.74147 6.75521 3.7548 6.76233C3.76819 6.76948 3.77816 6.77805 3.78459 6.78523C3.79068 6.79202 3.79169 6.79539 3.78993 6.79166C3.7881 6.78774 3.78401 6.77765 3.7799 6.75924C3.7758 6.74088 3.77207 6.71603 3.77015 6.68368L3.42077 6.70448ZM3.98264 7.01611L4.18324 7.30292L6.73787 5.51621L6.53728 5.2294L6.33668 4.94258L3.78204 6.7293L3.98264 7.01611Z"
                                fill="#1A75BB"
                              />
                            </svg>

                            <span class="text-sm text-[#1a75bb]"
                              >{{ course?.videoCount || 0 }} video</span
                            >
                          </div>
                          <div class="flex items-center gap-1 sm:gap-2">
                            <svg
                              class="w-3 h-3 sm:w-4 sm:h-4 shrink-0"
                              width="11"
                              height="10"
                              viewBox="0 0 11 10"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9.29747 3.94998V1.54998H5.08694L4.03431 0.349976H0.350098V9.34998H1.92905V8.74998L3.50799 3.94998H10.3501L8.77115 9.34998H1.40273"
                                stroke="#1A75BB"
                                stroke-width="0.7"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>

                            <span class="text-sm text-[#1a75bb]"
                              >{{ course?.documentCount || 0 }} Tài liệu</span
                            >
                          </div>
                        </div>
                      </div>

                      <!-- Main Content -->
                      <div
                        v-if="course?.chapters && course.chapters.length > 0"
                      >
                        <h3
                          class="text-xl sm:text-2xl font-bold text-[#1A75BB] mb-1 uppercase"
                        >
                          NỘI DUNG CHÍNH
                        </h3>

                        <div class="space-y-0">
                          <div
                            v-for="(chapter, chapterIndex) in course.chapters"
                            :key="`chapter-${chapterIndex}`"
                            class="border-b border-gray-200"
                          >
                            <!-- Chapter Header -->
                            <div
                              class="flex items-center justify-between py-4 sm:py-5 cursor-pointer hover:bg-gray-50 transition-colors"
                              @click="toggleChapter(chapterIndex)"
                            >
                              <div
                                class="flex items-center gap-2 sm:gap-3 flex-1 min-w-0"
                              >
                                <span
                                  class="text-base font-semibold truncate"
                                  :style="{
                                    color: expandedChapters[chapterIndex]
                                      ? '#1A75BB'
                                      : '#393939',
                                  }"
                                >
                                  Phần {{ chapterIndex + 1 }}:
                                  {{ chapter.title }}
                                </span>
                              </div>
                              <!-- Plus/Minus Icon -->
                              <!-- Minus Icon (expanded) -->
                              <svg
                                v-if="expandedChapters[chapterIndex]"
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                class="flex-shrink-0"
                              >
                                <path
                                  d="M4 8H12"
                                  stroke="#1A75BB"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                />
                              </svg>
                              <!-- Plus Icon (collapsed) -->
                              <svg
                                v-else
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                class="flex-shrink-0"
                              >
                                <path
                                  d="M8 4V12M4 8H12"
                                  stroke="#393939"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                />
                              </svg>
                            </div>

                            <!-- Chapter Lessons (chỉ hiển thị khi expanded) -->
                            <div
                              v-show="expandedChapters[chapterIndex]"
                              class="pl-4 sm:pl-6 md:pl-8 pb-3 sm:pb-4 space-y-1 sm:space-y-2"
                            >
                              <div
                                v-for="(lesson, lessonIndex) in chapter.lessons"
                                :key="`lesson-${chapterIndex}-${lessonIndex}`"
                                class="flex items-center justify-between py-2 gap-2 cursor-pointer hover:bg-gray-50 rounded transition-colors"
                                @click="
                                  handleLessonNavigate(
                                    chapterIndex,
                                    lessonIndex,
                                    lesson,
                                  )
                                "
                              >
                                <div
                                  class="flex items-center gap-2 sm:gap-3 flex-1 min-w-0"
                                >
                                  <!-- Lesson Icon -->
                                  <div class="flex-shrink-0">
                                    <img
                                      v-if="lesson.type === 'video'"
                                      src="/images/svg/video-icon.svg"
                                      alt="video"
                                      class="w-3 h-3 sm:w-4 sm:h-4"
                                    />
                                    <img
                                      v-else-if="lesson.type === 'document'"
                                      src="/images/svg/folder.svg"
                                      alt="document"
                                      class="w-3 h-3 sm:w-4 sm:h-4"
                                    />
                                    <img
                                      v-else
                                      src="/images/svg/folder.svg"
                                      alt="quiz"
                                      class="w-3 h-3 sm:w-4 sm:h-4"
                                    />
                                  </div>

                                  <!-- Lesson Title (chỉ hiển thị tên, không đánh số) -->
                                  <span
                                    class="text-sm font-normal truncate"
                                    style="color: #393939"
                                  >
                                    {{ lesson.title }}
                                  </span>
                                </div>

                                <!-- Action Buttons -->
                                <div
                                  class="flex items-center gap-1 sm:gap-2 flex-shrink-0"
                                >
                                  <!-- Học thử Button (for preview lessons) -->
                                  <button
                                    v-if="lesson.isPreview && !lesson.isLocked"
                                    class="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded border transition-colors whitespace-nowrap"
                                    style="
                                      color: #1a75bb;
                                      border-color: #1a75bb;
                                      background-color: transparent;
                                    "
                                    @click.stop="
                                      handleLessonNavigate(
                                        chapterIndex,
                                        lessonIndex,
                                        lesson,
                                      )
                                    "
                                  >
                                    Học thử
                                  </button>

                                  <!-- Lock Icon (for locked lessons - only show if course not purchased) -->
                                  <img
                                    v-if="
                                      lesson.isLocked && !course?.isPurchased
                                    "
                                    src="/images/svg/lock.svg"
                                    alt="locked"
                                    class="w-3 h-3 sm:w-4 sm:h-4"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <a-empty
                        v-else
                        description="Chưa có nội dung khóa học chi tiết"
                        class="mt-6"
                      />
                    </div>
                  </a-tab-pane>

                  <!-- Tab 3: Giảng viên -->
                  <a-tab-pane key="3" tab="Giảng viên">
                    <div class="py-5">
                      <div class="bg-white rounded-lg shadow-sm p-2 md:p-6">
                        <div
                          class="flex flex-col md:flex-row gap-8 items-start"
                        >
                          <!-- Instructor Avatar -->
                          <div class="flex-shrink-0 w-full md:w-auto">
                            <div class="w-48 h-48 mx-auto md:mx-0">
                              <img
                                class="w-full h-full object-cover rounded-full border-4 border-prim-100 shadow-lg"
                                :src="
                                  course?.instructor?.avatar ||
                                  '/images/avatar-demo.png'
                                "
                                alt="Giảng viên"
                              />
                            </div>
                          </div>

                          <!-- Instructor Info -->
                          <div class="flex-1">
                            <h2
                              class="text-2xl font-bold text-[#1A75BB] mb-2 text-center md:text-left"
                            >
                              {{ course?.instructor?.name || "Chưa cập nhật" }}
                            </h2>

                            <div class="mb-6">
                              <p
                                class="text-[#1A75BB] text-lg leading-relaxed font-semibold text-center md:text-left"
                              >
                                {{
                                  course?.instructor?.specialization ||
                                  "Thông tin chuyên môn đang được cập nhật..."
                                }}
                              </p>
                            </div>

                            <div
                              class="mb-6 text-gray-600 text-base leading-relaxed course-description-content"
                            >
                              <span
                                v-html="
                                  course?.instructor?.bio ||
                                  'Thông tin tiểu sử đang được cập nhật...'
                                "
                              ></span>
                            </div>

                            <div
                              v-if="(course?.instructor as any)?.skills"
                              class="mb-6"
                            >
                              <h3
                                class="text-xl font-semibold text-gray-800 mb-3"
                              >
                                Kỹ năng chuyên môn
                              </h3>
                              <div class="flex flex-wrap gap-2">
                                <span
                                  v-for="skill in (
                                    (course?.instructor as any)?.skills || ''
                                  )
                                    .split(',')
                                    .map((s: string) => s.trim())"
                                  :key="skill"
                                  class="px-3 py-1 bg-prim-100 text-white rounded-full text-sm font-medium"
                                >
                                  {{ skill }}
                                </span>
                              </div>
                            </div>

                            <!-- Social Media Links -->
                            <div v-if="socialMediaArray.length" class="mt-8">
                              <h3
                                class="text-xl font-semibold text-gray-800 mb-4"
                              >
                                Liên hệ
                              </h3>
                              <div class="flex gap-4">
                                <a
                                  v-for="(social, index) in socialMediaArray"
                                  :key="`social_${index}`"
                                  :href="social.link"
                                  target="_blank"
                                  class="w-12 h-12 bg-gray-100 hover:bg-prim-100 rounded-full flex items-center justify-center transition-colors group"
                                >
                                  <img
                                    v-if="social.icon"
                                    class="w-6 h-6 object-contain group-hover:brightness-0 group-hover:invert"
                                    :src="social.icon"
                                    :alt="social.icon"
                                  />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a-tab-pane>

                  <!-- Tab 4: Đánh giá -->
                  <a-tab-pane key="4" tab="Đánh giá">
                    <div v-if="!loadingReview" class="py-5">
                      <!-- Reviews Summary -->
                      <div v-if="reviews?.length" class="mb-8">
                        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                          <h3 class="text-2xl font-bold text-[#1A75BB] mb-4">
                            Đánh giá tổng quan
                          </h3>
                          <div class="flex items-center gap-6">
                            <div class="text-center">
                              <div
                                class="text-4xl font-bold text-[#1A75BB] mb-1"
                              >
                                {{ calculatedRating.average.toFixed(1) }}
                              </div>
                              <a-rate
                                :value="calculatedRating.average"
                                :count="5"
                                disabled
                                style="font-size: 20px"
                              />
                              <p class="text-sm text-gray-600 mt-1">
                                {{ calculatedRating.count }} đánh giá
                              </p>
                            </div>
                            <div class="flex-1">
                              <div
                                v-for="i in 5"
                                :key="i"
                                class="flex items-center gap-2 mb-1"
                              >
                                <span class="text-sm text-gray-600 w-8"
                                  >{{ 6 - i }}★</span
                                >
                                <div
                                  class="flex-1 bg-gray-200 rounded-full h-2"
                                >
                                  <div
                                    class="bg-[#1A75BB] h-2 rounded-full transition-all duration-300"
                                    :style="{
                                      width:
                                        calculatedRating.count > 0
                                          ? `${(calculatedRating.breakdown[(6 - i) as keyof typeof calculatedRating.breakdown] / calculatedRating.count) * 100}%`
                                          : '0%',
                                    }"
                                  ></div>
                                </div>
                                <span class="text-sm text-gray-600 w-8">
                                  {{
                                    calculatedRating.breakdown[
                                      (6 -
                                        i) as keyof typeof calculatedRating.breakdown
                                    ]
                                  }}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Individual Reviews -->
                        <div class="space-y-6">
                          <h3 class="text-2xl font-bold text-[#1A75BB] mb-4">
                            Đánh giá chi tiết
                          </h3>
                          <div
                            v-for="(review, index) in reviews"
                            :key="`review_${index}`"
                            class="bg-white rounded-lg shadow-sm p-2 md:p-6"
                          >
                            <div class="flex gap-4">
                              <div class="flex-shrink-0">
                                <img
                                  class="w-16 h-16 object-cover rounded-full"
                                  :src="
                                    review.userAvatar ||
                                    '/images/avatar-demo.png'
                                  "
                                  :alt="review.userName"
                                />
                              </div>
                              <div class="flex-1">
                                <div class="flex items-center gap-2 mb-2">
                                  <h4
                                    class="text-lg font-semibold text-[#1A75BB]"
                                  >
                                    {{ review.userName }}
                                  </h4>
                                  <span
                                    v-if="review.isVerified"
                                    class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium"
                                  >
                                    Đã xác thực
                                  </span>
                                </div>
                                <div class="flex items-center gap-2 mb-3">
                                  <!-- Star Rating Display -->
                                  <div
                                    class="flex items-center gap-1 review-stars"
                                  >
                                    <span
                                      v-for="star in 5"
                                      :key="star"
                                      class="star-icon"
                                      :class="{
                                        'star-filled':
                                          star <= Number(review.rating || 0),
                                        'star-empty':
                                          star > Number(review.rating || 0),
                                      }"
                                    >
                                      ★
                                    </span>
                                  </div>
                                  <span class="text-sm text-gray-500 ml-2">
                                    {{
                                      new Date(
                                        review.reviewDate || review.createdAt,
                                      ).toLocaleDateString("vi-VN")
                                    }}
                                  </span>
                                </div>
                                <p class="text-gray-700 leading-relaxed">
                                  {{ review.content }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <a-empty
                        v-else
                        description="Chưa có đánh giá nào cho khóa học này"
                      />
                    </div>
                    <div
                      v-else
                      class="flex items-center justify-center h-full min-h-[350px]"
                    >
                      <a-spin size="large" />
                    </div>
                  </a-tab-pane>
                </a-tabs>
              </div>
            </div>
          </div>

          <!-- Right Sidebar -->
          <div
            class="col-span-12 lg:col-span-4 max-lg:absolute max-lg:-top-[49rem] max-lg:w-[calc(100%-48px)] max-[639px]:w-[calc(100%-32px)]"
          >
            <div
              class="bg-white rounded-md px-3 sm:px-4 pt-3 pb-5 z-[2] shadow-xl mt-4 lg:-mt-[100%] lg:sticky lg:top-[90px]"
            >
              <div class="pb-3 sm:pb-4 rounded-md overflow-hidden">
                <div class="course-thumbnail-16x9">
                  <img
                    class="w-full h-full object-cover"
                    :src="course?.thumbnail || '/images/courses/python-course.jpg'"
                    alt="/"
                  />
                </div>
              </div>
              <!-- Pricing and Action Section -->
              <div class="mb-4">
                <!-- Purchased Badge -->
                <div v-if="course?.isPurchased" class="mb-3 sm:mb-4">
                  <div
                    class="flex items-center justify-center gap-2 px-3 py-2 rounded-lg"
                    style="background-color: #e6f7ff; border: 1px solid #1a75bb"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#1a75bb"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span
                      class="text-sm sm:text-base font-semibold"
                      style="color: #1a75bb"
                      >Đã mua khóa học này</span
                    >
                  </div>
                </div>

                <!-- Offer Timer (only show if not purchased and promotion is active) -->
                <div
                  v-if="!course?.isPurchased && promotionDaysRemaining !== null && promotionDaysRemaining > 0"
                  class="flex items-center gap-2 mb-2 sm:mb-3"
                >
                  <img
                    src="/images/svg/clock-pink.svg"
                    alt="clock"
                    class="w-3 h-3 sm:w-4 sm:h-4"
                  />
                  <span class="text-sm" style="color: #f48283"
                    >Ưu đãi còn {{ promotionDaysRemaining }} ngày</span
                  >
                </div>

                <!-- Price (only show if not purchased) -->
                <div
                  v-if="!course?.isPurchased"
                  class="flex items-end gap-2 sm:gap-3 mb-3 sm:mb-4"
                >
                  <!-- Hiển thị giá khuyến mãi nếu đang trong thời gian khuyến mãi -->
                  <h3
                    v-if="((course as any)?.isPromotionActive || (promotionDaysRemaining !== null && promotionDaysRemaining > 0)) && course?.originalPrice && Number(course.originalPrice) > Number(course.price || 0)"
                    class="text-2xl sm:text-3xl md:text-4xl font-bold mb-0"
                    style="color: #2176ff"
                  >
                    {{ Number(course.price || 0).toLocaleString("vi-VN") }}₫
                  </h3>
                  <!-- Hiển thị giá gốc nếu không có khuyến mãi -->
                  <h3
                    v-else-if="course?.price || course?.originalPrice"
                    class="text-2xl sm:text-3xl md:text-4xl font-bold mb-0"
                    style="color: #2176ff"
                  >
                    {{ Number(course.originalPrice || course.price || 0).toLocaleString("vi-VN") }}₫
                  </h3>
                  <h3
                    v-else
                    class="text-2xl sm:text-3xl md:text-4xl font-bold mb-0"
                    style="color: #15cf74"
                  >
                    Miễn phí
                  </h3>
                  <!-- Hiển thị giá gốc bị gạch khi có khuyến mãi -->
                  <h4
                    v-if="((course as any)?.isPromotionActive || (promotionDaysRemaining !== null && promotionDaysRemaining > 0)) && course?.originalPrice && Number(course.originalPrice) > Number(course.price || 0)"
                    class="text-lg sm:text-xl md:text-2xl italic mb-0 line-through"
                    style="color: #999999"
                  >
                    {{ Number(course.originalPrice).toLocaleString("vi-VN") }}₫
                  </h4>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col gap-2 sm:gap-3">
                  <!-- Đã mua và có chứng chỉ: hiển thị 2 nút "Đã hoàn thành" và "Review" -->
                  <template v-if="course?.isPurchased && hasCertificate">
                    <!-- Nút Đã hoàn thành (đi tới trang chứng chỉ) -->
                    <a-button
                      class="!w-full !py-2 sm:!py-3 !h-[44px] sm:!h-[50px] !text-white !border-none !font-bold !text-sm sm:!text-base !rounded-lg !transition-all !duration-200 hover:!opacity-90"
                      style="
                        background: linear-gradient(
                          88.69deg,
                          #ffbe6a -1.04%,
                          #ebbc46 23.61%,
                          #ffda7d 55.57%,
                          #ebbc46 74.44%,
                          #ffbe6a 97.91%
                        ) !important;
                      "
                      @click="goToCertificate"
                    >
                      Đã hoàn thành
                    </a-button>

                    <!-- Nút Review (đi tới trang học tập mode review) -->
                    <a-button
                      class="!w-full !py-2 sm:!py-3 !h-[44px] sm:!h-[50px] !text-white !border-none !font-bold !text-sm sm:!text-base !rounded-lg !transition-all !duration-200 hover:!opacity-90"
                      style="background-color: #317bc4 !important"
                      @click="goToReview"
                    >
                      Review
                    </a-button>
                  </template>

                  <!-- Đã hoàn thành nhưng chưa có chứng chỉ (tiến trình 100%) -->
                  <a-button
                    v-else-if="course?.progress?.isCompleted"
                    class="!w-full !py-2 sm:!py-3 !h-[44px] sm:!h-[50px] !text-white !border-none !font-bold !text-sm sm:!text-base !rounded-lg !transition-all !duration-200 hover:!opacity-90"
                    style="
                      background: linear-gradient(
                        88.69deg,
                        #ffbe6a -1.04%,
                        #ebbc46 23.61%,
                        #ffda7d 55.57%,
                        #ebbc46 74.44%,
                        #ffbe6a 97.91%
                      ) !important;
                    "
                    @click="goToCertificate"
                  >
                    Đã hoàn thành
                  </a-button>

                  <!-- Học ngay (đã mua nhưng chưa hoàn thành) -->
                  <a-button
                    v-else-if="course?.isPurchased"
                    class="!w-full !py-2 sm:!py-3 !h-[44px] sm:!h-[50px] !text-white !border-none !font-bold !text-sm sm:!text-base !rounded-lg !transition-all !duration-200 hover:!opacity-90"
                    style="background-color: #15cf74 !important"
                    @click="goToLearning"
                  >
                    Học ngay
                  </a-button>

                  <!-- Mua ngay (chưa mua) -->
                  <a-button
                    v-else
                    class="!w-full !py-2 sm:!py-3 !h-[44px] sm:!h-[50px] !text-white !border-none !font-bold !text-sm sm:!text-base !rounded-lg !transition-all !duration-200 hover:!opacity-90"
                    style="background-color: #1a75bb !important"
                    @click="redirectCheckout"
                  >
                    Mua ngay
                  </a-button>

                  <!-- Thêm vào giỏ hàng Button (only show if not purchased) -->
                  <a-button
                    v-if="!course?.isPurchased"
                    class="!w-full !py-2 sm:!py-3 !h-[44px] sm:!h-[50px] !text-white !border-none !font-bold !text-sm sm:!text-base !rounded-lg !transition-all !duration-200 hover:!opacity-90"
                    style="background-color: #f48283 !important"
                    @click="toggleCourse"
                  >
                    {{ isInCart ? "Xóa khỏi giỏ hàng" : "Thêm vào giỏ hàng" }}
                  </a-button>
                </div>
              </div>

              <!-- Course Details -->
              <div class="mt-3 sm:mt-4">
                <ul class="mb-0">
                  <li
                    class="flex justify-between items-center border-b-[1px] border-solid border-gray-40 py-2 sm:py-3"
                  >
                    <span
                      class="font-semibold text-[#1A75BB] text-sm sm:text-base"
                      >Bài giảng:</span
                    >
                    <span
                      class="px-2 py-1 text-[10px] sm:text-xs rounded"
                      style="background-color: #f5f5f5; color: #999999"
                      >{{ course?.progress?.totalLessons || 0 }} Bài</span
                    >
                  </li>
                  <li
                    class="flex justify-between items-center border-b-[1px] border-solid border-gray-40 py-2 sm:py-3"
                  >
                    <span
                      class="font-semibold text-[#1A75BB] text-sm sm:text-base"
                      >Trắc nghiệm:</span
                    >
                    <span
                      class="px-2 py-1 text-[10px] sm:text-xs rounded"
                      style="background-color: #f5f5f5; color: #999999"
                      >{{ course?.examCount || 0 }}</span
                    >
                  </li>
                  <li
                    class="flex justify-between items-center border-b-[1px] border-solid border-gray-40 py-2 sm:py-3"
                  >
                    <span
                      class="font-semibold text-[#1A75BB] text-sm sm:text-base"
                      >Trình độ:</span
                    >
                    <span
                      class="px-2 py-1 text-[10px] sm:text-xs rounded"
                      style="background-color: #f5f5f5; color: #999999"
                      >{{ mapDifficulty(course?.level) }}</span
                    >
                  </li>
                  <li
                    class="flex justify-between items-center border-b-[1px] border-solid border-gray-40 py-2 sm:py-3"
                  >
                    <span
                      class="font-semibold text-[#1A75BB] text-sm sm:text-base"
                      >Ngôn ngữ:</span
                    >
                    <span
                      class="px-2 py-1 text-[10px] sm:text-xs rounded"
                      style="background-color: #f5f5f5; color: #999999"
                      >Tiếng Việt</span
                    >
                  </li>
                  <li
                    class="flex justify-between items-center border-b-[1px] border-solid border-gray-40 py-2 sm:py-3"
                  >
                    <span
                      class="font-semibold text-[#1A75BB] text-sm sm:text-base"
                      >Chứng nhận:</span
                    >
                    <span
                      class="px-2 py-1 text-[10px] sm:text-xs rounded"
                      style="background-color: #f5f5f5; color: #999999"
                      >Có</span
                    >
                  </li>
                </ul>
              </div>

              <!-- Social Media and Contact Section -->
              <div class="text-center mt-4 sm:mt-6">
                <h4
                  class="text-[#1A75BB] font-semibold mb-2 sm:mb-3 text-sm sm:text-base"
                >
                  Tìm hiểu thêm thông tin về khóa học
                </h4>
                <div class="mb-3 sm:mb-4">
                  <ul
                    class="mb-0 flex items-center justify-center gap-2 sm:gap-3"
                  >
                    <li>
                      <a
                        href="https://www.facebook.com/chamsocmevabe.vanphuc"
                        target="_blank"
                        class="block"
                      >
                        <img
                          src="/images/svg/fb-gray.svg"
                          alt="Facebook"
                          class="w-9 h-9 sm:w-11 sm:h-11"
                        />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.tiktok.com/@methuylamy"
                        target="_blank"
                        class="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 bg-[#ECECEC] rounded-full"
                      >
                        <img
                          src="/images/svg/tiktok-gray.svg"
                          alt="TikTok"
                          class=""
                        />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.youtube.com/@vanphuccare.tresosinh/videos"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="block"
                      >
                        <img
                          src="/images/svg/youtube-gray.svg"
                          alt="YouTube"
                          class="w-9 h-9 sm:w-11 sm:h-11"
                        />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://vanphuccare.vn"
                        target="_blank"
                        class="block"
                      >
                        <img
                          src="/images/svg/link-gray.svg"
                          alt="Link"
                          class="w-9 h-9 sm:w-11 sm:h-11"
                        />
                      </a>
                    </li>
                  </ul>
                </div>

                <h4
                  class="text-gray-700 font-semibold mb-2 sm:mb-3 text-sm sm:text-base"
                >
                  Chi tiết xin liên hệ
                </h4>

                <!-- HOTLINE TƯ VẤN Button -->
                <a
                  href="tel:0376246673"
                  class="!w-full !h-[40px] sm:!h-[45px] !rounded-full !mb-2 sm:!mb-3 !border !font-bold !text-xs sm:!text-base flex items-center justify-center"
                  style="
                    background-color: white !important;
                    border-color: #1a75bb !important;
                    color: #1a75bb !important;
                    text-decoration: none;
                  "
                >
                  <div class="flex items-center justify-center gap-2">
                    <img
                      src="/images/svg/telephone.svg"
                      alt="phone"
                      class="w-4 h-4 sm:w-5 sm:h-5"
                    />
                    <span class="text-xs sm:text-base">HOTLINE TƯ VẤN</span>
                  </div>
                </a>

                <!-- CHAT ZALO Button -->
                <a
                  href="https://zalo.me/1165841515663780416"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="!w-full !h-[45px] sm:!h-[50px] !rounded-full !border-none !font-bold !text-xs sm:!text-base !text-white !flex !flex-col !items-center !justify-center !gap-1"
                  style="
                    background-color: #2176ff !important;
                    text-decoration: none;
                  "
                >
                  <div class="flex items-center justify-center gap-2">
                    <img
                      src="/images/svg/zalo.svg"
                      alt="Zalo"
                      class="w-5 h-5 sm:w-6 sm:h-6"
                    />
                    <div class="flex flex-col items-start">
                      <span class="text-xs sm:text-base">CHAT ZALO</span>
                      <span class="text-[10px] sm:text-xs font-normal"
                        >Hỗ trợ tư vấn ngay</span
                      >
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Recommended Courses -->
        <div class="mt-10 py-10 border-t-[1px] border-solid border-gray-80">
          <h2 class="text-3xl text-[#317BC4] font-bold">Khóa học liên quan</h2>
          <RecomentCourse class="mt-6" />
        </div>
      </div>
    </div>

    <!-- Cart Toast -->
    <CartToast />

    <!-- Purchase Modal -->
    <a-modal
      v-model:open="showPurchaseModal"
      :width="480"
      :footer="null"
      :closable="true"
      :maskClosable="true"
      centered
      class="purchase-modal"
      :body-style="{
        padding: 0,
        borderRadius: '12px',
        background: 'transparent',
        boxShadow: 'none',
      }"
      :wrap-style="{ borderRadius: '12px' }"
    >
      <div class="purchase-modal-content">
        <!-- Text Container: padding 28px 40px, gap 16px, width 480px, height 248px -->
        <div class="purchase-modal-text-container">
          <!-- Frame: width 400px, height 192px, gap 18px -->
          <div class="purchase-modal-frame">
            <!-- Title Section: width 400px, height 70px -->
            <div class="purchase-modal-title-section">
              <!-- Image: 70x70, margin 0 auto -->
              <img
                src="/images/storytelling.png"
                alt="Storytelling"
                class="purchase-modal-image"
              />
            </div>

            <!-- Text Content: width 400px, height 104px, gap 8px -->
            <div class="purchase-modal-text-content">
              <!-- Title: width 206px, height 24px, font-size 20px, font-weight 700, color #232325 -->
              <h3 class="purchase-modal-title">Bạn đang học rất tốt!</h3>

              <!-- Description: width 400px, height 72px, font-size 16px, font-weight 500, color #6F727A, text-align center -->
              <p class="purchase-modal-description">
                Bạn đã hoàn thành hết nội dung học thử. Đừng để kiến thức bị
                ngắt quãng, hãy mở khóa toàn bộ khóa học để tiếp tục bạn nhé!
              </p>
            </div>
          </div>
        </div>

        <!-- CTA Section: padding 8px 40px 24px, width 480px, height 80px -->
        <div class="purchase-modal-cta-section">
          <!-- Button: width 400px, height 48px, padding 12px, gap 10px, background #317BC4 -->
          <a-button
            type="primary"
            size="large"
            class="purchase-modal-button"
            @click="handlePurchaseFromModal"
          >
            Mua khóa học ngay
          </a-button>
        </div>
      </div>
    </a-modal>

    <!-- Login Modal -->
    <a-modal
      v-model:open="showLoginModal"
      :width="480"
      :footer="null"
      :closable="true"
      :maskClosable="true"
      centered
      class="login-modal"
      :body-style="{
        padding: 0,
        borderRadius: '12px',
        background: 'transparent',
        boxShadow: 'none',
      }"
      :wrap-style="{ borderRadius: '12px' }"
    >
      <div class="login-modal-content">
        <!-- Text Container: padding 28px 40px, gap 16px, width 480px, height 248px -->
        <div class="login-modal-text-container">
          <!-- Frame: width 400px, height 192px, gap 18px -->
          <div class="login-modal-frame">
            <!-- Title Section: width 400px, height 70px -->
            <div class="login-modal-title-section">
              <!-- Image: 70x70, margin 0 auto -->
              <img
                src="/images/padlock.png"
                alt="Padlock"
                class="login-modal-image"
              />
            </div>

            <!-- Text Content: width 400px, height 104px, gap 8px -->
            <div class="login-modal-text-content">
              <!-- Title: width 206px, height 24px, font-size 20px, font-weight 700, color #232325 -->
              <h3 class="login-modal-title">Mở khóa bài học thử miễn phí!</h3>

              <!-- Description: width 400px, height 72px, font-size 16px, font-weight 500, color #6F727A, text-align center -->
              <p class="login-modal-description">
                Hãy đăng nhập để truy cập video và tài liệu học tập ngay lập
                tức.
              </p>
            </div>
          </div>
        </div>

        <!-- CTA Section: padding 8px 40px 24px, width 480px, height 80px -->
        <div class="login-modal-cta-section">
          <!-- Button: width 400px, height 48px, padding 12px, gap 10px, background #317BC4 -->
          <a-button
            type="primary"
            size="large"
            class="login-modal-button"
            @click="handleLoginFromModal"
          >
            Đăng nhập ngay
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCoursesStore } from "~/stores/courses";
import { useCartStore } from "~/stores/cart";
import { useAuthStore } from "~/stores/auth";
import { message } from "ant-design-vue";
import ContentCourse from "~/components/courses/ContentCourse.vue";
import RecomentCourse from "~/components/courses/RecomentCourse.vue";
import CartToast from "~/components/cart/Toast.vue";
import type { AddToCartData } from "~/types/cart";
import { useApiBase } from "~/composables/useApiBase";
// @ts-ignore - hls.js types
import Hls from "hls.js";

const route = useRoute();
const router = useRouter();
const coursesStore = useCoursesStore();
const cartStore = useCartStore();
const authStore = useAuthStore();
const { apiUser } = useApiBase();

const activeTab = ref("1");
const loadingReview = ref(false);
const socialMediaArray = ref<Array<{ icon: string; link: string }>>([]);
const showPurchaseModal = ref(false);
const showLoginModal = ref(false);

// Watch query parameter để tự động hiện popup
watch(
  () => route.query.showPurchaseModal,
  (value) => {
    if (value === "true") {
      showPurchaseModal.value = true;
      // Xóa query parameter sau khi hiện popup
      router.replace({
        query: { ...route.query, showPurchaseModal: undefined },
      });
    }
  },
  { immediate: true },
);

// Expanded chapters state
const expandedChapters = ref<Record<number, boolean>>({}); // Ban đầu collapse hết
const videoRef = ref<any>(null);
const course = computed(() => coursesStore.course);

// Calculate promotion days remaining
const promotionDaysRemaining = computed(() => {
  if (!course.value) return null;
  
  // Use promotionDaysRemaining from backend if available
  if ((course.value as any).promotionDaysRemaining !== undefined) {
    return (course.value as any).promotionDaysRemaining;
  }
  
  // Fallback: calculate from promotionEndDate
  const promotionEndDate = (course.value as any).promotionEndDate;
  if (!promotionEndDate) return null;
  
  const endDate = new Date(promotionEndDate);
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Only return positive days (promotion is still active)
  if (daysRemaining > 0) {
    return daysRemaining;
  }
  
  return null;
});

// Normalize description HTML to ensure ul displays as bullets
// Convert <ol> without type/start attributes to <ul> (likely bullet lists created incorrectly)
const normalizedDescription = computed(() => {
  if (!course.value?.description) return "";

  let html = course.value.description;

  // If running on client side, use DOM parser for more accurate conversion
  if (process.client && typeof DOMParser !== "undefined") {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Find all <ol> elements without type or start attributes
      const olElements = doc.querySelectorAll("ol:not([type]):not([start])");
      olElements.forEach((ol) => {
        const ul = doc.createElement("ul");
        // Copy all attributes except type and start
        Array.from(ol.attributes).forEach((attr) => {
          if (attr.name !== "type" && attr.name !== "start") {
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
      html = html.replace(/<ol(?![^>]*\s(type|start)=[^>]*)>/gi, "<ul>");
      html = html.replace(/<\/ol>/gi, "</ul>");
    }
  } else {
    // Server-side or fallback: use regex
    // Convert <ol> without type/start to <ul> - these are likely bullet lists created incorrectly
    html = html.replace(/<ol(?![^>]*\s(type|start)=[^>]*)>/gi, "<ul>");
    html = html.replace(/<\/ol>/gi, "</ul>");
  }

  return html;
});

// Computed property cho hero background style - giải quyết vấn đề SSR/CSR hydration
// Wrap URL trong quotes để handle special characters như () và spaces
const heroBackgroundStyle = computed(() => {
  const bannerUrl = course.value?.banner;
  const thumbnailUrl = course.value?.thumbnail;

  // Escape quotes trong URL nếu có
  const escapeUrl = (url: string) => url.replace(/"/g, "%22");

  if (bannerUrl) {
    return `url("${escapeUrl(bannerUrl)}") center center/cover no-repeat`;
  }
  if (thumbnailUrl) {
    return `url("${escapeUrl(thumbnailUrl)}") center center/cover no-repeat`;
  }
  return "#0e1d29db";
});

// SEO Configuration
useHead({
  title: computed(
    () =>
      `${course.value?.title || "Chi tiết khóa học"} - Van Phuc Care E-Learning`,
  ),
  meta: [
    {
      name: "description",
      content: computed(
        () =>
          course.value?.shortDescription ||
          "Khám phá khóa học tại Van Phuc Care E-Learning",
      ),
    },
    {
      name: "keywords",
      content: computed(() => {
        if (!course.value)
          return "khóa học trực tuyến, e-learning, Van Phuc Care";
        const tags = course.value.tags?.join(", ") || "";
        const category = course.value.category || "";
        return `${course.value.title}, ${category}, ${tags}, khóa học trực tuyến, e-learning, Van Phuc Care`;
      }),
    },
    {
      property: "og:title",
      content: computed(
        () =>
          `${
            course.value?.title || "Chi tiết khóa học"
          } - Van Phuc Care E-Learning`,
      ),
    },
    {
      property: "og:description",
      content: computed(
        () =>
          course.value?.shortDescription ||
          "Khám phá khóa học tại Van Phuc Care E-Learning",
      ),
    },
    {
      property: "og:type",
      content: "article",
    },
    {
      property: "og:url",
      content: computed(
        () => `https://vanphuccare.com/courses/${course.value?.slug || ""}`,
      ),
    },
    {
      property: "og:image",
      content: computed(
        () =>
          `https://vanphuccare.com${
            course.value?.thumbnail || "/images/courses/default.jpg"
          }`,
      ),
    },
    {
      property: "og:image:width",
      content: "1200",
    },
    {
      property: "og:image:height",
      content: "630",
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:title",
      content: computed(
        () =>
          `${
            course.value?.title || "Chi tiết khóa học"
          } - Van Phuc Care E-Learning`,
      ),
    },
    {
      name: "twitter:description",
      content: computed(
        () =>
          course.value?.shortDescription ||
          "Khám phá khóa học tại Van Phuc Care E-Learning",
      ),
    },
    {
      name: "twitter:image",
      content: computed(
        () =>
          `https://vanphuccare.com${
            course.value?.thumbnail || "/images/courses/default.jpg"
          }`,
      ),
    },
    {
      name: "article:author",
      content: computed(
        () => course.value?.instructor?.name || "Van Phuc Care",
      ),
    },
    {
      name: "article:published_time",
      content: computed(
        () => course.value?.createdAt || new Date().toISOString(),
      ),
    },
    {
      name: "article:modified_time",
      content: computed(
        () => course.value?.updatedAt || new Date().toISOString(),
      ),
    },
  ],
  link: [
    {
      rel: "canonical",
      href: computed(
        () => `https://vanphuccare.com/courses/${course.value?.slug || ""}`,
      ),
    },
  ],
});

// Schema.org markup for Course Detail (temporarily disabled for testing)
// useSchemaOrg([
//   {
//     '@type': 'Course',
//     name: computed(() => course.value?.title || 'Khóa học'),
//     description: computed(() => course.value?.description || course.value?.shortDescription || ''),
//     url: computed(() => `https://vanphuccare.com/courses/${course.value?.slug || ''}`),
//     image: computed(() => `https://vanphuccare.com${course.value?.thumbnail || '/images/courses/default.jpg'}`),
//     provider: {
//       '@type': 'Organization',
//       name: 'Van Phuc Care',
//       url: 'https://vanphuccare.com',
//       logo: 'https://vanphuccare.com/images/logo.png'
//     },
//     instructor: computed(() => course.value?.instructor ? {
//       '@type': 'Person',
//       name: course.value.instructor.name,
//       image: course.value.instructor.avatar ? `https://vanphuccare.com${course.value.instructor.avatar}` : undefined,
//       description: course.value.instructor.bio
//     } : undefined),
//     offers: computed(() => course.value ? {
//       '@type': 'Offer',
//       price: course.value.price,
//       priceCurrency: 'VND',
//       availability: 'https://schema.org/InStock',
//       validFrom: course.value.createdAt || new Date().toISOString()
//     } : undefined),
//     aggregateRating: computed(() => course.value?.rating ? {
//       '@type': 'AggregateRating',
//       ratingValue: course.value.rating.average,
//       reviewCount: course.value.rating.count,
//       bestRating: 5,
//       worstRating: 1
//     } : undefined),
//     courseMode: 'online',
//     educationalLevel: computed(() => {
//       if (!course.value?.level) return undefined
//       const levelMap: Record<string, string> = {
//         'beginner': 'Beginner',
//         'intermediate': 'Intermediate',
//         'advanced': 'Advanced'
//       }
//       return levelMap[course.value.level] || course.value.level
//     }),
//     timeRequired: computed(() => course.value?.duration ? `PT${Math.floor(course.value.duration / 60)}M` : undefined),
//     numberOfCredits: computed(() => course.value?.lessons || undefined),
//     inLanguage: 'vi',
//     isAccessibleForFree: false,
//     hasCourseInstance: computed(() => course.value ? {
//       '@type': 'CourseInstance',
//       courseMode: 'online',
//       instructor: course.value.instructor ? {
//         '@type': 'Person',
//         name: course.value.instructor.name
//       } : undefined
//     } : undefined)
//   },
//   {
//     '@type': 'BreadcrumbList',
//     itemListElement: [
//       {
//         '@type': 'ListItem',
//         position: 1,
//         name: 'Trang chủ',
//         item: 'https://vanphuccare.com'
//       },
//       {
//         '@type': 'ListItem',
//         position: 2,
//         name: 'Khóa học',
//         item: 'https://vanphuccare.com/courses'
//       },
//       {
//         '@type': 'ListItem',
//         position: 3,
//         name: computed(() => course.value?.title || 'Chi tiết khóa học'),
//         item: computed(() => `https://vanphuccare.com/courses/${course.value?.slug || ''}`)
//       }
//     ]
//   }
// ])
const reviews = computed(() => {
  const reviewsData = coursesStore.reviews;
  return reviewsData;
});

// Calculate rating from reviews
const calculatedRating = computed(() => {
  if (!reviews.value || reviews.value.length === 0) {
    return {
      average: 0,
      count: 0,
      breakdown: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
    };
  }

  const total = reviews.value.length;
  const sum = reviews.value.reduce((acc: number, review: any) => {
    const rating = Number(review.rating) || 0;
    return acc + rating;
  }, 0);
  const average = total > 0 ? sum / total : 0;

  // Calculate breakdown by star rating
  const breakdown = {
    5: reviews.value.filter((r: any) => Number(r.rating) === 5).length,
    4: reviews.value.filter((r: any) => Number(r.rating) === 4).length,
    3: reviews.value.filter((r: any) => Number(r.rating) === 3).length,
    2: reviews.value.filter((r: any) => Number(r.rating) === 2).length,
    1: reviews.value.filter((r: any) => Number(r.rating) === 1).length,
  };

  return {
    average,
    count: total,
    breakdown,
  };
});

const isInCart = computed(() => {
  return cartStore.isInCart(course.value?._id || "");
});

// State for intro video proxy
const introVideoToken = ref<string | null>(null);
const introVideoTokenLoading = ref(false);
const userClickedPlay = ref(false);
const introVideoReady = ref(false);
let introHlsInstance: Hls | null = null;
const isMounted = ref(false);

// Computed: Get intro video URL - Stream qua proxy (token ẩn URL gốc)
const currentVideoUrl = computed(() => {
  // CHỈ tạo video URL khi user đã click play VÀ video ready - ẩn URL khỏi Cốc Cốc
  if (!userClickedPlay.value || !introVideoReady.value) {
    return null; // Không có URL cho đến khi user click play và video ready
  }

  if (!course.value?.introVideo && !(course.value as any)?.introVideoHlsUrl) {
    // Fallback to demo video (no token needed)
    return "/videos/demo-intro.mp4";
  }

  // Tất cả video (HLS và MP4) đều stream qua proxy để tránh CORS và ẩn URL gốc
  if (introVideoToken.value) {
    return `${apiUser}/video/stream/${introVideoToken.value}`;
  }

  return null; // Chưa có token, sẽ hiển thị loading
});

// Get intro video token for proxy streaming
const getIntroVideoToken = async () => {
  // CHỈ lấy token khi user đã click play - ẩn URL khỏi Cốc Cốc
  if (!userClickedPlay.value) {
    introVideoToken.value = null;
    return;
  }

  if (!course.value?._id) {
    introVideoToken.value = null;
    return;
  }

  try {
    introVideoTokenLoading.value = true;
    const response = await fetch(`${apiUser}/video/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        courseId: course.value._id,
        isIntroVideo: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get intro video token: ${response.status}`);
    }

    const data = await response.json();
    introVideoToken.value = data.data?.token || null;
  } catch (error) {
    introVideoToken.value = null;
  } finally {
    introVideoTokenLoading.value = false;
  }
};

// Load intro video with HLS
const loadIntroVideoWithHls = async () => {
  if (!videoRef.value || !currentVideoUrl.value) return;

  // Cleanup previous HLS instance
  if (introHlsInstance) {
    introHlsInstance.destroy();
    introHlsInstance = null;
  }

  // Check if video is HLS format
  const isHls =
    (course.value as any)?.introVideoHlsUrl ||
    currentVideoUrl.value.endsWith(".m3u8") ||
    false;

  if (isHls) {
    // HLS: Use hls.js to load HLS manifest (.m3u8)
    if (Hls.isSupported()) {
      introHlsInstance = new Hls({
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
      introHlsInstance.loadSource(currentVideoUrl.value);
      introHlsInstance.attachMedia(videoRef.value);

      introHlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
        // Video ready to play
        if (videoRef.value) {
          videoRef.value.play().catch(() => {});
        }
      });

      introHlsInstance.on(Hls.Events.ERROR, (event: string, data: any) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              introHlsInstance?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              introHlsInstance?.recoverMediaError();
              break;
            default:
              introHlsInstance?.destroy();
              introHlsInstance = null;
              break;
          }
        }
      });
    } else if (videoRef.value.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari native HLS support
      videoRef.value.src = currentVideoUrl.value;
      videoRef.value.play().catch(() => {});
    } else {
    }
  } else {
    // MP4: Use native video element (streamed via proxy)
    videoRef.value.src = currentVideoUrl.value;
    videoRef.value.play().catch(() => {});
  }
};

// Play intro video
const playIntroVideo = async () => {
  // Set flag để cho phép lấy token
  userClickedPlay.value = true;
  introVideoReady.value = false; // Reset video ready state

  // Lấy token ngay khi user click play
  await getIntroVideoToken();

  // Đợi token được set
  await nextTick();

  // Delay một chút trước khi set video src để tránh Cốc Cốc bắt được
  await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay

  // Sau delay, set video ready để video URL được tạo và video element được render
  introVideoReady.value = true;

  // Đợi video element được render
  await nextTick();

  // Load video qua HLS (stream theo chunks - chống download tốt hơn)
  await loadIntroVideoWithHls();
};

// Initialize with introVideo (nếu có), nhưng không set URL ngay
watch(
  () => course.value,
  (newCourse) => {
    if (!newCourse) return;
    // Reset play state when course changes
    userClickedPlay.value = false;
    introVideoReady.value = false;
    introVideoToken.value = null;
  },
  { immediate: true },
);

// Methods
const mapDifficulty = (level?: string) => {
  const map: Record<string, string> = {
    easy: "Dễ",
    medium: "Vừa",
    hard: "Khó",
  };
  return map[level || ""] || "Chưa xác định";
};

const convertToObjectArray = () => {
  const contacts = (course.value?.instructor as any)?.contacts || {};
  socialMediaArray.value = Object.entries(contacts).map(([key, value]) => ({
    icon: getIcon(key),
    link: key === "email" ? `mailto:${value}` : (value as string),
  }));
};

const getIcon = (key: string) => {
  const icons: Record<string, string> = {
    facebook: "/images/svg/facebook.svg",
    email: "/images/svg/email.png",
    website: "/images/svg/google.svg",
    linkedin: "/images/svg/linkedin-original.svg",
  };
  return icons[key] || "";
};

const addToCart = async () => {
  if (!course.value) return;

  try {
    await cartStore.addToCart({
      courseId: course.value._id,
      quantity: 1,
      userId: String(authStore?.user?.id),
    } as AddToCartData);
  } catch (error) {
  }
};

const toggleCourse = async () => {
  if (!course.value) return;

  try {
    // Nếu đã có trong cart thì xóa, nếu chưa thì thêm
    if (isInCart.value) {
      // Tìm cart item để lấy course._id
      const cartItem = cartStore.items.find(
        (item) => item.course?._id === course.value?._id,
      );

      if (cartItem && cartItem.course?._id) {
        // Sử dụng course._id để xóa
        await cartStore.removeFromCart(cartItem.course._id);
      }
    } else {
      // Thêm vào cart
      await cartStore.addToCart({
        courseId: course.value._id,
        quantity: 1,
        userId: String(authStore?.user?.id),
      } as AddToCartData);
    }
  } catch (error) {
  }
};

const redirectCheckout = async () => {
  if (!course.value) return;

  try {
    // Thêm vào cart nếu chưa có
    if (!isInCart.value) {
      await cartStore.addToCart({
        courseId: course.value._id,
        quantity: 1,
        userId: String(authStore?.user?.id),
      } as AddToCartData);
    }

    // Đi tới màn cart (không phải checkout)
    router.push("/cart");
  } catch (error) {
  }
};

// Kiểm tra xem course đã có chứng chỉ chưa
const hasCertificate = computed(() => {
  const id = course.value?._id?.toString?.();
  return !!(id && authStore.user?.courseCompleted?.includes(id));
});

// Chế độ Review: cho phép xem lại tất cả bài mà không cần check locked
const isReviewMode = computed(() => route.query.review === "true");

const goToLearning = () => {
  if (!course.value?.slug) return;
  router.push(`/my-learning/${course.value.slug}`);
};

const goToCertificate = () => {
  if (!course.value?.slug) return;
  router.push(`/my-learning/${course.value.slug}?certificate=true`);
};

const goToReview = () => {
  if (!course.value?.slug) return;
  router.push(
    `/my-learning/${course.value.slug}?chapter=0&lesson=0&review=true`,
  );
};

const handlePurchaseFromModal = async () => {
  showPurchaseModal.value = false;
  await redirectCheckout();
};

const handleLoginFromModal = () => {
  showLoginModal.value = false;
  router.push("/login");
};

const accessCourse = () => {
  // Redirect to course learning page or show course content
  // For now, just show a message - you can implement actual course access later
  // router.push(`/learning/${course.value?.slug}`)
  alert("Tính năng truy cập khóa học đang được phát triển!");
};

const handleTabChange = async (key: string) => {
  if (key === "4" && !reviews.value.length) {
    try {
      loadingReview.value = true;
      await coursesStore.fetchReviews(course.value?._id || "");
    } catch (error) {
    } finally {
      loadingReview.value = false;
    }
  }
};

// Điều hướng sang trang học tập khi click vào lesson trong chi tiết khóa học
const handleLessonNavigate = async (
  chapterIndex: number,
  lessonIndex: number,
  lesson: any,
) => {
  // Nếu không có slug thì bỏ qua
  if (!course.value?.slug) return;

  // Đảm bảo authStore đã được init
  if (process.client && authStore.isLoggedIn && !authStore.user) {
    await authStore.initAuth();
  }

  // Kiểm tra xem user đã mua hoặc đã hoàn thành khóa học chưa
  const courseId = course.value._id?.toString();

  // Kiểm tra từ nhiều nguồn để đảm bảo chính xác
  const isPurchasedFromStore = course.value.isPurchased === true;
  const isPurchasedFromUser =
    courseId && authStore.user?.courseRegister?.includes(courseId);
  const isCompletedFromProgress = course.value.progress?.isCompleted === true;
  const isCompletedFromUser =
    courseId && authStore.user?.courseCompleted?.includes(courseId);
  const hasCert = hasCertificate.value;

  const isPurchasedOrCompleted =
    isPurchasedFromStore ||
    isPurchasedFromUser ||
    hasCert ||
    isCompletedFromProgress ||
    isCompletedFromUser;

  // Nếu user chưa mua và chưa hoàn thành khóa học
  if (!isPurchasedOrCompleted) {
    // Bài preview: kiểm tra đăng nhập trước
    if (lesson.isPreview && !lesson.isLocked) {
      // Nếu chưa đăng nhập thì hiện popup đăng nhập
      if (!authStore.isLoggedIn) {
        showLoginModal.value = true;
        return;
      }
      // Đã đăng nhập: chuyển đến trang học tập với bài đó
      router.push({
        path: `/my-learning/${course.value.slug}`,
        query: {
          chapter: String(chapterIndex),
          lesson: String(lessonIndex),
        },
      });
      return;
    }
    // Các bài không phải preview: hiện popup mua khóa học
    showPurchaseModal.value = true;
    return;
  }

  // Đã mua hoặc đã hoàn thành khóa học: luôn cho phép nhảy cóc tự do (không check locked)
  const slug = course.value.slug;

  // Giữ lại query review=true nếu đang ở chế độ review hoặc đã hoàn thành
  const query: Record<string, string> = {
    chapter: String(chapterIndex),
    lesson: String(lessonIndex),
  };

  if (
    isReviewMode.value ||
    hasCert ||
    isCompletedFromProgress ||
    isCompletedFromUser
  ) {
    query.review = "true";
  }

  router.push({
    path: `/my-learning/${slug}`,
    query,
  });
};

// Toggle chapter expand/collapse
const toggleChapter = (chapterIndex: number) => {
  // Đảm bảo reactivity bằng cách tạo object mới
  expandedChapters.value = {
    ...expandedChapters.value,
    [chapterIndex]: !expandedChapters.value[chapterIndex],
  };
};

// Handle preview lesson
const handlePreviewLesson = (lesson: any) => {
  // Note: currentVideoUrl is now computed, so we can't set it directly
  // Preview lessons will use their own video URL logic if needed
  // For now, just play the video if it exists
  if (videoRef.value) {
    videoRef.value.play();
  }
  // Scroll to video section
  nextTick(() => {
    const videoElement = document.querySelector("video");
    if (videoElement) {
      videoElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
};

const fetchData = async () => {
  try {
    // Đảm bảo authStore đã được init trước khi fetch course detail
    if (process.client && authStore.isLoggedIn) {
      await authStore.initAuth();
    }

    const slug = route.params.slug as string;
    await coursesStore.fetchDetail(slug);
    convertToObjectArray();

    // Fetch reviews to calculate rating
    if (course.value?._id) {
      try {
        await coursesStore.fetchReviews(course.value._id);
      } catch (error) {
      }
    }
  } catch (error) {
    // Redirect to home if course not found
    router.push("/");
  }
};

// Lifecycle
onMounted(async () => {
  isMounted.value = true;
  await fetchData();
  // Load cart if user is logged in
  if (authStore.isLoggedIn) {
    await cartStore.fetchCart();
  }
});

// Cleanup HLS instance on unmount
onUnmounted(() => {
  if (introHlsInstance) {
    introHlsInstance.destroy();
    introHlsInstance = null;
  }
});

// Watch route changes
watch(
  () => route.params.slug,
  () => {
    if (route.params.slug) {
      fetchData();
    }
  },
);
</script>

<style scoped>
/* Purchase Modal Styles */
.purchase-modal :deep(.ant-modal-content) {
  background: #ffffff;
  border-radius: 12px;
  box-shadow:
    0px 1px 10px rgba(0, 0, 0, 0.05),
    0px 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.purchase-modal :deep(.ant-modal-body) {
  padding: 0;
  background: transparent;
}

.purchase-modal-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  position: relative;
  width: 100%;
  min-height: 328px;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
}

.purchase-modal-text-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 28px 40px;
  gap: 16px;
  width: 100%;
  min-height: 248px;
  background: transparent;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
  box-sizing: border-box;
}

.purchase-modal-frame {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  gap: 18px;
  width: 400px;
  flex: none;
  order: 0;
  align-self: center;
  flex-grow: 0;
}

.purchase-modal-title-section {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px;
  width: 400px;
  height: 70px;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
}

.purchase-modal-image {
  margin: 0 auto;
  width: 70px;
  height: 70px;
  flex: none;
  order: 0;
  flex-grow: 0;
  object-fit: contain;
}

.purchase-modal-text-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  gap: 8px;
  width: 400px;
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
}

.purchase-modal-title {
  width: auto;
  min-height: 24px;
  font-family: "SVN-Gilroy", sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.3px;
  color: #232325;
  flex: none;
  order: 0;
  flex-grow: 0;
  margin: 0;
  text-align: center;
}

.purchase-modal-description {
  width: 400px;
  min-height: 72px;
  font-family: "SVN-Gilroy", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.3px;
  color: #6f727a;
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
  margin: 0;
}

.purchase-modal-cta-section {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 40px 24px;
  width: 100%;
  min-height: 80px;
  background: transparent;
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
  box-sizing: border-box;
}

.purchase-modal-button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px;
  gap: 10px;
  width: 400px;
  height: 48px;
  background: #317bc4 !important;
  border-radius: 8px;
  border: none;
  font-family: "SVN-Gilroy", sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.3px;
  color: #ffffff !important;
  flex: none;
  order: 0;
  flex-grow: 1;
}

.purchase-modal-button:hover {
  background: #2a6ba8 !important;
}

/* Login Modal Styles */
.login-modal :deep(.ant-modal-content) {
  background: #ffffff;
  border-radius: 12px;
  box-shadow:
    0px 1px 10px rgba(0, 0, 0, 0.05),
    0px 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.login-modal :deep(.ant-modal-body) {
  padding: 0;
  background: transparent;
}

.login-modal-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  position: relative;
  width: 100%;
  min-height: 328px;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
}

.login-modal-text-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 28px 40px;
  gap: 16px;
  width: 100%;
  min-height: 248px;
  background: transparent;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
  box-sizing: border-box;
}

.login-modal-frame {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  gap: 18px;
  width: 400px;
  flex: none;
  order: 0;
  align-self: center;
  flex-grow: 0;
}

.login-modal-title-section {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px;
  width: 400px;
  height: 70px;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
}

.login-modal-image {
  margin: 0 auto;
  width: 70px;
  height: 70px;
  flex: none;
  order: 0;
  flex-grow: 0;
  object-fit: contain;
}

.login-modal-text-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  gap: 8px;
  width: 400px;
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
}

.login-modal-title {
  width: auto;
  min-height: 24px;
  font-family: "SVN-Gilroy", sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.3px;
  color: #232325;
  flex: none;
  order: 0;
  flex-grow: 0;
  margin: 0;
  text-align: center;
}

.login-modal-description {
  width: 400px;
  min-height: 72px;
  font-family: "SVN-Gilroy", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.3px;
  color: #6f727a;
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
  margin: 0;
}

.login-modal-cta-section {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 40px 24px;
  width: 100%;
  min-height: 80px;
  background: transparent;
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
  box-sizing: border-box;
}

.login-modal-button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px;
  gap: 10px;
  width: 400px;
  height: 48px;
  background: #317bc4 !important;
  border-radius: 8px;
  border: none;
  font-family: "SVN-Gilroy", sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.3px;
  color: #ffffff !important;
  flex: none;
  order: 0;
  flex-grow: 1;
}

.login-modal-button:hover {
  background: #2a6ba8 !important;
}

.card-container :deep(.ant-tabs-content) {
  margin-top: -16px;
  padding-left: 12px;
  padding-right: 12px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.card-container
  > :deep(.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-nav-wrap) {
  @apply px-5;
}

.card-container
  > :deep(.ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane) {
  padding: 16px;
}

.card-container :deep(.ant-tabs-content) {
  background-color: #ffffff;
}

.card-container > :deep(.ant-tabs-card > .ant-tabs-bar) {
  border-color: #fff;
}

.card-container > :deep(.ant-tabs-card > .ant-tabs-bar .ant-tabs-tab) {
  border-color: transparent;
  background: transparent;
}

.card-container > :deep(.ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active) {
  border-color: #fff;
  background: #fff;
}

.card-container > :deep(.ant-tabs-tab-active.ant-tabs-tab) {
  min-width: 150px;
}

.course-detail-tabs :deep(.ant-tabs-tab) {
  padding: 10px 12px;
  font-size: 14px;
  font-weight: 400;
}

.course-detail-tabs :deep(.ant-tabs-tab:hover) {
  color: #1a75bb;
}

.course-detail-tabs :deep(.ant-tabs-tab-active) {
  color: #1a75bb !important;
  font-weight: 700;
  background-color: #ffffff;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.course-detail-tabs :deep(.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #1a75bb !important;
}

.course-detail-tabs :deep(.ant-tabs-ink-bar) {
  background-color: #1a75bb;
  height: 2px;
}

/* Responsive Tabs */
@media (min-width: 640px) {
  .course-detail-tabs :deep(.ant-tabs-tab) {
    padding: 12px 16px;
    font-size: 16px;
  }
}

/* Mobile Tabs - Scrollable */
@media (max-width: 768px) {
  .course-detail-tabs :deep(.ant-tabs-nav) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .course-detail-tabs :deep(.ant-tabs-nav::-webkit-scrollbar) {
    display: none;
  }

  .course-detail-tabs :deep(.ant-tabs-nav-list) {
    flex-wrap: nowrap;
  }

  .course-detail-tabs :deep(.ant-tabs-tab) {
    white-space: nowrap;
    flex-shrink: 0;
    padding: 10px 14px;
    font-size: 14px;
  }
}

/* Custom colors to match original design */
.text-primary-100 {
  color: #2176ff;
}

.bg-prim-100 {
  background-color: #2176ff;
}

.stroke-prim-100 {
  stroke: #2176ff;
}

.bg-second-100 {
  background-color: #15cf74;
}

.border-second-100 {
  border-color: #15cf74;
}

.text-gray-40 {
  color: #e5e5e5;
}

.border-gray-40 {
  border-color: #e5e5e5;
}

.text-gray-80 {
  color: #999999;
}

.border-gray-80 {
  border-color: #999999;
}

.text-gray-100 {
  color: #666666;
}

.bg-gray-80 {
  background-color: #999999;
}

/* Rate component styles - Global */
:deep(.ant-rate) {
  font-size: 16px !important;
  line-height: 1 !important;
  display: inline-flex !important;
  align-items: center !important;
  vertical-align: middle !important;
  color: #ffd74b !important;
}

:deep(.ant-rate-star) {
  margin-right: 4px !important;
  font-size: 16px !important;
  display: inline-block !important;
  position: relative !important;
  cursor: default !important;
  transition: all 0.3s !important;
  color: inherit !important;
}

:deep(.ant-rate-star:last-child) {
  margin-right: 0 !important;
}

/* Star icon styles - Ensure icons are visible */
:deep(.ant-rate-star .anticon),
:deep(.ant-rate-star .anticon-star) {
  font-size: 16px !important;
  line-height: 16px !important;
  display: inline-block !important;
  width: 16px !important;
  height: 16px !important;
  color: inherit !important;
  fill: currentColor !important;
}

/* Full star - yellow/gold */
:deep(.ant-rate-star-full) {
  color: #ffd74b !important;
}

:deep(.ant-rate-star-full .anticon),
:deep(.ant-rate-star-full .anticon-star) {
  color: #ffd74b !important;
  fill: #ffd74b !important;
}

/* Zero/empty star - gray */
:deep(.ant-rate-star-zero) {
  color: #d9d9d9 !important;
}

:deep(.ant-rate-star-zero .anticon),
:deep(.ant-rate-star-zero .anticon-star) {
  color: #d9d9d9 !important;
  fill: #d9d9d9 !important;
}

/* Half star */
:deep(.ant-rate-star-half) {
  color: #ffd74b !important;
}

:deep(.ant-rate-star-half .ant-rate-star-first .anticon),
:deep(.ant-rate-star-half .ant-rate-star-first .anticon-star) {
  color: #ffd74b !important;
  fill: #ffd74b !important;
}

:deep(.ant-rate-star-half .ant-rate-star-second .anticon),
:deep(.ant-rate-star-half .ant-rate-star-second .anticon-star) {
  color: #d9d9d9 !important;
  fill: #d9d9d9 !important;
}

:deep(.ant-rate-disabled) {
  cursor: default !important;
}

:deep(.ant-rate-disabled .ant-rate-star) {
  cursor: default !important;
}

/* Specific styles for review rating cards */
.review-rating {
  display: inline-flex !important;
  align-items: center !important;
}

.review-rating :deep(.ant-rate) {
  font-size: 16px !important;
  line-height: 1 !important;
  color: #ffd74b !important;
}

.review-rating :deep(.ant-rate-star) {
  font-size: 16px !important;
  margin-right: 4px !important;
  color: inherit !important;
}

.review-rating :deep(.ant-rate-star .anticon),
.review-rating :deep(.ant-rate-star .anticon-star) {
  font-size: 16px !important;
  width: 16px !important;
  height: 16px !important;
  line-height: 16px !important;
  display: inline-block !important;
  color: inherit !important;
  fill: currentColor !important;
}

.review-rating :deep(.ant-rate-star-full .anticon),
.review-rating :deep(.ant-rate-star-full .anticon-star) {
  color: #ffd74b !important;
  fill: #ffd74b !important;
}

.review-rating :deep(.ant-rate-star-zero .anticon),
.review-rating :deep(.ant-rate-star-zero .anticon-star) {
  color: #d9d9d9 !important;
  fill: #d9d9d9 !important;
}

/* Custom Star Rating for Reviews */
.review-stars {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.star-icon {
  font-size: 16px;
  line-height: 1;
  display: inline-block;
  user-select: none;
  transition: all 0.2s;
}

.star-filled {
  color: #ffd74b;
  text-shadow: 0 0 2px rgba(255, 215, 75, 0.3);
}

.star-empty {
  color: #d9d9d9;
}

/* Course Description Content Styles - Rich Text Editor Output */
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

.course-description-content :deep(p),
.course-description-content :deep(span),
.course-description-content :deep(li) {
  text-align: justify;
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
  content: "• " !important;
  color: #333 !important;
  font-weight: bold !important;
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
  content: "• " !important;
  color: #333 !important;
  font-weight: bold !important;
}

/* Ensure ol displays as numbered list */
.course-description-content :deep(ol) {
  margin: 1em 0 !important;
  padding-left: 2em !important;
  line-height: 1.8;
  list-style-position: outside !important;
  list-style-type: decimal !important;
}

.course-description-content :deep(ol li) {
  margin-bottom: 0.5em;
  padding-left: 0.5em;
  line-height: 1.8;
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
  color: #317bc4;
  text-decoration: underline;
}

.course-description-content :deep(a:hover) {
  color: #155a8f;
}

/* 16:9 thumbnail (fallback for browsers without aspect-ratio) */
.course-thumbnail-16x9 {
  position: relative;
  width: 100%;
  background: #f3f4f6; /* gray-100 placeholder */
}

.course-thumbnail-16x9::before {
  content: "";
  display: block;
  padding-top: 56.25%; /* 9/16 */
}

.course-thumbnail-16x9 > img {
  position: absolute;
  inset: 0;
}

@supports (aspect-ratio: 16 / 9) {
  .course-thumbnail-16x9 {
    aspect-ratio: 16 / 9;
  }

  .course-thumbnail-16x9::before {
    display: none;
    padding-top: 0;
  }
}
</style>
