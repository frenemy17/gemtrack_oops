const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixDuplicateSKUs() {
  try {
    const items = await prisma.item.findMany();
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const newSku = `SKU-${item.id}`;
      
      await prisma.item.update({
        where: { id: item.id },
        data: { sku: newSku }
      });
      
      console.log(`Updated item ${item.id} with SKU: ${newSku}`);
    }
    
    console.log('All SKUs updated successfully');
  } catch (error) {
    console.error('Error fixing SKUs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixDuplicateSKUs();