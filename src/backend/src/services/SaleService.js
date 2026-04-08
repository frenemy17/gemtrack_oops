const BaseService = require('./BaseService');
const ItemRepository = require('../repositories/ItemRepository');
const CustomerRepository = require('../repositories/CustomerRepository');
const prismaSingleton = require('../prismaClient');
const { DiscountFactory } = require('../strategies/DiscountStrategy');

/**
 * @class SaleService
 * @description Demonstrates Inheritance, Encapsulation, and Dependency Injection pattern.
 */
class SaleService extends BaseService {
  #itemRepo;
  #customerRepo;
  #prisma;

  // DI Pattern: Dependencies are externally provided to decouple architecture
  constructor(itemRepo, customerRepo) {
    super();
    this.#itemRepo = itemRepo || new ItemRepository();
    this.#customerRepo = customerRepo || new CustomerRepository();
    this.#prisma = prismaSingleton;
  }

  // IMPLEMENTS BaseService contract
  async validate(data) {
    const { customerId, items } = data;
    
    if (customerId) {
        await this.#customerRepo.findById(customerId); // throws error if missing
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw this._formatError('A sale must include items', 'VALIDATION_ERROR');
    }

    // Checking if any single item is already sold
    for (const itemData of items) {
      const item = await this.#itemRepo.findById(itemData.itemId);
      if (item.isSold) {
        throw this._formatError(`Item ${item.sku || itemData.itemId} is already sold`, 'VALIDATION_ERROR');
      }
    }
  }

  // IMPLEMENTS BaseService contract
  async execute(data) {
    if (data.action === 'processSale') {
      return await this.processSale(data.payload);
    }
    throw this._formatError('Invalid action', 'INVALID_ACTION');
  }

  // Public API
  async processSale({ customerId, items, amountPaid, discount, discountType, dueDate, paymentMethod, userId }) {
    try {
      await this.validate({ customerId, items });

      // Calculate totals
      const totalSaleAmount = items.reduce((sum, item) => sum + (Number(item.soldPrice) || 0), 0);
      
      // Implement Strategy Pattern to calculate final discount dynamically
      const discountStrategy = DiscountFactory.getStrategy(discountType, discount);
      const finalDiscount = discountStrategy.calculate(totalSaleAmount);
      const finalPaid = Number(amountPaid) || 0;
      const amountDue = totalSaleAmount - finalDiscount - finalPaid;

      const paymentStatus = this.#calculatePaymentStatus(totalSaleAmount, finalDiscount, finalPaid);
      const billNumber = this.#generateBillNumber();
      const saleItemsPayload = this.#buildSaleItemsPayload(items);

      // Perform everything within Prisma's native $transaction to assure database atomicity without violating repo boundaries
      const completeSale = await this.#prisma.$transaction(async (tx) => {
        // 1. Create sale entity natively
        const sale = await tx.sale.create({
          data: {
            customerId,
            billNumber,
            totalSaleAmount,
            discount: finalDiscount,
            amountPaid: finalPaid,
            amountDue,
            paymentStatus,
            dueDate,
            userId,
            // Automatically cascade creation to the payments table if paid
            ...(finalPaid > 0 && {
                payments: {
                  create: [{ amountPaid: finalPaid, paymentMethod: paymentMethod || 'Cash' }]
                }
            }),
            // Links the generated sale ID across newly created scale items
            saleItems: {
              create: saleItemsPayload
            }
          },
          include: {
            saleItems: true,
            payments: true,
            customer: true
          }
        });

        // 2. Mark the relevant items as sold. As requested, we make use of ItemRepo specifically marking as sold.
        for (const item of items) {
           await this.#itemRepo.markAsSold(item.itemId);
        }

        return sale;
      });

      return completeSale;
    } catch (error) {
      if (error.code) throw error; 
      throw this._formatError(error.message, 'PROCESS_SALE_ERROR');
    }
  }

  async getSaleById(id) {
    try {
      const sale = await this.#prisma.sale.findUnique({
        where: { id: parseInt(id, 10) },
        include: { saleItems: true, payments: true, customer: true }
      });
      
      if (!sale) throw new Error('Sale not found');
      return sale;
      
    } catch (error) {
      throw this._formatError(error.message, 'FIND_SALE_ERROR');
    }
  }

  async getAllSales({ page = 1, limit = 20, paymentStatus, userId } = {}) {
    try {
      const skip = (page - 1) * limit;
      const take = parseInt(limit, 10);
      const where = {};
      if (paymentStatus) where.paymentStatus = paymentStatus;
      if (userId) where.userId = userId;

      const [sales, total] = await Promise.all([
        this.#prisma.sale.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
        this.#prisma.sale.count({ where })
      ]);

      return {
        sales,
        total,
        page: parseInt(page, 10),
        totalPages: Math.ceil(total / take) || 1
      };
    } catch (error) {
      throw this._formatError(error.message, 'FIND_SALES_ERROR');
    }
  }

  // Private — Encapsulation
  #calculatePaymentStatus(total, discount, paid) {
    const amountDue = total - discount - paid;
    if (amountDue <= 0) return 'PAID';
    if (paid > 0) return 'PARTIAL';
    return 'UNPAID';
  }

  #generateBillNumber() {
    const timestamp = Date.now();
    const random4 = Math.floor(1000 + Math.random() * 9000);
    return `BILL-${timestamp}-${random4}`;
  }

  #buildSaleItemsPayload(items) {
    return items.map(item => ({
      itemId: item.itemId,
      soldPrice: item.soldPrice,
      soldMakingCharge: item.soldMakingCharge || 0,
      soldWastage: item.soldWastage || 0,
      soldHallmarking: item.soldHallmarking || 0,
      soldStoneCharges: item.soldStoneCharges || 0,
      soldOtherCharges: item.soldOtherCharges || 0,
      soldCgstPct: item.soldCgstPct || 0,
      soldSgstPct: item.soldSgstPct || 0
    }));
  }
}

module.exports = SaleService;
