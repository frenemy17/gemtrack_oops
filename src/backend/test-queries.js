const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Testing Dashboard Queries...');

    try {
        console.log('\n1. Testing getSalesOverTime...');
        const salesOverTime = await prisma.$queryRaw`
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') as month,
        SUM("totalSaleAmount") as "totalSales"
      FROM sales
      GROUP BY month
      ORDER BY month ASC
      LIMIT 12;
    `;
        console.log('Result:', salesOverTime);
    } catch (e) {
        console.error('Error in getSalesOverTime:', e.message);
    }

    try {
        console.log('\n2. Testing getSalesByYear...');
        const salesByYear = await prisma.$queryRaw`
      SELECT 
        TO_CHAR(created_at, 'YYYY') as year,
        SUM("totalSaleAmount") as "totalSales"
      FROM sales
      GROUP BY year
      ORDER BY year DESC
      LIMIT 5;
    `;
        console.log('Result:', salesByYear);
    } catch (e) {
        console.error('Error in getSalesByYear:', e.message);
    }

    try {
        console.log('\n3. Testing getSalesByCategory...');
        const salesByCategory = await prisma.$queryRaw`
      SELECT 
        i.category,
        SUM(si."soldPrice") as "totalSales",
        COUNT(si.id) as "itemCount"
      FROM sale_items si
      JOIN items i ON si."itemId" = i.id
      WHERE i.category IS NOT NULL
      GROUP BY i.category
      ORDER BY "totalSales" DESC;
    `;
        console.log('Result:', salesByCategory);
    } catch (e) {
        console.error('Error in getSalesByCategory:', e.message);
    }

    try {
        console.log('\n4. Testing getTotalSalesStats (Category Part)...');
        const categoryStats = await prisma.$queryRaw`
      SELECT 
        i.category,
        SUM(si."soldPrice") as amount
      FROM sale_items si
      JOIN items i ON si."itemId" = i.id
      WHERE i.category IS NOT NULL
      GROUP BY i.category;
    `;
        console.log('Result:', categoryStats);
    } catch (e) {
        console.error('Error in getTotalSalesStats:', e.message);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
