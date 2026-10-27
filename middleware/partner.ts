export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuth()
  if (!auth.initialized.value) await auth.fetchMe()
  if (!auth.user.value) return navigateTo({ path: '/auth/login', query: { redirect: to.fullPath } })
  const role = auth.user.value.role
  if (role !== 'bengkel_partner' && role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Hanya mitra bengkel terverifikasi. Ajukan di /verifikasi.' })
})
