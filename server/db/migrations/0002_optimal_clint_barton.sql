ALTER TABLE "serial" ADD COLUMN "orderId" text;--> statement-breakpoint
ALTER TABLE "serial" ADD COLUMN "assignedAt" integer;--> statement-breakpoint
ALTER TABLE "serial" ADD CONSTRAINT "serial_orderId_order_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."order"("id") ON DELETE no action ON UPDATE no action;