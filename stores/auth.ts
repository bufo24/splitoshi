import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  lightning_address?: string
  created_at: string
}

export const useAuthStore = defineStore('auth', () => {
  const api = useApi()
  const user = ref<User | null>(null)
  const loading = ref(false)

  const signUp = async (email: string, password: string) => {
    loading.value = true
    try {
      const response = await api.post<{ user: User; token: string }>('/api/auth/signup', {
        email,
        password
      })
      user.value = response.user
      
      // Set token in cookie (handled by server)
      const tokenCookie = useCookie('auth-token')
      tokenCookie.value = response.token
      
      return response
    } finally {
      loading.value = false
    }
  }

  const signIn = async (email: string, password: string) => {
    loading.value = true
    try {
      const response = await api.post<{ user: User; token: string }>('/api/auth/signin', {
        email,
        password
      })
      user.value = response.user
      
      // Set token in cookie (handled by server)
      const tokenCookie = useCookie('auth-token')
      tokenCookie.value = response.token
      
      return response
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    await api.post('/api/auth/signout')
    user.value = null
    
    // Clear token cookie
    const tokenCookie = useCookie('auth-token')
    tokenCookie.value = null
    
    await navigateTo('/')
  }

  const getCurrentUser = async () => {
    try {
      const response = await api.get<{ user: User }>('/api/auth/me')
      user.value = response.user
      return response.user
    } catch (error) {
      user.value = null
      return null
    }
  }

  const updateLightningAddress = async (lightningAddress: string) => {
    const response = await api.patch<{ user: User }>('/api/auth/lightning-address', {
      lightning_address: lightningAddress
    })
    user.value = response.user
    return response.user
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    updateLightningAddress
  }
})