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
- Fields: name, description, price (cents)
- Stock managed immutably via StockEvent records
- Managed by sellers

#### **StockEvent**
- Event sourcing pattern for immutable stock tracking
- Types: `INITIAL` | `RESERVATION` | `CANCELLATION` | `RESTOCK`
- Stock calculated via pure fold over all events

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

## 📚 API Documentation

### Product API

Complete API documentation for the Product Module. All endpoints are implemented and ready for production use.

#### Base URL
```
http://localhost:3000/api
```

#### Authentication
Currently no authentication required (add as needed).

#### Endpoints

**1. List Products**
```
GET /api/products?skip=0&take=50
```
Returns paginated products list.

**2. Get Product by ID**
```
GET /api/products/:id
```
Returns product with seller information.

**3. Create Product** ✅
```
POST /api/products
Content-Type: application/json

{
  "name": "New Widget",
  "description": "A shiny new widget",
  "price": 2999,
  "stock": 50,
  "sellerId": "cmh837t2e00017kfs5guwauz9"
}
```
*Note: The `stock` parameter creates an INITIAL StockEvent. Stock is managed immutably via `/stock-events` API.*

**4. Reserve Stock (Atomic)** ✅
```
POST /api/products/:id/reserve
Content-Type: application/json

{ "quantity": 10 }
```
Atomically decrements stock. Returns 409 if insufficient stock.

**5. Update Product (PATCH)** ✅
```
PATCH /api/products/:id
Content-Type: application/json

{ "price": 3499, "name": "Updated Widget" }
```

**6. Delete Product** ✅
```
DELETE /api/products/:id
```

#### Implementation Details

**Service Layer** (`src/lib/product.ts`)
- `createProduct(data, sellerId)` - Creates product with initial stock
- `getProductById(id)` - Fetches product with seller info
- `listProducts(skip, take)` - Paginates products
- `updateProduct(id, data)` - Partial update with type validation
- `deleteProduct(id)` - Removes product
- `getCurrentStock(productId)` - Returns current stock level
- `reserveStock(productId, quantity)` - Atomic stock reservation

**Key Features**
- ✅ Atomic Stock Reservation - Uses conditional updateMany to prevent race conditions
- ✅ Type Safety - Full TypeScript with Prisma types
- ✅ Pagination - Built-in skip/take parameters
- ✅ Seller Relations - Products include seller info on fetch
- ✅ Error Handling - Proper HTTP status codes (400, 404, 409, 500)

#### Test APIs Locally
```bash
# List products
curl http://localhost:3000/api/products

# Get product
curl http://localhost:3000/api/products/cmh837vkd000f7kfs1rwvjnup

# Create product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "description": "Description",
    "price": 2999,
    "stock": 50,
    "sellerId": "cmh837t2e00017kfs5guwauz9"
  }'

# Reserve stock
curl -X POST http://localhost:3000/api/products/:id/stock-events \
  -H "Content-Type: application/json" \
  -d '{ "type": "RESERVATION", "quantity": -5, "reason": "Order #123" }'

# Update product
curl -X PATCH http://localhost:3000/api/products/:id \
  -H "Content-Type: application/json" \
  -d '{ "price": 3999 }'

# Delete product
# Delete product
curl -X DELETE http://localhost:3000/api/products/:id
```

### Stock Events API

The Stock Events API provides immutable event-based stock management with complete audit trail.

**Endpoints:**

**1. Calculate Current Stock**
```
GET /api/products/:id/stock
```
Returns the current calculated stock level for a product.

**Response:**
```json
{
  "productId": "cmh8542sp00027kxcz3ne0622",
  "productName": "Wireless Mouse",
  "currentStock": 14,
  "totalEvents": 4,
  "lastUpdated": "2025-10-26T20:04:12.004Z"
}
```

**2. Get Stock Events for a Product**
```
GET /api/products/:id/stock-events
```
Returns all stock events and current calculated stock.

**Response:**
```json
{
  "productId": "cmh8542sp00027kxcz3ne0622",
  "currentStock": 14,
  "totalEvents": 4,
  "events": [
    {
      "id": "event_id_1",
      "productId": "cmh8542sp00027kxcz3ne0622",
      "type": "INITIAL",
      "quantity": 10,
      "reason": "Initial stock",
      "createdAt": "2025-10-26T20:04:08.360Z"
    },
    {
      "id": "event_id_2",
      "productId": "cmh8542sp00027kxcz3ne0622",
      "type": "RESERVATION",
      "quantity": -3,
      "reason": "Reservation for 3 units",
      "createdAt": "2025-10-26T20:04:09.729Z"
    }
  ]
}
```

**2. Record a Stock Event**
```
POST /api/products/:id/stock-events
Content-Type: application/json

{
  "type": "RESERVATION | CANCELLATION | RESTOCK",
  "quantity": -5,
  "reason": "Optional reason"
}
```

**Event Types:**
- `RESERVATION`: Reduce stock (quantity negative, e.g., -5)
- `RESTOCK`: Add stock (quantity positive, e.g., 10)
- `CANCELLATION`: Restore stock (quantity positive, e.g., 2)

**Response:**
```json
{
  "success": true,
  "event": {
    "id": "event_id_new",
    "productId": "cmh8542sp00027kxcz3ne0622",
    "type": "RESERVATION",
    "quantity": -5,
    "reason": "Order #123",
    "createdAt": "2025-10-26T20:04:15.000Z"
  },
  "currentStock": 9
}
```

**Test Examples:**
```bash
# Get current stock (simple calculation)
curl http://localhost:3000/api/products/{id}/stock

# Get stock history (with all events)
curl http://localhost:3000/api/products/{id}/stock-events

# Reserve stock (reserve 5 units)
curl -X POST http://localhost:3000/api/products/{id}/stock-events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "RESERVATION",
    "quantity": -5,
    "reason": "Order #123"
  }'

# Restock (add 10 units)
curl -X POST http://localhost:3000/api/products/{id}/stock-events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "RESTOCK",
    "quantity": 10,
    "reason": "Warehouse delivery"
  }'

# Cancel reservation (restore 2 units)
curl -X POST http://localhost:3000/api/products/{id}/stock-events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "CANCELLATION",
    "quantity": 2,
    "reason": "Customer cancellation"
  }'
```

**Key Features:**
- ✅ Immutable Event Sourcing - All stock changes recorded as events, never mutated
- ✅ Complete Audit Trail - Full history with timestamps and reasons
- ✅ Pure Functional Calculation - Stock computed via fold over events
- ✅ No Race Conditions - Event recording is atomic and sequential
- ✅ Historical Replay - Can replay events to see stock at any point in time

See [`API_STOCK_EVENTS.md`](./API_STOCK_EVENTS.md) for detailed API documentation.

#### Product Service Functions
```

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

### 5. Immutable Stock Management (Event Sourcing)
```typescript
// Pure function: Calculate stock from event history
export const calculateStockFromEvents = (events: StockEventRecord[]): number =>
  events.reduce((acc, event) => acc + event.quantity, 0);

// Record stock changes as immutable events instead of mutating state
type StockEvent = 
  | { type: 'INITIAL'; quantity: number }
  | { type: 'RESERVATION'; quantity: number }  // negative
  | { type: 'CANCELLATION'; quantity: number } // positive
  | { type: 'RESTOCK'; quantity: number };     // positive

// Stock is never directly mutated - calculated from entire event history
// This provides complete audit trail and enables event replay
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

