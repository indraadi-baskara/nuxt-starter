export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuth()
  if (!auth.initialized.value) await auth.fetchMe()
  if (!auth.user.value) return navigateTo({ path: '/auth/login', query: { redirect: to.fullPath } })
  const role = auth.user.value.role
  if (!['admin', 'gudang_picker'].includes(role)) throw createError({ statusCode: 403, statusMessage: 'Akses khusus staf gudang/admin — hubungi Depot Pengapon SMG-01.' })
})
