-- Architecture refactor: Grade.bookingId unique + Payment.courseId FK

-- 1. Unique index on Grade.bookingId (PostgreSQL allows multiple NULLs)
CREATE UNIQUE INDEX "grades_bookingId_key" ON "grades"("bookingId");

-- 2. Add courseId column to payments
ALTER TABLE "payments" ADD COLUMN "courseId" TEXT;

-- 3. FK from payments.courseId -> courses.id (SET NULL on delete)
ALTER TABLE "payments" ADD CONSTRAINT "payments_courseId_fkey"
  FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- 4. Index on payments.courseId
CREATE INDEX "payments_courseId_idx" ON "payments"("courseId");
