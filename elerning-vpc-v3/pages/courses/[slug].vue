<template>
  <div>
    <!-- Hero Section -->
    <div
      class="sm:h-[450px] py-10 sm:pt-20 sm:pb-20 md:pb-40 bg-cover bg-[#0e1d29db] bg-center bg-no-repeat relative z-[0] after:absolute after:content-[''] after:top-0 after:left-0 after:w-full after:h-full after:opacity-60 after:bg-prim-100"
      :style="`background: url(${course?.thumbnail}) center center/cover no-repeat`"
    >
      <div class="container h-full">
        <div class="grid grid-cols-12 gap-8">
          <div class="col-span-12 xl:col-span-8 relative z-[1] flex flex-col h-full gap-6">
            <div class="text-white">
              <!-- Breadcrumb -->
              <div class="mb-6">
                <NuxtLink to="/" class="m-0 hover:underline">
                  Tất cả khóa học |
                </NuxtLink>
                <span class="m-0">
                  {{ course?.title }}
                </span>
              </div>

              <!-- Title -->
              <div class="flex items-center gap-4">
                <h4 class="text-3xl sm:text-4xl font-bold text-white mb-1">
                  {{ course?.title }}
                </h4>
              </div>

              <!-- Short Description -->
              <div class="mt-4">
                <p class="mb-0 md:max-w-[90%]">
                  {{ course?.shortDescription }}
                </p>
              </div>
            </div>

            <div class="mt-auto">
              <div class="text-white">
                <!-- Countdown -->
                <div class="text-white flex items-center gap-2">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      class="fill-none stroke-white"
                    >
                      <path
                        d="M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10Z"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="m15.71 15.18-3.1-1.85c-.54-.32-.98-1.09-.98-1.72v-4.1"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span>
                  <span>Ưu đãi còn 3 ngày</span>
                </div>

                <!-- Price -->
                <div v-if="!isPurchased" class="flex items-end gap-4 py-1">
                  <h3 v-if="course?.price" class="text-3xl sm:text-5xl mb-0 text-white">
                    {{ Number(course.price).toLocaleString('en-US') }}đ
                  </h3>
                  <h3 v-else class="text-3xl sm:text-5xl font-[600] mb-0 text-[#15CF74]">
                    Miễn phí
                  </h3>
                  <h4 v-if="course?.priceSale" class="text-xl sm:text-3xl italic mb-0 line-through text-white">
                    {{ Number(course.priceSale).toLocaleString('en-US') }}đ
                  </h4>
                </div>
                
                <!-- Purchased Status in Hero -->
                <div v-else class="flex items-center gap-2 py-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" class="fill-none stroke-green-400">
                    <path d="M9 12l2 2 4-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.5 0 2.91.37 4.15 1.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <h3 class="text-3xl sm:text-5xl font-[600] mb-0 text-green-400">
                    Đã mua
                  </h3>
                </div>

                <!-- Course Info -->
                <div class="text-white flex items-center gap-4 flex-wrap">
                  <div class="flex gap-1 items-center w-full sm:w-auto">
                    <a-rate
                      class="relative -top-0.5"
                      style="fontSize: 14px;color: #FFD74B; marginRight: 0px"
                      :value="course?.rate || 5"
                      disabled
                    />
                    <span class="">
                      {{ (course?.reviewsCount || 0).toLocaleString('en-US') }} lượt đánh giá
                    </span>
                  </div>
                  <div class="flex items-center justify-start gap-1">
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="fill-none stroke-white">
                        <path d="M9.1 12v-1.48c0-1.91 1.35-2.68 3-1.73l1.28.74 1.28.74c1.65.95 1.65 2.51 0 3.46l-1.28.74-1.28.74c-1.65.95-3 .17-3-1.73V12Z" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </span>
                    <span>{{ course?.videoCount }} video</span>
                  </div>
                  <div class="flex items-center justify-start gap-1">
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="fill-none stroke-white">
                        <path d="m21.67 14.3-.4 5c-.15 1.53-.27 2.7-2.98 2.7H5.71C3 22 2.88 20.83 2.73 19.3l-.4-5c-.08-.83.18-1.6.65-2.19l.02-.02C3.55 11.42 4.38 11 5.31 11h13.38c.93 0 1.75.42 2.29 1.07.01.01.02.02.02.03.49.59.76 1.36.67 2.2Z" stroke-width="1.5" stroke-miterlimit="10" />
                        <path d="M3.5 11.43V6.28c0-3.4.85-4.25 4.25-4.25h1.27c1.27 0 1.56.38 2.04 1.02l1.27 1.7c.32.42.51.68 1.36.68h2.55c3.4 0 4.25.85 4.25 4.25v1.79M9.43 17h5.14" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </span>
                    <span>{{ course?.documentCount }} tài liệu</span>
                  </div>
                  <div class="flex items-center justify-start gap-1">
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 10 9" class="fill-none stroke-white">
                        <path d="M4.31471 8.36571H2.15047C1.55283 8.3657 1.06836 7.91654 1.06836 7.36246L1.0684 1.34307C1.06841 0.789004 1.55288 0.339844 2.15052 0.339844H7.02016C7.61779 0.339844 8.10227 0.789008 8.10227 1.34308V4.10198M5.93805 6.94448L6.92999 7.86411L9.09422 5.85756M2.96223 2.34631H6.20858M2.96223 3.85117H6.20858M2.96223 5.35602H4.5854" stroke-width="0.7" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </span>
                    <span>{{ course?.examCount }} bài trắc nghiệm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="bg-[#f4f7f9] py-0 md:py-14">
      <div class="container mx-auto">
        <div class="grid grid-cols-12 gap-8">
          <!-- Left Content -->
          <div class="col-span-12 lg:col-span-8">
            <div>
              <!-- Video or Thumbnail -->
              <div>
                <img class="h-[300px] lg:h-[500px] w-full object object-cover rounded-md" :src="course?.thumbnail || '/images/courses/python-course.jpg'" alt="/" />
              </div>

              <!-- Tabs -->
              <div class="card-container mt-6">
                <a-tabs v-model:activeKey="activeTab" type="card" @change="handleTabChange">
                  <!-- Tab 1: Giới thiệu -->
                  <a-tab-pane key="1" tab="Giới thiệu">
                    <div class="py-5">
                      <h4 class="text-3xl font-bold text-primary-100 mb-1">
                        {{ course?.title }}
                      </h4>
                      <div class="border-t-[1px] border-solid border-gray-40 pt-4">
                        <div v-html="course?.description" />
                      </div>

                      <!-- Course Overview Stats -->
                      <div class="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                        <h3 class="text-2xl font-bold text-primary-100 mb-4">Thông tin khóa học</h3>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div class="text-center">
                            <div class="flex items-center justify-center w-12 h-12 bg-prim-100 text-white rounded-full mx-auto mb-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-none stroke-current">
                                <path d="M9.1 12v-1.48c0-1.91 1.35-2.68 3-1.73l1.28.74 1.28.74c1.65.95 1.65 2.51 0 3.46l-1.28.74-1.28.74c-1.65.95-3 .17-3-1.73V12Z" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
                            </div>
                            <p class="text-sm text-gray-600">{{ course?.videoCount || 0 }} Video</p>
                          </div>
                          <div class="text-center">
                            <div class="flex items-center justify-center w-12 h-12 bg-prim-100 text-white rounded-full mx-auto mb-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-none stroke-current">
                                <path d="m21.67 14.3-.4 5c-.15 1.53-.27 2.7-2.98 2.7H5.71C3 22 2.88 20.83 2.73 19.3l-.4-5c-.08-.83.18-1.6.65-2.19l.02-.02C3.55 11.42 4.38 11 5.31 11h13.38c.93 0 1.75.42 2.29 1.07.01.01.02.02.02.03.49.59.76 1.36.67 2.2Z" stroke-width="1.5" stroke-miterlimit="10" />
                                <path d="M3.5 11.43V6.28c0-3.4.85-4.25 4.25-4.25h1.27c1.27 0 1.56.38 2.04 1.02l1.27 1.7c.32.42.51.68 1.36.68h2.55c3.4 0 4.25.85 4.25 4.25v1.79M9.43 17h5.14" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
                            </div>
                            <p class="text-sm text-gray-600">{{ course?.documentCount || 0 }} Tài liệu</p>
                          </div>
                          <div class="text-center">
                            <div class="flex items-center justify-center w-12 h-12 bg-prim-100 text-white rounded-full mx-auto mb-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 10 9" class="fill-none stroke-current">
                                <path d="M4.31471 8.36571H2.15047C1.55283 8.3657 1.06836 7.91654 1.06836 7.36246L1.0684 1.34307C1.06841 0.789004 1.55288 0.339844 2.15052 0.339844H7.02016C7.61779 0.339844 8.10227 0.789008 8.10227 1.34308V4.10198M5.93805 6.94448L6.92999 7.86411L9.09422 5.85756M2.96223 2.34631H6.20858M2.96223 3.85117H6.20858M2.96223 5.35602H4.5854" stroke-width="0.7" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
                            </div>
                            <p class="text-sm text-gray-600">{{ course?.examCount || 0 }} Bài kiểm tra</p>
                          </div>
                          <div class="text-center">
                            <div class="flex items-center justify-center w-12 h-12 bg-prim-100 text-white rounded-full mx-auto mb-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-none stroke-current">
                                <path d="M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="m15.71 15.18-3.1-1.85c-.54-.32-.98-1.09-.98-1.72v-4.1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
                            </div>
                            <p class="text-sm text-gray-600">{{ course?.duration || 0 }} phút</p>
                          </div>
                        </div>
                      </div>

                      <!-- Chapters and Lessons -->
                      <div v-if="course?.chapters && course.chapters.length > 0" class="mt-8">
                        <h3 class="text-2xl font-bold text-primary-100 mb-6">Nội dung khóa học</h3>
                        <div v-for="(chapter, chapterIndex) in course.chapters" :key="`chapter-${chapterIndex}`" class="mb-6 border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                          <h4 class="text-xl font-semibold text-primary-100 mb-3 flex items-center">
                            <span class="bg-prim-100 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                              {{ chapterIndex + 1 }}
                            </span>
                            {{ chapter.title }}
                          </h4>
                          <p v-if="(chapter as any).description" class="text-gray-600 mb-4 ml-11">{{ (chapter as any).description }}</p>
                          <div class="ml-11">
                            <div v-for="(lesson, lessonIndex) in chapter.lessons" :key="`lesson-${chapterIndex}-${lessonIndex}`" 
                                 class="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg mb-2 hover:bg-gray-100 transition-colors">
                              <div class="flex items-center">
                                <span class="text-primary-100 mr-3 font-medium">{{ chapterIndex + 1 }}.{{ lessonIndex + 1 }}</span>
                                <span class="text-gray-800 font-medium">{{ lesson.title }}</span>
                              </div>
                              <div class="flex items-center gap-3">
                                <span class="text-sm text-gray-500">{{ lesson.duration }} phút</span>
                                <span class="px-3 py-1 text-xs rounded-full font-medium" 
                                      :class="{
                                        'bg-blue-100 text-blue-800': lesson.type === 'video',
                                        'bg-green-100 text-green-800': lesson.type === 'exam',
                                        'bg-orange-100 text-orange-800': lesson.type === 'document'
                                      }">
                                  {{ lesson.type === 'video' ? 'Video' : 
                                     lesson.type === 'exam' ? 'Kiểm tra' : 'Tài liệu' }}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <a-empty v-else-if="!course?.chapters || course.chapters.length === 0" description="Chưa có nội dung khóa học chi tiết" class="mt-6" />
                    </div>
                  </a-tab-pane>

                  <!-- Tab 2: Giảng viên -->
                  <a-tab-pane key="2" tab="Giảng viên">
                    <div class="py-5">
                      <div class="bg-white rounded-lg shadow-sm p-8">
                        <div class="flex flex-col md:flex-row gap-8 items-start">
                          <!-- Instructor Avatar -->
                          <div class="flex-shrink-0">
                            <div class="w-48 h-48 mx-auto md:mx-0">
                              <img 
                                class="w-full h-full object-cover rounded-full border-4 border-prim-100 shadow-lg" 
                                :src="course?.instructor?.avatar || '/images/avatar-demo.png'" 
                                alt="Giảng viên" 
                              />
                            </div>
                          </div>
                          
                          <!-- Instructor Info -->
                          <div class="flex-1">
                            <h2 class="text-3xl font-bold text-primary-100 mb-2">
                              {{ course?.instructor?.name || 'Chưa cập nhật' }}
                            </h2>
                            
                            <div class="mb-6">
                              <h3 class="text-xl font-semibold text-gray-800 mb-2">Chuyên môn</h3>
                              <p class="text-gray-600 text-lg leading-relaxed">
                                {{ course?.instructor?.bio || 'Thông tin chuyên môn đang được cập nhật...' }}
                              </p>
                            </div>

                            <div v-if="(course?.instructor as any)?.skills" class="mb-6">
                              <h3 class="text-xl font-semibold text-gray-800 mb-3">Kỹ năng chuyên môn</h3>
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
                              <h3 class="text-xl font-semibold text-gray-800 mb-4">Liên hệ</h3>
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

                  <!-- Tab 3: Đánh giá -->
                  <a-tab-pane key="3" tab="Đánh giá">
                    <div v-if="!loadingReview" class="py-5">
                      <!-- Reviews Summary -->
                      <div v-if="reviews?.length" class="mb-8">
                        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                          <h3 class="text-2xl font-bold text-primary-100 mb-4">Đánh giá tổng quan</h3>
                          <div class="flex items-center gap-6">
                            <div class="text-center">
                              <div class="text-4xl font-bold text-primary-100 mb-1">
                                {{ (course?.rating?.average || 0).toFixed(1) }}
                              </div>
                              <a-rate 
                                style="fontSize: 20px; color: #FFD74B;" 
                                :value="course?.rating?.average || 0" 
                                disabled 
                              />
                              <p class="text-sm text-gray-600 mt-1">
                                {{ course?.rating?.count || 0 }} đánh giá
                              </p>
                            </div>
                            <div class="flex-1">
                              <div v-for="i in 5" :key="i" class="flex items-center gap-2 mb-1">
                                <span class="text-sm text-gray-600 w-8">{{ 6 - i }}★</span>
                                <div class="flex-1 bg-gray-200 rounded-full h-2">
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
                          <h3 class="text-2xl font-bold text-primary-100 mb-4">Đánh giá chi tiết</h3>
                          <div v-for="(review, index) in reviews" :key="`review_${index}`" class="bg-white rounded-lg shadow-sm p-6">
                            <div class="flex gap-4">
                              <div class="flex-shrink-0">
                                <img 
                                  class="w-16 h-16 object-cover rounded-full" 
                                  :src="review.userAvatar || '/images/avatar-demo.png'" 
                                  :alt="review.userName" 
                                />
                              </div>
                              <div class="flex-1">
                                <div class="flex items-center gap-2 mb-2">
                                  <h4 class="text-lg font-semibold text-primary-100">
                                    {{ review.userName }}
                                  </h4>
                                  <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                                    Đã xác thực
                                  </span>
                                </div>
                                <div class="flex items-center gap-2 mb-3">
                                  <a-rate 
                                    style="fontSize: 16px; color: #FFD74B;" 
                                    :value="review.rating || 5" 
                                    disabled 
                                  />
                                  <span class="text-sm text-gray-500">
                                    {{ new Date(review.createdAt).toLocaleDateString('vi-VN') }}
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
                      <a-empty v-else description="Chưa có đánh giá nào cho khóa học này" />
                    </div>
                    <div v-else class="flex items-center justify-center h-full min-h-[350px]">
                      <a-spin size="large" />
                    </div>
                  </a-tab-pane>
                </a-tabs>
              </div>
            </div>
          </div>

          <!-- Right Sidebar -->
          <div class="col-span-12 lg:col-span-4">
            <div class="bg-white rounded-md px-3 pt-3 pb-5 lg:-mt-[100%] z-[2] shadow-xl sticky top-[90px]">
              <div>
                <img class="w-full h-[200px] object-cover rounded" :src="course?.thumbnail || '/images/courses/python-course.jpg'" alt="/" />
              </div>
              
              <!-- Action Buttons -->
              <div class="flex flex-col items-center gap-3 mt-2">
                <!-- Purchased Status -->
                <div v-if="isPurchased" class="w-full">
                  <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center mb-3">
                    <div class="flex items-center justify-center gap-2 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-none stroke-green-600">
                        <path d="M9 12l2 2 4-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.5 0 2.91.37 4.15 1.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span class="text-green-800 font-bold text-lg">Đã mua</span>
                    </div>
                    <p class="text-green-700 text-sm">Bạn có thể truy cập khóa học ngay bây giờ</p>
                  </div>
                  
                  <!-- Access Course Button -->
                  <a-button 
                    class="!w-full !py-3 !h-[50px] !text-white !border-none !font-bold !text-lg !transition-all !duration-200 hover:!opacity-90 !flex !items-center !justify-center !gap-3" 
                    style="background-color: #10b981 !important; color: white !important;"
                    @click="accessCourse"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="fill-none stroke-current">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>Truy cập khóa học</span>
                  </a-button>
                </div>

                <!-- Not Purchased - Show Cart and Checkout Buttons -->
                <div v-else class="w-full">
                  <!-- Toggle Cart Button -->
                  <a-button
                    :type="isInCart ? 'default' : 'primary'"
                    :class="[
                      '!w-full !py-3 !h-[50px] !font-bold !text-lg !transition-all !duration-200 !flex !items-center !justify-center !gap-3',
                      isInCart 
                        ? '!border-red-500 !text-red-500 hover:!bg-red-50' 
                        : '!bg-prim-100 !border-prim-100 hover:!bg-blue-600'
                    ]"
                    @click="toggleCourse"
                  >
                    <svg v-if="isInCart" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="fill-none stroke-current">
                      <path d="M3 6h18l-2 13H5L3 6zM3 6L1 2H1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M9 11V17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M15 11V17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="fill-none stroke-current">
                      <path d="M3 6h18l-2 13H5L3 6zM3 6L1 2H1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M9 11V17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M15 11V17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>{{ isInCart ? 'Xóa khỏi giỏ hàng' : 'Thêm vào giỏ hàng' }}</span>
                  </a-button>

                  <!-- Checkout Button -->
                  <a-button 
                    class="!w-full !py-3 !h-[50px] !text-white !border-none !font-bold !text-lg !transition-all !duration-200 hover:!opacity-90 !flex !items-center !justify-center !gap-3" 
                    style="background-color: #15CF74 !important; color: white !important;"
                    @click="redirectCheckout"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="fill-none stroke-current">
                      <path d="M9 12l2 2 4-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.5 0 2.91.37 4.15 1.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>Thanh toán ngay</span>
                  </a-button>
                </div>
              </div>

              <!-- Course Details -->
              <div class="mt-2">
                <ul class="mb-0">
                  <li class="flex justify-between items-center border-b-[1px] border-solid border-gray-40 py-3">
                    <span class="font-semibold text-primary-100">Thời lượng:</span>
                    <span v-if="course?.duration">Tổng {{ course.duration }} phút</span>
                    <span v-else>Đang cập nhật</span>
                  </li>
                  <li class="flex justify-between items-center border-b-[1px] border-solid border-gray-40 py-3">
                    <span class="font-semibold text-primary-100">Bài giảng:</span>
                    <span>{{ totalLessons }}</span>
                  </li>
                  <li class="flex justify-between items-center border-b-[1px] border-solid border-gray-40 py-3">
                    <span class="font-semibold text-primary-100">Trắc nghiệm:</span>
                    <span>{{ course?.examCount }}</span>
                  </li>
                  <li class="flex justify-between items-center border-b-[1px] border-solid border-gray-40 py-3">
                    <span class="font-semibold text-primary-100">Trình độ:</span>
                    <span>{{ mapDifficulty(course?.level) }}</span>
                  </li>
                  <li class="flex justify-between items-center border-b-[1px] border-solid border-gray-40 py-3">
                    <span class="font-semibold text-primary-100">Ngôn ngữ:</span>
                    <span>Tiếng Việt</span>
                  </li>
                  <li class="flex justify-between items-center border-b-[1px] border-solid border-gray-40 py-3">
                    <span class="font-semibold text-primary-100">Chứng nhận:</span>
                    <span>Có</span>
                  </li>
                </ul>
              </div>

              <!-- Contact Info -->
              <div class="text-center mt-6">
                <h4 class="text-primary-100 font-semibold">
                  Tìm hiểu thêm thông tin về khóa học
                </h4>
                <div>
                  <ul class="mb-0 flex items-center justify-center gap-4">
                    <li>
                      <a
                        href="https://www.facebook.com/chamsocmevabe.vanphuc"
                        target="_blank"
                        class="text-center w-8 h-8 rounded-full bg-[#ececec] flex flex-col justify-center items-center"
                      >
                        <svg class="w-4 h-4" fill="#868686" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.instagram.com/vanphuccare/"
                        target="_blank"
                        class="text-center w-8 h-8 rounded-full bg-[#ececec] flex flex-col justify-center items-center"
                      >
                        <img src="/images/instagram.png" alt="/" class="w-4 h-4" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.zalo.vn/vanphuccare/"
                        target="_blank"
                        class="text-center w-8 h-8 rounded-full bg-[#ececec] flex flex-col justify-center items-center"
                      >
                        <img src="/images/zalo.png" alt="/" class="w-4 h-4" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://vanphuccare.vn"
                        target="_blank"
                        class="text-center w-8 h-8 rounded-full bg-[#ececec] flex flex-col justify-center items-center"
                      >
                        <svg class="w-4 h-4" fill="#868686" viewBox="0 0 24 24">
                          <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
                        </svg>
                      </a>
                    </li>
                  </ul>
                </div>
                <h4 class="text-primary-100 font-semibold mt-4">
                  Chi tiết xin liên hệ
                </h4>
                <a-button class="!rounded-full w-full !h-[45px] px-2">
                  <div class="flex items-center justify-center gap-3">
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" class="fill-none stroke-prim-100">
                        <path d="M21.97 18.33c0 .36-.08.73-.25 1.09-.17.36-.39.7-.68 1.02-.49.54-1.03.93-1.64 1.18-.6.25-1.25.38-1.95.38-1.02 0-2.11-.24-3.26-.73s-2.3-1.15-3.44-1.98a28.75 28.75 0 0 1-3.28-2.8 28.414 28.414 0 0 1-2.79-3.27c-.82-1.14-1.48-2.28-1.96-3.41C2.24 8.67 2 7.58 2 6.54c0-.68.12-1.33.36-1.93.24-.61.62-1.17 1.15-1.67C4.15 2.31 4.85 2 5.59 2c.28 0 .56.06.81.18.26.12.49.3.67.56l2.32 3.27c.18.25.31.48.4.7.09.21.14.42.14.61 0 .24-.07.48-.21.71-.13.23-.32.47-.56.71l-.76.79c-.11.11-.16.24-.16.4 0 .08.01.15.03.23.03.08.06.14.08.2.18.33.49.76.93 1.28.45.52.93 1.05 1.45 1.58.54.53 1.06 1.02 1.59 1.47.52.44.95.74 1.29.92.05.02.11.05.18.08.08.03.16.04.25.04.17 0 .3-.06.41-.17l.76-.75c.25-.25.49-.44.72-.56.23-.14.46-.21.71-.21.19 0 .39.04.61.13.22.09.45.22.7.39l3.31 2.35c.26.18.44.39.55.64.1.25.16.5.16.78Z" stroke-width="1.5" stroke-miterlimit="10" />
                      </svg>
                    </span>
                    <a href="tel:(024) 6329 6698" class="!text-primary-100">(024) 6329 6698</a>
                    <span class="text-primary-100 relative -top-0.5">|</span>
                    <a href="tel:0908093198" class="!text-primary-100">0908093198</a>
                  </div>
                </a-button>
              </div>
            </div>
          </div>
        </div>

        <!-- Recommended Courses -->
        <div class="mt-10 py-10 border-t-[1px] border-solid border-gray-80">
          <h2 class="text-3xl text-gray-100">
            Khóa học phổ biến
          </h2>
          <RecomentCourse class="mt-6" />
        </div>
      </div>
    </div>

    <!-- Cart Toast -->
    <CartToast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCoursesStore } from '~/stores/courses'
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'
import ContentCourse from '~/components/courses/ContentCourse.vue'
import RecomentCourse from '~/components/courses/RecomentCourse.vue'
import CartToast from '~/components/cart/Toast.vue'

