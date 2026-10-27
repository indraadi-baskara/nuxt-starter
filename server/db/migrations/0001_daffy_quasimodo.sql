CREATE TABLE "bengkel_pricing" (
	"id" text PRIMARY KEY NOT NULL,
	"sku" text NOT NULL,
	"tier" text DEFAULT 'tier-1' NOT NULL,
	"price" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "active" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "active" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "serial" ALTER COLUMN "verified" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "serial" ALTER COLUMN "verified" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "emailVerified" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "phoneVerified" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "bengkel_pricing" ADD CONSTRAINT "bengkel_pricing_sku_product_sku_fk" FOREIGN KEY ("sku") REFERENCES "public"."product"("sku") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bengkel_pricing_sku_tier_idx" ON "bengkel_pricing" USING btree ("sku","tier");--> statement-breakpoint
CREATE INDEX "bengkel_pricing_sku_idx" ON "bengkel_pricing" USING btree ("sku");