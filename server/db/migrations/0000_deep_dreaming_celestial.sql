CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"accessTokenExpiresAt" integer,
	"refreshTokenExpiresAt" integer,
	"scope" text,
	"idToken" text,
	"password" text,
	"createdAt" integer DEFAULT extract(epoch from now())::int NOT NULL,
	"updatedAt" integer DEFAULT extract(epoch from now())::int NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_event" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text,
	"type" text NOT NULL,
	"ip" text,
	"meta" text,
	"createdAt" integer DEFAULT extract(epoch from now())::int NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bengkel_profile" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"nib" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"tier" text DEFAULT 'tier-1' NOT NULL,
	"depotId" text DEFAULT 'SMG-01' NOT NULL,
	"createdAt" integer DEFAULT extract(epoch from now())::int NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cart" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text,
	"anonId" text,
	"sku" text NOT NULL,
	"qty" integer DEFAULT 1 NOT NULL,
	"createdAt" integer DEFAULT extract(epoch from now())::int NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_lot" (
	"id" text PRIMARY KEY NOT NULL,
	"sku" text NOT NULL,
	"depotId" text DEFAULT 'SMG-01' NOT NULL,
	"rak" text NOT NULL,
	"qty" integer DEFAULT 0 NOT NULL,
	"reserved" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"status" text DEFAULT 'created' NOT NULL,
	"subtotal" integer NOT NULL,
	"fee" integer NOT NULL,
	"total" integer NOT NULL,
	"courier" text NOT NULL,
	"address" text,
	"fakturNo" text,
	"suratJalanNo" text,
	"idempotencyKey" text,
	"createdAt" integer DEFAULT extract(epoch from now())::int NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_item" (
	"id" text PRIMARY KEY NOT NULL,
	"orderId" text NOT NULL,
	"sku" text NOT NULL,
	"title" text NOT NULL,
	"price" integer NOT NULL,
	"qty" integer NOT NULL,
	"image" text
);
--> statement-breakpoint
CREATE TABLE "product" (
	"sku" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"brand" text NOT NULL,
	"category" text NOT NULL,
	"price" integer NOT NULL,
	"compareAt" integer,
	"badge" text,
	"image" text,
	"specs" text,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "serial" (
	"code" text PRIMARY KEY NOT NULL,
	"sku" text NOT NULL,
	"verified" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"token" text NOT NULL,
	"expiresAt" integer NOT NULL,
	"createdAt" integer DEFAULT extract(epoch from now())::int NOT NULL,
	"updatedAt" integer DEFAULT extract(epoch from now())::int NOT NULL,
	"ipAddress" text,
	"userAgent" text
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"image" text,
	"createdAt" integer DEFAULT extract(epoch from now())::int NOT NULL,
	"updatedAt" integer DEFAULT extract(epoch from now())::int NOT NULL,
	"role" text DEFAULT 'customer' NOT NULL,
	"phone" text,
	"phoneVerified" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" integer NOT NULL,
	"createdAt" integer DEFAULT extract(epoch from now())::int NOT NULL,
	"updatedAt" integer DEFAULT extract(epoch from now())::int NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_event" ADD CONSTRAINT "auth_event_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bengkel_profile" ADD CONSTRAINT "bengkel_profile_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_sku_product_sku_fk" FOREIGN KEY ("sku") REFERENCES "public"."product"("sku") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_lot" ADD CONSTRAINT "inventory_lot_sku_product_sku_fk" FOREIGN KEY ("sku") REFERENCES "public"."product"("sku") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_orderId_order_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_sku_product_sku_fk" FOREIGN KEY ("sku") REFERENCES "public"."product"("sku") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "serial" ADD CONSTRAINT "serial_sku_product_sku_fk" FOREIGN KEY ("sku") REFERENCES "public"."product"("sku") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "auth_event_userId_idx" ON "auth_event" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "cart_userId_idx" ON "cart" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "cart_anonId_idx" ON "cart" USING btree ("anonId");--> statement-breakpoint
CREATE INDEX "inv_sku_idx" ON "inventory_lot" USING btree ("sku");--> statement-breakpoint
CREATE UNIQUE INDEX "order_idempotency_idx" ON "order" USING btree ("idempotencyKey");--> statement-breakpoint
CREATE INDEX "order_userId_idx" ON "order" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "product_brand_idx" ON "product" USING btree ("brand");--> statement-breakpoint
CREATE INDEX "product_category_idx" ON "product" USING btree ("category");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "session_token_idx" ON "session" USING btree ("token");--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_idx" ON "user" USING btree ("email");