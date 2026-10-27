export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuth()
  if (!auth.initialized.value) await auth.fetchMe()
  if (auth.user.value) return navigateTo('/dashboard')
})
