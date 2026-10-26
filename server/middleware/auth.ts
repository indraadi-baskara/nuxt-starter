import { getAuth } from "../lib/auth";
export default defineEventHandler(async (event) => {
  // expose session on event.context.auth for downstream handlers
  const url = getRequestURL(event);
  if (!url.pathname.startsWith("/api/")) return;
  // allow public auth endpoints without session
  if (url.pathname.startsWith("/api/auth/") && ["POST", "GET"].includes(getMethod(event))) {
    // still try to attach but don't block
  }
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: event.headers as any });
    if (session) {
      (event.context as any).auth = session; // { user, session }
    }
  } catch {}
});
