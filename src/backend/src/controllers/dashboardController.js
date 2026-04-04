// backend/src/controllers/dashboardController.js
const prisma = require('../prismaClient');

exports.getStats = async (req, res) => {
  try {
    const totalRevenue = await prisma.payment.aggregate({
      _sum: { amountPaid: true },
      where: { sale: { userId: req.user.id } }
    });

    const totalDues = await prisma.sale.aggregate({
      _sum: { amountDue: true },
      where: { paymentStatus: { not: 'PAID' }, userId: req.user.id },
    });

    const totalItems = await prisma.item.count({
      where: { isSold: false, userId: req.user.id }
    });
    const totalCustomers = await prisma.customer.count({ where: { userId: req.user.id } });

    res.json({
      totalRevenue: totalRevenue._sum.amountPaid || 0,
      totalDues: totalDues._sum.amountDue || 0,
      totalItems,
      totalCustomers,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats.' });
  }
};

exports.getSalesOverTime = async (req, res) => {
  try {
    const salesByMonth = await prisma.$queryRaw`
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') as month,
        SUM("totalSaleAmount") as "totalSales"
      FROM sales
      WHERE "userId" = ${req.user.id}
      GROUP BY month
      ORDER BY month ASC
      LIMIT 12;
    `;

    const formattedSales = salesByMonth.map(entry => ({
      month: entry.month,
      totalSales: Number(entry.totalSales || 0)
    }));

    res.json(formattedSales);
  } catch (error) {
    console.error('Error fetching sales over time:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ message: 'Failed to fetch sales data.' });
  }
};

exports.getTopSellingItems = async (req, res) => {
  try {
    const topItems = await prisma.saleItem.groupBy({
      by: ['itemId'],
      _count: {
        itemId: true,
      },
      where: { sale: { userId: req.user.id } },
      orderBy: {
        _count: {
          itemId: 'desc',
        },
      },
      take: 5,
    });

    // Get item details for the top IDs
    const itemIds = topItems.map(item => item.itemId);
    const items = await prisma.item.findMany({
      where: { id: { in: itemIds } },
      select: { id: true, name: true, sku: true },
    });

    // Map counts to item details
    const result = topItems.map(topItem => {
      const itemDetails = items.find(i => i.id === topItem.itemId);
      return {
        ...itemDetails,
        salesCount: topItem._count.itemId,
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching top items:', error);
    res.status(500).json({ message: 'Failed to fetch top items.' });
  }
};

exports.getCustomerDues = async (req, res) => {
  try {
    const dues = await prisma.sale.findMany({
      where: {
        paymentStatus: { not: 'PAID' },
        userId: req.user.id
      },
      select: {
        id: true,
        amountDue: true,
        dueDate: true,
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
    res.json(dues);
  } catch (error) {
    console.error('Error fetching customer dues:', error);
    res.status(500).json({ message: 'Failed to fetch customer dues.' });
  }
};

exports.getSalesByYear = async (req, res) => {
  try {
    const salesByYear = await prisma.$queryRaw`
      SELECT 
        TO_CHAR(created_at, 'YYYY') as year,
        SUM("totalSaleAmount") as "totalSales"
      FROM sales
      WHERE "userId" = ${req.user.id}
      GROUP BY year
      ORDER BY year DESC
      LIMIT 5;
    `;

    const formattedSales = salesByYear.map(entry => ({
      year: entry.year,
      totalSales: Number(entry.totalSales || 0)
    }));

    res.json(formattedSales);
  } catch (error) {
    console.error('Error fetching sales by year:', error);
    res.status(500).json({ message: 'Failed to fetch sales data.' });
  }
};

exports.getSalesByCategory = async (req, res) => {
  try {
    const categoryStats = await prisma.$queryRaw`
      SELECT 
        i.category,
        SUM(si."soldPrice") as "totalSales",
        COUNT(si.id) as "itemCount"
      FROM sale_items si
      JOIN items i ON si."itemId" = i.id
      WHERE i.category IS NOT NULL AND i."userId" = ${req.user.id}
      GROUP BY i.category
      ORDER BY "totalSales" DESC;
    `;

    const formattedStats = categoryStats.map(entry => ({
      category: entry.category || 'Other',
      totalSales: Number(entry.totalSales || 0),
      itemCount: Number(entry.itemCount || 0)
    }));

    res.json(formattedStats);
  } catch (error) {
    console.error('Error fetching sales by category:', error);
    res.status(500).json({ message: 'Failed to fetch sales data.' });
  }
};

exports.getTotalSalesStats = async (req, res) => {
  try {
    const totalSales = await prisma.sale.aggregate({
      _sum: { totalSaleAmount: true },
      _count: true,
      where: { userId: req.user.id }
    });

    const categoryStats = await prisma.$queryRaw`
      SELECT 
        i.category,
        SUM(si."soldPrice") as amount
      FROM sale_items si
      JOIN items i ON si."itemId" = i.id
      WHERE i.category IS NOT NULL AND i."userId" = ${req.user.id}
      GROUP BY i.category;
    `;

    res.json({
      totalAmount: Number(totalSales._sum.totalSaleAmount || 0),
      totalCount: totalSales._count,
      byCategory: categoryStats.map(c => ({
        category: c.category,
        amount: Number(c.amount || 0)
      }))
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to fetch data.' });
  }
};

exports.getPiecesByMetal = async (req, res) => {
  try {
    const metalStats = await prisma.item.groupBy({
      by: ['metal'],
      _count: {
        id: true,
      },
      where: {
        isSold: false, // Only count items in stock
        metal: { not: null },
        userId: req.user.id
      }
    });

    const formattedStats = metalStats.map(entry => ({
      metal: entry.metal,
      count: entry._count.id
    }));

    res.json(formattedStats);
  } catch (error) {
    console.error('Error fetching pieces by metal:', error);
    res.status(500).json({ message: 'Failed to fetch metal stats.' });
  }
};

exports.getRecentSales = async (req, res) => {
  try {
    const recentSales = await prisma.sale.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      where: { userId: req.user.id },
      include: {
        customer: {
          select: { name: true }
        }
      }
    });

    const formattedSales = recentSales.map(sale => ({
      id: sale.id,
      customerName: sale.customer ? sale.customer.name : 'Walk-in Customer',
      amount: sale.totalSaleAmount,
      date: sale.createdAt,
      status: sale.paymentStatus
    }));

    res.json(formattedSales);
  } catch (error) {
    console.error('Error fetching recent sales:', error);
    res.status(500).json({ message: 'Failed to fetch recent sales.' });
  }
};