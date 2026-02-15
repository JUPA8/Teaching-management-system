# 🎓 Salam Institute - Teaching Management System

A complete Next.js 14 full-stack application for managing online teaching institute operations with multilingual support (English, Arabic, German).

## ✨ Features

### Frontend (Already Implemented)
- ✅ Modern, responsive UI with Tailwind CSS
- ✅ Multilingual support (en, ar, de) with next-intl
- ✅ Beautiful landing pages with Framer Motion animations
- ✅ Course browsing pages
- ✅ Trial class (Probestunde) request form
- ✅ Teacher profiles page
- ✅ Contact and About pages

### Backend (Newly Implemented)
- ✅ PostgreSQL database with Prisma ORM
- ✅ NextAuth.js authentication with role-based access control (RBAC)
- ✅ Complete REST API for users, courses, bookings, payments
- ✅ Stripe payment integration with webhooks
- ✅ AWS S3 signed uploads for images/documents
- ✅ Admin dashboard for managing operations
- ✅ Trial class request management
- ✅ Booking conflict detection
- ✅ Type-safe with TypeScript and Zod validation

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **Payments**: Stripe
- **File Storage**: AWS S3
- **Validation**: Zod
- **Icons**: Lucide React
- **Internationalization**: next-intl

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud)
- Stripe account (test mode for development)
- AWS account (for S3 uploads)
- SMTP credentials (optional, for emails)

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone <repository-url>
cd teaching-management-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/salam_institute?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Stripe (use test keys for development)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# AWS S3
AWS_REGION="eu-central-1"
AWS_ACCESS_KEY_ID="your_key"
AWS_SECRET_ACCESS_KEY="your_secret"
AWS_S3_BUCKET_NAME="salam-institute-uploads"

# Email (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
EMAIL_FROM="noreply@salam-institut.com"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### 4. Setup Database

#### Option A: Local PostgreSQL

Install PostgreSQL and create database:

```bash
# macOS (using Homebrew)
brew install postgresql@15
brew services start postgresql@15
createdb salam_institute

# Linux
sudo apt install postgresql postgresql-contrib
sudo -u postgres createdb salam_institute

# Windows: Use installer from postgresql.org
```

#### Option B: Docker

```bash
docker run --name salam-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=salam_institute \
  -p 5432:5432 \
  -d postgres:15
```

### 5. Run Database Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

### 6. Create Admin User

Create `scripts/create-admin.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Admin123!', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@salam-institut.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', admin.email);
  console.log('📧 Email:', admin.email);
  console.log('🔑 Password: Admin123!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run it:

```bash
npx ts-node scripts/create-admin.ts
```

### 7. Setup Stripe Webhook (Development)

Install Stripe CLI:

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Other platforms: https://stripe.com/docs/stripe-cli
```

Forward webhooks to local:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/payments/webhook
```

Copy the webhook signing secret to your `.env`:

```env
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 8. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 9. Access Admin Dashboard

