const BaseRepository = require('./BaseRepository');

/**
 * @class ItemRepository
 * @description Demonstrates Inheritance (extends BaseRepository) and Polymorphism (overrides findAll and delete).
 */
class ItemRepository extends BaseRepository {
  constructor() {
    // Passes the prisma model name to the BaseRepository
    super('item');
  }

  // OVERRIDES BaseRepository.findAll() — Polymorphism
  // Adds jewelry-specific filters: category, metal, purity, isSold, search by name/sku/huid, securely isolated by userId
  async findAll({ page = 1, limit = 20, search, category, metal, isSold, userId } = {}) {
    try {
      const skip = (page - 1) * limit;
      const take = parseInt(limit, 10);
      const where = {};
      
      if (userId) where.userId = userId;

      if (search) {
        where.OR = this.#buildSearchFilter(search);
      }
      if (category) {
        where.category = category;
      }
      if (metal) {
        where.metal = metal;
      }
      if (isSold !== undefined && isSold !== null && isSold !== '') {
        where.isSold = isSold === 'true' || isSold === true;
      }

      const prisma = this._getPrisma();
      const [items, total] = await Promise.all([
        prisma.item.findMany({ where, skip, take }),
        prisma.item.count({ where }),
      ]);

      return {
        items,
        total,
        page: parseInt(page, 10),
        totalPages: Math.ceil(total / take) || 1,
      };
    } catch (error) {
      throw new Error(`Failed to find items: ${error.message}`);
    }
  }

  // OVERRIDES BaseRepository.delete() — Polymorphism
  // Adds business rule: cannot delete if isSold = true
  async delete(id) {
    try {
      const item = await this.findById(id);
      if (item.isSold) {
        const error = new Error('BusinessRuleError: Cannot delete an item that has already been sold.');
        error.code = 'BUSINESS_RULE_ERROR';
        throw error;
      }
      return await super.delete(id);
    } catch (error) {
      throw error;
    }
  }

  // New methods specific to jewelry domain
  async markAsSold(id) {
    try {
      return await this.update(id, { isSold: true });
    } catch (error) {
      throw new Error(`Failed to mark as sold: ${error.message}`);
    }
  }

  async markBarcodePrinted(id) {
    try {
      return await this.update(id, { barcodePrinted: true });
    } catch (error) {
      throw new Error(`Failed to mark barcode printed: ${error.message}`);
    }
  }

  async findBySku(sku) {
    try {
      const item = await this._getPrisma().item.findUnique({ where: { sku } });
      if (!item) throw new Error(`Item with SKU ${sku} not found`);
      return item;
    } catch (error) {
      throw error;
    }
  }

  async findByHuid(huid) {
    try {
      const item = await this._getPrisma().item.findFirst({ where: { huid } });
      if (!item) throw new Error(`Item with HUID ${huid} not found`);
      return item;
    } catch (error) {
      throw error;
    }
  }

  // Private — Encapsulation
  #buildSearchFilter(search) {
    return [
      { name: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
      { huid: { contains: search, mode: 'insensitive' } }
    ];
  }
}

module.exports = ItemRepository;
