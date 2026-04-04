const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkItems() {
  try {
    const items = await prisma.item.findMany();
    console.log('Items in database:', items);
    
    // Find duplicates
    const skus = items.map(item => item.sku);
    const duplicates = skus.filter((sku, index) => skus.indexOf(sku) !== index);
    console.log('Duplicate SKUs:', duplicates);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkItems();