# ⚡ Quick Setup Guide

Follow these steps to get your backend up and running in 10 minutes.

## 1️⃣ Install Dependencies

```bash
npm install
```

**Installed packages:**
- `@prisma/client` - Database ORM
- `prisma` - Database toolkit
- `next-auth` - Authentication
- `@auth/prisma-adapter` - Prisma adapter for NextAuth
- `bcryptjs` - Password hashing
- `zod` - Schema validation
- `stripe` - Payment processing
- `@aws-sdk/client-s3` - S3 file uploads
- `@aws-sdk/s3-request-presigner` - Signed URLs
- `nodemailer` - Email sending

## 2️⃣ Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your credentials (minimum required for local development):

```env
# Database - Use local PostgreSQL or Docker
DATABASE_URL="postgresql://user:password@localhost:5432/salam_institute"

# NextAuth - Generate secret with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"

# Stripe Test Keys (get from: https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..." # Get after setting up webhook

# AWS S3 (skip for now, add later when needed)
AWS_REGION="eu-central-1"
AWS_ACCESS_KEY_ID="your_key"
AWS_SECRET_ACCESS_KEY="your_secret"
AWS_S3_BUCKET_NAME="salam-institute-uploads"
```

## 3️⃣ Setup PostgreSQL Database

### Option A: Local PostgreSQL

```bash
# macOS
brew install postgresql@15
brew services start postgresql@15
createdb salam_institute

# Linux
sudo apt install postgresql
sudo -u postgres createdb salam_institute

# Windows: Download from postgresql.org
```

### Option B: Docker (Easiest)

```bash
docker run --name salam-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=salam_institute \
  -p 5432:5432 \
  -d postgres:15

# Update .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/salam_institute"
```

### Option C: Cloud (Neon, Supabase, etc.)

Sign up for free tier and copy connection string to `.env`

## 4️⃣ Initialize Database

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations (creates tables)
npm run db:migrate

# Seed database with admin user and sample courses
npm run db:seed
```

**Admin credentials created:**
- Email: `admin@salam-institut.com`
- Password: `Admin123!`

## 5️⃣ Setup Stripe Webhook (Optional for Development)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe  # macOS
# or download from: https://stripe.com/docs/stripe-cli

# Login and forward webhooks
stripe login
stripe listen --forward-to localhost:3000/api/payments/webhook

# Copy the webhook signing secret (whsec_...) to .env
```

## 6️⃣ Start Development Server

```bash
npm run dev
```

**Server will start at:** http://localhost:3000

## 7️⃣ Test Everything

### ✅ Test Frontend
- Visit: http://localhost:3000
- You should see the homepage

### ✅ Test Trial Class Form
1. Go to: http://localhost:3000/de/probestunde (or /en/ or /ar/)
2. Fill out the form
3. Submit
4. Should show success message

### ✅ Test Admin Login
1. Go to: http://localhost:3000/login
2. Login with:
   - Email: `admin@salam-institut.com`
   - Password: `Admin123!`
3. Should redirect to admin dashboard

### ✅ Test Admin Dashboard
- Visit: http://localhost:3000/admin
- You should see dashboard with statistics
- Check "Trial Requests" tab to see submitted trial classes

### ✅ Test API
```bash
# Test trial class submission
curl -X POST http://localhost:3000/api/probestunde \
  -H "Content-Type: application/json" \
  -d '{
    "numStudents": 1,
    "students": [{"name": "Test Student", "age": "10"}],
    "email": "test@example.com",
    "phone": "+49123456789",
    "contactMethod": "email",
    "teacherPreference": "no-preference"
  }'

# Should return: {"success": true, ...}
```

## 🎉 Success!

Your backend is now running. Here's what you have:

### ✅ Completed Features
1. ✅ PostgreSQL database with Prisma
2. ✅ Trial class form → saves to database
3. ✅ Authentication with NextAuth.js
4. ✅ Admin dashboard with RBAC
5. ✅ Complete REST APIs for:
   - Users (CRUD)
   - Courses (CRUD)
   - Bookings (with conflict detection)
   - Payments (Stripe integration)
   - File uploads (S3 signed URLs)
6. ✅ Role-based access: ADMIN, TEACHER, STUDENT
7. ✅ Type-safe with TypeScript + Zod validation

## 📚 What's Next?

### Immediate Next Steps
1. **Create more users** via admin dashboard or API
2. **Add courses** in admin panel
3. **Test booking flow** (requires teacher and student accounts)
4. **Setup Stripe payments** (test mode)
5. **Configure AWS S3** (for image uploads)

### Production Deployment
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for:
- AWS deployment (Amplify or EC2)
- GoDaddy DNS configuration
- SSL certificates
- Production environment setup

## 🐛 Common Issues

### Database connection failed
```bash
# Check if PostgreSQL is running
pg_isready

# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL
```

### Prisma errors
```bash
# Regenerate client
npm run db:generate

# Reset database (⚠️ deletes all data)
npm run db:reset
```

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

## 📖 Full Documentation

- **README.md** - Complete project documentation
- **API_DOCUMENTATION.md** - API reference with examples
- **DEPLOYMENT_GUIDE.md** - Production deployment guide

## 🆘 Need Help?

1. Check logs in terminal
2. Open Prisma Studio: `npm run db:studio`
3. Check database: `psql $DATABASE_URL`
4. Review error messages carefully

---

**You're all set! 🚀 Start building amazing features!**
