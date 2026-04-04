const prismaSingleton = require('../prismaClient');

/**
 * @class BaseRepository
 * @description Demonstrates Abstraction and Encapsulation.
 * Defines the contract all repositories must follow.
 * No direct instantiation allowed.
 */
class BaseRepository {
  #model;
  #prisma;

  constructor(modelName) {
    if (new.target === BaseRepository) {
      throw new Error('Cannot instantiate abstract class BaseRepository directly');
    }
    this.#model = modelName;
    this.#prisma = prismaSingleton;
  }

  // Base implementation — must be overridden if custom logic is needed (Polymorphism)
  async findAll(filters) {
    throw new Error('Not implemented: findAll must be implemented by concrete subclasses');
  }

  async findById(id) {
    const record = await this.#prisma[this.#model].findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (!record) {
      const error = new Error('NotFoundError');
      error.code = 'NOT_FOUND';
      throw error;
    }
    return record;
  }

  async create(data) {
    return await this.#prisma[this.#model].create({ data });
  }

  async update(id, data) {
    return await this.#prisma[this.#model].update({
      where: { id: parseInt(id, 10) },
      data,
    });
  }

  async delete(id) {
    return await this.#prisma[this.#model].delete({
      where: { id: parseInt(id, 10) },
    });
  }

  // Protected helper — accessible to subclasses only (Inheritance)
  _getPrisma() {
    return this.#prisma;
  }

  _getModel() {
    return this.#model;
  }
}

module.exports = BaseRepository;
