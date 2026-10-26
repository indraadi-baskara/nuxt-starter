export default defineEventHandler(async (event) => {
  const auth: any = (event.context as any).auth;
  if (!auth?.user) throw createError({ statusCode: 401, message: "Unauthorized" });
  const { defineAbility } = await import("../utils/casl");
  const ability = defineAbility({ id: auth.user.id, role: auth.user.role ?? "customer", depotId: "SMG-01" });
  return { user: auth.user, abilities: ability.rules };
});
