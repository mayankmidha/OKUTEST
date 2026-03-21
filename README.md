# OKU Therapy - Integrated SaaS Platform

This is a comprehensive, integrated SaaS platform for a therapy clinic, built with Next.js, Prisma, NextAuth, and Stripe/Razorpay integrations.

## Features

- **Next.js 15 (App Router)** for a modern, performant web experience.
- **Authentication** via NextAuth.js (Next-Auth v5) with Credentials provider and Prisma Adapter.
- **Database** management with Prisma ORM and PostgreSQL.
- **Payments** integration with both Stripe and Razorpay.
- **Styling** with Tailwind CSS and Framer Motion for a polished UI.
- **Content Management** through local JSON files.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd oku-therapy-integrated
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Copy `.env` and fill in the values for:
    - `AUTH_SECRET`: Random string for NextAuth.
    - `DATABASE_URL`: PostgreSQL connection string.
    - `STRIPE_SECRET_KEY` & `STRIPE_WEBHOOK_SECRET`.
    - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` & `RAZORPAY_WEBHOOK_SECRET`.

4.  **Database Migration:**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run in development mode:**
    ```bash
    npm run dev
    ```

## Deployment to Vercel

1.  Push your code to GitHub.
2.  Import the project into Vercel.
3.  Add the environment variables in the Vercel dashboard.
4.  Vercel will automatically run the `build` script (`prisma generate && next build`).

## Database Management

This project uses Prisma with PostgreSQL. Ensure you have a PostgreSQL instance (e.g., from Vercel Postgres, Supabase, or Neon) and provide the `DATABASE_URL` during deployment.
