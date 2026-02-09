<template>
  <div class="mb-12 sm:mb-16 lg:mb-20 mt-8">
    <main class="container mx-auto pb-6 sm:pb-8 lg:pb-10 px-4 lg:px-0 xl:px-4">
      <!-- Header -->
      <div class="mb-8">
        <!-- Mobile: Centered layout -->
        <div class="md:hidden text-center">
          <h1 class="text-[32px] font-bold mb-2" style="color: #1A75BB;">
            Giỏ hàng
          </h1>
          <p class="text-[16px]" style="color: #7C7C7C;">
            ({{ cartItems.length }} sản phẩm)
          </p>
        </div>
        <!-- Desktop: Original layout -->
        <h1 class="hidden md:block text-2xl sm:text-3xl font-bold text-[#1A75BB]">
          Giỏ hàng
          <span class="text-base sm:text-lg font-normal ml-2" style="color: #7C7C7C;">
            ({{ cartItems.length }} sản phẩm)
          </span>
        </h1>
      </div>
      
      <div class="flex flex-col lg:flex-row lg:gap-8 xl:gap-12">
        <!-- Left Section: Cart Items -->
        <div class="w-full lg:w-[70%] xl:w-[60%]">
          <template v-if="cartItems.length > 0">
            <div class="space-y-4">
              <div 
                v-for="(course, index) in cartItems" 
                :key="`items_cart_${index}`" 
                class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <!-- Mobile: Vertical Layout -->
                <div class="md:hidden">
                  <!-- Course Thumbnail - Full Width Top -->
                  <div class="relative w-full aspect-[16/9]">
                    <img
                      class="w-full h-full object-cover"
                      :src="(course as any).course?.thumbnail || (course as any).thumbnail || '/images/courses/python-course.jpg'"
                      :alt="(course as any).course?.title || (course as any).title"
                    >
                  </div>
                  
                  <!-- Course Info - Bottom Section -->
                  <div class="p-4">
                    <!-- Title -->
                    <h3 
                      class="mb-3 font-bold text-lg cursor-pointer line-clamp-2 hover:underline" 
                      style="color: #1A75BB;"
                      @click="navigateTo(`/courses/${(course as any).course?.slug || (course as any).slug}`)"
                    >
                      {{ (course as any).course?.title || (course as any).title }}
                    </h3>
                    
                    <!-- Rating and Reviews -->
                    <div class="flex items-center gap-2 mb-4">
                      <Rating
                        :value="(course as any).course?.rating?.average || (course as any).rating?.average || 0"
                        :size="16"
                        active-color="#FFD74B"
                        inactive-color="#E5E7EB"
                        :disabled="true"
                        :allow-half="false"
                      />
                      <span class="text-sm text-gray-500">
                        ({{ ((course as any).course?.rating?.count || (course as any).rating?.count || 0)?.toLocaleString('en-US') }} lượt đánh giá)
                      </span>
                    </div>
                    
                    <!-- Course Content: Video, Documents, Quizzes -->
                    <div class="flex items-center gap-4 text-sm text-[#393939] mb-4 pb-4 border-b border-[#D9D9D9]">
                      <span v-if="course.course?.videoCount || course.course?.videoCount === 0" class="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 9 9" fill="none">
                          <path d="M5.86759 4.70128L5.67654 4.4078L5.66699 4.41447L5.86759 4.70128ZM5.86759 4.12602L5.66006 4.40786L5.67567 4.41936L5.69246 4.42906L5.86759 4.12602ZM3.56207 2.42835L3.7696 2.14651L3.75973 2.13924L3.74937 2.13268L3.56207 2.42835ZM3.07874 2.68192L3.42879 2.6809L3.42866 2.67478L3.07874 2.68192ZM3.0884 6.01671L2.73841 6.01773L2.73843 6.02763L2.73902 6.03751L3.0884 6.01671ZM3.58946 6.29461L3.75894 6.60084L3.77501 6.59195L3.79006 6.58142L3.58946 6.29461ZM4.36303 8.37586V8.02586C2.34005 8.02586 0.700098 6.38591 0.700098 4.36293H0.350098H9.76622e-05C9.76622e-05 6.77251 1.95345 8.72586 4.36303 8.72586V8.37586ZM8.37596 4.36293H8.02596C8.02596 6.38591 6.38601 8.02586 4.36303 8.02586V8.37586V8.72586C6.77261 8.72586 8.72596 6.77251 8.72596 4.36293H8.37596ZM4.36303 0.35V0.7C6.38601 0.7 8.02596 2.33995 8.02596 4.36293H8.37596H8.72596C8.72596 1.95335 6.77261 3.8743e-07 4.36303 3.8743e-07V0.35ZM4.36303 0.35V3.8743e-07C1.95345 3.8743e-07 9.76622e-05 1.95335 9.76622e-05 4.36293H0.350098H0.700098C0.700098 2.33995 2.34005 0.7 4.36303 0.7V0.35ZM5.86759 4.70128L6.05854 4.99461C6.23456 4.88002 6.4387 4.68699 6.43831 4.40486C6.43792 4.11489 6.2239 3.92769 6.04272 3.82299L5.86759 4.12602L5.69246 4.42906C5.71573 4.4425 5.73205 4.45407 5.74294 4.46295C5.7539 4.47188 5.75777 4.47678 5.75765 4.47663C5.7574 4.4763 5.75239 4.46982 5.74742 4.4568C5.74223 4.4432 5.73834 4.42565 5.73831 4.40582C5.73829 4.3861 5.74208 4.36984 5.74622 4.3586C5.75016 4.34792 5.75363 4.34382 5.75199 4.34604C5.75028 4.34835 5.74447 4.35554 5.73179 4.3668C5.71918 4.37801 5.70126 4.39194 5.67664 4.40796L5.86759 4.70128ZM5.86759 4.12602L6.07512 3.84419L3.7696 2.14651L3.56207 2.42835L3.35454 2.71019L5.66006 4.40786L5.86759 4.12602ZM3.56207 2.42835L3.74937 2.13268C3.56521 2.01602 3.31398 1.95371 3.0803 2.06283C2.82728 2.18096 2.72366 2.43692 2.72881 2.68906L3.07874 2.68192L3.42866 2.67478C3.42798 2.64144 3.4346 2.63752 3.42813 2.64992C3.42481 2.65625 3.41885 2.66521 3.40923 2.67452C3.39957 2.68387 3.38829 2.69156 3.37645 2.69709C3.35227 2.70838 3.33601 2.70628 3.33625 2.70631C3.33695 2.70641 3.35073 2.70879 3.37478 2.72402L3.56207 2.42835ZM3.07874 2.68192L2.72874 2.68293L2.73841 6.01773L3.0884 6.01671L3.4384 6.0157L3.42874 2.6809L3.07874 2.68192ZM3.0884 6.01671L2.73902 6.03751C2.75182 6.2524 2.82557 6.51946 3.07436 6.65234C3.31954 6.78328 3.57963 6.70008 3.75894 6.60084L3.58946 6.29461L3.41999 5.98838C3.3977 6.00071 3.37996 6.00855 3.36676 6.01336C3.35349 6.0182 3.34648 6.01936 3.34522 6.01954C3.3441 6.01969 3.35002 6.01873 3.36127 6.02038C3.37303 6.0221 3.38816 6.02635 3.40413 6.03488C3.42015 6.04344 3.43252 6.0539 3.44106 6.06343C3.44926 6.07258 3.45211 6.07879 3.45191 6.07836C3.45163 6.07775 3.4488 6.07144 3.44564 6.05728C3.44249 6.04318 3.4394 6.02306 3.43779 5.99591L3.0884 6.01671ZM3.58946 6.29461L3.79006 6.58142L6.06819 4.9881L5.86759 4.70128L5.66699 4.41447L3.38887 6.0078L3.58946 6.29461Z" fill="#393939"/>
                        </svg>
                        <span>{{ course.course?.videoCount }} video</span>
                      </span>
                      <span v-if="course.course?.documentCount || course.course?.documentCount === 0" class="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 9 8" fill="none">
                          <path d="M7.53101 3.15905V1.28635H4.1517L3.30687 0.35H0.349976V7.37263H1.61722V6.90445L2.88446 3.15905H8.37584L7.1086 7.37263H1.1948" stroke="#393939" stroke-width="0.7" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>{{ course.course?.documentCount }} Tài liệu</span>
                      </span>
                      <span v-if="course.course?.quizCount || course.course?.quizCount === 0" class="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 9 9" fill="none">
                          <path d="M3.59632 8.37586H1.43209C0.83445 8.37586 0.349972 7.92669 0.349976 7.37262L0.350017 1.35323C0.350021 0.799161 0.8345 0.35 1.43213 0.35H6.30177C6.89941 0.35 7.38389 0.799164 7.38389 1.35324V4.11213M5.21967 6.95463L6.21161 7.87427L8.37584 5.86771M2.24385 2.35647H5.49019M2.24385 3.86132H5.49019M2.24385 5.36618H3.86702" stroke="#393939" stroke-width="0.7" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>{{ course.course?.quizCount }} bài trắc nghiệm</span>
                      </span>
                    </div>
                    
                    <!-- Price and Remove Button - Bottom Section -->
                    <div class="flex items-center justify-between">
                      <!-- Price -->
                      <div>
                        <div v-if="(course as any).course?.price || (course as any).price" class="text-xl font-bold text-gray-900">
                          {{ Number((course as any).course?.price || (course as any).price).toLocaleString('vi-VN') }} Đ
                        </div>
                        <div v-else class="text-xl font-bold text-green-600">
                          Miễn phí
                        </div>
                        <div v-if="(course as any).course?.originalPrice && (course as any).course?.originalPrice !== (course as any).course?.price" class="text-sm line-through text-gray-400 mt-1">
                          {{ Number((course as any).course?.originalPrice || (course as any).originalPrice).toLocaleString('vi-VN') }} Đ
                        </div>
                      </div>
                      
                      <!-- Remove Button -->
                      <button
                        class="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors shadow-sm flex-shrink-0"
                        @click="handleRemoveFromCart(course)"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="fill-none stroke-white">
                          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Desktop: Horizontal Layout -->
                <div class="hidden md:flex" style="width: 100%;">
                  <!-- Course Thumbnail - Left Section (40%) -->
                  <div class="w-[40%] flex-shrink-0 relative aspect-[16/9]">
                    <img
                      class="w-full h-full object-cover"
                      :src="(course as any).course?.thumbnail || (course as any).thumbnail || '/images/courses/python-course.jpg'"
                      :alt="(course as any).course?.title || (course as any).title"
                    >
                  </div>
                  
                  <!-- Course Info - Right Section (60%) -->
                  <div class="flex-1 min-w-0 p-4 sm:p-6 relative">
                    <!-- Title -->
                    <h3 
                      class="mb-2 font-bold text-lg cursor-pointer line-clamp-2 hover:underline pr-24" 
                      style="color: #1A75BB;"
                      @click="navigateTo(`/courses/${(course as any).course?.slug || (course as any).slug}`)"
                    >
                      {{ (course as any).course?.title || (course as any).title }}
                    </h3>
                    
                    <!-- Rating and Reviews -->
                    <div class="flex items-center gap-2 mb-2">
                      <Rating
                        :value="(course as any).course?.rating?.average || (course as any).rating?.average || 0"
                        :size="14"
                        active-color="#FFD74B"
                        inactive-color="#E5E7EB"
                        :disabled="true"
                        :allow-half="false"
                      />
                      <span class="text-xs text-gray-500">
                        ({{ ((course as any).course?.rating?.count || (course as any).rating?.count || 0)?.toLocaleString('en-US') }} lượt đánh giá)
                      </span>
                    </div>
                    
                    <!-- Course Content: Video, Documents, Quizzes -->
                    <div class="flex items-center gap-4 text-xs text-[#393939] mb-2 pb-2 border-b border-[#D9D9D9]">
                      <span v-if="course.course?.videoCount || course.course?.videoCount === 0" class="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 9 9" fill="none">
                          <path d="M5.86759 4.70128L5.67654 4.4078L5.66699 4.41447L5.86759 4.70128ZM5.86759 4.12602L5.66006 4.40786L5.67567 4.41936L5.69246 4.42906L5.86759 4.12602ZM3.56207 2.42835L3.7696 2.14651L3.75973 2.13924L3.74937 2.13268L3.56207 2.42835ZM3.07874 2.68192L3.42879 2.6809L3.42866 2.67478L3.07874 2.68192ZM3.0884 6.01671L2.73841 6.01773L2.73843 6.02763L2.73902 6.03751L3.0884 6.01671ZM3.58946 6.29461L3.75894 6.60084L3.77501 6.59195L3.79006 6.58142L3.58946 6.29461ZM4.36303 8.37586V8.02586C2.34005 8.02586 0.700098 6.38591 0.700098 4.36293H0.350098H9.76622e-05C9.76622e-05 6.77251 1.95345 8.72586 4.36303 8.72586V8.37586ZM8.37596 4.36293H8.02596C8.02596 6.38591 6.38601 8.02586 4.36303 8.02586V8.37586V8.72586C6.77261 8.72586 8.72596 6.77251 8.72596 4.36293H8.37596ZM4.36303 0.35V0.7C6.38601 0.7 8.02596 2.33995 8.02596 4.36293H8.37596H8.72596C8.72596 1.95335 6.77261 3.8743e-07 4.36303 3.8743e-07V0.35ZM4.36303 0.35V3.8743e-07C1.95345 3.8743e-07 9.76622e-05 1.95335 9.76622e-05 4.36293H0.350098H0.700098C0.700098 2.33995 2.34005 0.7 4.36303 0.7V0.35ZM5.86759 4.70128L6.05854 4.99461C6.23456 4.88002 6.4387 4.68699 6.43831 4.40486C6.43792 4.11489 6.2239 3.92769 6.04272 3.82299L5.86759 4.12602L5.69246 4.42906C5.71573 4.4425 5.73205 4.45407 5.74294 4.46295C5.7539 4.47188 5.75777 4.47678 5.75765 4.47663C5.7574 4.4763 5.75239 4.46982 5.74742 4.4568C5.74223 4.4432 5.73834 4.42565 5.73831 4.40582C5.73829 4.3861 5.74208 4.36984 5.74622 4.3586C5.75016 4.34792 5.75363 4.34382 5.75199 4.34604C5.75028 4.34835 5.74447 4.35554 5.73179 4.3668C5.71918 4.37801 5.70126 4.39194 5.67664 4.40796L5.86759 4.70128ZM5.86759 4.12602L6.07512 3.84419L3.7696 2.14651L3.56207 2.42835L3.35454 2.71019L5.66006 4.40786L5.86759 4.12602ZM3.56207 2.42835L3.74937 2.13268C3.56521 2.01602 3.31398 1.95371 3.0803 2.06283C2.82728 2.18096 2.72366 2.43692 2.72881 2.68906L3.07874 2.68192L3.42866 2.67478C3.42798 2.64144 3.4346 2.63752 3.42813 2.64992C3.42481 2.65625 3.41885 2.66521 3.40923 2.67452C3.39957 2.68387 3.38829 2.69156 3.37645 2.69709C3.35227 2.70838 3.33601 2.70628 3.33625 2.70631C3.33695 2.70641 3.35073 2.70879 3.37478 2.72402L3.56207 2.42835ZM3.07874 2.68192L2.72874 2.68293L2.73841 6.01773L3.0884 6.01671L3.4384 6.0157L3.42874 2.6809L3.07874 2.68192ZM3.0884 6.01671L2.73902 6.03751C2.75182 6.2524 2.82557 6.51946 3.07436 6.65234C3.31954 6.78328 3.57963 6.70008 3.75894 6.60084L3.58946 6.29461L3.41999 5.98838C3.3977 6.00071 3.37996 6.00855 3.36676 6.01336C3.35349 6.0182 3.34648 6.01936 3.34522 6.01954C3.3441 6.01969 3.35002 6.01873 3.36127 6.02038C3.37303 6.0221 3.38816 6.02635 3.40413 6.03488C3.42015 6.04344 3.43252 6.0539 3.44106 6.06343C3.44926 6.07258 3.45211 6.07879 3.45191 6.07836C3.45163 6.07775 3.4488 6.07144 3.44564 6.05728C3.44249 6.04318 3.4394 6.02306 3.43779 5.99591L3.0884 6.01671ZM3.58946 6.29461L3.79006 6.58142L6.06819 4.9881L5.86759 4.70128L5.66699 4.41447L3.38887 6.0078L3.58946 6.29461Z" fill="#393939"/>
                        </svg>
                        <span>{{ course.course?.videoCount }} video</span>
                      </span>
                      <span v-if="course.course?.documentCount || course.course?.documentCount === 0" class="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 9 8" fill="none">
                          <path d="M7.53101 3.15905V1.28635H4.1517L3.30687 0.35H0.349976V7.37263H1.61722V6.90445L2.88446 3.15905H8.37584L7.1086 7.37263H1.1948" stroke="#393939" stroke-width="0.7" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>{{ course.course?.documentCount }} Tài liệu</span>
                      </span>
                      <span v-if="course.course?.quizCount || course.course?.quizCount === 0" class="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 9 9" fill="none">
                          <path d="M3.59632 8.37586H1.43209C0.83445 8.37586 0.349972 7.92669 0.349976 7.37262L0.350017 1.35323C0.350021 0.799161 0.8345 0.35 1.43213 0.35H6.30177C6.89941 0.35 7.38389 0.799164 7.38389 1.35324V4.11213M5.21967 6.95463L6.21161 7.87427L8.37584 5.86771M2.24385 2.35647H5.49019M2.24385 3.86132H5.49019M2.24385 5.36618H3.86702" stroke="#393939" stroke-width="0.7" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>{{ course.course?.quizCount }} bài trắc nghiệm</span>
                      </span>
                    </div>
                    
                    <!-- Price - Top Right Corner -->
                    <div class="absolute top-4 right-4 text-right">
                      <div v-if="(course as any).course?.price || (course as any).price" class="text-lg font-bold text-gray-900 mb-1">
                        {{ Number((course as any).course?.price || (course as any).price).toLocaleString('vi-VN') }} Đ
                      </div>
                      <div v-else class="text-lg font-bold text-green-600 mb-1">
                        Miễn phí
                      </div>
                      <div v-if="(course as any).course?.originalPrice && (course as any).course?.originalPrice !== (course as any).course?.price" class="text-xs line-through text-gray-400">
                        {{ Number((course as any).course?.originalPrice || (course as any).originalPrice).toLocaleString('vi-VN') }} Đ
                      </div>
                    </div>
                    
                    <!-- Remove Button - Bottom Right Corner -->
                    <div class="absolute bottom-4 right-4">
                      <button
                        class="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors shadow-sm"
                        @click="handleRemoveFromCart(course)"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" class="fill-none stroke-white">
                          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          
          <!-- Empty State -->
          <div v-else class="text-center">
            <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8 md:p-12">
              <div class="mx-auto mb-4 sm:mb-6 flex items-center justify-center overflow-hidden">
                <img 
                  src="/images/tu_van_vien2.png" 
                  alt="Giỏ hàng trống" 
                  class="w-[280px] h-[227px] sm:w-[320px] sm:h-[260px] md:w-[360px] md:h-[292px] object-cover scale-125"
                  style="object-position: center;"
                />
              </div>
              <h3 class="text-xl sm:text-2xl font-bold text-gray-700 mb-2 sm:mb-3">Giỏ hàng của bạn đang trống</h3>
              <p class="text-sm sm:text-base md:text-lg text-gray-500 mb-6 sm:mb-8 px-4">Hãy thêm một số khóa học để bắt đầu hành trình học tập của bạn!</p>
              <div class="flex justify-center">
                <a-button 
                  type="primary" 
                  size="large" 
                  class="!bg-prim-100 !py-3 sm:!py-4 !h-auto sm:!h-[60px] !text-white !border-prim-100 !text-base sm:!text-lg md:!text-xl !font-bold !rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 !flex !items-center !justify-center !gap-3 sm:gap-4 !px-6 sm:!px-8"
                  @click="navigateTo('/')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="fill-none stroke-current sm:w-6 sm:h-6">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>Khám phá khóa học</span>
                </a-button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Section: Order Summary -->
        <div class="w-full lg:flex-1 mt-6 lg:mt-0">
          <div class="lg:sticky lg:top-28">
            <div class=" overflow-hidden">
              <!-- Content -->
              <div>
                <!-- Coupon Input -->
                <div class="mb-6">
                  <h4 class="text-base sm:text-lg font-bold text-gray-800 mb-3">
                    Nhập mã ưu đãi
                  </h4>
                  <CouponInput @coupon-applied="handleCouponApplied" />
                </div>
                
                <!-- Payment Summary -->
                <div class="mb-6">
                  <h4 class="text-base sm:text-lg font-bold text-gray-800 mb-4">
                    Thanh toán
                  </h4>
                  
                  <div class="space-y-3">
                    <div class="flex justify-between items-center">
                      <span class="text-sm sm:text-base text-gray-600">Tổng giá trị sản phẩm</span>
                      <span class="text-sm sm:text-base font-semibold text-gray-900">{{ subtotalPrice.toLocaleString('vi-VN') }} Đ</span>
                    </div>
                    
                    <div v-if="appliedCoupon" class="flex justify-between items-center">
                      <span class="text-sm sm:text-base text-gray-600">Mã ưu đãi</span>
                      <span class="text-sm sm:text-base font-semibold text-[#F48284]">
                        {{ discountAmount > 0 ? '-' + discountAmount.toLocaleString('vi-VN') : '0' }} Đ
                      </span>
                    </div>
                    
                    <div class="flex justify-between items-center">
                      <span class="text-sm sm:text-base text-gray-600">VAT</span>
                      <span class="text-sm sm:text-base font-semibold text-[#27C840]">{{'+' + vatPrice.toLocaleString('vi-VN') }} Đ</span>
                    </div>

                    <div class="flex justify-between items-center pt-3 border-t border-gray-200">
                      <span class="text-base sm:text-lg font-bold text-gray-900">Tổng số tiền</span>
                      <span class="text-lg sm:text-xl font-bold text-gray-900">{{ totalPrice.toLocaleString('vi-VN') }} Đ</span>
                    </div>
                  </div>
                </div>
              
                <!-- Payment Methods -->
                <div class="space-y-3">
                  <a-button 
                    type="primary"
                    size="large"
                    class="w-full !bg-[#1A75BB] !h-12 sm:!h-14 !text-white !border-prim-100 !text-base sm:!text-base !font-semibold !rounded-lg"
                    :disabled="cartItems.length === 0 || isProcessingOrderQr"
                    :loading="isProcessingOrderQr"
                    @click="handlePayment('qr')"
                  >
                    Thanh toán bằng QR Banking
                  </a-button>
                  
                  <a-button 
                    type="primary"
                    size="large"
                    class="w-full flex items-center justify-center gap-2 !bg-[#2579F2] !h-12 sm:!h-14 !text-white !border-prim-100 !text-base sm:!text-base !font-semibold !rounded-lg"
                    :disabled="cartItems.length === 0 || isProcessingOrderVnpay"
                    :loading="isProcessingOrderVnpay"
                    @click="handlePayment('vnpay')"
                  >
                    Thanh toán bằng 
                    <svg width="77" height="14" viewBox="0 0 77 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0">
                      <g clip-path="url(#clip0_326_2805)">
                        <path d="M64.8052 0.946852C65.5642 0.397336 66.5388 0.211345 67.4702 0.278978C68.255 0.355065 69.0054 0.7355 69.5229 1.31883C70.1611 2.06279 70.4457 3.06883 70.3163 4.0326C70.1956 4.86956 69.8075 5.6727 69.1606 6.23912C69.6609 6.71255 70.1611 7.21135 70.7993 7.51569C71.1012 7.66787 71.4289 7.76086 71.7652 7.80313C71.4979 8.00603 71.2046 8.18357 70.8855 8.30192C70.4026 8.46255 69.8592 8.47946 69.3849 8.29347C68.6432 8.01449 68.0394 7.49033 67.4357 6.99154C67.3495 6.907 67.2115 6.95772 67.108 6.95772C66.2283 7.10144 65.2968 6.80555 64.6414 6.23067C63.9514 5.63888 63.5547 4.7512 63.4857 3.86352C63.3477 2.74758 63.8738 1.58936 64.8052 0.946852ZM66.3749 1.28502C65.9868 1.39492 65.7022 1.71618 65.5556 2.07125C65.3831 2.49395 65.34 2.96738 65.3486 3.41545C65.34 3.81279 65.4176 4.21014 65.5556 4.58212C65.6849 4.98792 65.8919 5.38526 66.211 5.68115C66.6164 6.05313 67.2632 6.11231 67.7376 5.85023C68.0739 5.66424 68.2464 5.30072 68.3499 4.9541C68.5138 4.39613 68.4793 3.80434 68.4103 3.23792C68.324 2.76449 68.2033 2.2826 67.9359 1.8768C67.6168 1.37801 66.9527 1.13284 66.3749 1.28502Z" fill="white"/>
                        <path d="M0.301758 0.355072C1.73343 0.355072 3.16511 0.355072 4.59678 0.355072C5.7956 3.58454 6.98579 6.81401 8.1846 10.0435C9.19367 7.38889 10.2114 4.74275 11.2204 2.08816C11.2894 1.90217 11.2894 1.68237 11.2032 1.49638C11.0221 1.10749 10.8151 0.735507 10.6081 0.37198C11.6775 0.37198 12.747 0.37198 13.8164 0.37198C13.6526 0.955314 13.4283 1.52174 13.23 2.09662C11.8155 5.96014 10.3925 9.82367 8.96943 13.6872C7.75337 13.4589 6.53731 13.0024 5.60586 12.1739C5.13151 11.7597 4.80377 11.2186 4.56229 10.6522C4.30355 10.035 4.06206 9.41787 3.80333 8.80072C2.78563 6.26449 1.75931 3.72826 0.732985 1.19203C0.612242 0.904589 0.465624 0.625603 0.301758 0.355072Z" fill="white"/>
                        <path d="M14.2822 0.355072C15.6794 0.355072 17.068 0.355072 18.4651 0.355072C20.7248 3.07729 22.9758 5.80797 25.2354 8.53865C25.2354 6.43357 25.2354 4.32005 25.2354 2.21498C25.2354 1.98671 25.2527 1.73309 25.1233 1.53019C24.8732 1.13285 24.5886 0.752415 24.3126 0.37198C25.658 0.37198 27.0034 0.37198 28.3402 0.37198C28.0211 0.769323 27.702 1.16667 27.3743 1.56401C27.2794 1.67391 27.2536 1.81763 27.2536 1.9529C27.2536 5.88406 27.2536 9.80676 27.2536 13.7379C26.4256 13.628 25.5804 13.4674 24.8214 13.1039C24.1401 12.7826 23.545 12.2838 23.062 11.7089C21.1819 9.43478 19.3017 7.16063 17.4129 4.89493C17.4129 7.2029 17.4129 9.51087 17.4129 11.8188C17.4043 11.971 17.4561 12.1147 17.5596 12.2246C17.8787 12.6135 18.1978 13.0109 18.5169 13.4082C17.1715 13.4082 15.826 13.4082 14.4892 13.4082C14.7048 13.0785 14.9291 12.7572 15.1619 12.4444C15.2999 12.25 15.4207 12.0217 15.412 11.7766C15.412 9.78986 15.412 7.79469 15.412 5.80797C15.4034 4.56522 15.4207 3.32246 15.4034 2.08816C15.0498 1.49638 14.6531 0.938405 14.2822 0.355072Z" fill="white"/>
                        <path d="M70.5575 0.414242C71.6269 0.414242 72.705 0.414242 73.7744 0.414242C74.2229 0.405788 74.6972 0.507237 75.0681 0.769315C75.5683 1.11593 75.8098 1.75845 75.7236 2.34178C75.6546 2.69685 75.4907 3.03502 75.2147 3.28018C75.025 3.44927 74.8007 3.57608 74.5765 3.69444C74.9991 4.39613 75.4303 5.10627 75.8529 5.80796C76.0944 6.17149 76.3618 6.52656 76.6895 6.814C76.0858 6.84782 75.4734 6.93236 74.8697 6.89854C74.6196 6.89009 74.3523 6.79709 74.2056 6.59419C74.0073 6.34057 73.8865 6.04468 73.7227 5.77415C73.4208 5.21617 73.1189 4.6582 72.8171 4.10869C72.8171 4.69202 72.8171 5.27535 72.8171 5.86714C72.8171 6.10386 72.843 6.35748 72.9723 6.56883C73.0413 6.69564 73.1621 6.78018 73.2742 6.87318C72.3686 6.88163 71.4544 6.88163 70.5488 6.87318C70.6523 6.78018 70.7731 6.69564 70.8421 6.57729C70.9542 6.37439 70.9887 6.13767 70.9887 5.91787C70.9887 4.60748 70.9887 3.29709 70.9887 1.97825C70.9801 1.61473 71.0146 1.24274 70.9197 0.887672C70.8593 0.676319 70.7041 0.541054 70.5575 0.414242ZM72.8171 1.34419C72.8171 2.08816 72.8171 2.83212 72.8171 3.57608C73.0672 3.52535 73.3173 3.43236 73.507 3.25482C73.9555 2.84902 74.0245 2.11352 73.645 1.64009C73.4553 1.40337 73.1189 1.33574 72.8171 1.34419Z" fill="white"/>
                        <path d="M29.0732 0.422702C29.746 0.39734 30.4187 0.422702 31.0828 0.414248C32.4541 0.414248 33.8254 0.414248 35.1967 0.414248C36.0591 0.431157 36.9475 0.54106 37.7064 0.963765C38.2498 1.26811 38.7586 1.68236 39.0518 2.23188C39.4227 2.94203 39.5693 3.76207 39.4486 4.54831C39.3623 5.30918 39.0173 6.04468 38.4481 6.56884C37.7323 7.23671 36.7663 7.57488 35.8176 7.76087C35.4468 7.80314 35.0846 7.8285 34.7137 7.86232C34.3946 7.90459 34.0755 7.81159 33.7477 7.80314C34.386 7.54951 34.9724 7.12681 35.3174 6.53502C35.7228 5.85024 35.7831 5.02174 35.6969 4.25241C35.6279 3.71135 35.4468 3.14492 35.0156 2.77294C34.6361 2.44323 34.11 2.33333 33.6184 2.32488C33.6098 4.81038 33.6184 7.29589 33.6184 9.78985C33.6184 10.2717 33.6098 10.7536 33.627 11.227C33.6615 11.8865 33.8254 12.5882 34.2997 13.087C34.386 13.1884 34.524 13.256 34.5671 13.3828C32.7387 13.3828 30.9103 13.3913 29.0819 13.3828C29.2457 13.2391 29.4182 13.1123 29.5476 12.9432C29.8753 12.5121 29.9788 11.9541 29.9788 11.4299C29.9788 8.47101 29.9788 5.51207 29.9788 2.56159C29.9788 2.13889 29.9616 1.70773 29.815 1.30193C29.6683 0.938403 29.3665 0.667872 29.0732 0.422702Z" fill="white"/>
                        <path d="M41.7512 0.4227C43.4157 0.405791 45.0802 0.4227 46.7448 0.414246C48.0471 3.79589 49.3494 7.18598 50.6517 10.5676C50.8932 11.2186 51.1174 11.8865 51.5573 12.4444C51.7729 12.7319 52.0316 12.9855 52.299 13.2307C52.3507 13.2729 52.3852 13.3237 52.4025 13.3913C50.3326 13.3998 48.2713 13.3913 46.2014 13.3913C46.2014 13.3744 46.2014 13.3321 46.2014 13.3152C46.555 13.1208 46.9173 12.8333 47.0121 12.4191C47.107 11.9541 46.9345 11.4891 46.7879 11.058C46.6068 10.5254 46.4257 10.0012 46.2446 9.46859C44.8905 9.46859 43.5451 9.46859 42.191 9.46859C42.0358 9.90821 41.8719 10.3394 41.7167 10.779C41.5442 11.244 41.3889 11.7174 41.3199 12.2162C41.3027 12.5882 41.5701 12.901 41.8374 13.1377C41.915 13.2222 42.0444 13.2729 42.0703 13.3913C40.6731 13.3913 39.2673 13.3913 37.8701 13.3913C37.896 13.2983 37.9736 13.2391 38.0426 13.1799C38.3876 12.8756 38.6808 12.5121 38.8792 12.0978C39.1379 11.5399 39.3277 10.965 39.526 10.3901C40.4144 7.91304 41.3027 5.44444 42.1996 2.96739C42.3635 2.50241 42.536 2.02053 42.5274 1.52173C42.4929 1.03985 42.1134 0.693231 41.7512 0.4227ZM44.1402 3.68598C43.6831 4.99637 43.2346 6.30676 42.7775 7.61714C43.7089 7.61714 44.6404 7.61714 45.5718 7.61714C45.0889 6.30676 44.6145 4.99637 44.1402 3.68598Z" fill="white"/>
                        <path d="M49.4268 0.431153C51.0827 0.414245 52.73 0.431153 54.3859 0.422699C55.3949 1.98671 56.3954 3.55072 57.4045 5.11473C57.9651 4.3285 58.5343 3.54226 59.1035 2.74758C59.2932 2.47705 59.4312 2.1727 59.5261 1.8599C59.6124 1.564 59.6296 1.23429 59.4657 0.963762C59.3277 0.718593 59.0863 0.574873 58.862 0.431153C60.4317 0.414245 62.0014 0.431153 63.571 0.422699C61.9065 2.75603 60.2419 5.08937 58.5688 7.4227C58.5343 7.46497 58.5084 7.52415 58.517 7.57487C58.517 8.32729 58.517 9.07125 58.517 9.82366C58.517 10.4239 58.4998 11.0326 58.5688 11.6328C58.655 12.1316 58.793 12.6473 59.1639 13.0193C59.2587 13.1461 59.4226 13.2222 59.4744 13.3744C57.5856 13.3744 55.6968 13.3828 53.808 13.3744C53.8339 13.2814 53.9288 13.2476 54.0064 13.1884C54.3255 12.977 54.5239 12.6304 54.6187 12.2669C54.7481 11.7766 54.705 11.2609 54.7136 10.7621C54.705 9.67149 54.7222 8.57246 54.705 7.48188C53.5234 5.73188 52.316 3.99879 51.1172 2.25724C50.8326 1.83453 50.5393 1.41183 50.1943 1.03139C49.9701 0.803134 49.6855 0.625598 49.4268 0.431153Z" fill="white"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_326_2805">
                          <rect width="77" height="14" fill="white"/>
                        </clipPath>
                      </defs>
                    </svg>
                  </a-button>
                  
                  <!--  -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Cart Toast -->
    <CartToast />

    <!-- QR Payment Modal (theo Figma My Academy VPC 2025) -->
    <a-modal
      v-model:open="showQrModal"
      :footer="null"
      :closable="true"
      :maskClosable="false"
      centered
      width="480px"
      class="qr-payment-modal"
    >
      <div class="qr-modal-inner">
        <!-- Hướng dẫn trên cùng (Figma: text đậm, xám đậm) -->
        <p class="qr-modal-instruction">
          Mở ứng dụng ngân hàng/ ví điện tử, quét QR và xác nhận thanh toán
        </p>

        <div v-if="qrInfo" class="qr-modal-content">
          <!-- Khối QR: khung trắng, viền, shadow nhẹ -->
          <div class="qr-block">
            <img
              :src="qrInfo.qrCode"
              alt="QR thanh toán MB Bank"
              class="qr-block-image"
            >
            <div class="qr-block-badges">
              <span>napas 247</span>
              <span class="qr-badge-divider">|</span>
              <span>MB</span>
              <span class="qr-badge-divider">|</span>
              <span class="qr-badge-vietqr">VIETQR</span>
            </div>
          </div>

          <!-- Lưu ý màu đỏ (Figma: red notice) -->
          <p class="qr-modal-notice">
            Quý khách vui lòng giữ nguyên màn hình cho tới khi hệ thống xác nhận thành công và chuyển về trang khóa học.
          </p>

          <!-- Thông tin chuyển khoản (Figma: label + value, số tiền blue) -->
          <div class="qr-transfer-details">
            <div class="qr-transfer-row">
              <span class="qr-transfer-label">Ngân hàng:</span>
              <span class="qr-transfer-value">MB Bank</span>
            </div>
            <div class="qr-transfer-row">
              <span class="qr-transfer-label">Số tài khoản:</span>
              <span class="qr-transfer-value">{{ qrInfo.accountNo }}</span>
            </div>
            <div class="qr-transfer-row">
              <span class="qr-transfer-label">Chủ tài khoản:</span>
              <span class="qr-transfer-value">{{ qrInfo.accountName }}</span>
            </div>
            <div class="qr-transfer-row">
              <span class="qr-transfer-label">Số tiền:</span>
              <span class="qr-transfer-amount">{{ Number(qrInfo.amount).toLocaleString('vi-VN') }}₫</span>
            </div>
            <div class="qr-transfer-row">
              <span class="qr-transfer-label">Nội dung chuyển khoản:</span>
              <span class="qr-transfer-value qr-transfer-content">{{ qrInfo.content }}</span>
            </div>
          </div>

          <!-- Hết hạn -->
          <p class="qr-expiry">
            Hết hạn sau: <strong>{{ formatSeconds(qrCountdown) }}</strong>
          </p>

          <!-- Nút Đóng (Figma: nền xám nhạt, viền, chữ xám) -->
          <div class="qr-modal-actions">
            <div v-if="qrError" class="qr-error-text">{{ qrError }}</div>
            <div class="qr-actions-buttons">
              <a-button v-if="qrError" type="primary" :loading="isProcessingOrderQr" @click="retryQr">Tạo mã QR mới</a-button>
              <button type="button" class="qr-btn-close" @click="closeQrModal">Đóng</button>
            </div>
          </div>
        </div>

        <div v-else class="qr-loading">
          Đang chuẩn bị mã QR thanh toán...
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { message } from 'ant-design-vue'
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'
import { useCoursesStore } from '~/stores/courses'
import { useApiBase } from '~/composables/useApiBase'
import CartToast from '~/components/cart/Toast.vue'
import CouponInput from '~/components/cart/CouponInput.vue'
import Rating from '~/components/courses/Rating.vue'

