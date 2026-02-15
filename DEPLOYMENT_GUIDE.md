# 🚀 Production Deployment Guide - AWS + GoDaddy

## Overview
This guide covers deploying the Salam Institute Teaching Management System to AWS with domain configuration on GoDaddy.

---

## 📋 Prerequisites

- AWS Account with appropriate permissions
- Domain registered on GoDaddy: `salam-institut.com`
- PostgreSQL database (AWS RDS recommended)
- Stripe account for payments
- SMTP credentials for email notifications

---

## 🗄️ Database Setup (AWS RDS)

### 1. Create PostgreSQL Database

```bash
# Via AWS Console:
# - Service: RDS
# - Engine: PostgreSQL 15+
# - Instance: db.t3.micro (or larger for production)
# - Storage: 20 GB SSD (adjust as needed)
# - Public access: No (use VPC)
# - Database name: salam_institute
```

### 2. Configure Security Group

```bash
# Add inbound rule:
Type: PostgreSQL
Port: 5432
Source: Your application security group
```

### 3. Note Your Connection String

```
postgresql://username:password@your-db-instance.region.rds.amazonaws.com:5432/salam_institute
```

---

## 🪣 S3 Bucket Setup

### 1. Create S3 Bucket

```bash
aws s3 mb s3://salam-institute-uploads --region eu-central-1
```

### 2. Configure CORS

Create `cors.json`:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://salam-institut.com", "https://www.salam-institut.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

Apply CORS:

```bash
aws s3api put-bucket-cors --bucket salam-institute-uploads --cors-configuration file://cors.json
```

### 3. Create IAM User for S3 Access

```bash
# Create user
aws iam create-user --user-name salam-institute-s3-user

# Attach S3 policy
aws iam attach-user-policy --user-name salam-institute-s3-user \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

# Create access keys
aws iam create-access-key --user-name salam-institute-s3-user
```

Save the `AccessKeyId` and `SecretAccessKey`.

---

## 🚢 Deployment Options

### Option A: AWS Amplify (Recommended for Next.js)

#### 1. Push Code to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 2. Deploy via AWS Amplify Console

1. Go to AWS Amplify Console
2. Click "New app" → "Host web app"
3. Connect to GitHub repository
4. Configure build settings:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npx prisma generate
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

5. Add environment variables (see section below)
6. Deploy!

#### 3. Configure Custom Domain

In Amplify Console:
- Go to "Domain management"
- Add domain: `salam-institut.com`
- Follow DNS configuration instructions (see GoDaddy section below)

---

### Option B: AWS EC2 + PM2

#### 1. Launch EC2 Instance

```bash
# Instance: t3.small (minimum)
# AMI: Ubuntu 22.04 LTS
# Security Group: Allow ports 22, 80, 443
```

#### 2. SSH and Install Dependencies

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

#### 3. Clone and Setup Application

```bash
# Clone repository
git clone https://github.com/yourusername/teaching-management-system.git
cd teaching-management-system

# Install dependencies
npm ci

# Setup environment variables
cp .env.example .env
nano .env  # Edit with production values

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Build application
npm run build
```

#### 4. Configure PM2

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'salam-institute',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 'max',
    exec_mode: 'cluster',
    max_memory_restart: '500M'
  }]
};
```

Start application:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow instructions
```

#### 5. Configure Nginx

Create `/etc/nginx/sites-available/salam-institut.com`:

```nginx
server {
    listen 80;
    server_name salam-institut.com www.salam-institut.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/salam-institut.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. Setup SSL with Let's Encrypt

```bash
sudo certbot --nginx -d salam-institut.com -d www.salam-institut.com
```

---

## 🔐 Environment Variables

Set these in your deployment platform:

```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/salam_institute?schema=public"

# NextAuth
NEXTAUTH_URL="https://salam-institut.com"
NEXTAUTH_SECRET="generate-strong-secret-with-openssl-rand-base64-32"

# Stripe
STRIPE_SECRET_KEY="sk_live_your_live_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_live_your_live_publishable_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# AWS S3
AWS_REGION="eu-central-1"
AWS_ACCESS_KEY_ID="your_access_key_id"
AWS_SECRET_ACCESS_KEY="your_secret_access_key"
AWS_S3_BUCKET_NAME="salam-institute-uploads"

# Email (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
EMAIL_FROM="noreply@salam-institut.com"

# App
NEXT_PUBLIC_APP_URL="https://salam-institut.com"
NODE_ENV="production"
```

### Generate NextAuth Secret

```bash
openssl rand -base64 32
```

---

## 🌐 GoDaddy DNS Configuration

### DNS Records for salam-institut.com

| Type  | Name  | Value                                    | TTL  | Priority |
|-------|-------|------------------------------------------|------|----------|
| A     | @     | `YOUR_EC2_IP` or Amplify IP              | 600  | -        |
| A     | www   | `YOUR_EC2_IP` or Amplify IP              | 600  | -        |
| CNAME | www   | salam-institut.com (if using Amplify)    | 600  | -        |
| MX    | @     | mail.salam-institut.com                  | 3600 | 10       |
| TXT   | @     | "v=spf1 include:_spf.google.com ~all"    | 3600 | -        |

### If Using AWS Amplify:

Amplify will provide specific DNS records. Typically:

| Type   | Name | Value                                          | TTL  |
|--------|------|------------------------------------------------|------|
| CNAME  | @    | d1234abcdef.cloudfront.net (Amplify provides) | 600  |
| CNAME  | www  | d1234abcdef.cloudfront.net (Amplify provides) | 600  |

### If Using AWS CloudFront + S3:

| Type   | Name | Value                              | TTL  |
|--------|------|------------------------------------|------|
| CNAME  | @    | your-distribution.cloudfront.net   | 600  |
| CNAME  | www  | your-distribution.cloudfront.net   | 600  |

**Note:** Root domain (@) cannot use CNAME. Use A record or ALIAS record pointing to CloudFront IP.

### Steps in GoDaddy:

1. Log in to GoDaddy account
2. Go to "My Products" → "Domains"
3. Click on `salam-institut.com`
4. Click "DNS" or "Manage DNS"
5. Add/Edit records as shown above
6. Save changes

**DNS Propagation:** Changes can take 24-48 hours to fully propagate globally.

---

## 🗃️ Database Migrations

### Initial Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# (Optional) Seed database
npx prisma db seed
```

