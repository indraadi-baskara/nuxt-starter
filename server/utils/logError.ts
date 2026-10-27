export function logRouteError(route: string, err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack?.split("\n").slice(0, 6).join(" | ") : "";
  console.error(`[api:${route}] ${msg}${stack ? ` — ${stack}` : ""}`);
}
