<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <AuthForm />
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
  await authStore.getCurrentUser()
  if (authStore.user) {
    router.push('/dashboard')
  }
})
</script>