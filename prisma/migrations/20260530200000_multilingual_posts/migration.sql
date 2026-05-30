-- Multilingual fields for Post model

ALTER TABLE "posts" ADD COLUMN "titleDe"    TEXT;
ALTER TABLE "posts" ADD COLUMN "slugDe"     TEXT;
ALTER TABLE "posts" ADD COLUMN "excerptDe"  TEXT;
ALTER TABLE "posts" ADD COLUMN "contentDe"  TEXT;

ALTER TABLE "posts" ADD COLUMN "titleAr"    TEXT;
ALTER TABLE "posts" ADD COLUMN "slugAr"     TEXT;
ALTER TABLE "posts" ADD COLUMN "excerptAr"  TEXT;
ALTER TABLE "posts" ADD COLUMN "contentAr"  TEXT;

CREATE UNIQUE INDEX "posts_slugDe_key" ON "posts"("slugDe");
CREATE UNIQUE INDEX "posts_slugAr_key" ON "posts"("slugAr");