const route = useRoute()
const router = useRouter()
const coursesStore = useCoursesStore()
const cartStore = useCartStore()
const authStore = useAuthStore()

const activeTab = ref('1') // Default to "Giới thiệu" tab
const loadingReview = ref(false)
const socialMediaArray = ref<Array<{ icon: string; link: string }>>([])

const course = computed(() => {
  
  if (!coursesStore.course) return null
  
  // Tính toán counts từ store getters
  const videoCount = coursesStore.videoCount
  const documentCount = coursesStore.documentCount  
  const examCount = coursesStore.examCount
  
  return {
    ...coursesStore.course,
    videoCount,
    documentCount,
    examCount
  }
})

// SEO Configuration
useHead({
  title: computed(() => `${course.value?.title || 'Chi tiết khóa học'} - Van Phuc Care E-Learning`),
  meta: [
    {
      name: 'description',
      content: computed(() => course.value?.shortDescription || 'Khám phá khóa học tại Van Phuc Care E-Learning'),
    },
    {
      name: 'keywords',
      content: computed(() => {
        if (!course.value) return 'khóa học trực tuyến, e-learning, Van Phuc Care'
        const tags = course.value.tags?.join(', ') || ''
        const category = course.value.category || ''
        return `${course.value.title}, ${category}, ${tags}, khóa học trực tuyến, e-learning, Van Phuc Care`
      })
    },
    {
      property: 'og:title',
      content: computed(() => `${course.value?.title || 'Chi tiết khóa học'} - Van Phuc Care E-Learning`)
    },
    {
      property: 'og:description',
      content: computed(() => course.value?.shortDescription || 'Khám phá khóa học tại Van Phuc Care E-Learning')
    },
    {
      property: 'og:type',
      content: 'article'
    },
    {
      property: 'og:url',
      content: computed(() => `https://vanphuccare.com/courses/${course.value?.slug || ''}`)
    },
    {
      property: 'og:image',
      content: computed(() => `https://vanphuccare.com${course.value?.thumbnail || '/images/courses/default.jpg'}`)
    },
    {
      property: 'og:image:width',
      content: '1200'
    },
    {
      property: 'og:image:height',
      content: '630'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: computed(() => `${course.value?.title || 'Chi tiết khóa học'} - Van Phuc Care E-Learning`)
    },
    {
      name: 'twitter:description',
      content: computed(() => course.value?.shortDescription || 'Khám phá khóa học tại Van Phuc Care E-Learning')
    },
    {
      name: 'twitter:image',
      content: computed(() => `https://vanphuccare.com${course.value?.thumbnail || '/images/courses/default.jpg'}`)
    },
    {
      name: 'article:author',
      content: computed(() => course.value?.instructor?.name || 'Van Phuc Care')
    },
    {
      name: 'article:published_time',
      content: computed(() => course.value?.createdAt || new Date().toISOString())
    },
    {
      name: 'article:modified_time',
      content: computed(() => course.value?.updatedAt || new Date().toISOString())
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: computed(() => `https://vanphuccare.com/courses/${course.value?.slug || ''}`)
    }
  ]
})

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
const reviews = computed(() => coursesStore.reviews)