const cartStore = useCartStore()
const authStore = useAuthStore()
const coursesStore = useCoursesStore()

// Cấu hình E-Learning (VAT % từ admin setting)
const { data: elearningPublic } = useFetch<{ vatPercent: number }>('/api/settings/elearning-public')
const vatPercentRate = computed(() => ((elearningPublic.value?.vatPercent ?? 8) / 100))

// Loading state for payments
const isProcessingOrder = ref(false)
const isProcessingOrderVnpay = ref(false)
const isProcessingOrderQr = ref(false)

// QR payment state (SePay)
const showQrModal = ref(false)
const qrInfo = ref<any | null>(null)
const qrPaymentStatus = ref<'pending' | 'completed' | 'expired'>('pending')
let qrStatusInterval: any = null
let qrPollingActive = ref(false)

// Polling / TTL control
const QR_POLL_INTERVAL_MS = 10000
const QR_TTL_SECONDS = 15 * 60 // 15 minutes
const MAX_POLLING_ATTEMPTS = Math.ceil(QR_TTL_SECONDS / (QR_POLL_INTERVAL_MS / 1000))

const qrExpiresAt = ref<number | null>(null) // timestamp ms when QR expires
const qrPollingAttempts = ref(0)
const qrError = ref<string | null>(null)

const now = ref(Date.now())
let qrTickInterval: any = null

