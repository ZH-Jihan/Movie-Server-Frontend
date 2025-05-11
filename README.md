# CineVerse

[Live Demo](https://cineverse-mocha-three.vercel.app)

A modern, full-stack Movie Portal built with Next.js, TypeScript, Tailwind CSS, and Prisma. Users can browse, like, comment, review, add to watchlist, and purchase movies and series. Includes authentication, user profiles, and admin features.

## Features

- User authentication (login, register, logout)
- View, like, comment, and review movies/series
- Add movies/series to watchlist
- Purchase movies
- User profile with all activity
- Admin panel for managing content
- Responsive, modern UI with Tailwind CSS

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/) (or your preferred DB)
- [Vercel](https://vercel.com/) for deployment

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ZH-Jihan/Movie-Server-Frontend
cd Movie-Server-Frontend
```

### 2. Install dependencies

```bash
npm install
# or
yarn
# or
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory and add the following:

```env
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

Adjust as needed for your environment.

### 4. Set up the database

```bash
npx prisma migrate dev --name init
```

### 5. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

## Folder Structure

- `src/app` - Next.js app directory (pages, API routes)
- `src/components` - Reusable UI components
- `src/services` - API and business logic
- `src/lib` - Utilities, hooks, and context
- `src/interfaces` - TypeScript interfaces
- `public/` - Static assets

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request
