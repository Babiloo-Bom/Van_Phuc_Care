<template>
  <div>
    <!-- Hero Section -->
    <div
      class="min-h-[300px] lg:h-[450px] bg-cover bg-[#0e1d29db] bg-center bg-no-repeat relative z-[0] after:absolute after:content-[''] after:top-0 after:left-0 after:w-full after:h-full after:opacity-60 after:bg-prim-100"
      :style="`background: url(${course?.banner}) center center/cover no-repeat`"
    >
      <div
        class="absolute top-0 left-0 w-full h-full bg-[#1A75BBB2] opacity-80"
      ></div>
      <div class="container h-full mx-auto flex items-center py-8 lg:py-0">
        <div class="grid grid-cols-12 gap-4 sm:gap-8 w-full">
          <div
            class="col-span-12 xl:col-span-8 relative z-[1] flex flex-col h-full gap-4 sm:gap-6"
          >
            <div class="text-white max-lg:w-full w-[66%]">
              <!-- Breadcrumb -->
              <div class="mb-3 sm:mb-6">
                <NuxtLink to="/" class="m-0 hover:underline text-sm sm:text-base">
                  Tất cả khóa học |
                </NuxtLink>
                <span class="m-0 text-sm sm:text-base">
                  {{ course?.title }}
                </span>
              </div>

              <!-- Title -->
              <div class="flex items-center gap-4">
                <h4 class="max-lg:text-[28px] text-4xl font-bold text-white mb-1">
                  {{ course?.title }}
                </h4>
              </div>

              <!-- Short Description -->
              <div class="mt-3 sm:mt-4 max-lg:hidden">
                <div class="mb-0 text-sm sm:text-base md:max-w-[90%] line-clamp-3 sm:line-clamp-none" v-html="course?.shortDescription"></div>
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
          <div class="col-span-12 lg:col-span-8 max-[639px]:mt-0 max-md:mt-[11rem] max-lg:mt-[12rem]">
            <div>
              <!-- Video or Thumbnail -->
              <div class="py-4 sm:py-6 md:py-8">
                <div class="p-2 sm:p-4 rounded-md overflow-hidden shadow-md">
                  <video
                    v-if="currentVideoUrl"
                    :ref="videoRef"
                    :src="currentVideoUrl"
                    :poster="course?.thumbnail"
                    class="w-full h-auto min-h-[200px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-[500px] object-cover rounded-[8px] sm:rounded-[12px]"
                    controls
                    preload="metadata"
                    crossorigin="anonymous"
                  />
                  <img
                    v-else
                    class="h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] w-full object-cover rounded-[8px] sm:rounded-md"
                    :src="
                      course?.thumbnail || '/images/courses/python-course.jpg'
                    "
                    alt="/"
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
                    <div class="py-4 sm:py-5">
                      <h4 class="text-xl sm:text-2xl md:text-3xl font-bold text-primary-100 mb-1">
                        {{ course?.title }}
                      </h4>
                      <div
                        class="border-t-[1px] border-solid border-gray-40 pt-3 sm:pt-4"
                      >
                        <div class="text-sm sm:text-base" v-html="course?.description" />
                      </div>
                    </div>
                  </a-tab-pane>

                  <!-- Tab 2: Nội dung khóa học -->
                  <a-tab-pane key="2" tab="Nội dung khóa học">
                    <div class="py-4 sm:py-5">
                      <!-- Course Summary Section -->
                      <div class="mb-4 sm:mb-6" style="background-color: #F3F9FF; padding: 12px 16px; border-radius: 8px;">
                        <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 md:gap-6 flex-wrap">
                          <span class="text-sm sm:text-base font-semibold" style="color: #393939;">Khóa học bao gồm:</span>
                          <div class="flex items-center gap-1 sm:gap-2">
                            <img src="/images/svg/folder.svg" alt="quiz" class="w-3 h-3 sm:w-4 sm:h-4" />
                            <span class="text-xs sm:text-sm" style="color: #393939;">{{ course?.examCount || 0 }} bài trắc nghiệm</span>
                          </div>
                          <div class="flex items-center gap-1 sm:gap-2">
                            <img src="/images/svg/video-icon.svg" alt="video" class="w-3 h-3 sm:w-4 sm:h-4" />
                            <span class="text-xs sm:text-sm" style="color: #393939;">{{ course?.videoCount || 0 }} video</span>
                          </div>
                          <div class="flex items-center gap-1 sm:gap-2">
                            <img src="/images/svg/folder.svg" alt="document" class="w-3 h-3 sm:w-4 sm:h-4" />
                            <span class="text-xs sm:text-sm" style="color: #393939;">{{ course?.documentCount || 0 }} Tài liệu</span>
                          </div>
                        </div>
                      </div>

                      <!-- Main Content -->
                      <div v-if="course?.chapters && course.chapters.length > 0">
                        <h3 class="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 uppercase" style="color: #1A75BB;">
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
                              class="flex items-center justify-between py-3 sm:py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                              @click="toggleChapter(chapterIndex)"
                            >
                              <div class="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                <span class="text-sm sm:text-base font-semibold flex-shrink-0" style="color: #1A75BB;">
                                  B{{ chapterIndex + 1 }}.
                                </span>
                                <span class="text-sm sm:text-base font-medium truncate" style="color: #000000;">
                                  {{ chapter.title }}
                                </span>
                              </div>
                              <!-- Plus/Minus Icon -->
                              <svg 
                                v-if="expandedChapters[chapterIndex] === true"
                                xmlns="http://www.w3.org/2000/svg" 
                                width="16" 
                                height="16" 
                                viewBox="0 0 16 16" 
                                fill="none"
                                class="flex-shrink-0"
                              >
                                <path d="M4 8H12" stroke="#1A75BB" stroke-width="1.5" stroke-linecap="round"/>
                              </svg>
                              <svg 
                                v-else
                                xmlns="http://www.w3.org/2000/svg" 
                                width="16" 
                                height="16" 
                                viewBox="0 0 16 16" 
                                fill="none"
                                class="flex-shrink-0"
                              >
                                <path d="M8 4V12M4 8H12" stroke="#1A75BB" stroke-width="1.5" stroke-linecap="round"/>
                              </svg>
                            </div>
                            
                            <!-- Chapter Lessons (Expanded) -->
                            <!-- Cho phép luôn hiển thị danh sách bài học để user có thể click (không phụ thuộc expand) -->
                            <div class="pl-4 sm:pl-6 md:pl-8 pb-3 sm:pb-4 space-y-2 sm:space-y-3">
                              <div
                                v-for="(lesson, lessonIndex) in chapter.lessons"
                                :key="`lesson-${chapterIndex}-${lessonIndex}`"
                                class="flex items-center justify-between py-2 gap-2 cursor-pointer"
                                @click="handleLessonNavigate(chapterIndex, lessonIndex, lesson)"
                              >
                                <div class="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
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
                                  
                                  <!-- Lesson Title -->
                                  <span class="text-xs sm:text-sm font-normal truncate" style="color: #393939;">
                                    {{ lesson.title }}
                                  </span>
                                </div>
                                
                                <!-- Action Buttons -->
                                <div class="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                                  <!-- Học thử Button (for preview lessons) -->
                                  <button
                                    v-if="lesson.isPreview && !lesson.isLocked"
                                    class="px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-medium rounded border transition-colors whitespace-nowrap"
                                    style="color: #1A75BB; border-color: #1A75BB; background-color: transparent;"
                                    @click.stop="handleLessonNavigate(chapterIndex, lessonIndex, lesson)"
                                  >
                                    Học thử
                                  </button>
                                  
                                  <!-- Lock Icon (for locked lessons - only show if course not purchased) -->
                                  <img 
                                    v-if="lesson.isLocked && !course?.isPurchased"
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
                      <div class="bg-white rounded-lg shadow-sm p-8">
                        <div
                          class="flex flex-col md:flex-row gap-8 items-start"
                        >
                          <!-- Instructor Avatar -->
                          <div class="flex-shrink-0">
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
                              class="text-3xl font-bold text-primary-100 mb-2"
                            >
                              {{ course?.instructor?.name || "Chưa cập nhật" }}
                            </h2>

                            <div class="mb-6">
                              <h3
                                class="text-xl font-semibold text-gray-800 mb-2"
                              >
                                Chuyên môn
                              </h3>
                              <p class="text-gray-600 text-lg leading-relaxed">
                                {{
                                  course?.instructor?.bio ||
                                  "Thông tin chuyên môn đang được cập nhật..."
                                }}
                              </p>
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
                                  v-for="skill in ((course?.instructor as any)?.skills || '').split(',').map((s: string) => s.trim())"
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
                          <h3 class="text-2xl font-bold text-primary-100 mb-4">
                            Đánh giá tổng quan
                          </h3>
                          <div class="flex items-center gap-6">
                            <div class="text-center">
                              <div
                                class="text-4xl font-bold text-primary-100 mb-1"
                              >
                                {{ (course?.rating?.average || 0).toFixed(1) }}
                              </div>
                              <a-rate
                                style="fontsize: 20px; color: #ffd74b"
                                :value="course?.rating?.average || 0"
                                disabled
                              />
                              <p class="text-sm text-gray-600 mt-1">
                                {{ course?.rating?.count || 0 }} đánh giá
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
                                    class="bg-prim-100 h-2 rounded-full"
                                    :style="{ width: '0%' }"
                                  ></div>
                                </div>
                                <span class="text-sm text-gray-600 w-8">0</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Individual Reviews -->
                        <div class="space-y-6">
                          <h3 class="text-2xl font-bold text-primary-100 mb-4">
                            Đánh giá chi tiết
                          </h3>
                          <div
                            v-for="(review, index) in reviews"
                            :key="`review_${index}`"
                            class="bg-white rounded-lg shadow-sm p-6"
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
                                    class="text-lg font-semibold text-primary-100"
                                  >
                                    {{ review.userName }}
                                  </h4>
                                  <span
                                    class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium"
                                  >
                                    Đã xác thực
                                  </span>
                                </div>
                                <div class="flex items-center gap-2 mb-3">
                                  <a-rate
                                    style="fontsize: 16px; color: #ffd74b"
                                    :value="review.rating || 5"
                                    disabled
                                  />
                                  <span class="text-sm text-gray-500">
                                    {{
                                      new Date(
                                        review.createdAt
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
          <div class="col-span-12 lg:col-span-4 max-lg:absolute max-lg:-top-[49rem] max-lg:w-[calc(100%-48px)] max-[639px]:w-[calc(100%-32px)]">
            <div
              class="bg-white rounded-md px-3 sm:px-4 pt-3 pb-5 z-[2] shadow-xl mt-4 lg:-mt-[100%] lg:sticky lg:top-[90px]"
            >
              <div class="pb-3 sm:pb-4 rounded-md overflow-hidden">
                <img
                  class="w-full h-[150px] sm:h-[180px] md:h-[200px] object-cover"
                  :src="
                    course?.thumbnail || '/images/courses/python-course.jpg'
                  "
                  alt="/"
                />
              </div>
              <!-- Pricing and Action Section -->
              <div class="mb-4">
                <!-- Purchased Badge -->
                <div v-if="course?.isPurchased" class="mb-3 sm:mb-4">
                  <div class="flex items-center justify-center gap-2 px-3 py-2 rounded-lg" style="background-color: #e6f7ff; border: 1px solid #1a75bb;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a75bb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span class="text-sm sm:text-base font-semibold" style="color: #1a75bb;">Đã mua khóa học này</span>
                  </div>
                </div>

                <!-- Offer Timer (only show if not purchased) -->
                <div v-if="!course?.isPurchased" class="flex items-center gap-2 mb-2 sm:mb-3">
                  <img
                    src="/images/svg/clock-pink.svg"
                    alt="clock"
                    class="w-3 h-3 sm:w-4 sm:h-4"
                  />
                  <span class="text-xs sm:text-sm" style="color: #f48283"
                    >Ưu đãi còn 3 ngày</span
                  >
                </div>

                <!-- Price (only show if not purchased) -->
                <div v-if="!course?.isPurchased" class="flex items-end gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <h3
                    v-if="course?.price"
                    class="text-2xl sm:text-3xl md:text-4xl font-bold mb-0"
                    style="color: #2176ff"
                  >
                    {{ Number(course.price).toLocaleString("vi-VN") }}₫
                  </h3>
                  <h3
                    v-else
                    class="text-2xl sm:text-3xl md:text-4xl font-bold mb-0"
                    style="color: #15cf74"
                  >
                    Miễn phí
                  </h3>
                  <h4
                    v-if="course?.priceSale || course?.originalPrice"
                    class="text-lg sm:text-xl md:text-2xl italic mb-0 line-through"
                    style="color: #999999"
                  >
                    {{
                      Number(
                        course.priceSale || course.originalPrice
                      ).toLocaleString("vi-VN")
                    }}₫
                  </h4>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col gap-2 sm:gap-3">
                  <!-- Đã mua và có chứng chỉ: hiển thị 2 nút "Đã hoàn thành" và "Review" -->
                  <template v-if="course?.isPurchased && hasCertificate">
                    <!-- Nút Đã hoàn thành (đi tới trang chứng chỉ) -->
                    <a-button
                      class="!w-full !py-2 sm:!py-3 !h-[44px] sm:!h-[50px] !text-white !border-none !font-bold !text-sm sm:!text-base !rounded-lg !transition-all !duration-200 hover:!opacity-90"
                      style="background: linear-gradient(88.69deg, #FFBE6A -1.04%, #EBBC46 23.61%, #FFDA7D 55.57%, #EBBC46 74.44%, #FFBE6A 97.91%) !important"
                      @click="goToCertificate"
                    >
                      Đã hoàn thành
                    </a-button>
                    
                    <!-- Nút Review (đi tới trang học tập mode review) -->
                    <a-button
                      class="!w-full !py-2 sm:!py-3 !h-[44px] sm:!h-[50px] !text-white !border-none !font-bold !text-sm sm:!text-base !rounded-lg !transition-all !duration-200 hover:!opacity-90"
                      style="background-color: #317BC4 !important"
                      @click="goToReview"
                    >
                      Review
                    </a-button>
                  </template>

                  <!-- Đã hoàn thành nhưng chưa có chứng chỉ (tiến trình 100%) -->
                  <a-button
                    v-else-if="course?.progress?.isCompleted"
                    class="!w-full !py-2 sm:!py-3 !h-[44px] sm:!h-[50px] !text-white !border-none !font-bold !text-sm sm:!text-base !rounded-lg !transition-all !duration-200 hover:!opacity-90"
                    style="background: linear-gradient(88.69deg, #FFBE6A -1.04%, #EBBC46 23.61%, #FFDA7D 55.57%, #EBBC46 74.44%, #FFBE6A 97.91%) !important"
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
                    <span class="font-semibold text-[#1A75BB] text-sm sm:text-base">Bài giảng:</span>
                    <span
                      class="px-2 py-1 text-[10px] sm:text-xs rounded"
                      style="background-color: #f5f5f5; color: #999999"
                      >{{ course?.progress?.totalLessons || 0 }} Bài</span
                    >
                  </li>
                  <li
                    class="flex justify-between items-center border-b-[1px] border-solid border-gray-40 py-2 sm:py-3"
                  >
                    <span class="font-semibold text-[#1A75BB] text-sm sm:text-base"
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
                    <span class="font-semibold text-[#1A75BB] text-sm sm:text-base">Trình độ:</span>
                    <span
                      class="px-2 py-1 text-[10px] sm:text-xs rounded"
                      style="background-color: #f5f5f5; color: #999999"
                      >{{ mapDifficulty(course?.level) }}</span
                    >
                  </li>
                  <li
                    class="flex justify-between items-center border-b-[1px] border-solid border-gray-40 py-2 sm:py-3"
                  >
                    <span class="font-semibold text-[#1A75BB] text-sm sm:text-base">Ngôn ngữ:</span>
                    <span
                      class="px-2 py-1 text-[10px] sm:text-xs rounded"
                      style="background-color: #f5f5f5; color: #999999"
                      >Tiếng Việt</span
                    >
                  </li>
                  <li
                    class="flex justify-between items-center border-b-[1px] border-solid border-gray-40 py-2 sm:py-3"
                  >
                    <span class="font-semibold text-[#1A75BB] text-sm sm:text-base"
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
                <h4 class="text-[#1A75BB] font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                  Tìm hiểu thêm thông tin về khóa học
                </h4>
                <div class="mb-3 sm:mb-4">
                  <ul class="mb-0 flex items-center justify-center gap-2 sm:gap-3">
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
                        href="https://open.spotify.com"
                        target="_blank"
                        class="block"
                      >
                        <img
                          src="/images/svg/spotify-gray.svg"
                          alt="Spotify"
                          class="w-9 h-9 sm:w-11 sm:h-11"
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

                <h4 class="text-gray-700 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
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
                  style="background-color: #2176ff !important; text-decoration: none;"
                >
                  <div class="flex items-center justify-center gap-2">
                    <img
                      src="/images/svg/zalo.svg"
                      alt="Zalo"
                      class="w-5 h-5 sm:w-6 sm:h-6"
                    />
                    <div class="flex flex-col items-start">
                      <span class="text-xs sm:text-base">CHAT ZALO</span>
                    <span class="text-[10px] sm:text-xs font-normal">Hỗ trợ tư vấn ngay</span>
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
      :body-style="{ padding: 0, borderRadius: '12px', background: 'transparent', boxShadow: 'none' }"
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
              <h3 class="purchase-modal-title">
                Bạn đang học rất tốt!
              </h3>
              
              <!-- Description: width 400px, height 72px, font-size 16px, font-weight 500, color #6F727A, text-align center -->
              <p class="purchase-modal-description">
                Bạn đã hoàn thành hết nội dung học thử. Đừng để kiến thức bị ngắt quãng, hãy mở khóa toàn bộ khóa học để tiếp tục bạn nhé!
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
      :body-style="{ padding: 0, borderRadius: '12px', background: 'transparent', boxShadow: 'none' }"
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
              <h3 class="login-modal-title">
                Mở khóa bài học thử miễn phí!
              </h3>
              
              <!-- Description: width 400px, height 72px, font-size 16px, font-weight 500, color #6F727A, text-align center -->
              <p class="login-modal-description">
                Hãy đăng nhập để truy cập video và tài liệu học tập ngay lập tức.
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
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCoursesStore } from "~/stores/courses";
import { useCartStore } from "~/stores/cart";
import { useAuthStore } from "~/stores/auth";
import { message } from "ant-design-vue";
import ContentCourse from "~/components/courses/ContentCourse.vue";
import RecomentCourse from "~/components/courses/RecomentCourse.vue";
import CartToast from "~/components/cart/Toast.vue";
import type { AddToCartData } from "~/types/cart";

const route = useRoute();
const router = useRouter();
const coursesStore = useCoursesStore();
const cartStore = useCartStore();
const authStore = useAuthStore();

const activeTab = ref("1");
const loadingReview = ref(false);
const socialMediaArray = ref<Array<{ icon: string; link: string }>>([]);
const showPurchaseModal = ref(false);
const showLoginModal = ref(false);

// Watch query parameter để tự động hiện popup
watch(
  () => route.query.showPurchaseModal,
  (value) => {
    if (value === 'true') {
      showPurchaseModal.value = true;
      // Xóa query parameter sau khi hiện popup
      router.replace({ query: { ...route.query, showPurchaseModal: undefined } });
    }
  },
  { immediate: true }
);

// Expanded chapters state
const expandedChapters = ref<Record<number, boolean>>({ 0: true }); // B1 expanded by default
const videoRef = ref<any>(null)
const course = computed(() => coursesStore.course);

// SEO Configuration
useHead({
  title: computed(
    () =>
      `${course.value?.title || "Chi tiết khóa học"} - Van Phuc Care E-Learning`
  ),
  meta: [
    {
      name: "description",
      content: computed(
        () =>
          course.value?.shortDescription ||
          "Khám phá khóa học tại Van Phuc Care E-Learning"
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
          } - Van Phuc Care E-Learning`
      ),
    },
    {
      property: "og:description",
      content: computed(
        () =>
          course.value?.shortDescription ||
          "Khám phá khóa học tại Van Phuc Care E-Learning"
      ),
    },
    {
      property: "og:type",
      content: "article",
    },
    {
      property: "og:url",
      content: computed(
        () => `https://vanphuccare.com/courses/${course.value?.slug || ""}`
      ),
    },
    {
      property: "og:image",
      content: computed(
        () =>
          `https://vanphuccare.com${
            course.value?.thumbnail || "/images/courses/default.jpg"
          }`
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
          } - Van Phuc Care E-Learning`
      ),
    },
    {
      name: "twitter:description",
      content: computed(
        () =>
          course.value?.shortDescription ||
          "Khám phá khóa học tại Van Phuc Care E-Learning"
      ),
    },
    {
      name: "twitter:image",
      content: computed(
        () =>
          `https://vanphuccare.com${
            course.value?.thumbnail || "/images/courses/default.jpg"
          }`
      ),
    },
    {
      name: "article:author",
      content: computed(
        () => course.value?.instructor?.name || "Van Phuc Care"
      ),
    },
    {
      name: "article:published_time",
      content: computed(
        () => course.value?.createdAt || new Date().toISOString()
      ),
    },
    {
      name: "article:modified_time",
      content: computed(
        () => course.value?.updatedAt || new Date().toISOString()
      ),
    },
  ],
  link: [
    {
      rel: "canonical",
      href: computed(
        () => `https://vanphuccare.com/courses/${course.value?.slug || ""}`
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
const reviews = computed(() => coursesStore.reviews);

const isInCart = computed(() => {
  return cartStore.isInCart(course.value?._id || "");
});

const currentVideoUrl = ref<string | null>(null);

// Initialize with introVideo (nếu có), nếu không có thì hiện luôn video demo
watch(
  () => course.value,
  (newCourse) => {
    if (!newCourse || currentVideoUrl.value) return;

    // 1. Ưu tiên video giới thiệu riêng của course
    if (newCourse.introVideo) {
      currentVideoUrl.value = newCourse.introVideo;
    } else {
      // 2. Nếu không có introVideo, hiện luôn video demo
      currentVideoUrl.value = "/videos/demo-intro.mp4";
    }
  },
  { immediate: true }
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
      userId: String(authStore?.user?.id)
    } as AddToCartData);
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};

const toggleCourse = async () => {
  if (!course.value) return;

  try {
    // Nếu đã có trong cart thì xóa, nếu chưa thì thêm
    if (isInCart.value) {
      // Tìm cart item để lấy course._id
      const cartItem = cartStore.items.find(item => 
        item.course?._id === course.value?._id
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
        userId: String(authStore?.user?.id)
      } as AddToCartData);
    }
  } catch (error) {
    console.error("Error toggling course in cart:", error);
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
        userId: String(authStore?.user?.id)
      } as AddToCartData);
    }
    
    // Đi tới màn cart (không phải checkout)
    router.push("/cart");
  } catch (error) {
    console.error("Error adding to cart:", error);
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
  router.push(`/my-learning/${course.value.slug}?chapter=0&lesson=0&review=true`);
};