const qrCountdown = computed(() => {
  if (!qrExpiresAt.value) return 0
  return Math.max(0, Math.floor((qrExpiresAt.value - now.value) / 1000))
})

const clearQrTick = () => {
  if (qrTickInterval) {
    clearInterval(qrTickInterval)
    qrTickInterval = null
  }
}

// Reactive data
const cartItems = computed(() => {
  return cartStore.items || []
})

// Trạng thái: người dùng có vừa áp dụng mã giảm giá trong phiên hiện tại không
const hasAppliedCoupon = ref(false)

// Computed properties
const subtotalPrice = computed(() => {
  return cartItems.value.reduce((total, course: any) => {
    return total + (course.course?.price || course.price || 0)
  }, 0)
})

// Chỉ hiển thị/áp dụng mã ưu đãi nếu user vừa apply ở phiên hiện tại
const appliedCoupon = computed(() => {
  if (!hasAppliedCoupon.value) return null
  return cartStore.cart?.coupon || null
})

// Chỉ trừ tiền khi THỰC SỰ có mã ưu đãi được áp dụng,
// và không cho giảm quá số tiền sản phẩm (tránh tổng tiền âm)
const discountAmount = computed(() => {
  if (!appliedCoupon.value) return 0
  const rawDiscount = appliedCoupon.value.discountAmount || 0
  if (rawDiscount <= 0) return 0
  return Math.min(rawDiscount, subtotalPrice.value)
})