const isInCart = computed(() => {
  return cartStore.isInCart(course.value?._id || '')
})

// Check if course is purchased
const isPurchased = computed(() => {
  if (!course.value?._id || !authStore.user) return false
  return authStore.user.courseRegister?.includes(course.value._id) || false
})

const totalLessons = computed(() => {
  return course.value?.chapters?.reduce((total, chapter) => {
    return total + (chapter.lessons?.length || 0)
  }, 0) || 0
})

// Methods
const mapDifficulty = (level?: string) => {
  const map: Record<string, string> = {
    easy: 'Dễ',
    medium: 'Vừa',
    hard: 'Khó',
  }
  return map[level || ''] || 'Chưa xác định'
}

const convertToObjectArray = () => {
  const contacts = (course.value?.instructor as any)?.contacts || {}
  socialMediaArray.value = Object.entries(contacts).map(([key, value]) => ({
    icon: getIcon(key),
    link: key === 'email' ? `mailto:${value}` : value as string,
  }))
}

const getIcon = (key: string) => {
  const icons: Record<string, string> = {
    facebook: '/images/svg/facebook.svg',
    email: '/images/svg/email.png',
    website: '/images/svg/google.svg',
    linkedin: '/images/svg/linkedin-original.svg',
  }
  return icons[key] || ''
}

const openSocial = (url: string) => {
  window.open(url, '_blank')
}

const addToCart = async () => {
  if (!course.value) return
  
  try {
    await cartStore.addToCart({
      courseId: course.value._id,
      quantity: 1
    })
  } catch (error) {
    console.error('Error adding to cart:', error)
  }
}

const toggleCourse = () => {
  if (!course.value) return
  
  cartStore.toggleCourse({
    _id: course.value._id,
    title: course.value.title,
    description: course.value.description,
    shortDescription: course.value.shortDescription,
    thumbnail: course.value.thumbnail,
    price: course.value.price,
    priceSale: course.value.priceSale,
    slug: course.value.slug,
    rate: course.value.rate,
    reviewsCount: course.value.reviewsCount,
    videoCount: course.value.videoCount,
    documentCount: course.value.documentCount,
    examCount: course.value.examCount,
  })
}

const redirectCheckout = () => {
  if (!isInCart.value) {
    addToCart()
  }
  router.push('/checkout')
}

const accessCourse = () => {
  // Redirect to course learning page or show course content
  // For now, just show a message - you can implement actual course access later
  // router.push(`/learning/${course.value?.slug}`)
  alert('Tính năng truy cập khóa học đang được phát triển!')
}

const handleTabChange = async (key: string) => {
  if (key === '3' && !reviews.value.length) {
    try {
      loadingReview.value = true
      await coursesStore.fetchReviews(course.value?._id || '')
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      loadingReview.value = false
    }
  }
}

