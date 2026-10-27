export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  if (!url.pathname.startsWith("/api/")) return;
  // public auth endpoints still attach if present, but never block
  try {
    const session = await getUserSession(event) as any;
    if (session?.user) (event.context as any).auth = { user: session.user, session };
  } catch {}
});