const vatPrice = computed(() => {
  const taxableAmount = Math.max(subtotalPrice.value - discountAmount.value, 0)
  return Math.round(taxableAmount * vatPercentRate.value) // VAT % từ cài đặt admin
})

const finalPrice = computed(() => {
  return Math.max(subtotalPrice.value - discountAmount.value, 0)
})

// Keep totalPrice for backward compatibility - làm tròn để không có số thập phân
const totalPrice = computed(() => Math.round(finalPrice.value + vatPrice.value))

// Helper functions to get course counts
// Similar to how [slug].vue handles it, but for cart items
const getVideoCount = (course: any): number => {
  const courseData = course.course || course
  
  // First try to get from course data (if API provides it)
  if (courseData?.videoCount !== undefined) {
    return courseData.videoCount
  }
  
  // If not available, try to calculate from chapters (like in coursesStore)
  if (courseData?.chapters && Array.isArray(courseData.chapters)) {
    let count = 0
    courseData.chapters.forEach((chapter: any) => {
      chapter.lessons?.forEach((lesson: any) => {
        if (lesson.type === 'video' || lesson.videoUrl) {
          count++
        }
      })
    })
    return count
  }
  
  return 0
}

const getDocumentCount = (course: any): number => {
  const courseData = course.course || course
  
  // First try to get from course data (if API provides it)
  if (courseData?.documentCount !== undefined) {
    return courseData.documentCount
  }
  
  // If not available, try to calculate from chapters
  if (courseData?.chapters && Array.isArray(courseData.chapters)) {
    let count = 0
    courseData.chapters.forEach((chapter: any) => {
      chapter.lessons?.forEach((lesson: any) => {
        if (lesson.type === 'document' || lesson.documentUrl || (lesson.documents && lesson.documents.length > 0)) {
          if (lesson.documents && Array.isArray(lesson.documents)) {
            count += lesson.documents.length
          } else {
            count++
          }
        }
      })
    })
    return count
  }
  
  return 0
}

