# DigitalSpeed - PERN Stack Website

A modern website built with the PERN stack (PostgreSQL, Express, React, Node.js) using Next.js, TypeScript, Prisma ORM, NextAuth, Cloudinary, and Tailwind CSS.

## Features

- **Public-facing Website**: Home, Blog, Projects, Shop, Gallery, and Contact pages
- **Admin Dashboard**: Manage content with a comprehensive admin panel
- **Authentication**: Secure login with NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **Image Storage**: Cloudinary integration for image uploads
- **Responsive Design**: Mobile, tablet, and desktop friendly with Tailwind CSS

## Admin Dashboard Sections

- **Dashboard Overview**: Statistics and recent activity
- **Blogs**: Create, edit, and manage blog posts
- **Projects**: Showcase your work
- **Shop**: Manage products
- **Gallery**: Upload and organize images
- **Contacts**: View and manage contact form submissions
- **Settings**: Configure website settings
- **Audit Trail**: Track admin actions

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Cloudinary account

## Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/digitalspeed.git
cd digitalspeed
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/digitalspeed?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NEXT_PUBLIC_CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

4. **Set up the database**

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed the database with initial data
npm run db:seed
```

5. **Start the development server**

```bash
npm run dev
```

6. **Access the website**

- Frontend: [http://localhost:3000](http://localhost:3000)
- Admin Dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
  - Default admin credentials:
    - Email: admin@example.com
    - Password: admin123

## Build for Production

```bash
npm run build
npm run start
```

## Database Management

You can use Prisma Studio to manage your database:

```bash
npm run prisma:studio
```

## Project Structure

```
digitalspeed/
├── prisma/                # Prisma schema and migrations
├── public/                # Static assets
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (admin)/       # Admin dashboard routes
│   │   ├── (public)/      # Public-facing routes
│   │   ├── api/           # API routes
│   ├── components/        # React components
│   │   ├── admin/         # Admin dashboard components
│   │   ├── public/        # Public-facing components
│   │   ├── ui/            # Shared UI components
│   ├── lib/               # Utility functions and libraries
│   ├── types/             # TypeScript type definitions
├── .env                   # Environment variables
├── package.json           # Project dependencies
├── tailwind.config.js     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
