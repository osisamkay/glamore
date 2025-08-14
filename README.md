# GlarmourGlow Fashion E-Commerce Platform

A modern, elegant e-commerce platform built with Next.js, featuring authentication, cart management, and email notifications.

## Features

- 🛍️ **Product Catalog** - Browse and filter products
- 🔐 **User Authentication** - Secure signup/login with session management
- 🛒 **Shopping Cart** - Add, remove, and manage cart items
- 📧 **Email Notifications** - Welcome emails and notifications
- 🎨 **Modern UI** - Responsive design with Tailwind CSS
- 🗄️ **Database** - SQLite with Prisma ORM

## Getting Started

### 1. Environment Setup

Copy the example environment file and configure your settings:

```bash
cp env.example .env
```

Edit `.env` and add your email credentials:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# Email Configuration (for welcome emails)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**For Gmail Setup:**
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to Security > 2-Step Verification
3. Generate an "App Password" for this application
4. Use your email and the app password (not your regular password)

### 2. Database Setup

Initialize the database:

```bash
npx prisma db push
npx prisma generate
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