const getExamCount = (course: any): number => {
  const courseData = course.course || course
  
  // First try to get from course data (if API provides it)
  if (courseData?.examCount !== undefined) {
    return courseData.examCount
  }
  
  // If not available, try to calculate from chapters
  if (courseData?.chapters && Array.isArray(courseData.chapters)) {
    let count = 0
    courseData.chapters.forEach((chapter: any) => {
      chapter.lessons?.forEach((lesson: any) => {
        if (lesson.type === 'exam' || lesson.type === 'quiz' || lesson.quizId || lesson.quiz) {
          count++
        }
      })
    })
    return count
  }
  
  return 0
}

// Methods
const handleCouponApplied = () => {
  hasAppliedCoupon.value = true
}
const handleRemoveFromCart = async (course: any) => {
  try {
    // Use courseId field (not _id which is cart item ID)
    const courseId = course.courseId || course.course?._id || course._id
    await cartStore.removeFromCart(courseId)
  } catch (error) {
  }
}

const handlePayment = async (method: string) => {
  if (cartItems.value.length === 0) return
  
  // If bypass, process order directly without checkout
  if (method === 'bypass') {
    await processBypassOrder()
    return
  }

  if (method === 'vnpay') {
    await processVnPay()
    return
  }

  if (method === 'qr') {
    await processQrOrder()
    return
  }

  // Các phương thức khác (nếu có) có thể điều hướng sang checkout
  navigateTo(`/checkout?method=${method}`)
}

