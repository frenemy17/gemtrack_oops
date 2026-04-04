const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugDashboard() {
  try {
    console.log('Testing dashboard queries...');
    
    // Test 1: Check if sales table exists and has data
    const salesCount = await prisma.sale.count();
    console.log('Sales count:', salesCount);
    
    // Test 2: Check if payments table exists
    const paymentsCount = await prisma.payment.count();
    console.log('Payments count:', paymentsCount);
    
    // Test 3: Try the raw query
    try {
      const result = await prisma.$queryRaw`SELECT COUNT(*) as count FROM sales`;
      console.log('Raw query result:', result);
    } catch (rawError) {
      console.error('Raw query error:', rawError.message);
    }
    
  } catch (error) {
    console.error('Debug error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

debugDashboard();