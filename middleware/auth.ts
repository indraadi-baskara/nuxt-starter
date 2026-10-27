export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuth()
  if (!auth.initialized.value) await auth.fetchMe()
  if (!auth.user.value) {
    return navigateTo({ path: '/auth/login', query: { redirect: to.fullPath } })
  }
})