const fetchData = async () => {
  try {
    const slug = route.params.slug as string
    await coursesStore.fetchDetail(slug)
    convertToObjectArray()
  } catch (error) {
    console.error('❌ Error fetching course detail:', error)
    // Redirect to home if course not found
    router.push('/')
  }
}

// Lifecycle
onMounted(async () => {
  await fetchData()
  // Load cart if user is logged in
  if (authStore.isLoggedIn) {
    await cartStore.fetchCart()
  }
})

// Watch route changes
watch(() => route.params.slug, () => {
  if (route.params.slug) {
    fetchData()
  }
})
</script>

<style scoped>
.card-container :deep(.ant-tabs-content) {
  margin-top: -16px;
}

.card-container > :deep(.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-nav-wrap) {
  @apply px-5;
}

.card-container > :deep(.ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane) {
  background: #fff;
  padding: 16px;
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

/* Custom colors to match original design */
.text-primary-100 {
  color: #2176FF;
}

.bg-prim-100 {
  background-color: #2176FF;
}

.stroke-prim-100 {
  stroke: #2176FF;
}

.bg-second-100 {
  background-color: #15CF74;
}

.border-second-100 {
  border-color: #15CF74;
}

.text-gray-40 {
  color: #E5E5E5;
}

.border-gray-40 {
  border-color: #E5E5E5;
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

