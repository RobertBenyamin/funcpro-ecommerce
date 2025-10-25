# 🛍️ Functional E-Commerce Platform

A type-safe e-commerce platform built with **Next.js 14**, **TypeScript**, and **Prisma**, demonstrating functional programming principles through applicative validation, state machines, and pure functions.

## 🎯 Project Overview

This project showcases functional programming concepts in a full-stack TypeScript application:

- ✅ **Type-Safe State Machine** - Order state transitions with discriminated unions
- ✅ **Applicative Validation** - Collect all validation errors at once
- ✅ **Pure Analytics** - Monoid-like aggregation for sales statistics
- ✅ **Event-Based Balance** - Calculate balance using pure folds
- ✅ **Immutable State** - All state updates are immutable

## 🏗️ Tech Stack

### Core
- **Next.js 14** - Full-stack React framework with App Router
- **TypeScript 5** - Static type checking
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Database (Supabase)

### Future Additions
- **Zod** - Runtime validation
- **TailwindCSS** - Styling
- **Recharts** - Analytics visualization

## 📊 Database Schema

### Models

#### **User**
- Roles: `SELLER` | `BUYER`
- Relations: products, carts, orders, balanceEvents

#### **Product**
- Fields: name, description, price (cents), stock
- Managed by sellers

#### **Cart & CartItem**
- One cart per user
- Multiple items with quantity validation

#### **Order & OrderItem**
- State machine: `PENDING` → `PAYMENT_PAGE` → `PAYMENT_SUCCESS`/`PAYMENT_FAILED`
- Payment methods: `BANK_TRANSFER` (always succeeds) | `BALANCE` (checks balance)

#### **BalanceEvent**
- Event sourcing pattern
- Types: `DEPOSIT` | `WITHDRAWAL` | `PAYMENT_DEDUCTION`
- Balance calculated via pure fold

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Supabase account)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RobertBenyamin/funcpro-ecommerce.git
   cd funcpro-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://..."
   DIRECT_URL="postgresql://..."
   ```

4. **Push database schema**
   ```bash
   npm run db:push
   ```

5. **Seed the database**
   ```bash
   npm run db:seed
   ```

6. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio (database GUI)
npm run db:generate  # Generate Prisma Client
npm run db:seed      # Seed database with sample data
```

## 🧪 Test Data

After seeding, you'll have:

### Sellers
- `seller1@example.com` - Tech Store (4 products)
- `seller2@example.com` - Fashion Boutique (3 products)

### Buyers
- `buyer1@example.com` - $500 balance
- `buyer2@example.com` - ~$120 balance (after order)

## 🔑 Key Functional Programming Concepts

### 1. Type-Safe State Machine
```typescript
type OrderState =
  | { status: 'PENDING'; cartId: string }
  | { status: 'PAYMENT_PAGE'; totalAmount: number }
  | { status: 'PAYMENT_SUCCESS'; orderId: string }
  | { status: 'PAYMENT_FAILED'; reason: string };
```

### 2. Applicative Validation
```typescript
type Validation<E, A> =
  | { type: 'Success'; value: A }
  | { type: 'Failure'; errors: E[] };

// Collects ALL errors instead of failing on first error
```

### 3. Pure Analytics (Monoid Pattern)
```typescript
// Combine sales stats using pure functions
const combineSalesStats = (a: SalesStats, b: SalesStats): SalesStats => ({
  totalRevenue: a.totalRevenue + b.totalRevenue,
  totalOrders: a.totalOrders + b.totalOrders,
  // ... more aggregations
});
```

### 4. Event-Based Balance
```typescript
// Calculate balance by folding over events
const calculateBalance = (events: BalanceEvent[]): number =>
  events.reduce((acc, event) => acc + event.amount, 0);
```

## 📁 Project Structure

```
funcpro-ecommerce/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed data
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API routes (backend)
│   │   └── ...             # Pages
│   ├── lib/
│   │   └── prisma.ts       # Prisma client singleton
│   └── types/
│       └── index.ts        # TypeScript types & domain models
├── .env                    # Environment variables
└── package.json
```

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Functional Programming in TypeScript](https://gcanti.github.io/fp-ts/)

## 📦 Next Steps

This setup includes:
- ✅ Database schema with all models
- ✅ Type definitions
- ✅ Prisma client
- ✅ Sample seed data

**Coming soon:**
- [ ] API routes (Product, Cart, Order, Payment, Balance)
- [ ] Validation utilities
- [ ] State machine implementation
- [ ] Analytics aggregation
- [ ] Frontend UI components

## 👥 Contributors

- Robert Benyamin

## 📄 License

This project is for educational purposes (Functional Programming course assignment).

