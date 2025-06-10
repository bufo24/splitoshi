<template>
  <div class="max-w-md mx-auto">
    <div class="card">
      <div class="text-center mb-6">
        <div class="inline-flex items-center gap-2 text-bitcoin text-3xl font-bold mb-2">
          <Zap class="w-8 h-8" />
          Splitoshi
        </div>
        <p class="text-gray-600 dark:text-gray-400">
          {{ isLogin ? 'Sign in to your account' : 'Create your account' }}
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium mb-2">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="input-field"
            placeholder="Enter your email"
          />
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium mb-2">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="input-field"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="btn-primary w-full"
        >
          <span v-if="authStore.loading" class="flex items-center justify-center gap-2">
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Loading...
          </span>
          <span v-else>{{ isLogin ? 'Sign In' : 'Sign Up' }}</span>
        </button>
      </form>

      <div class="mt-6 text-center">
        <button
          @click="isLogin = !isLogin"
          class="text-bitcoin hover:text-bitcoin-dark transition-colors"
        >
          {{ isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in" }}
        </button>
      </div>

      <div v-if="error" class="mt-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 rounded-lg">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Zap } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const error = ref('')

const handleSubmit = async () => {
  error.value = ''
  
  try {
    if (isLogin.value) {
      await authStore.signIn(email.value, password.value)
    } else {
      await authStore.signUp(email.value, password.value)
    }
    
    await authStore.getCurrentUser()
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.message || 'An error occurred'
  }
}
</script>