### Create Admin User

```bash
# Using Prisma Studio (local development)
npx prisma studio

# Or via SQL
psql $DATABASE_URL
```

```sql
-- Create admin user (hash password with bcrypt first)
INSERT INTO users (id, email, password, name, role, "createdAt", "updatedAt")
VALUES (
  'clxxxxx',  -- generate with: node -e "console.log(require('crypto').randomBytes(12).toString('base64url'))"
  'admin@salam-institut.com',
  '$2a$10$...your-bcrypt-hashed-password',
  'Admin',
  'ADMIN',
  NOW(),
  NOW()
);
```

Or use this script `scripts/create-admin.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = 'ChangeMeInProduction123!';
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@salam-institut.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', admin.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run:

```bash
npx ts-node scripts/create-admin.ts
```

---

## 💳 Stripe Webhook Configuration

### 1. Get Webhook Signing Secret

In Stripe Dashboard:
1. Go to Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://salam-institut.com/api/payments/webhook`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy webhook signing secret

### 2. Update Environment Variable

```bash
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 3. Test Webhook

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward events to local
stripe listen --forward-to localhost:3000/api/payments/webhook
```

---

## 📧 Email Configuration (Optional)

### Using Gmail SMTP

1. Enable 2-factor authentication on Gmail
2. Generate App Password:
   - Google Account → Security → App Passwords
3. Use in environment:

```bash
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-16-char-app-password"
EMAIL_FROM="noreply@salam-institut.com"
```

### Using AWS SES (Recommended for production)

```bash
# Configure SES
aws ses verify-email-identity --email-address noreply@salam-institut.com

# Update environment
SMTP_HOST="email-smtp.eu-central-1.amazonaws.com"
SMTP_PORT="587"
SMTP_USER="your-ses-smtp-username"
SMTP_PASSWORD="your-ses-smtp-password"
```

---

## ✅ Post-Deployment Checklist

- [ ] Database migrated successfully
- [ ] Admin user created
- [ ] SSL certificate installed (HTTPS working)
- [ ] Environment variables configured
- [ ] S3 bucket accessible
- [ ] Stripe webhook configured and tested
- [ ] DNS records propagated (check with `dig salam-institut.com`)
- [ ] Test trial class form submission
- [ ] Test admin login at `/admin`
- [ ] Test payment flow (use Stripe test mode first)
- [ ] Configure backup strategy for database
- [ ] Setup monitoring (CloudWatch, Sentry, etc.)
- [ ] Configure log rotation
- [ ] Test all API endpoints
- [ ] Verify email notifications working

---

## 🔧 Maintenance Commands

### Update Application

```bash
git pull origin main
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 restart salam-institute
```

### View Logs

```bash
# PM2 logs
pm2 logs salam-institute

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Database Backup

```bash
# Backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup-20240214.sql
```

### Monitor Application

```bash
pm2 monit
pm2 status
```

---

## 🐛 Troubleshooting

### Issue: DNS not resolving

```bash
# Check DNS propagation
dig salam-institut.com
nslookup salam-institut.com

# Clear local DNS cache (Mac)
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

### Issue: SSL certificate not working

```bash
# Renew certificate
sudo certbot renew --nginx
sudo systemctl reload nginx
```

### Issue: Application not starting

```bash
# Check logs
pm2 logs
pm2 describe salam-institute

# Check environment variables
pm2 env 0
```

### Issue: Database connection failed

```bash
# Test connection
psql $DATABASE_URL

# Check security group rules in AWS RDS
```

---

## 📞 Support

For issues with:
- **AWS**: AWS Support Console
- **GoDaddy**: GoDaddy Support
- **Stripe**: Stripe Dashboard → Help
- **Application**: Check logs and GitHub issues

---

## 🔒 Security Best Practices

1. **Never commit secrets**: Use environment variables
2. **Use strong passwords**: For database and admin accounts
3. **Enable AWS CloudWatch**: Monitor logs and metrics
4. **Setup AWS WAF**: Protect against common web exploits
5. **Regular backups**: Automate database backups
6. **Keep dependencies updated**: Run `npm audit` regularly
7. **Use HTTPS only**: Redirect HTTP to HTTPS
8. **Implement rate limiting**: Protect API endpoints
9. **Setup monitoring**: Use Sentry or similar for error tracking
10. **Regular security audits**: Review IAM policies and access logs

---

## 🎉 Done!

Your application should now be live at:
- **Main site**: https://salam-institut.com
- **WWW**: https://www.salam-institut.com
- **Admin panel**: https://salam-institut.com/admin

Happy teaching! 🎓
