<template>
  <header :class="['bg-prim-100 text-white shadow-lg', props.className]">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <img
            src="/images/logo-small.png"
            alt="Van Phuc Care"
            class="h-8 w-auto md:hidden"
          />
          <img
            src="/images/logo-large.png"
            alt="Van Phuc Care"
            class="h-8 w-auto hidden md:block"
          />
        </div>

        <div class="flex justify-end">
          <!-- Navigation -->
          <nav class="hidden lg:flex items-center gap-4">
            <NuxtLink
              to="/courses"
              class="hover:text-gray-200 transition-colors rounded p-2 flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <g clip-path="url(#clip0_644_765)">
                  <path
                    d="M14 0H2C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2L0 16H16V2C16 1.46957 15.7893 0.960859 15.4142 0.585786C15.0391 0.210714 14.5304 0 14 0V0ZM14.6667 2V3.33333H10V1.33333H14C14.1768 1.33333 14.3464 1.40357 14.4714 1.5286C14.5964 1.65362 14.6667 1.82319 14.6667 2ZM7.33333 1.33333H8.66667V5.33333H7.33333V1.33333ZM2 1.33333H6V3.33333H1.33333V2C1.33333 1.82319 1.40357 1.65362 1.5286 1.5286C1.65362 1.40357 1.82319 1.33333 2 1.33333ZM1.33333 14.6667V4.66667H6V6.66667H10V4.66667H14.6667V14.6667H1.33333ZM10 12H13.3333V13.3333H10V12Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_644_765">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Tất cả khóa học
            </NuxtLink>
            <NuxtLink
              to="/my-learning"
              class="hover:text-gray-200 transition-colors rounded p-2 flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <g clip-path="url(#clip0_644_769)">
                  <path
                    d="M15.2813 1.13336C15.0568 0.945176 14.7935 0.808883 14.5103 0.734207C14.227 0.659531 13.9308 0.648314 13.6427 0.701356L9.52267 1.45002C8.9331 1.55632 8.39663 1.85838 8 2.30736C7.60367 1.85764 7.06716 1.55486 6.47733 1.44802L2.35733 0.699356C2.06918 0.647031 1.77305 0.658628 1.48987 0.733328C1.20669 0.808028 0.943372 0.944008 0.718521 1.13166C0.49367 1.31931 0.312775 1.55405 0.188618 1.8193C0.0644604 2.08455 7.11635e-05 2.37382 0 2.66669L0 13.8894L8 15.3447L16 13.8894V2.66669C16 2.37404 15.9357 2.08496 15.8115 1.81997C15.6873 1.55498 15.5063 1.32057 15.2813 1.13336ZM7.33333 13.8667L1.33333 12.7774V2.66669C1.33342 2.56908 1.35493 2.47268 1.39636 2.3843C1.43779 2.29593 1.49811 2.21772 1.57308 2.15521C1.64805 2.09271 1.73583 2.04743 1.83022 2.02257C1.92461 1.99771 2.0233 1.99388 2.11933 2.01136L6.23867 2.76002C6.54588 2.81592 6.82374 2.97786 7.02378 3.21763C7.22383 3.45739 7.33338 3.75976 7.33333 4.07202V13.8667ZM14.6667 12.776L8.66667 13.8667V4.07202C8.66662 3.75976 8.77617 3.45739 8.97622 3.21763C9.17626 2.97786 9.45412 2.81592 9.76133 2.76002L13.8807 2.01136C13.9767 1.99388 14.0754 1.99771 14.1698 2.02257C14.2642 2.04743 14.352 2.09271 14.4269 2.15521C14.5019 2.21772 14.5622 2.29593 14.6036 2.3843C14.6451 2.47268 14.6666 2.56908 14.6667 2.66669V12.776Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_644_769">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Khóa học của tôi
            </NuxtLink>
            <span class="w-[1px] h-3 bg-white"></span>
            <!-- User Info Banner (only show when logged in) -->
            <div
              v-if="isLoggedIn"
              class="relative"
            >
              <div
                class="user-profile flex items-center gap-4 px-4 py-2 cursor-pointer hover:bg-white/10 rounded-lg transition-all"
                @click.stop="toggleUserMenu"
              >
                <!-- Avatar -->
                <img
                  :src="userAvatar || '/images/avatar-fallback.png'"
                  :alt="userName"
                  class="w-12 h-12 rounded-full object-cover border-2 border-white"
                  @error="(e) => (e.target as HTMLImageElement).src = '/images/avatar-fallback.png'"
                />
                <!-- User Info -->
                <div class="flex flex-col">
                  <div class="text-white font-semibold text-base leading-tight">
                    {{ userName }}
                  </div>
                  <div class="text-white text-sm opacity-90 leading-tight">
                    {{ userEmail }}
                  </div>
                </div>
                <svg
                  class="text-white/80 transition-transform"
                  :class="{ 'rotate-180': showUserMenu }"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M19.92 8.95L13.4 15.47C12.63 16.24 11.37 16.24 10.6 15.47L4.08 8.95"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>

              <!-- User Dropdown Menu -->
              <div
                v-if="showUserMenu"
                class="user-dropdown absolute top-[calc(100%+8px)] right-0 min-w-[200px] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-[100]"
              >
                <!-- Chỉnh sửa thông tin -->
                <a
                  :href="crmProfileUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-3 px-4 py-3 text-gray-700 text-sm transition-all hover:bg-gray-50 hover:text-blue-500 border-none bg-transparent w-full text-left cursor-pointer"
                  @click="handleCrmLinkClick($event, crmProfileUrl)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <g clip-path="url(#clip0_244_8848)">
                      <path d="M14 2.66667H10V2C10 1.46957 9.78929 0.960859 9.41421 0.585786C9.03914 0.210714 8.53043 0 8 0C7.46957 0 6.96086 0.210714 6.58579 0.585786C6.21071 0.960859 6 1.46957 6 2V2.66667H2C1.46957 2.66667 0.960859 2.87738 0.585786 3.25245C0.210714 3.62753 0 4.13623 0 4.66667L0 16H16V4.66667C16 4.13623 15.7893 3.62753 15.4142 3.25245C15.0391 2.87738 14.5304 2.66667 14 2.66667ZM7.33333 2C7.33333 1.82319 7.40357 1.65362 7.5286 1.5286C7.65362 1.40357 7.82319 1.33333 8 1.33333C8.17681 1.33333 8.34638 1.40357 8.47141 1.5286C8.59643 1.65362 8.66667 1.82319 8.66667 2V4H7.33333V2ZM14.6667 14.6667H1.33333V4.66667C1.33333 4.48986 1.40357 4.32029 1.5286 4.19526C1.65362 4.07024 1.82319 4 2 4H6V5.33333H10V4H14C14.1768 4 14.3464 4.07024 14.4714 4.19526C14.5964 4.32029 14.6667 4.48986 14.6667 4.66667V14.6667ZM2.66667 13.3333H7.33333V6.66667H2.66667V13.3333ZM4 8H6V12H4V8ZM8.66667 9.33333H13.3333V10.6667H8.66667V9.33333ZM8.66667 6.66667H13.3333V8H8.66667V6.66667ZM8.66667 12H12V13.3333H8.66667V12Z" fill="currentColor"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_244_8848">
                        <rect width="16" height="16" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                  <span>Chỉnh sửa thông tin</span>
                </a>
                <!-- Lịch sử giao dịch -->
                <a
                  :href="crmTransactionsUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-3 px-4 py-3 text-gray-700 text-sm transition-all hover:bg-gray-50 hover:text-blue-500 border-none bg-transparent w-full text-left cursor-pointer"
                  @click="handleCrmLinkClick($event, crmTransactionsUrl)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <g clip-path="url(#clip0_244_8854)">
                      <path d="M6.66667 16H0V14.6667H6.66667V16ZM5.33333 12H0V13.3333H5.33333V12ZM4 9.33333H0V10.6667H4V9.33333ZM8 0C5.87897 0.00229405 3.84547 0.845885 2.34568 2.34568C0.845885 3.84547 0.00229405 5.87897 0 8H1.33333C1.33333 6.68146 1.72433 5.39253 2.45687 4.2962C3.18941 3.19987 4.2306 2.34539 5.44878 1.8408C6.66695 1.33622 8.0074 1.2042 9.3006 1.46143C10.5938 1.71867 11.7817 2.3536 12.714 3.28595C13.6464 4.21831 14.2813 5.40619 14.5386 6.6994C14.7958 7.9926 14.6638 9.33305 14.1592 10.5512C13.6546 11.7694 12.8001 12.8106 11.7038 13.5431C10.6075 14.2757 9.31854 14.6667 8 14.6667V16C10.1217 16 12.1566 15.1571 13.6569 13.6569C15.1571 12.1566 16 10.1217 16 8C16 5.87827 15.1571 3.84344 13.6569 2.34315C12.1566 0.842855 10.1217 0 8 0V0ZM7.33333 4.66667V8.276L9.52867 10.4713L10.4713 9.52867L8.66667 7.724V4.66667H7.33333Z" fill="currentColor"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_244_8854">
                        <rect width="16" height="16" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                  <span>Lịch sử giao dịch</span>
                </a>
                <!-- Sổ sức khỏe điện tử -->
                <a
                  :href="crmHealthBookUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-3 px-4 py-3 text-gray-700 text-sm transition-all hover:bg-gray-50 hover:text-blue-500 border-none bg-transparent w-full text-left cursor-pointer"
                  @click="handleCrmLinkClick($event, crmHealthBookUrl)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <g clip-path="url(#clip0_244_8859)">
                      <path d="M13.3332 0H1.99984V2H0.666504V3.33333H1.99984V4.66667H0.666504V6H1.99984V7.33333H0.666504V8.66667H1.99984V10H0.666504V11.3333H1.99984V12.6667H0.666504V14H1.99984V16H13.3332C13.8636 16 14.3723 15.7893 14.7474 15.4142C15.1225 15.0391 15.3332 14.5304 15.3332 14V2C15.3332 1.46957 15.1225 0.960859 14.7474 0.585786C14.3723 0.210714 13.8636 0 13.3332 0V0ZM13.9998 14C13.9998 14.1768 13.9296 14.3464 13.8046 14.4714C13.6796 14.5964 13.51 14.6667 13.3332 14.6667H3.33317V1.33333H13.3332C13.51 1.33333 13.6796 1.40357 13.8046 1.5286C13.9296 1.65362 13.9998 1.82319 13.9998 2V14ZM8.6665 8C9.06207 8 9.44875 7.8827 9.77764 7.66294C10.1065 7.44318 10.3629 7.13082 10.5143 6.76537C10.6656 6.39991 10.7052 5.99778 10.6281 5.60982C10.5509 5.22186 10.3604 4.86549 10.0807 4.58579C9.80101 4.30608 9.44465 4.1156 9.05668 4.03843C8.66872 3.96126 8.26659 4.00087 7.90114 4.15224C7.53569 4.30362 7.22333 4.55996 7.00357 4.88886C6.7838 5.21776 6.6665 5.60444 6.6665 6C6.6665 6.53043 6.87722 7.03914 7.25229 7.41421C7.62736 7.78929 8.13607 8 8.6665 8ZM11.9998 10.6667V12H10.6665V10.6667C10.6665 10.4899 10.5963 10.3203 10.4712 10.1953C10.3462 10.0702 10.1766 10 9.99984 10H7.33317C7.15636 10 6.98679 10.0702 6.86177 10.1953C6.73674 10.3203 6.6665 10.4899 6.6665 10.6667V12H5.33317V10.6667C5.33317 10.1362 5.54388 9.62753 5.91896 9.25245C6.29403 8.87738 6.80274 8.66667 7.33317 8.66667H9.99984C10.5303 8.66667 11.039 8.87738 11.4141 9.25245C11.7891 9.62753 11.9998 10.1362 11.9998 10.6667Z" fill="currentColor"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_244_8859">
                        <rect width="16" height="16" fill="currentColor"/>
                      </clipPath>
                    </defs>
                  </svg>
                  <span>Sổ sức khỏe điện tử</span>
                </a>
                <!-- Divider -->
                <div class="border-t border-gray-200"></div>
                <!-- Đăng xuất -->
                <button
                  class="flex items-center gap-3 px-4 py-3 text-gray-700 text-sm transition-all hover:bg-gray-50 hover:text-red-500 border-none bg-transparent w-full text-left cursor-pointer"
                  @click="handleLogout"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M8.9 7.56C9.21 3.96 11.06 2.49 15.11 2.49H15.24C19.71 2.49 21.5 4.28 21.5 8.75V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24 20.08 8.91 16.54"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M15 12H3.62"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M5.85 8.65L2.5 12L5.85 15.35"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
            <!-- Login Link (only show when not logged in) -->
            <NuxtLink
              v-else
              to="/login"
              class="hover:text-gray-200 transition-colors rounded p-2 flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <g clip-path="url(#clip0_644_1855)">
                  <path
                    d="M1.33333 14V2C1.33333 1.82319 1.40357 1.65362 1.5286 1.5286C1.65362 1.40357 1.82319 1.33333 2 1.33333H5.33333V0H2C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2L0 14C0 14.5304 0.210714 15.0391 0.585786 15.4142C0.960859 15.7893 1.46957 16 2 16H5.33333V14.6667H2C1.82319 14.6667 1.65362 14.5964 1.5286 14.4714C1.40357 14.3464 1.33333 14.1768 1.33333 14Z"
                    fill="white"
                  />
                  <path
                    d="M16 8.66626V7.33293L5.0373 7.35359L7.9193 4.47093L6.9753 3.52826L3.91797 6.58559C3.54303 6.96065 3.3324 7.46926 3.3324 7.99959C3.3324 8.52992 3.54303 9.03854 3.91797 9.41359L6.9753 12.4709L7.91797 11.5283L5.07597 8.68626L16 8.66626Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_644_1855">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Đăng nhập
            </NuxtLink>
            <!-- Cart Icon -->
            <NuxtLink
              to="/cart"
              class="relative hover:bg-white/10 rounded-lg transition-colors shrink-0 p-2 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="24"
                viewBox="0 0 22 19"
                fill="none"
              >
                <g clip-path="url(#clip0_644_784)">
                  <path
                    d="M16 5H2.828L2.8 4.766C2.7427 4.27961 2.50892 3.83115 2.14299 3.50565C1.77706 3.18015 1.30442 3.00023 0.814667 3L0 3V4.33333H0.814667C0.977956 4.33335 1.13556 4.3933 1.25758 4.50181C1.3796 4.61032 1.45756 4.75983 1.47667 4.922L2.53333 13.9007C2.59063 14.3871 2.82441 14.8355 3.19034 15.161C3.55627 15.4865 4.02891 15.6664 4.51867 15.6667H13.3333V14.3333H4.51867C4.35528 14.3333 4.19759 14.2733 4.07555 14.1646C3.95351 14.056 3.87562 13.9063 3.85667 13.744L3.76933 13H14.5573L16 5ZM13.4427 11.6667H3.61267L2.98533 6.33333H14.4047L13.4427 11.6667Z"
                    fill="white"
                  />
                  <path
                    d="M4.66683 19.0004C5.40321 19.0004 6.00016 18.4034 6.00016 17.6671C6.00016 16.9307 5.40321 16.3337 4.66683 16.3337C3.93045 16.3337 3.3335 16.9307 3.3335 17.6671C3.3335 18.4034 3.93045 19.0004 4.66683 19.0004Z"
                    fill="white"
                  />
                  <path
                    d="M11.3333 19.0004C12.0697 19.0004 12.6667 18.4034 12.6667 17.6671C12.6667 16.9307 12.0697 16.3337 11.3333 16.3337C10.597 16.3337 10 16.9307 10 17.6671C10 18.4034 10.597 19.0004 11.3333 19.0004Z"
                    fill="white"
                  />
                </g>

                <path
                  d="M17.2124 7.484C16.9244 7.88 16.5224 8.078 16.0004 8.078C15.4784 8.078 15.0764 7.88 14.7824 7.484C14.4944 7.088 14.3504 6.56 14.3504 5.9C14.3504 5.24 14.4944 4.712 14.7824 4.316C15.0764 3.92 15.4784 3.722 16.0004 3.722C16.5224 3.722 16.9244 3.92 17.2124 4.316C17.5064 4.712 17.6504 5.24 17.6504 5.9C17.6504 6.56 17.5064 7.088 17.2124 7.484ZM16.0004 7.406C16.6244 7.406 16.9604 6.866 16.9604 5.9C16.9604 4.934 16.6244 4.394 16.0004 4.394C15.3824 4.394 15.0404 4.934 15.0404 5.9C15.0404 6.866 15.3824 7.406 16.0004 7.406Z"
                  fill="white"
                />
                <defs>
                  <clipPath id="clip0_644_784">
                    <rect
                      width="16"
                      height="16"
                      fill="white"
                      transform="translate(0 3)"
                    />
                  </clipPath>
                </defs>
              </svg>
              <span
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
              >
                {{ cartCount }}
              </span>
            </NuxtLink>
          </nav>
          <!-- Right Side -->
          <div class="flex items-center gap-2 sm:gap-4">
            <!-- Mobile Menu Button -->
            <button
              class="lg:hidden w-9 h-9 p-2 bg-white hover:bg-white/70 rounded-lg transition-colors"
              @click="mobileMenuOpen = !mobileMenuOpen"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M2.45456 4.90894C2.45456 4.45708 2.82088 4.09076 3.27274 4.09076H16.3637C16.8155 4.09076 17.1818 4.45708 17.1818 4.90894C17.1818 5.36081 16.8155 5.72712 16.3637 5.72712H3.27274C2.82088 5.72712 2.45456 5.36081 2.45456 4.90894ZM2.45456 9.81803C2.45456 9.36615 2.82088 8.99985 3.27274 8.99985H16.3637C16.8155 8.99985 17.1818 9.36615 17.1818 9.81803C17.1818 10.2699 16.8155 10.6362 16.3637 10.6362H3.27274C2.82088 10.6362 2.45456 10.2699 2.45456 9.81803ZM2.45456 14.7271C2.45456 14.2752 2.82088 13.9089 3.27274 13.9089H16.3637C16.8155 13.9089 17.1818 14.2752 17.1818 14.7271C17.1818 15.179 16.8155 15.5453 16.3637 15.5453H3.27274C2.82088 15.5453 2.45456 15.179 2.45456 14.7271Z"
                  fill="#317BC4"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Overlay -->
      <Teleport to="body">
        <Transition name="fade">
          <div 
            v-if="mobileMenuOpen" 
            class="lg:hidden fixed inset-0 bg-black/50 z-[99]"
            @click="mobileMenuOpen = false"
          />
        </Transition>
        <Transition name="slide">
          <Sidebar 
            v-if="mobileMenuOpen"
            :is-mobile="true"
            @close="mobileMenuOpen = false"
          />
        </Transition>
      </Teleport>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useCartStore } from "~/stores/cart";
import { useAuthStore } from "~/stores/auth";
import Sidebar from "~/components/layout/Sidebar.vue";

const props = defineProps<{
  className: string
}>()

const cartStore = useCartStore();
const authStore = useAuthStore();
const config = useRuntimeConfig();

// Reactive data
const mobileMenuOpen = ref(false);
const showUserMenu = ref(false);

// Computed properties
const cartCount = computed(() => cartStore.cartCount);
const isLoggedIn = computed(() => authStore.isLoggedIn);
const user = computed(() => authStore.user);
const userName = computed(() => authStore.userName || 'User');
const userEmail = computed(() => authStore.userEmail || 'user@example.com');
const userAvatar = computed(() => authStore.user?.avatar || '/images/avatar-fallback.png');

// CRM Base URL
const crmBaseUrl = computed(() => config.public.baseUrlCrm || 'http://localhost:3101');

// SSO URLs for CRM - use functions to avoid require in computed
const getCrmProfileUrl = () => {
  if (!isLoggedIn.value) return '#';
  try {
    const { buildSSOUrl } = require('~/utils/sso');
    return buildSSOUrl(crmBaseUrl.value, '/profile');
  } catch {
    return crmBaseUrl.value + '/profile';
  }
};

const getCrmTransactionsUrl = () => {
  if (!isLoggedIn.value) return '#';
  try {
    const { buildSSOUrl } = require('~/utils/sso');
    return buildSSOUrl(crmBaseUrl.value, '/transactions');
  } catch {
    return crmBaseUrl.value + '/transactions';
  }
};

const getCrmHealthBookUrl = () => {
  if (!isLoggedIn.value) return '#';
  try {
    const { buildSSOUrl } = require('~/utils/sso');
    return buildSSOUrl(crmBaseUrl.value, '/');
  } catch {
    return crmBaseUrl.value + '/';
  }
};

const crmProfileUrl = computed(() => getCrmProfileUrl());
const crmTransactionsUrl = computed(() => getCrmTransactionsUrl());
const crmHealthBookUrl = computed(() => getCrmHealthBookUrl());

// Watch for user changes
watch(() => authStore.user, (newUser) => {
}, { immediate: true })

// Auto refresh user data on mount and window focus
const handleFocus = async () => {
  if (authStore.isAuthenticated && authStore.token) {
    await authStore.refreshUserData();
  }
};

let stopLogoutMonitor: (() => void) | null = null;

onMounted(async () => {
  // Refresh user data on component mount if authenticated
  if (authStore.isAuthenticated && authStore.token) {
    await authStore.refreshUserData();
  }

  // Refresh user data when window gains focus (user switches back to this tab)
  window.addEventListener('focus', handleFocus);

  // Click outside to close user menu
  document.addEventListener('click', handleClickOutside);

  // Monitor logout sync cookie from CRM site
  if (process.client) {
    const { startLogoutSyncMonitor } = await import('~/utils/authSync');
    stopLogoutMonitor = startLogoutSyncMonitor(async () => {
      // Logout if sync cookie detected
      if (authStore.isAuthenticated) {
        await authStore.logout();
      }
    });
  }
});

onUnmounted(() => {
  window.removeEventListener('focus', handleFocus);
  document.removeEventListener('click', handleClickOutside);
  if (stopLogoutMonitor) {
    stopLogoutMonitor();
  }
});

// Methods
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const closeUserMenu = () => {
  showUserMenu.value = false;
};

const handleCrmLinkClick = async (event: MouseEvent, url: string | undefined) => {
  console.log('[SSO] handleCrmLinkClick called with URL:', url);
  event.preventDefault();
  closeUserMenu();
  
  if (!url || url === '#') {
    console.warn('[SSO] Invalid URL, skipping SSO');
    return;
  }
  
  try {
    console.log('[SSO] Extracting path from URL:', url);
    // Extract path from URL
    let path = '/';
    try {
      const urlObj = new URL(url);
      path = urlObj.pathname;
      console.log('[SSO] Extracted path:', path);
    } catch (e) {
      console.warn('[SSO] URL parsing failed, trying regex:', e);
      const match = url.match(/https?:\/\/[^\/]+(\/.*)?$/);
      path = match && match[1] ? match[1] : '/';
      console.log('[SSO] Extracted path (regex):', path);
    }
    
    console.log('[SSO] Importing buildSSOUrl...');
    const { buildSSOUrl } = await import('~/utils/sso');
    const baseUrl = String(crmBaseUrl.value || 'http://localhost:3101');
    console.log('[SSO] Base URL:', baseUrl, 'Path:', path);
    const ssoUrl = buildSSOUrl(baseUrl, path);
    console.log('[SSO] SSO URL generated:', ssoUrl);
    
    console.log('[SSO] Waiting 100ms for cookie to be set...');
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log('[SSO] Opening new tab with URL:', ssoUrl);
    window.open(ssoUrl, '_blank', 'noopener,noreferrer');
  } catch (error) {
    console.error('[SSO] Error setting SSO cookie:', error);
    if (url) {
      console.log('[SSO] Fallback: opening URL without SSO:', url);
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
};

const handleLogout = async () => {
  try {
    closeUserMenu();
    await authStore.logout();
    navigateTo("/");
  } catch (error) {
    console.error("❌ Logout failed:", error);
  }
};

// Click outside to close dropdown
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".user-profile") && !target.closest(".user-dropdown")) {
    showUserMenu.value = false;
  }
};
</script>

<style scoped>
/* Custom colors to match design */
.bg-prim-100 {
  background-color: #2176ff;
}

.text-primary-100 {
  color: #2176ff;
}

/* Ensure buttons are visible and properly styled */
.ant-btn {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 4px 8px !important;
  font-size: 14px !important;
}

/* Override any conflicting styles */
.ant-btn-primary {
  background-color: white !important;
  border-color: white !important;
  color: #2176ff !important;
}

.ant-btn-primary:hover {
  background-color: #f9fafb !important;
  border-color: #f9fafb !important;
  color: #2176ff !important;
}

@media screen and (min-width: 768px) {
  .ant-btn {
    padding: 8px 24px !important;
    font-size: 16px !important;
  }
}

/* Mobile menu transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
