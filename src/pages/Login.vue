<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import CandleStick from "@/components/CandleStick.vue";
import Lucide from "@/components/Base/Lucide";
import { login } from '@/services/authService'

const router = useRouter()

// Refs
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isDark = ref(true)
const isLoading = ref(false)
const emailError = ref('')
const passwordError = ref('')
const invalidCreds = ref('')
const errorNotification = ref(false)
const turnstile_token = ref('')


// Dark mode toggle
function toggleDark() {
  isDark.value = !isDark.value
}
watch(isDark, (val) => {
  const html = document.documentElement
  html.classList.toggle('dark', val)
}, { immediate: true })

// Toggle password visibility
function togglePassword() {
  showPassword.value = !showPassword.value
}

// Input validation
function validateInputs() {
  emailError.value = ''
  passwordError.value = ''
  invalidCreds.value = ''

  if (!email.value) {
    emailError.value = 'Email is required'
  } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    emailError.value = 'Invalid email address'
  }

  if (!password.value) {
    passwordError.value = 'Password is required'
  }

  return !emailError.value && !passwordError.value
}

// Final login logic
async function handleLogin() {
  if (!validateInputs()) return


  invalidCreds.value = ''
  isLoading.value = true
  errorNotification.value = false

  try {
    const response = await login(email.value, password.value)
    const { client, token } = response.result

    localStorage.setItem('userData', JSON.stringify(client))
    localStorage.setItem('authToken', token)

    let onboardingAnswers = {}
    if (typeof client.onboarding_answers === 'string') {
      try {
        onboardingAnswers = JSON.parse(client.onboarding_answers)
      } catch (e) {
        console.error('Failed to parse onboarding_answers:', e)
      }
    }

    localStorage.setItem('onboarding', JSON.stringify(onboardingAnswers))

    if (client.email_verified === 0) {
      router.push('/verify-email')
    } else {
      router.push('/')
    }
  } catch (error: any) {
    if (error.response?.status === 422) {
      const errorData = error.response.data
      if (errorData?.result?.ask_reset) {
        router.push({ name: 'reset-password', query: { email: email.value } })
      } else {
        invalidCreds.value = errorData.message || 'Invalid Credentials'
      }
    } else if (error.response?.status === 400) {
      errorNotification.value = true
    } else {
      invalidCreds.value = 'Invalid Credentials'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Uses Tailwind CSS for styling */
</style>

<template>
  <section
      class="relative bg-gray-50 dark:bg-stone-950 min-h-screen flex items-center justify-center"
  >
    <!-- Dark/Light Mode Toggle -->
    <button
        @click="toggleDark"
        class="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 focus:outline-none"
    >
      <span v-if="isDark" class="text-yellow-300">☀️</span>
      <span v-else class="text-gray-800">🌙</span>
    </button>

    <div class="bg-gray-100 dark:bg-custom-gradient-dark flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
      <!-- form -->
      <div class="md:w-1/2 px-4">
        <img src="/logo_wide.svg" class="w-56 content-center">
        <h2 class="font-bold text-2xl text-[#002D74] dark:text-gray-400 pt-5">Login</h2>
        <p class="text-xs mt-1 text-[#002D74] dark:text-gray-400">
          If you are already a member, easily log in
        </p>

        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
          <input
              v-model="email"
              class="p-2 mt-4 rounded-xl border bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              type="email"
              name="email"
              placeholder="Email"
              required
          />

          <div class="relative">
            <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Password"
                required
                class="p-2 rounded-xl border w-full bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            />
            <button type="button" @click="togglePassword" class="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Lucide :icon="showPassword ? 'EyeOff' : 'Eye'" class="w-5 h-5 text-gray-400" />
            </button>

          </div>


          <button
              type="submit"
              :disabled="isLoading"
              class="bg-gradient-to-r from-[#f1b926] to-[#d93d18] text-white dark:text-black font-semibold rounded-xl px-6 py-2 shadow-md border border-[#a67c2d] hover:brightness-110 hover:scale-105 transition duration-300 flex items-center justify-center"
          >
            <span v-if="!isLoading">LOGIN</span>
            <span v-else>
    <svg class="animate-spin h-5 w-5 mr-2 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
    </svg>
    LOGGING IN...
  </span>
          </button>




        </form>

        <div class="mt-6 grid grid-cols-3 items-center text-gray-400 dark:text-gray-600">
          <hr class="border-gray-400 dark:border-gray-600" />
          <p class="text-center text-sm">NEW HERE ?</p>
          <hr class="border-gray-400 dark:border-gray-600" />
        </div>

        <button
            @click="router.push('/register')"
            class="bg-white dark:bg-gray-700 border dark:border-gray-600 py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 text-[#002D74] dark:text-gray-200"
        >
          <!-- Google Icon -->

          Sign Up Now
        </button>

        <div class="mt-5 text-xs border-b border-[#002D74] dark:border-gray-600 py-4 text-[#002D74] dark:text-gray-200">
          <a href="#" @click="router.push('/forgot-password')">Forgot your password?</a>
        </div>

        <div class="mt-3 text-xs flex justify-between items-center text-[#002D74] dark:text-gray-200">
          <p>Looking something new?</p>
          <button
              @click="$emit('show-register')"
              class="py-1 px-5 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg hover:scale-110 duration-300"
          >
            SOCIAL TRADER
          </button>
        </div>
      </div>

      <!-- illustration -->
      <div class="md:block hidden w-1/2">
        <img
            class="rounded-2xl"
            src="/reg_banner.png"
            alt="Trading illustration"
        />
      </div>
    </div>
  </section>
</template>
<!--
<style lang="scss" scoped>
.background {
  background-color: #272016;
}
</style>
-->

