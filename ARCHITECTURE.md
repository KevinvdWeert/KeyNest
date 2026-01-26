# KeyNest Architecture Documentation

## Overview
KeyNest is a modern password manager built with Laravel 10 and React, featuring client-side encryption and Stripe subscription management.

## Technology Stack

### Backend
- **Laravel 10**: PHP framework
- **Laravel Sanctum**: SPA authentication
- **Laravel Cashier**: Stripe subscription management
- **Laravel Encryption**: Server-side encryption for metadata
- **MySQL 8**: Database

### Frontend
- **React 18**: Dynamic UI library
- **Vite 5**: Build tool
- **Tailwind CSS 3**: Styling
- **Web Crypto API**: Client-side encryption

### Payment Processing
- **Stripe**: Subscription billing

## Application Flow

### 1. User Registration & Authentication
```
User → Register Form → Laravel Auth → Database
                     → Auto-login → Dashboard
```

### 2. Vault Access Flow
```
User → Login → Dashboard → Vault Page
                         ↓
                  Master Password Modal
                         ↓
                  React App Loads
                         ↓
                  Fetch Encrypted Items
                         ↓
                  Decrypt on Client
                         ↓
                  Display Items
```

### 3. Adding a Password
```
User Input → Encrypt with Master Password (Client)
          → Send Encrypted Blob to API
          → Validate Subscription Limit (Server)
          → Store in Database
          → Return Success
          → Update React State
          → UI Updates Instantly
```

### 4. Subscription Flow
```
User → Select Plan → Stripe Checkout
                   → Payment Success
                   → Webhook to Laravel
                   → Update Subscription
                   → Unlock Features
```

## Security Architecture

### Two-Layer Encryption

#### Layer 1: Client-Side (Web Crypto API)
**Purpose**: Protect password data from server access

**Algorithm**: AES-GCM (256-bit)
- Key derivation: PBKDF2 with 100,000 iterations
- Salt: 16 bytes (random per item)
- IV: 12 bytes (random per encryption)

**What is encrypted**:
- Username
- Password
- URL
- Notes

**Key characteristics**:
- Master password never leaves the browser
- Server receives only encrypted blobs
- Decryption only possible with correct master password

#### Layer 2: Server-Side (Laravel Encryption)
**Purpose**: Enable search and filtering

**Algorithm**: AES-256-CBC (Laravel default)

**What is encrypted**:
- Item title
- Category

**Key characteristics**:
- Uses Laravel application key
- Allows server to search/filter
- Protects metadata

### Data Flow Security

```
┌─────────────────────────────────────────────────────┐
│                    Browser (Client)                  │
│  ┌────────────────────────────────────────────┐    │
│  │ Master Password (never transmitted)        │    │
│  └────────────┬───────────────────────────────┘    │
│               │                                      │
│               ▼                                      │
│  ┌────────────────────────────────────────────┐    │
│  │ Web Crypto API                             │    │
│  │ • AES-GCM Encryption                       │    │
│  │ • PBKDF2 Key Derivation                    │    │
│  └────────────┬───────────────────────────────┘    │
│               │                                      │
│               ▼                                      │
│  ┌────────────────────────────────────────────┐    │
│  │ Encrypted Blob (Base64)                    │    │
│  └────────────┬───────────────────────────────┘    │
└───────────────┼──────────────────────────────────┘
                │ HTTPS
                ▼
┌─────────────────────────────────────────────────────┐
│                Laravel Server (API)                  │
│  ┌────────────────────────────────────────────┐    │
│  │ Sanctum Authentication                     │    │
│  └────────────┬───────────────────────────────┘    │
│               │                                      │
│               ▼                                      │
│  ┌────────────────────────────────────────────┐    │
│  │ Subscription Limit Check                   │    │
│  └────────────┬───────────────────────────────┘    │
│               │                                      │
│               ▼                                      │
│  ┌────────────────────────────────────────────┐    │
│  │ Laravel Encryption (Title/Category)        │    │
│  └────────────┬───────────────────────────────┘    │
│               │                                      │
│               ▼                                      │
│  ┌────────────────────────────────────────────┐    │
│  │ Store in Database                          │    │
│  │ • encrypted_data (client-encrypted)        │    │
│  │ • title (server-encrypted)                 │    │
│  │ • category (server-encrypted)              │    │
│  └────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

## Database Schema

### users
```sql
id              BIGINT PRIMARY KEY
name            VARCHAR(255)
email           VARCHAR(255) UNIQUE
password        VARCHAR(255)  -- Hashed
remember_token  VARCHAR(100)
created_at      TIMESTAMP
updated_at      TIMESTAMP

-- Cashier columns (from migrations)
stripe_id       VARCHAR(255) NULLABLE
pm_type         VARCHAR(255) NULLABLE
pm_last_four    VARCHAR(4) NULLABLE
trial_ends_at   TIMESTAMP NULLABLE
```

### vault_items
```sql
id              BIGINT PRIMARY KEY
user_id         BIGINT FOREIGN KEY → users.id
title           TEXT              -- Laravel encrypted
encrypted_data  TEXT              -- Client encrypted (Base64)
type            VARCHAR(50)       -- 'password', 'note', 'card', 'identity'
category        TEXT NULLABLE     -- Laravel encrypted
favorite        BOOLEAN DEFAULT false
created_at      TIMESTAMP
updated_at      TIMESTAMP

