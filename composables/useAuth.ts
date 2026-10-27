export type AuthUser = { id: string; name: string; email: string; role: 'customer' | 'bengkel_partner' | 'gudang_picker' | 'admin'; phone?: string | null; image?: string | null; emailVerified?: boolean }

export function useAuth() {
  const user = useState<AuthUser | null>('auth-user', () => null)
  const loading = useState<boolean>('auth-loading', () => false)
  const initialized = useState<boolean>('auth-init', () => false)

  async function fetchMe() {
    loading.value = true
    try {
      const headers: Record<string, string> = { ...(import.meta.server ? (useRequestHeaders(['cookie']) as any) : {}) }
      const res = await $fetch<{ user: AuthUser }>('/api/me', { headers, credentials: 'include' } as any).catch(() => null)
      user.value = (res as any)?.user ?? null
      initialized.value = true
      return user.value
    } finally { loading.value = false }
  }

  async function signUp(payload: { name: string; email: string; password: string }) {
    const res = await $fetch('/api/auth/register', { method: 'POST', body: payload, credentials: 'include' } as any)
    await fetchMe()
    return res
  }

  async function signIn(payload: { email: string; password: string }) {
    const res = await $fetch('/api/auth/login', { method: 'POST', body: payload, credentials: 'include' } as any)
    await fetchMe()
    return res
  }

  async function signOut() {
    await $fetch('/api/auth/logout', { method: 'POST', credentials: 'include' } as any).catch(() => null)
    user.value = null
    initialized.value = true
  }

  const isAuthed = computed(() => !!user.value)

  return { user, loading, initialized, isAuthed, fetchMe, signUp, signIn, signOut }
}