const clearQrInterval = () => {
  // disable scheduling
  qrPollingActive.value = false

  if (qrStatusInterval) {
    clearTimeout(qrStatusInterval)
    qrStatusInterval = null
  }
  // reset client-side tracking
  qrExpiresAt.value = null
  qrPollingAttempts.value = 0
  // also clear the tick used for countdown
  clearQrTick()
}

const startQrStatusPolling = (orderId: string) => {
  if (!process.client) return

  clearQrInterval()
  qrPollingAttempts.value = 0
  qrError.value = null
  // set expiry from now
  qrExpiresAt.value = Date.now() + QR_TTL_SECONDS * 1000

  // start tick to update countdown every second
  clearQrTick()
  now.value = Date.now()
  qrTickInterval = setInterval(() => {
    now.value = Date.now()
  }, 1000)

  const { apiUser } = useApiBase()

  // Adaptive polling with exponential backoff + jitter
  let baseInterval = QR_POLL_INTERVAL_MS
  let currentInterval = baseInterval
  let consecutiveFailures = 0
  const maxInterval = 60 * 1000 // 1 minute cap

  const poll = async () => {
    try {
      qrPollingAttempts.value++

      // Stop if expired or reached max attempts
      if (qrExpiresAt.value && Date.now() > qrExpiresAt.value) {
        clearQrInterval()
        qrPaymentStatus.value = 'pending'
        qrError.value = 'Mã QR đã hết hạn. Vui lòng tạo mã mới.'
        isProcessingOrderQr.value = false
        return
      }

      if (qrPollingAttempts.value > MAX_POLLING_ATTEMPTS) {
        clearQrInterval()
        qrError.value = 'Mã QR đã hết hạn. Vui lòng tạo mã mới.'
        isProcessingOrderQr.value = false
        return
      }

      const res: any = await $fetch(`${apiUser}/orders/payment/qr/status/${orderId}?t=${Date.now()}`)
      // success path
      consecutiveFailures = 0
      currentInterval = baseInterval

      if (res?.data?.paid) {
        qrPaymentStatus.value = 'completed'
        clearQrInterval()

        // Clear cart sau khi thanh toán thành công
        await cartStore.clearCart()

        showQrModal.value = false

        // Sau khi thanh toán QR thành công, chuyển về trang "Khóa học của tôi"
        const order = res.data.order as any
        const resolvedOrderId = order?.orderId || order?._id

        if (resolvedOrderId) {
          await navigateTo(`/checkout/success?orderId=${resolvedOrderId}`)
        } else {
          await navigateTo('/my-learning')
        }
        return
      }
    } catch (error) {
      consecutiveFailures++
      // increase interval with exponential backoff and jitter
      currentInterval = Math.min(maxInterval, Math.pow(2, consecutiveFailures) * baseInterval)
      currentInterval = currentInterval + Math.floor(Math.random() * 1000) // jitter up to 1s

      // If too many consecutive failures, show error and stop
      if (consecutiveFailures >= 6) {
        clearQrInterval()
        qrError.value = 'Không thể kiểm tra trạng thái. Vui lòng thử lại sau.'
        isProcessingOrderQr.value = false
        return
      }
    } finally {
      // schedule next poll only if polling is still active
      if (qrPollingActive.value) {
        if (qrStatusInterval) clearTimeout(qrStatusInterval)
        qrStatusInterval = setTimeout(poll, currentInterval)
      } else {
        // ensure we clean up any stray timeout
        if (qrStatusInterval) {
          clearTimeout(qrStatusInterval)
          qrStatusInterval = null
        }
      }
    }
  }

  // mark active then start first poll immediately
  qrPollingActive.value = true
  poll()
}

