<template>
  <div class="bg-blue-50 rounded-none lg:rounded-lg p-6 border-b border-gray-200 lg:border-0">
    <div class="grid grid-cols-3 gap-4">
      <!-- Weight -->
      <div class="flex flex-col items-center justify-center">
        <h4 class="text-blue-600 font-semibold mb-2 text-sm">Cân nặng</h4>
        <div class="text-center">
          <span class="text-3xl lg:text-3xl font-bold text-gray-800">
            {{ healthBook.weight || "--" }}
          </span>
          <span class="text-sm font-medium text-gray-600 ml-1">kg</span>
        </div>
      </div>

      <!-- Divider -->
      <div
        class="flex flex-col items-center justify-center relative before:absolute before:w-px before:h-3/4 before:left-0 before:bg-gray-300 after:absolute after:w-px after:h-3/4 after:right-0 after:bg-gray-300"
      >
        <h4 class="text-blue-600 font-semibold mb-2 text-sm">Chiều cao</h4>
        <div class="text-center">
          <span class="text-3xl lg:text-3xl font-bold text-gray-800">
            {{ healthBook.height || "--" }}
          </span>
          <span class="text-sm font-medium text-gray-600 ml-1">cm</span>
        </div>
      </div>

      <!-- Gender -->
      <div class="flex flex-col items-center justify-center">
        <h4 class="text-blue-600 font-semibold mb-2 text-sm">Giới tính</h4>
        <div class="flex items-center justify-center h-10">
          <svg
            v-if="healthBook.gender === 'male'"
            class="w-10 h-10 text-blue-500"
            width="31"
            height="29"
            viewBox="0 0 31 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.6767 28.7442C6.18789 28.7442 0.906616 23.6007 0.906616 17.2764C0.906616 10.9521 6.18789 5.80469 12.6767 5.80469C19.1654 5.80469 24.4467 10.9521 24.4467 17.2764C24.4467 23.6007 19.1654 28.7442 12.6767 28.7442ZM12.6767 10.5598C8.87935 10.5598 5.78539 13.5714 5.78539 17.2764C5.78539 20.9814 8.87528 23.993 12.6767 23.993C16.474 23.993 19.5679 20.9814 19.5679 17.2764C19.5679 13.5714 16.474 10.5598 12.6767 10.5598Z"
              fill="#0076CE"
            />
            <path
              d="M19.2712 13.2218C18.6451 13.2218 18.0231 12.988 17.5474 12.5244C16.596 11.5971 16.596 10.0913 17.5474 9.16012L24.089 2.7843C25.0404 1.85706 26.5853 1.85706 27.5407 2.7843C28.4921 3.71155 28.4921 5.21734 27.5407 6.14855L20.9991 12.5244C20.5234 12.988 19.8973 13.2218 19.2712 13.2218Z"
              fill="#0076CE"
            />
            <path
              d="M27.6667 11.1381C26.321 11.1381 25.2273 10.0722 25.2273 8.76055V5.15063H21.2958C19.9501 5.15063 18.8564 4.08469 18.8564 2.77307C18.8564 1.46145 19.9501 0.395508 21.2958 0.395508H27.6667C29.0124 0.395508 30.1061 1.46145 30.1061 2.77307V8.76055C30.1061 10.0722 29.0165 11.1381 27.6667 11.1381Z"
              fill="#0076CE"
            />
            <path
              d="M12.6767 28.3487C6.18789 28.3487 0.906616 23.2052 0.906616 16.8809C0.906616 10.5566 6.18789 5.40918 12.6767 5.40918C19.1654 5.40918 24.4467 10.5566 24.4467 16.8809C24.4467 23.2052 19.1654 28.3487 12.6767 28.3487ZM12.6767 10.1643C8.87935 10.1643 5.78539 13.1759 5.78539 16.8809C5.78539 20.5859 8.87528 23.5975 12.6767 23.5975C16.474 23.5975 19.5679 20.5859 19.5679 16.8809C19.5679 13.1759 16.474 10.1643 12.6767 10.1643Z"
              fill="#2278B2"
            />
            <path
              d="M19.2712 12.8263C18.6451 12.8263 18.0231 12.5925 17.5474 12.1289C16.596 11.2016 16.596 9.69583 17.5474 8.76462L24.089 2.3888C25.0404 1.46155 26.5853 1.46155 27.5407 2.3888C28.4921 3.31604 28.4921 4.82183 27.5407 5.75304L20.9991 12.1289C20.5234 12.5925 19.8973 12.8263 19.2712 12.8263Z"
              fill="#2278B2"
            />
            <path
              d="M27.6667 10.7426C26.321 10.7426 25.2273 9.67667 25.2273 8.36505V4.75512H21.2958C19.9501 4.75512 18.8564 3.68918 18.8564 2.37756C18.8564 1.06594 19.9501 0 21.2958 0H27.6667C29.0124 0 30.1061 1.06594 30.1061 2.37756V8.36505C30.1061 9.67667 29.0165 10.7426 27.6667 10.7426Z"
              fill="#2278B2"
            />
            <path
              d="M5.3789 5.76855C5.3789 5.76855 2.29307 7.49229 0.500122 11.1418"
              stroke="#2278B2"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M26.195 17.6055C26.195 17.6055 26.2316 19.9474 25.1664 22.1783"
              stroke="#2278B2"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <svg
            v-else-if="healthBook.gender === 'female'"
            class="w-10 h-10 text-pink-500"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"
            />
          </svg>
          <span v-else class="text-gray-500">--</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HealthBook } from "~/types/api";

interface Props {
  healthBook: HealthBook;
}

defineProps<Props>();
</script>
