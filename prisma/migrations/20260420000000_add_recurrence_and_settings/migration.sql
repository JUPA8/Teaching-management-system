-- Migration: Add recurrenceGroupId to bookings + SiteSettings table

-- Add recurrenceGroupId to bookings (nullable — single sessions have no group)
ALTER TABLE "bookings" ADD COLUMN "recurrenceGroupId" TEXT;
CREATE INDEX "bookings_recurrenceGroupId_idx" ON "bookings"("recurrenceGroupId");

-- Create site_settings table for admin-editable global configuration
CREATE TABLE "site_settings" (
    "id"        TEXT NOT NULL,
    "key"       TEXT NOT NULL,
    "value"     TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "site_settings_key_key" ON "site_settings"("key");

-- Seed default settings
INSERT INTO "site_settings" ("id", "key", "value", "updatedAt") VALUES
  (gen_random_uuid()::text, 'school_name',   'Salam Institut',             NOW()),
  (gen_random_uuid()::text, 'phone',         '+20 122 032 5887',           NOW()),
  (gen_random_uuid()::text, 'whatsapp',      '+20 122 032 5887',           NOW()),
  (gen_random_uuid()::text, 'email_contact', 'info@salam-institut.com',    NOW()),
  (gen_random_uuid()::text, 'website',       'https://salam-institut.com', NOW()),
  (gen_random_uuid()::text, 'testimonials',  '[]',                         NOW());
