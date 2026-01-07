<template>
  <footer class="bg-white">
    <!-- Main Footer Content -->
    <div class="container mx-auto py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Left Section - Logo and Slogan -->
        <div class="flex flex-col items-start">
          <!-- Logo -->
          <div class="flex items-center mb-4">
            <div class="flex items-center space-x-2">
              <!-- Pink figure -->
              <div class="w-6 h-8 bg-pink-400 rounded-t-full flex items-end justify-center">
                <div class="w-2 h-2 bg-white rounded-full mb-1"></div>
              </div>
              <!-- Blue figure -->
              <div class="w-6 h-8 bg-blue-400 rounded-t-full flex items-end justify-center">
                <div class="w-2 h-2 bg-white rounded-full mb-1"></div>
              </div>
            </div>
            <div class="ml-3 flex flex-col">
              <div class="text-pink-500 text-sm font-bold">CARE</div>
              <div class="text-blue-500 text-lg font-bold">VAN PHUC</div>
            </div>
          </div>
          
          <!-- Slogan -->
          <p class="text-gray-700 text-sm">
            Hành trình cùng Mẹ, trải đầy yêu thương
          </p>
        </div>

        <!-- Middle Section - Contact Information -->
        <div class="flex flex-col">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Thông tin</h3>
          
          <!-- Phone -->
          <div class="flex items-center mb-3">
            <svg class="w-4 h-4 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            <span class="text-gray-700 text-sm">(024) 6329 6698 - 0908093198</span>
          </div>

          <!-- Email -->
          <div class="flex items-center mb-3">
            <svg class="w-4 h-4 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <span class="text-gray-700 text-sm">cskh@vanphuccare.vn</span>
          </div>

          <!-- Address 1 - Hanoi -->
          <div class="flex items-start mb-3">
            <svg class="w-4 h-4 text-gray-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span class="text-gray-700 text-sm">
              Lô A47, tập thể Trung ương Đoàn, đường Nguyễn Khánh Toàn, Tổ 51, P. Quan Hoa, Q. Cầu Giấy, TP Hà Nội
            </span>
          </div>

          <!-- Address 2 - Ho Chi Minh -->
          <div class="flex items-start">
            <svg class="w-4 h-4 text-gray-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span class="text-gray-700 text-sm">
              540/24 đường Cách Mạng Tháng 8, Q. 3, TP Hồ Chí Minh
            </span>
          </div>
        </div>

        <!-- Right Section - App Download and Social Media -->
        <div class="flex flex-col">
          <!-- App Download -->
          <div class="mb-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Tải app Myvanphuccare</h3>
            <div class="flex flex-col sm:flex-row gap-3">
              <div class="w-auto cursor-pointer">
                <img class="w-[120px] h-auto object-contain" src="/images/download-google-app.png" alt="Google Play" />
              </div>
              <div class="w-auto cursor-pointer">
                <img class="w-[120px] h-auto object-contain" src="/images/download-iphone-app.png" alt="App Store" />
              </div>
            </div>
          </div>

          <!-- Social Media -->
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-4">Kết nối với chúng tôi</h3>
            <div class="flex items-center space-x-3">
              <!-- Facebook -->
              <a href="#" class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              <!-- Twitter -->
              <a href="#" class="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>

              <!-- Instagram -->
              <a href="#" class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-colors">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.388 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                </svg>
              </a>

              <!-- LinkedIn -->
              <a href="#" class="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.662H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>

              <!-- YouTube -->
              <a href="#" class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="bg-blue-600 py-4">
      <div class="container mx-auto">
        <div class="flex items-center justify-start">
          <a href="#" class="text-white text-sm hover:text-gray-200 transition-colors">
            Điều khoản
          </a>
          <div class="w-px h-4 bg-white mx-4"></div>
          <a href="#" class="text-white text-sm hover:text-gray-200 transition-colors">
            Chính sách bảo mật
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer component logic if needed
</script>