// Clean up interval on unmount and when modal closed
onUnmounted(() => {
  clearQrInterval()
  clearQrTick()
})

watch(showQrModal, (val) => {
  if (!val) {
    // If user closes modal manually, stop polling and reset transient state
    clearQrInterval()
    clearQrTick()
    qrError.value = null
    qrInfo.value = null
    isProcessingOrderQr.value = false
  }
})

// Utility to format seconds to mm:ss
const formatSeconds = (s: number) => {
  const mm = Math.floor(s / 60).toString().padStart(2, '0')
  const ss = (s % 60).toString().padStart(2, '0')
  return `${mm}:${ss}`
}

const closeQrModal = () => {
  showQrModal.value = false
  qrInfo.value = null
  qrError.value = null
  qrPaymentStatus.value = 'pending'
  isProcessingOrderQr.value = false
  clearQrInterval()
}

const retryQr = async () => {
  if (isProcessingOrderQr.value) return
  qrError.value = null
  qrInfo.value = null
  qrPaymentStatus.value = 'pending'
  await processQrOrder()
}

const processQrOrder = async () => {
  if (cartItems.value.length === 0) return
  const { apiUser } = useApiBase()

  try {
    isProcessingOrderQr.value = true

    // Yêu cầu đăng nhập
    if (!authStore.user || !authStore.user.id) {
      await navigateTo('/login')
      return
    }

    // Chuẩn bị dữ liệu đơn hàng
    const orderData = {
      userId: authStore.user.id,
      customerInfo: {
        fullName: authStore.user.fullname || authStore.user.name || '',
        phone: authStore.user.phone || '',
        email: authStore.user.email || ''
      },
      items: cartItems.value.map((item: any) => ({
        courseId: item.courseId || item.course?._id || item._id,
        course: item.course || item,
        price: item.course?.price || item.price || 0
      })),
      subtotal: Math.round(subtotalPrice.value),
      discount: appliedCoupon.value ? {
        type: appliedCoupon.value.type,
        value: appliedCoupon.value.value,
        amount: Math.round(discountAmount.value),
        couponCode: appliedCoupon.value.code
      } : null,
      totalAmount: totalPrice.value, // Đã được làm tròn trong computed
      paymentMethod: 'qr',
      notes: ''
    }

    // Tạo đơn hàng
    const orderResponse: any = await $fetch(`${apiUser}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: orderData
    })

    if (!orderResponse.data || !orderResponse.data.order) {
      throw new Error('Failed to create order')
    }

    const order = orderResponse.data.order

    // Gọi API tạo QR SePay
    const qrResponse: any = await $fetch(`${apiUser}/orders/payment/qr/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        orderId: order.orderId
      }
    })

    qrInfo.value = qrResponse?.data?.qrData || null
    qrPaymentStatus.value = 'pending'

    if (!qrInfo.value) {
      throw new Error('Không tạo được mã QR thanh toán')
    }

    // Hiện popup QR ngay trên trang giỏ hàng
    showQrModal.value = true

    // Bắt đầu kiểm tra trạng thái thanh toán
    startQrStatusPolling(order.orderId)

  } catch (error: any) {
    const errorMsg = error.data?.message || error.message || 'Có lỗi xảy ra khi tạo thanh toán QR'
    message.error({
      content: errorMsg,
      duration: 5,
      style: {
        marginTop: '80px',
      },
    })
  } finally {
    isProcessingOrderQr.value = false
  }
}

