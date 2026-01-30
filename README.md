# KeyNest

KeyNest is a personal encrypted password vault built with Laravel 10, React (Vite), and Stripe (Laravel Cashier).

Core idea: secrets are encrypted on the client (Web Crypto API). The server stores encrypted blobs and never sees the master password.

## Tech

- Backend: Laravel 10, Sanctum, Cashier
- Frontend: React 18, Vite 5, Tailwind CSS
- DB: MySQL 8+

## Quick start

Full steps are in INSTALLATION.md.

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm run dev
php artisan serve
```

## Required environment variables

See .env.example for the full list.

- Database: DB_* (MySQL)
- Stripe: STRIPE_KEY, STRIPE_SECRET, STRIPE_WEBHOOK_SECRET
- Price IDs: STRIPE_PLAN_PRO, STRIPE_PLAN_PRO_PLUS
- Sanctum (SPA): SANCTUM_STATEFUL_DOMAINS, SESSION_DOMAIN

## Dev commands

- Backend tests: `php artisan test`
- Format PHP: `./vendor/bin/pint`
- Build frontend: `npm run build`

## Notes

- Client-side encryption uses AES-GCM and PBKDF2 (see ARCHITECTURE.md).
- The API endpoints for vault CRUD live under /api and are protected by session auth + Sanctum stateful SPA middleware.
