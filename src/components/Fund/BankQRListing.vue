<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getS3Image } from '@/utils/S3.js'

const upiOptions = ['upi1@bank', 'upi2@bank', 'upi3@bank', 'upi4@bank']
const qrImages = ref<string[]>([])
const activeUpiIndex = ref<number>(0)
const copied = ref(false)
const isLoading = ref(true)

onMounted(async () => {
  const paths = ['qr/qr_1.png', 'qr/qr_2.png', 'qr/qr_3.png', 'qr/qr_4.png']
  try {
    const results = await Promise.all(paths.map(getS3Image))
    qrImages.value = results
  } catch (error) {
    console.error('Error loading QR images', error)
  } finally {
    isLoading.value = false
  }
})

const QrImage = computed(() =>
    qrImages.value.length > activeUpiIndex.value ? qrImages.value[activeUpiIndex.value] : ''
)

function copyUpi() {
  const upi = upiOptions[activeUpiIndex.value]
  navigator.clipboard.writeText(upi).then(() => {
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  })
}
</script>


<template>
  <div>
    <div class="text-xl text-center text-gray-300 mb-4 font-bold py-5">
      You can use any of the UPI IDs below to make your payment.<br />
      If one fails, try the next.
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 justify-center mb-6">
      <button
          v-for="(upi, index) in upiOptions"
          :key="index"
          @click="activeUpiIndex = index"
          :class="[
          'rounded-md p-2 font-medium border transition',
          activeUpiIndex === index
            ? 'bg-cyan-900 border-cyan-400 text-white'
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        ]"
      >
        UPI OPTION {{ index + 1 }}
      </button>
    </div>

    <div class="flex justify-center">
      <div class="flex justify-between bg-gray-800 p-2 rounded-md font-medium max-w-md w-full">
<!--        <div class="sm:text-[10px] xs:text-[10px]">
          <span class="text-slate-400 text-[12px]">UPI ID:</span>
          <p class="text-[12px]">{{ upiOptions[activeUpiIndex.value] }}</p>
        </div>
        <button @click="copyUpi" class="group relative text-yellow-500 hover:text-white transition pr-1">
          COPY
          <span
              class="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-black text-xs text-white px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-all"
          >
            {{ copied.value ? 'Copied!' : 'Click to copy' }}
          </span>
        </button>-->
      </div>
    </div>

    <div class="text-sm text-center text-gray-300 max-w-xl mx-auto px-2 py-4">
      SCAN QR CODE
    </div>

    <div class="flex justify-center pb-5">
      <div v-if="isLoading" class="h-48 w-48 bg-gray-700 animate-pulse rounded-md"></div>
      <transition name="fade">
        <img

            class="max-h-48 rounded-md"
            :src="QrImage"
            :key="QrImage"
            alt="QR Code"
        />
      </transition>
    </div>

    <div class="text-sm text-center text-gray-400 max-w-xl mx-auto px-2">
      <svg class="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="..." />
      </svg>
      Point your smartphone’s camera at the QR code provided. Ensure it's within the frame and clearly visible.
    </div>

    <div class="flex justify-center mt-4">
      <div class="flex justify-between bg-gray-800 p-3 rounded-md font-medium w-full max-w-md">
        <div>Minimum Deposit:</div>
        <div>1500 <span class="text-gray-500">INR</span></div>
      </div>
    </div>

    <div class="text-sm text-center text-gray-400 max-w-xl mx-auto px-2 mt-2">
      <svg class="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="..." />
      </svg>
      If your payment is successful, take a screenshot and submit it on the deposit portal.
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
