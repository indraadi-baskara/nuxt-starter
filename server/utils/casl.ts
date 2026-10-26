import { AbilityBuilder, createMongoAbility } from "@casl/ability";
export type AppRole = "customer" | "bengkel_partner" | "gudang_picker" | "admin";

export function defineAbility(user: { id: string; role: AppRole; depotId?: string }) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
  if (user.role === "admin") {
    can("manage", "all");
  } else {
    can("read", "Product");
    can("read", "InventoryLot");
    if (user.role === "customer" || user.role === "bengkel_partner") {
      can(["create", "read"], "Cart", { userId: user.id });
      can(["create", "read"], "Order", { userId: user.id });
      can("read", "Order", { userId: user.id });
      can("read", ["Invoice", "SuratJalan"], { userId: user.id });
      can(["create"], "BengkelProfile");
    }
    if (user.role === "gudang_picker") {
      can("update", "Order", { depotId: user.depotId ?? "SMG-01" });
      can("read", "Order");
    }
    if (user.role === "bengkel_partner") {
      can("read", "BengkelPricing");
    }
  }
  cannot("delete", "User");
  return build();
}
