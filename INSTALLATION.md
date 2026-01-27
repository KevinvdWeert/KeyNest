# KeyNest Installation Guide

## Overview
KeyNest is a personal encrypted password vault built with Laravel 10, React, and Stripe (Laravel Cashier).

## Prerequisites
- PHP 8.1+
- Composer
- Node.js 18+
- MySQL 8.0+
- Stripe Account (for subscriptions)

## Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/KevinvdWeert/KeyNest.git
cd KeyNest
```

### 2. Install PHP Dependencies
```bash
composer install
```

### 3. Install Node Dependencies
```bash
npm install
```

### 4. Environment Configuration
```bash
cp .env.example .env
php artisan key:generate
```

### 5. Configure Environment Variables

Edit `.env` and update:

#### Database Configuration
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=keynest
DB_USERNAME=root
DB_PASSWORD=your_password
```

#### Stripe Configuration
Get your Stripe keys from https://dashboard.stripe.com/apikeys

```env
STRIPE_KEY=pk_test_your_publishable_key
STRIPE_SECRET=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

#### Create Stripe Products and Prices
1. Go to https://dashboard.stripe.com/products
2. Create two products:
   - **PRO** ($3/month): Set recurring price
   - **PRO+** ($6/month): Set recurring price
3. Copy the Price IDs and update:

```env
STRIPE_PLAN_PRO=price_xxxxxxxxxxxxx
STRIPE_PLAN_PRO_PLUS=price_xxxxxxxxxxxxx
```

#### Sanctum Configuration
```env
SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1
SESSION_DOMAIN=localhost
```

### 6. Run Database Migrations
```bash
php artisan migrate
```

### 7. Publish Vendor Assets
```bash
php artisan vendor:publish --tag=cashier-migrations
php artisan migrate
```

### 8. Build Frontend Assets
```bash
npm run build
```

For development with hot reload:
```bash
npm run dev
```

### 9. Start the Development Server
```bash
php artisan serve
```

Visit http://localhost:8000

## Application Structure

### Frontend (React)
```
resources/
├── js/
│   ├── app.js                      # Main entry point
│   ├── vault.jsx                   # Vault React entry point
│   └── vault/
│       ├── App.jsx                 # Vault root component
│       ├── crypto/
│       │   └── encryption.js       # Client-side encryption (Web Crypto API)
│       └── components/
│           ├── MasterPasswordModal.jsx
│           ├── VaultList.jsx
│           ├── VaultItem.jsx
│           ├── AddItemModal.jsx
│           └── EditItemModal.jsx
└── views/
    ├── layouts/
    │   └── app.blade.php           # Main layout
    ├── auth/
    │   ├── login.blade.php
    │   └── register.blade.php
    ├── billing/
    │   ├── index.blade.php
    │   └── success.blade.php
    ├── dashboard.blade.php
    └── vault.blade.php              # React mount point
```

### Backend (Laravel)
```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Api/
│   │   │   └── VaultController.php     # API endpoints for vault
│   │   ├── Auth/
│   │   │   └── AuthController.php      # Authentication
│   │   └── SubscriptionController.php  # Stripe subscriptions
│   └── Middleware/
│       └── CheckSubscriptionLimit.php  # Subscription enforcement
└── Models/
    ├── User.php                        # User model with Billable trait
    └── VaultItem.php                   # Vault item model
```

## Encryption Flow

### Client-Side Encryption (Web Crypto API)
1. User enters master password (never sent to server)
2. Password data is encrypted with AES-GCM on the client
3. Encrypted blob is sent to Laravel API
4. Laravel stores encrypted blob in database
5. Title and category are encrypted with Laravel Encryption (server-side) for search purposes

### Decryption
1. User enters master password
2. Encrypted data is fetched from API
3. Client decrypts data using master password
4. Plaintext is displayed only in the browser

**Important**: The server never receives or stores plaintext passwords.

## Subscription Plans

### FREE (Default)
- Max 25 password entries
- 1 vault
- Manual sync
- No attachments

### PRO ($3/month)
- Unlimited password entries
- Unlimited vaults
- Encrypted notes
- Automatic cross-device sync
- Priority badge

### PRO+ ($6/month)
- Everything in PRO
- Encrypted file attachments
- Optional read-only vault sharing
- Early access to new features

## API Routes

### Authentication
- `POST /login` - User login
- `POST /register` - User registration
- `POST /logout` - User logout

### Vault API (Requires Authentication)
- `GET /api/vault` - List all vault items
- `POST /api/vault` - Create new vault item
- `PUT /api/vault/{id}` - Update vault item
- `DELETE /api/vault/{id}` - Delete vault item

### Billing
- `GET /billing` - View subscription plans
- `GET /billing/checkout/{plan}` - Checkout for a plan
- `GET /billing/portal` - Stripe customer portal
- `POST /billing/cancel` - Cancel subscription

## Security Considerations

### Client-Side Encryption
- AES-GCM with 256-bit keys
- PBKDF2 key derivation (100,000 iterations)
- Random salt and IV for each encryption
- Master password never transmitted

### Laravel Security
- CSRF protection enabled
- Sanctum for SPA authentication
- Title/category encrypted with Laravel Encryption
- Subscription limits enforced server-side

## Stripe Webhooks

Configure webhook endpoint in Stripe Dashboard:
```
https://yourdomain.com/stripe/webhook
```

Required events:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

## Development

### Running Tests
```bash
php artisan test
```

### Code Style
```bash
./vendor/bin/pint
```

### Build for Production
```bash
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## Troubleshooting

### Vite Build Errors
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Database Connection Issues
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database exists

### Subscription Issues
- Verify Stripe keys are correct
- Check webhook endpoint is configured
- Review Stripe logs in dashboard

## Support
For issues and questions, please open an issue on GitHub.
