import "dotenv/config";
import { PrismaClient, UserRole, BalanceEventType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.balanceEvent.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create Sellers
  console.log('👤 Creating sellers...');
  const seller1 = await prisma.user.create({
    data: {
      email: 'seller1@example.com',
      name: 'Tech Store',
      role: UserRole.SELLER,
    },
  });

  const seller2 = await prisma.user.create({
    data: {
      email: 'seller2@example.com',
      name: 'Fashion Boutique',
      role: UserRole.SELLER,
    },
  });

  // Create Buyers
  console.log('👤 Creating buyers...');
  const buyer1 = await prisma.user.create({
    data: {
      email: 'buyer1@example.com',
      name: 'John Doe',
      role: UserRole.BUYER,
    },
  });

  const buyer2 = await prisma.user.create({
    data: {
      email: 'buyer2@example.com',
      name: 'Jane Smith',
      role: UserRole.BUYER,
    },
  });

  // Create Products for Seller 1 (Tech Store)
  console.log('📦 Creating products...');
  const products1 = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with USB receiver',
        price: 2500, // $25.00
        sellerId: seller1.id,
        stockEvents: {
          create: {
            type: 'INITIAL',
            quantity: 50,
            reason: 'Initial stock',
          },
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Mechanical Keyboard',
        description: 'RGB mechanical keyboard with blue switches',
        price: 8900, // $89.00
        sellerId: seller1.id,
        stockEvents: {
          create: {
            type: 'INITIAL',
            quantity: 30,
            reason: 'Initial stock',
          },
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'USB-C Cable',
        description: '2m braided USB-C charging cable',
        price: 1200, // $12.00
        sellerId: seller1.id,
        stockEvents: {
          create: {
            type: 'INITIAL',
            quantity: 100,
            reason: 'Initial stock',
          },
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Laptop Stand',
        description: 'Aluminum adjustable laptop stand',
        price: 4500, // $45.00
        sellerId: seller1.id,
        stockEvents: {
          create: {
            type: 'INITIAL',
            quantity: 25,
            reason: 'Initial stock',
          },
        },
      },
    }),
  ]);

  // Create Products for Seller 2 (Fashion Boutique)
  const products2 = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Cotton T-Shirt',
        description: 'Premium cotton t-shirt, available in multiple colors',
        price: 1999, // $19.99
        sellerId: seller2.id,
        stockEvents: {
          create: {
            type: 'INITIAL',
            quantity: 80,
            reason: 'Initial stock',
          },
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Denim Jeans',
        description: 'Classic fit denim jeans',
        price: 5999, // $59.99
        sellerId: seller2.id,
        stockEvents: {
          create: {
            type: 'INITIAL',
            quantity: 40,
            reason: 'Initial stock',
          },
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'Sneakers',
        description: 'Comfortable everyday sneakers',
        price: 7999, // $79.99
        sellerId: seller2.id,
        stockEvents: {
          create: {
            type: 'INITIAL',
            quantity: 35,
            reason: 'Initial stock',
          },
        },
      },
    }),
  ]);

  // Create Carts for Buyers
  console.log('🛒 Creating carts...');
  await prisma.cart.create({
    data: {
      userId: buyer1.id,
      items: {
        create: [
          {
            productId: products1[0].id, // Wireless Mouse
            quantity: 2,
          },
          {
            productId: products1[1].id, // Mechanical Keyboard
            quantity: 1,
          },
        ],
      },
    },
  });

  await prisma.cart.create({
    data: {
      userId: buyer2.id,
      items: {
        create: [
          {
            productId: products2[0].id, // Cotton T-Shirt
            quantity: 3,
          },
        ],
      },
    },
  });

  // Create Balance Events (Buyers have some balance)
  console.log('💰 Creating balance events...');
  await prisma.balanceEvent.create({
    data: {
      userId: buyer1.id,
      type: BalanceEventType.DEPOSIT,
      amount: 50000, // $500.00
    },
  });

  await prisma.balanceEvent.create({
    data: {
      userId: buyer2.id,
      type: BalanceEventType.DEPOSIT,
      amount: 30000, // $300.00
    },
  });

  // Create some completed orders for analytics
  console.log('📋 Creating sample orders...');
  await prisma.order.create({
    data: {
      userId: buyer1.id,
      totalAmount: 15000, // $150.00
      status: 'PAYMENT_SUCCESS',
      paymentMethod: 'BANK_TRANSFER',
      items: {
        create: [
          {
            productId: products1[2].id, // USB-C Cable
            quantity: 5,
            price: 1200,
          },
          {
            productId: products1[3].id, // Laptop Stand
            quantity: 2,
            price: 4500,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: buyer2.id,
      totalAmount: 17997, // $179.97
      status: 'PAYMENT_SUCCESS',
      paymentMethod: 'BALANCE',
      items: {
        create: [
          {
            productId: products2[0].id, // T-Shirt
            quantity: 3,
            price: 1999,
          },
          {
            productId: products2[2].id, // Sneakers
            quantity: 1,
            price: 7999,
          },
        ],
      },
    },
  });

  // Add payment deduction for balance payment
  await prisma.balanceEvent.create({
    data: {
      userId: buyer2.id,
      type: BalanceEventType.PAYMENT_DEDUCTION,
      amount: -17997,
      orderId: order2.id,
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Sellers: 2`);
  console.log(`- Buyers: 2`);
  console.log(`- Products: ${products1.length + products2.length}`);
  console.log(`- Carts: 2`);
  console.log(`- Orders: 2`);
  console.log('\n👥 Test Users:');
  console.log('Seller 1:', seller1.email, '(Tech Store)');
  console.log('Seller 2:', seller2.email, '(Fashion Boutique)');
  console.log('Buyer 1:', buyer1.email, '(Balance: $500)');
  console.log('Buyer 2:', buyer2.email, '(Balance: ~$120 after order)');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
