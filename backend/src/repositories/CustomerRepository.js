const BaseRepository = require('./BaseRepository');

/**
 * @class CustomerRepository
 * @description Demonstrates Inheritance (extends BaseRepository) and Polymorphism (overrides findAll).
 */
class CustomerRepository extends BaseRepository {
  constructor() {
    super('customer'); 
  }

  // OVERRIDES BaseRepository.findAll() — Polymorphism
  // Adds customer-specific search and scopes to userId securely
  async findAll({ page = 1, limit = 20, search, userId } = {}) {
    try {
      const skip = (page - 1) * limit;
      const take = parseInt(limit, 10);
      const where = {};
      if (userId) where.userId = userId;

      if (search) {
        where.OR = this.#buildSearchFilter(search);
      }

      const prisma = this._getPrisma();
      const [customers, total] = await Promise.all([
        prisma.customer.findMany({ where, skip, take }),
        prisma.customer.count({ where })
      ]);

      return {
        customers,
        total,
        page: parseInt(page, 10),
        totalPages: Math.ceil(total / take) || 1,
      };
    } catch (error) {
      throw new Error(`Failed to find customers: ${error.message}`);
    }
  }

  // New domain methods
  async findByPhone(phone) {
    try {
      const customer = await this._getPrisma().customer.findUnique({ where: { phone } });
      if (!customer) throw new Error(`Customer with phone ${phone} not found`);
      return customer;
    } catch (error) {
      throw error;
    }
  }

  async getSaleHistory(id) {
    try {
      const parsedId = parseInt(id, 10);
      // Validates customer exists before fetching sales
      await this.findById(parsedId);

      const sales = await this._getPrisma().sale.findMany({
        where: { customerId: parsedId },
        include: { saleItems: true }
      });
      return sales;
    } catch (error) {
      throw new Error(`Failed to get sale history: ${error.message}`);
    }
  }

  // Private — Encapsulation
  #buildSearchFilter(search) {
    return [
      { name: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } }
    ];
  }
}

module.exports = CustomerRepository;
