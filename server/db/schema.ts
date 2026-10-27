import { pgTable, text, integer, boolean, index, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(sql`extract(epoch from now())::int`),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().default(sql`extract(epoch from now())::int`),
  // custom
  role: text("role", { enum: ["customer", "bengkel_partner", "gudang_picker", "admin"] }).notNull().default("customer"),
  phone: text("phone"),
  phoneVerified: boolean("phoneVerified").notNull().default(false),
}, (t) => [uniqueIndex("user_email_idx").on(t.email)]);

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(sql`extract(epoch from now())::int`),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().default(sql`extract(epoch from now())::int`),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
}, (t) => [index("session_userId_idx").on(t.userId), uniqueIndex("session_token_idx").on(t.token)]);

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(), // credential | wa-otp
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  accessTokenExpiresAt: integer("accessTokenExpiresAt", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refreshTokenExpiresAt", { mode: "timestamp" }),
  scope: text("scope"),
  idToken: text("idToken"),
  password: text("password"), // hashed for credential
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(sql`extract(epoch from now())::int`),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().default(sql`extract(epoch from now())::int`),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(sql`extract(epoch from now())::int`),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().default(sql`extract(epoch from now())::int`),
});

// -- domain

export const product = pgTable("product", {
  sku: text("sku").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  brand: text("brand").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull(), // cents IDR
  compareAt: integer("compareAt"),
  badge: text("badge"),
  image: text("image"),
  specs: text("specs", { mode: "json" }).$type<Array<{ label: string; value: string }>>(),
  active: boolean("active").notNull().default(true),
}, (t) => [index("product_brand_idx").on(t.brand), index("product_category_idx").on(t.category)]);

export const inventoryLot = pgTable("inventory_lot", {
  id: text("id").primaryKey(),
  sku: text("sku").notNull().references(() => product.sku),
  depotId: text("depotId").notNull().default("SMG-01"),
  rak: text("rak").notNull(),
  qty: integer("qty").notNull().default(0),
  reserved: integer("reserved").notNull().default(0),
}, (t) => [index("inv_sku_idx").on(t.sku)]);

export const cart = pgTable("cart", {
  id: text("id").primaryKey(),
  userId: text("userId").references(() => user.id, { onDelete: "cascade" }),
  anonId: text("anonId"),
  sku: text("sku").notNull().references(() => product.sku),
  qty: integer("qty").notNull().default(1),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(sql`extract(epoch from now())::int`),
}, (t) => [index("cart_userId_idx").on(t.userId), index("cart_anonId_idx").on(t.anonId)]);

export const order = pgTable("order", {
  id: text("id").primaryKey(), // VG-ORD-YYYY-xxxxx-SMG
  userId: text("userId").notNull().references(() => user.id),
  status: text("status", { enum: ["created", "packing", "shipped", "delivered", "cancelled"] }).notNull().default("created"),
  subtotal: integer("subtotal").notNull(),
  fee: integer("fee").notNull(),
  total: integer("total").notNull(),
  courier: text("courier").notNull(),
  address: text("address", { mode: "json" }).$type<{ name: string; phone: string; address: string; note?: string }>(),
  fakturNo: text("fakturNo"),
  suratJalanNo: text("suratJalanNo"),
  idempotencyKey: text("idempotencyKey"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(sql`extract(epoch from now())::int`),
}, (t) => [uniqueIndex("order_idempotency_idx").on(t.idempotencyKey), index("order_userId_idx").on(t.userId)]);

export const orderItem = pgTable("order_item", {
  id: text("id").primaryKey(),
  orderId: text("orderId").notNull().references(() => order.id, { onDelete: "cascade" }),
  sku: text("sku").notNull().references(() => product.sku),
  title: text("title").notNull(),
  price: integer("price").notNull(),
  qty: integer("qty").notNull(),
  image: text("image"),
});

export const bengkelProfile = pgTable("bengkel_profile", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  nib: text("nib").notNull(),
  status: text("status", { enum: ["pending", "verified", "rejected"] }).notNull().default("pending"),
  tier: text("tier").notNull().default("tier-1"),
  depotId: text("depotId").notNull().default("SMG-01"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(sql`extract(epoch from now())::int`),
});

export const serial = pgTable("serial", {
  code: text("code").primaryKey(),
  sku: text("sku").notNull().references(() => product.sku),
  verified: boolean("verified").notNull().default(true),
});

export const authEvent = pgTable("auth_event", {
  id: text("id").primaryKey(),
  userId: text("userId").references(() => user.id),
  type: text("type").notNull(),
  ip: text("ip"),
  meta: text("meta", { mode: "json" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().default(sql`extract(epoch from now())::int`),
}, (t) => [index("auth_event_userId_idx").on(t.userId)]);