const handlePurchaseFromModal = async () => {
  showPurchaseModal.value = false;
  await redirectCheckout();
};

const handleLoginFromModal = () => {
  showLoginModal.value = false;
  router.push('/login');
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
      console.error("Error fetching reviews:", error);
    } finally {
      loadingReview.value = false;
    }
  }
};

// Điều hướng sang trang học tập khi click vào lesson trong chi tiết khóa học
const handleLessonNavigate = async (
  chapterIndex: number,
  lessonIndex: number,
  lesson: any
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
  const isPurchasedFromUser = courseId && authStore.user?.courseRegister?.includes(courseId);
  const isCompletedFromProgress = course.value.progress?.isCompleted === true;
  const isCompletedFromUser = courseId && authStore.user?.courseCompleted?.includes(courseId);
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

  if (isReviewMode.value || hasCert || isCompletedFromProgress || isCompletedFromUser) {
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
    [chapterIndex]: !expandedChapters.value[chapterIndex]
  };
};

// Handle preview lesson
const handlePreviewLesson = (lesson: any) => {
  if (lesson.videoUrl) {
    currentVideoUrl.value = lesson.videoUrl;
  } else if (lesson.videos && lesson.videos.length > 0) {
    currentVideoUrl.value = lesson.videos[0].videoUrl;
  }
  videoRef.value?.play()
  // Scroll to video section
  nextTick(() => {
    const videoElement = document.querySelector('video');
    if (videoElement) {
      videoElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
  } catch (error) {
    console.error("❌ Error fetching course detail:", error);
    // Redirect to home if course not found
    router.push("/");
  }
};

// Lifecycle
onMounted(async () => {
  await fetchData();
  // Load cart if user is logged in
  if (authStore.isLoggedIn) {
    await cartStore.fetchCart();
  }
});

// Watch route changes
watch(
  () => route.params.slug,
  () => {
    if (route.params.slug) {
      fetchData();
    }
  }
);
</script>

<style scoped>
/* Purchase Modal Styles */
.purchase-modal :deep(.ant-modal-content) {
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.05), 0px 2px 4px rgba(0, 0, 0, 0.1);
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
  background: #FFFFFF;
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
  font-family: 'SVN-Gilroy', sans-serif;
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
  font-family: 'SVN-Gilroy', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.3px;
  color: #6F727A;
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
  background: #317BC4 !important;
  border-radius: 8px;
  border: none;
  font-family: 'SVN-Gilroy', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.3px;
  color: #FFFFFF !important;
  flex: none;
  order: 0;
  flex-grow: 1;
}

.purchase-modal-button:hover {
  background: #2a6ba8 !important;
}

/* Login Modal Styles */
.login-modal :deep(.ant-modal-content) {
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.05), 0px 2px 4px rgba(0, 0, 0, 0.1);
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
  background: #FFFFFF;
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
  font-family: 'SVN-Gilroy', sans-serif;
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
  font-family: 'SVN-Gilroy', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.3px;
  color: #6F727A;
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
  background: #317BC4 !important;
  border-radius: 8px;
  border: none;
  font-family: 'SVN-Gilroy', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.3px;
  color: #FFFFFF !important;
  flex: none;
  order: 0;
  flex-grow: 1;
}

.login-modal-button:hover {
  background: #2a6ba8 !important;
}

.card-container :deep(.ant-tabs-content) {
  margin-top: -16px;
  padding-left: 20px;
  padding-right: 20px;
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
  background-color: #FFFFFF;
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
  color: #1A75BB;
}

.course-detail-tabs :deep(.ant-tabs-tab-active) {
  color: #1A75BB;
  font-weight: 700;
  background-color: #FFFFFF;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.course-detail-tabs :deep(.ant-tabs-ink-bar) {
  background-color: #1A75BB;
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
</style>