1. Navigate to [http://localhost:3000/login](http://localhost:3000/login)
2. Login with admin credentials:
   - Email: `admin@salam-institut.com`
   - Password: `Admin123!`
3. Access admin dashboard at [http://localhost:3000/admin](http://localhost:3000/admin)

## 📁 Project Structure

```
teaching-management-system/
├── prisma/
│   └── schema.prisma              # Database schema
├── public/                        # Static assets
├── src/
│   ├── app/
│   │   ├── [locale]/              # Internationalized routes
│   │   │   ├── page.tsx           # Home page
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   ├── courses/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── probestunde/       # Trial class form
│   │   │   └── ...
│   │   ├── admin/                 # Admin dashboard
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx           # Dashboard overview
│   │   │   ├── users/
│   │   │   ├── courses/
│   │   │   ├── bookings/
│   │   │   ├── payments/
│   │   │   └── probestunde/
│   │   └── api/                   # API routes
│   │       ├── auth/
│   │       ├── users/
│   │       ├── courses/
│   │       ├── bookings/
│   │       ├── payments/
│   │       ├── upload/
│   │       └── probestunde/       # ✅ Trial class API
│   ├── components/                # Reusable components
│   ├── lib/
│   │   ├── prisma.ts             # Prisma client
│   │   ├── auth.ts               # NextAuth config
│   │   ├── auth-helpers.ts       # RBAC helpers
│   │   ├── stripe.ts             # Stripe client
│   │   └── s3.ts                 # S3 client
│   └── messages/                  # i18n translations
│       ├── en.json
│       ├── ar.json
│       └── de.json
├── .env                          # Environment variables
├── API_DOCUMENTATION.md          # API docs
├── DEPLOYMENT_GUIDE.md           # Production deployment
└── README.md                     # This file
```

## 🔑 API Endpoints

### Public Endpoints
- `POST /api/probestunde` - Submit trial class request
- `GET /api/courses` - List all courses

### Protected Endpoints (Require Authentication)
- `GET /api/users` - List users (Admin only)
- `POST /api/users` - Create user (Admin only)
- `GET /api/users/[id]` - Get user details
- `PATCH /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user (Admin only)

- `POST /api/courses` - Create course (Admin only)
- `GET /api/courses/[id]` - Get course details
- `PATCH /api/courses/[id]` - Update course (Admin only)
- `DELETE /api/courses/[id]` - Delete course (Admin only)

- `GET /api/bookings` - List bookings (role-based)
- `POST /api/bookings` - Create booking
- `GET /api/bookings/[id]` - Get booking details
- `PATCH /api/bookings/[id]` - Update booking
- `DELETE /api/bookings/[id]` - Delete booking (Admin only)

- `GET /api/payments` - List payments (role-based)
- `POST /api/payments/checkout` - Create Stripe checkout
- `POST /api/payments/webhook` - Stripe webhook handler

- `POST /api/upload/signed-url` - Generate S3 signed URL

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed specifications.

## 👥 User Roles

### ADMIN
- Full access to all features
- User management (create, read, update, delete)
- Course management
- Booking management
- Payment oversight
- View trial class requests
- Access admin dashboard

### TEACHER
- View assigned courses and students
- Manage bookings (view, update meeting links)
- View schedule
- Update profile

### STUDENT
- Browse courses
- Make bookings
- View payment history
- Manage profile
- Cancel own bookings

## 🧪 Testing

### Test Trial Class Submission

```bash
curl -X POST http://localhost:3000/api/probestunde \
  -H "Content-Type: application/json" \
  -d '{
    "numStudents": 2,
    "students": [
      {"name": "Ali Ahmed", "age": "10"},
      {"name": "Fatima Ahmed", "age": "8"}
    ],
    "email": "parent@example.com",
    "phone": "+49123456789",
    "contactMethod": "whatsapp",
    "teacherPreference": "female"
  }'
```

### Test Stripe Payment (Development)

1. Use Stripe test card: `4242 4242 4242 4242`
2. Any future expiry date
3. Any 3-digit CVC
4. Any postal code

## 📦 Building for Production

```bash
# Build application
npm run build

# Start production server
npm start
```

## 🚀 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete production deployment instructions including:

- AWS Amplify / EC2 setup
- PostgreSQL (RDS) configuration
- S3 bucket setup
- Stripe webhook configuration
- GoDaddy DNS records for `salam-institut.com`
- SSL certificate setup
- Environment variables
- Database migrations

## 🗄️ Database Schema

Key models:
- **User**: Authentication and profile
- **Teacher**: Teacher-specific information
- **Student**: Student-specific information
- **Course**: Course catalog
- **Booking**: Class scheduling with conflict detection
- **Payment**: Payment tracking with Stripe integration
- **ProbestundeRequest**: Trial class requests
- **ActivityLog**: Audit trail (optional)

See `prisma/schema.prisma` for full schema.

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based sessions with NextAuth
- ✅ Role-based access control (RBAC)
- ✅ Input validation with Zod
- ✅ SQL injection prevention (Prisma)
- ✅ XSS protection (Next.js built-in)
- ✅ CSRF protection (NextAuth)
- ✅ Secure file uploads (S3 signed URLs)
- ✅ Stripe webhook signature verification

## 📝 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret key | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Yes |
| `AWS_REGION` | AWS region | Yes |
| `AWS_ACCESS_KEY_ID` | AWS access key | Yes |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | Yes |
| `AWS_S3_BUCKET_NAME` | S3 bucket name | Yes |
| `SMTP_HOST` | SMTP server | No |
| `SMTP_PORT` | SMTP port | No |
| `SMTP_USER` | SMTP username | No |
| `SMTP_PASSWORD` | SMTP password | No |
| `EMAIL_FROM` | Sender email address | No |

## 🐛 Troubleshooting

### Database connection failed
- Check PostgreSQL is running: `pg_isready`
- Verify `DATABASE_URL` in `.env`
- Check database exists: `psql -l`

### Prisma Client errors
- Regenerate client: `npx prisma generate`
- Reset database: `npx prisma migrate reset` (⚠️ deletes data)

### NextAuth session errors
- Clear browser cookies
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain

### Stripe webhook not working
- Run `stripe listen --forward-to localhost:3000/api/payments/webhook`
- Copy webhook secret to `.env`
- Restart dev server

### S3 upload fails
- Verify AWS credentials
- Check bucket exists and region matches
- Verify CORS configuration on bucket

## 📖 Additional Documentation

- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Production deployment
- [Prisma Schema](./prisma/schema.prisma) - Database schema

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open Pull Request

## 📄 License

This project is private and proprietary.

## 📞 Support

For support, email support@salam-institut.com or open an issue on GitHub.

---

**Built with ❤️ for Salam Institute**
