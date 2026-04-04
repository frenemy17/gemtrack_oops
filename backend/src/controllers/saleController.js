// backend/src/controllers/saleController.js
const prisma = require('../prismaClient.js');


// @route   POST /api/sales/checkout
// @desc    Process a new sale (checkout)
// @access  Private
exports.checkout = async (req, res) => {
  const { customerId, paymentMethod, items, amountPaid, discount = 0 } = req.body;

  if (!paymentMethod || !items || items.length === 0) {
    return res.status(400).json({ message: 'Payment method and items are required for checkout.' });
  }

  // Calculate total amount from the items provided
  const totalSaleAmount = items.reduce((sum, item) => sum + (item.soldPrice || 0), 0);
  const discountAmount = parseFloat(discount) || 0;
  const paidAmount = amountPaid ? parseFloat(amountPaid) : (totalSaleAmount - discountAmount);
  const amountDue = totalSaleAmount - discountAmount - paidAmount;

  // Determine payment status
  let paymentStatus;
  if (amountDue <= 0) {
    paymentStatus = 'PAID';
  } else if (paidAmount > 0) {
    paymentStatus = 'PARTIAL';
  } else {
    paymentStatus = 'UNPAID';
  }

  try {
    // Prisma transaction: ensures either all operations succeed or all fail
    const sale = await prisma.$transaction(async (prisma) => {
      // Generate unique Bill Number
      const date = new Date();
      const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
      const randomStr = Math.floor(1000 + Math.random() * 9000);
      const billNumber = `BILL-${dateStr}-${randomStr}`;

      // Verify items are not already sold
      const itemIds = items.map(item => parseInt(item.itemId));
      const existingItems = await prisma.item.findMany({
        where: { id: { in: itemIds }, userId: req.user.id },
        select: { id: true, isSold: true, name: true }
      });

      const soldItems = existingItems.filter(item => item.isSold);
      if (soldItems.length > 0) {
        throw new Error(`Items already sold: ${soldItems.map(i => i.name).join(', ')}`);
      }

      // Create the Sale record
      const newSale = await prisma.sale.create({
        data: {
          billNumber,
          customerId: customerId ? parseInt(customerId) : null,
          totalSaleAmount: parseFloat(totalSaleAmount),
          discount: discountAmount,
          amountPaid: parseFloat(paidAmount),
          amountDue: parseFloat(amountDue),
          paymentStatus,
          userId: req.user.id
        },
      });

      // Create SaleItem records
      const saleItemsData = items.map(item => ({
        saleId: newSale.id,
        itemId: parseInt(item.itemId),
        soldPrice: parseFloat(item.soldPrice),
        soldMakingCharge: item.soldMakingCharge ? parseFloat(item.soldMakingCharge) : null,
        soldWastage: item.soldWastage ? parseFloat(item.soldWastage) : null,
        soldHallmarking: item.soldHallmarking ? parseInt(item.soldHallmarking) : null,
        soldStoneCharges: item.soldStoneCharges ? parseInt(item.soldStoneCharges) : null,
        soldOtherCharges: item.soldOtherCharges ? parseInt(item.soldOtherCharges) : null,
        soldCgstPct: item.soldCgstPct ? parseFloat(item.soldCgstPct) : null,
        soldSgstPct: item.soldSgstPct ? parseFloat(item.soldSgstPct) : null,
      }));

      await prisma.saleItem.createMany({
        data: saleItemsData,
      });

      // Mark items as sold
      await prisma.item.updateMany({
        where: { id: { in: itemIds }, userId: req.user.id },
        data: { isSold: true },
      });

      // Create Payment record if amount was paid
      if (paidAmount > 0) {
        await prisma.payment.create({
          data: {
            saleId: newSale.id,
            amountPaid: parseFloat(paidAmount),
            paymentMethod,
          },
        });
      }

      return newSale;
    });

    res.status(201).json({ message: 'Checkout successful!', saleId: sale.id, billNumber: sale.billNumber });
  } catch (error) {
    console.error('Error during checkout transaction:', error);
    res.status(500).json({ message: 'Failed to process checkout.' });
  }
};

// @route   GET /api/sales
// @desc    Get all sales with search, filter, and pagination
// @access  Private
exports.getAllSales = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    startDate = '',
    endDate = ''
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  try {
    const where = { userId: req.user.id }; // Removed incorrect isSold: false filter
    if (search) {
      // Search by customer name or item name in the sale
      where.OR = [
        { customer: { name: { contains: search } } },
        {
          saleItems: {
            some: {
              item: {
                name: { contains: search }
              }
            }
          }
        }
      ];
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        // Set end date to the end of the day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    const sales = await prisma.sale.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        saleItems: {
          include: {
            item: {
              select: {
                id: true,
                name: true,
                sku: true,
                purity: true,
              },
            },
          },
        },
        payments: {
          select: {
            id: true,
            amountPaid: true,
            paymentMethod: true,
            paymentDate: true,
          },
        },
      },
    });

    const totalSales = await prisma.sale.count({ where });
    const totalPages = Math.ceil(totalSales / take);

    res.json({
      sales,
      currentPage: parseInt(page),
      totalPages,
      totalSales,
    });
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ message: 'Failed to fetch sales history.' });
  }
};

// @route   GET /api/sales/:id
// @desc    Get a single sale by ID with full details
// @access  Private
exports.getSaleById = async (req, res) => {
  const { id } = req.params;

  try {
    const sale = await prisma.sale.findFirst({
      where: { id: parseInt(id), userId: req.user.id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            address: true,
          },
        },
        saleItems: {
          include: {
            item: {
              select: {
                id: true,
                name: true,
                sku: true,
                purity: true,
                // Include any other original item details you want to see
              },
            },
          },
        },
        payments: {
          select: {
            id: true,
            amountPaid: true,
            paymentMethod: true,
            paymentDate: true,
          },
        },
      },
    });

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found.' });
    }
    res.json(sale);
  } catch (error) {
    console.error('Error fetching sale by ID:', error);
    res.status(500).json({ message: 'Failed to fetch sale details.' });
  }
};