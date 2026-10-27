import { ensureMigrated } from "../utils/migrate";

export default defineNitroPlugin(async () => {
  // Fire-and-log; don't block startup — first DB request will await if needed
  ensureMigrated().catch((e) => console.error("[migrate] background failed", e));
});
