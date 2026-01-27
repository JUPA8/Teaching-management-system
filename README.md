# Lies Akademie - Online Quran Learning Platform

A modern, multilingual educational platform for teaching Quran, Arabic, and Islamic studies online.

## Features

- 🌍 **Multi-language Support**: German, Arabic, and English with RTL support
- 📚 **Course Categories**: Quran for Adults, Quran for Kids, Arabic Language, Islamic Studies
- 👨‍🏫 **Teacher Profiles**: Qualified instructor showcases with ratings and specializations
- 🎥 **Video Library**: Educational video content with filtering
- 💰 **Pricing Plans**: Flexible subscription tiers
- 📊 **Student Dashboard**: Progress tracking, upcoming lessons, and course management
- 🔐 **Authentication**: Registration and login system
- 📱 **Responsive Design**: Works on all devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Internationalization**: next-intl
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Fix npm permissions (if needed)**:
   ```bash
   sudo chown -R $(whoami) ~/.npm
   ```

2. **Install dependencies**:
   ```bash
   cd lies-akademie
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
lies-akademie/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── courses/           # Course pages
│   │   ├── dashboard/         # Student dashboard
│   │   ├── login/             # Login page
│   │   ├── pricing/           # Pricing page
│   │   ├── register/          # Registration page
│   │   ├── teachers/          # Teachers page
│   │   ├── videos/            # Video library
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   │   ├── CourseCard.tsx
│   │   ├── CoursesSection.tsx
│   │   ├── CTASection.tsx
│   │   ├── Features.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   └── Testimonials.tsx
│   ├── lib/                   # Utilities and data
│   │   ├── data.ts            # Mock data
│   │   └── utils.ts           # Helper functions
│   ├── messages/              # Translation files
│   │   ├── ar.json            # Arabic
│   │   ├── de.json            # German
│   │   └── en.json            # English
│   ├── types/                 # TypeScript types
│   │   └── index.ts
│   └── i18n.ts                # Internationalization config
├── public/                    # Static assets
├── tailwind.config.ts         # Tailwind configuration
├── next.config.js             # Next.js configuration
└── package.json
```

## Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with hero, features, courses, testimonials |
| Quran Adults | `/courses/quran-adults` | Quran courses for adults |
| Quran Kids | `/courses/quran-kids` | Quran courses for children |
| Arabic | `/courses/arabic` | Arabic language courses |
| Islamic Studies | `/courses/islamic-studies` | Islamic sciences courses |
| Course Detail | `/courses/[slug]` | Individual course page |
| Teachers | `/teachers` | Teacher profiles |
| Videos | `/videos` | Video library with filters |
| Pricing | `/pricing` | Subscription plans |
| Register | `/register` | User registration |
| Login | `/login` | User login |
| Dashboard | `/dashboard` | Student dashboard |

## Customization

### Adding Translations

Edit the JSON files in `src/messages/`:
- `de.json` - German
- `ar.json` - Arabic
- `en.json` - English

### Changing Colors

Edit `tailwind.config.ts` to modify the color palette:

```typescript
colors: {
  primary: {
    // Your custom green shades
  },
  secondary: {
    // Your custom blue shades
  },
}
```

### Adding Courses

Edit `src/lib/data.ts` to add new courses:

```typescript
export const courses: Course[] = [
  {
    id: 'new-course',
    slug: 'new-course-slug',
    title: 'New Course Title',
    // ... other properties
  },
];
```

## Deployment

### Vercel (Recommended)

```bash
npm run build
vercel deploy
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Next Steps for Production

1. **Database Integration**: Connect to MongoDB, PostgreSQL, or Supabase
2. **Authentication**: Implement NextAuth.js or Clerk
3. **Payment Processing**: Integrate Stripe or PayPal
4. **Video Hosting**: Use Vimeo, YouTube, or Mux
5. **Email Service**: Set up SendGrid or Resend
6. **Analytics**: Add Google Analytics or Plausible

## Support

For questions or issues, please contact the development team.

## License

Private - All rights reserved.