INDEX(user_id)
INDEX(type)
```

### subscriptions (Cashier)
```sql
id                      BIGINT PRIMARY KEY
user_id                 BIGINT FOREIGN KEY
type                    VARCHAR(255)  -- 'default'
stripe_id               VARCHAR(255)  -- Stripe subscription ID
stripe_status           VARCHAR(255)  -- 'active', 'canceled', etc.
stripe_price            VARCHAR(255)  -- Price ID
quantity                INTEGER
trial_ends_at           TIMESTAMP NULLABLE
ends_at                 TIMESTAMP NULLABLE
created_at              TIMESTAMP
updated_at              TIMESTAMP
```

## Component Architecture

### React Component Hierarchy

```
App.jsx (Root)
├── MasterPasswordModal
│   └── Password Input Form
│
├── VaultList
│   └── VaultItem (multiple)
│       ├── Decrypt Data
│       ├── Display Fields
│       ├── Copy Buttons
│       └── Edit/Delete Actions
│
├── AddItemModal
│   ├── Form Fields
│   ├── Password Generator
│   ├── Client Encryption
│   └── API Call
│
└── EditItemModal
    ├── Decrypt Existing
    ├── Form Fields
    ├── Re-encrypt
    └── API Update
```

### Component Data Flow

```
                    ┌─────────────┐
                    │   App.jsx   │
                    └──────┬──────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
      ┌─────▼────┐   ┌────▼────┐   ┌────▼────┐
      │  State   │   │ Actions │   │  Modal  │
      │ • items  │   │ • add   │   │ Control │
      │ • master │   │ • edit  │   │         │
      │ • limits │   │ • delete│   │         │
      └──────────┘   └─────────┘   └─────────┘
```

### State Management

**No Redux/Context needed** - simple useState hooks:

```javascript
const [items, setItems] = useState([])           // Vault items
const [masterPassword, setMasterPassword] = useState(null)  // Session only
const [showAddModal, setShowAddModal] = useState(false)
const [editingItem, setEditingItem] = useState(null)
const [maxItems, setMaxItems] = useState(25)
const [canAddMore, setCanAddMore] = useState(true)
```

**Optimistic UI Updates**:
- Add item: Immediately add to state
- Delete item: Immediately remove from state
- Edit item: Immediately update in state
- On API error: Revert change and show error

## API Design

### RESTful Endpoints

#### GET /api/vault
**Purpose**: List all vault items for authenticated user

**Response**:
```json
{
  "items": [
    {
      "id": 1,
      "title": "Gmail Account",
      "encrypted_data": "base64_encrypted_blob",
      "type": "password",
      "category": "Work",
      "favorite": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "max_items": 25,
  "current_count": 1,
  "can_add_more": true
}
```

#### POST /api/vault
**Purpose**: Create new vault item

**Request**:
```json
{
  "title": "Gmail Account",
  "encrypted_data": "base64_encrypted_blob",
  "type": "password",
  "category": "Work",
  "favorite": false
}
```

**Validation**:
- Subscription limit check (middleware)
- Server-side validation
- Title encryption before storage

#### PUT /api/vault/{id}
**Purpose**: Update existing vault item

**Request**: Same as POST (partial updates allowed)

#### DELETE /api/vault/{id}
**Purpose**: Delete vault item

**Response**:
```json
{
  "message": "Vault item deleted successfully"
}
```

## Subscription Management

### Plan Enforcement

**Middleware: CheckSubscriptionLimit**
- Checks on POST /api/vault
- Returns 403 if limit reached
- Includes upgrade message

**User Model Methods**:
```php
getMaxVaultItems(): int  // 25 for free, unlimited for paid
canAddVaultItem(): bool  // Check current count vs limit
hasSubscription(string $plan): bool  // Check specific plan
```

### Stripe Integration

**Checkout Flow**:
1. User clicks "Upgrade to PRO"
2. Laravel generates Stripe Checkout Session
3. Redirect to Stripe payment page
4. User completes payment
5. Webhook updates subscription
6. User redirected to success page

**Webhook Events**:
- `customer.subscription.created`: Activate subscription
- `customer.subscription.updated`: Update status
- `customer.subscription.deleted`: Cancel subscription
- `invoice.payment_succeeded`: Confirm payment
- `invoice.payment_failed`: Handle failure

## Deployment Considerations

### Environment Variables
- Separate `.env` for production
- Rotate `APP_KEY` after deployment
- Use strong `STRIPE_WEBHOOK_SECRET`
- Set `SESSION_DOMAIN` correctly

### Performance Optimizations
- Laravel caching: config, routes, views
- Vite asset bundling and minification
- Database indexing on user_id and type
- CDN for static assets

### Security Checklist
- [ ] HTTPS enforced
- [ ] CSRF protection enabled
- [ ] Rate limiting on API routes
- [ ] Stripe webhook signature verification
- [ ] SQL injection prevention (Eloquent ORM)
- [ ] XSS prevention (React escaping)
- [ ] Strong password hashing (bcrypt)
- [ ] Secure session configuration

## Future Enhancements

### Planned Features
- Vault sharing (PRO+)
- File attachments (PRO+)
- Browser extension
- Mobile apps (iOS/Android)
- Two-factor authentication
- Password health reports
- Breach monitoring
- Password history

### Technical Improvements
- WebAuthn support
- Offline PWA functionality
- End-to-end encrypted notes
- Vault export/import
- Account recovery (without master password reset)
