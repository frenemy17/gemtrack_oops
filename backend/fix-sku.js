const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixDuplicateSKUs() {
  try {
    const items = await prisma.item.findMany();
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.sku || item.sku === '') {
        await prisma.item.update({
          where: { id: item.id },
          data: { sku: `SKU-${item.id}-${Date.now()}` }
        });
      }
    }
    
    console.log('Fixed duplicate SKUs');
  } catch (error) {
    console.error('Error fixing SKUs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixDuplicateSKUs();