/**
 * Safe Prisma migration deployer for production (Vercel / Neon).
 *
 * Problem this solves:
 *   The Neon database may have been provisioned via `prisma db push` or direct
 *   SQL — which creates the tables but does NOT record anything in the
 *   `_prisma_migrations` tracking table.  When `prisma migrate deploy` runs for
 *   the first time on Vercel it tries to apply all migrations from scratch,
 *   hits "relation 'users' already exists", and exits with code 1 → build fails.
 *
 * Strategy (Prisma's recommended "baselining" approach):
 *   1. Run `prisma migrate deploy` normally.
 *   2. If it succeeds → done.
 *   3. If it fails → mark every known migration as "applied" without re-running
 *      its SQL (`prisma migrate resolve --applied <name>`), then retry.
 *      The retry will find "No pending migrations to apply" and succeed.
 *   4. If the retry still fails → surface the error and abort the build.
 *
 * The `--applied` resolve is idempotent-ish: if a migration is already tracked
 * in `_prisma_migrations`, the command exits non-zero ("already applied"), which
 * we intentionally ignore.  If it is NOT tracked, the command inserts the record
 * without running the SQL — exactly what baselining requires.
 */

const { execSync } = require('child_process');

// All migrations in chronological order.
// Add new migration directory names here as the project grows.
const MIGRATIONS = [
  '20260214154534_init',
  '20260327000000_add_email_verification',
  '20260418000000_add_attendance_grades',
  '20260419000000_add_password_reset_tokens',
  '20260420000000_add_recurrence_and_settings',
];

function exec(cmd, opts = {}) {
  execSync(cmd, { stdio: 'inherit', ...opts });
}

function tryExec(cmd) {
  try {
    execSync(cmd, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

// ── Step 1: Attempt normal deploy ────────────────────────────────────────────
console.log('[prisma-deploy] Running prisma migrate deploy…');
const firstTry = tryExec('npx prisma migrate deploy');

if (firstTry) {
  console.log('[prisma-deploy] ✓ Migrations applied (or already up to date).');
  process.exit(0);
}

// ── Step 2: Baseline — mark all known migrations as applied ──────────────────
console.log(
  '[prisma-deploy] First deploy attempt failed. ' +
  'This usually means the database was provisioned outside of Prisma ' +
  '(e.g. via prisma db push). Baselining migration history…'
);

for (const migration of MIGRATIONS) {
  const ok = tryExec(`npx prisma migrate resolve --applied ${migration}`);
  if (ok) {
    console.log(`[prisma-deploy]   ✓ Baselined: ${migration}`);
  } else {
    // Non-zero exit from resolve means "already tracked" — that is fine.
    console.log(`[prisma-deploy]   • Already tracked (skipped): ${migration}`);
  }
}

// ── Step 3: Retry deploy ─────────────────────────────────────────────────────
console.log('[prisma-deploy] Retrying prisma migrate deploy after baseline…');
try {
  exec('npx prisma migrate deploy');
  console.log('[prisma-deploy] ✓ Migrations applied successfully.');
} catch (err) {
  console.error(
    '[prisma-deploy] ✗ Migration deploy failed even after baselining. ' +
    'Check the error above — there may be a genuine schema conflict that ' +
    'requires manual intervention on the production database.'
  );
  process.exit(1);
}