const processBypassOrder = async () => {
  if (cartItems.value.length === 0) return
  const { apiUser } = useApiBase()
  try {
    isProcessingOrder.value = true
    
    // Get user info from authStore
    if (!authStore.user || !authStore.user.id) {
      await navigateTo('/login')
      return
    }
    
    // Prepare order data
    const orderData = {
      userId: authStore.user.id,
      customerInfo: {
        fullName: authStore.user.fullname || authStore.user.name || '',
        phone: authStore.user.phone || '',
        email: authStore.user.email || ''
      },
      items: cartItems.value.map((item: any) => ({
        courseId: item.courseId || item.course?._id || item._id,
        course: item.course || item,
        price: item.course?.price || item.price || 0
      })),
      subtotal: Math.round(subtotalPrice.value),
      discount: appliedCoupon.value ? {
        type: appliedCoupon.value.type,
        value: appliedCoupon.value.value,
        amount: Math.round(discountAmount.value),
        couponCode: appliedCoupon.value.code
      } : null,
      totalAmount: totalPrice.value, // Đã được làm tròn trong computed
      paymentMethod: 'bypass',
      notes: ''
    }
    
    // Create order
    const orderResponse: any = await $fetch(`${apiUser}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: orderData
    })
    
    if (!orderResponse.data || !orderResponse.data.order) {
      throw new Error('Failed to create order')
    }
    
    const order = orderResponse.data.order
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Process payment
    await $fetch(`${apiUser}/orders/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        orderId: order.orderId,
        paymentMethod: 'bypass',
        paymentData: {}
      }
    })
    
    // Clear cart after successful payment
    await cartStore.clearCart()
    // Refresh "Khóa học của tôi" ngay sau thanh toán bypass
    try {
      await coursesStore.fetchMyCourses()
    } catch (e) {
    }
    
    // Show success message
    message.success({
      content: `Bạn đã mua khoá học thành công!`,
      duration: 4,
      style: {
        marginTop: '80px',
      },
    })
    
    // Redirect to my-learning page
    await navigateTo(`/my-learning/`)
    
  } catch (error: any) {
    // Show error message to user
    const errorMsg = error.data?.message || error.message || 'Có lỗi xảy ra khi xử lý đơn hàng'
    message.error({
      content: errorMsg,
      duration: 5,
      style: {
        marginTop: '80px',
      },
    })
  } finally {
    isProcessingOrder.value = false
  }
}

const processVnPay = async () => {
  if (cartItems.value.length === 0) return
  const { apiUser } = useApiBase()
  try {
    isProcessingOrderVnpay.value = true
    
    // Get user info from authStore
    if (!authStore.user || !authStore.user.id) {
      await navigateTo('/login')
      return
    }
    
    // Prepare order data
    const orderData = {
      userId: authStore.user.id,
      customerInfo: {
        fullName: authStore.user.fullname || authStore.user.name || '',
        phone: authStore.user.phone || '',
        email: authStore.user.email || ''
      },
      items: cartItems.value.map((item: any) => ({
        courseId: item.courseId || item.course?._id || item._id,
        course: item.course || item,
        price: item.course?.price || item.price || 0
      })),
      subtotal: Math.round(subtotalPrice.value),
      discount: appliedCoupon.value ? {
        type: appliedCoupon.value.type,
        value: appliedCoupon.value.value,
        amount: Math.round(discountAmount.value),
        couponCode: appliedCoupon.value.code
      } : null,
      totalAmount: totalPrice.value, // Đã được làm tròn trong computed
      paymentMethod: 'vnpay',
      notes: ''
    }
    
    // Create order
    const orderResponse: any = await $fetch(`${apiUser}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: orderData
    })
    
    if (!orderResponse.data || !orderResponse.data.order) {
      throw new Error('Failed to create order')
    }
    
    const order = orderResponse.data.order
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Process payment
    const paymentRes: any = await $fetch(`${apiUser}/orders/payment/vnpay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        orderId: order.orderId,
        paymentData: {
          ...orderData
        }
      }
    })
    if (paymentRes?.data?.paymentUrl) {
      // Sử dụng window.location.href thay vì window.open để tránh popup blocker
      // và để payment gateway hoạt động đúng cách
      window.location.href = paymentRes.data.paymentUrl
      return true
    } else {
      throw new Error('Không nhận được URL thanh toán từ VNPAY')
    }
    
  } catch (error: any) {
    // Show error message to user
    const errorMsg = error.data?.message || error.message || 'Có lỗi xảy ra khi xử lý đơn hàng'
    message.error({
      content: errorMsg,
      duration: 5,
      style: {
        marginTop: '80px',
      },
    })
  } finally {
    isProcessingOrderVnpay.value = false
  }
}

// SEO
useHead({
  title: "Trang Giỏ hàng",
  meta: [
    {
      name: "description",
      content:
        "Xem và quản lý giỏ hàng các khóa học tại Van Phuc Care E-Learning. Thanh toán và đăng ký các khóa học trực tuyến về chăm sóc sức khỏe Mẹ và Bé",
    },
    {
      name: "keywords",
      content:
        "Khóa học trực tuyến, Vạn Phúc Care, Trang Giỏ hàng, Trang thanh toán",
    },
  ],
});

// Middleware để yêu cầu đăng nhập
definePageMeta({
  middleware: 'auth'
})

// Lifecycle
onMounted(async () => {
  // Force clear any old cart data first
  cartStore.forceClearCart()
  
  // Then fetch fresh data from backend
  await cartStore.fetchCart()
})
</script>

<style scoped>
/* QR Payment Modal - theo Figma My Academy VPC 2025 (node 2800-7457) */
.qr-modal-inner {
  padding: 20px 24px 24px;
}
.qr-modal-instruction {
  font-size: 15px;
  font-weight: 700;
  color: #393939;
  text-align: center;
  margin: 0 0 20px;
  line-height: 1.4;
}
.qr-modal-content {
  text-align: center;
}
.qr-block {
  display: inline-block;
  background: #fff;
  padding: 20px 24px 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
}
.qr-block-image {
  width: 224px;
  height: 224px;
  max-width: 100%;
  display: block;
  margin: 0 auto;
  object-fit: contain;
  border-radius: 4px;
}
.qr-block-badges {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  font-size: 13px;
  font-weight: 500;
  color: #595959;
}
.qr-badge-divider {
  color: #d9d9d9;
  font-weight: 400;
}
.qr-badge-vietqr {
  color: #DE4841;
}
.qr-modal-notice {
  font-size: 13px;
  color: #DE4841;
  text-align: center;
  margin: 16px 0 0;
  line-height: 1.5;
}
.qr-transfer-details {
  text-align: left;
  max-width: 360px;
  margin: 16px auto 0;
  font-size: 14px;
}
.qr-transfer-row {
  margin-bottom: 6px;
}
.qr-transfer-label {
  font-weight: 600;
  color: #595959;
  margin-right: 4px; /* tạo khoảng cách: Ngân hàng: MB Bank */
}
.qr-transfer-value {
  color: #262626;
  word-break: break-word;
}
.qr-transfer-amount {
  font-weight: 700;
  color: #1A75BB;
}
.qr-expiry {
  font-size: 14px;
  color: #8c8c8c;
  text-align: center;
  margin: 16px 0 0;
}
.qr-expiry strong {
  color: #262626;
}
.qr-modal-actions {
  margin-top: 20px;
  text-align: center;
}
.qr-error-text {
  font-size: 14px;
  font-weight: 600;
  color: #DE4841;
  margin-bottom: 12px;
}
.qr-actions-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.qr-btn-close {
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #595959;
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.qr-btn-close:hover {
  background: #e8e8e8;
  color: #262626;
}
.qr-loading {
  text-align: center;
  color: #8c8c8c;
  padding: 48px 16px;
  font-size: 14px;
}

/* Custom colors to match design */
.text-primary-100 {
  color: #2176FF;
}

.bg-prim-100 {
  background-color: #2176FF;
}

.border-prim-100 {
  border-color: #2176FF;
}

.text-gray-50 {
  color: #F5F5F5;
}

.border-gray-50 {
  border-color: #F5F5F5;
}

.text-gray-60 {
  color: #E5E5E5;
}

.text-gray-70 {
  color: #CCCCCC;
}

.text-gray-80 {
  color: #999999;
}

.text-gray-100 {
  color: #666666;
}

.bg-gray-50 {
  background-color: #F9FAFB;
}

.border-gray-200 {
  border-color: #E5E7EB;
}
</style>

