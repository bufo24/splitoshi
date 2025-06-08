export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('auth-token')
  
  if (process.client && !token.value && to.path !== '/') {
    return navigateTo('/')
  }
})