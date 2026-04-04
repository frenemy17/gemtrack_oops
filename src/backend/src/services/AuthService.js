const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const BaseService = require('./BaseService');
const prisma = require('../prismaClient');

/**
 * @class AuthService
 * @description Demonstrates Inheritance (extends BaseService) and Encapsulation.
 */
class AuthService extends BaseService {
  #saltRounds;
  #jwtSecret;

  constructor() {
    super();
    this.#saltRounds = 10;
    this.#jwtSecret = process.env.JWT_SECRET || 'secret';
  }

  // IMPLEMENTS BaseService contract
  async validate(data) {
    if (data.action === 'register' || data.action === 'login') {
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        throw this._formatError('Valid email is required', 'VALIDATION_ERROR');
      }
    }
    if (data.action === 'register') {
      if (!data.password || data.password.length < 6) {
        throw this._formatError('Password must be at least 6 characters', 'VALIDATION_ERROR');
      }
    }
    if (data.action === 'login') {
      if (!data.password) {
        throw this._formatError('Password is required for login', 'VALIDATION_ERROR');
      }
    }
  }

  // IMPLEMENTS BaseService contract
  async execute(data) {
    await this.validate(data);

    switch (data.action) {
      case 'register':
        return await this.register(data.name, data.email, data.password);
      case 'login':
        return await this.login(data.email, data.password);
      default:
        throw this._formatError('Invalid action for AuthService', 'INVALID_ACTION');
    }
  }

  // Public API
  async register(name, email, password) {
    try {
      await this.validate({ action: 'register', email, password });
      
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const hash = await this.#hashPassword(password);
      const user = await prisma.user.create({
        data: { name, email, password: hash }
      });

      const token = this.#generateToken(user.id, user.email);
      return { token, user: this.#sanitizeUser(user) };
    } catch (error) {
      if (error.code === 'VALIDATION_ERROR') throw error;
      throw this._formatError(error.message, 'REGISTER_ERROR');
    }
  }

  async login(email, password) {
    try {
      await this.validate({ action: 'login', email, password });

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isValid = await this.#comparePassword(password, user.password);
      if (!isValid) {
        throw new Error('Invalid email or password');
      }

      const token = this.#generateToken(user.id, user.email);
      return { token, user: this.#sanitizeUser(user) };
    } catch (error) {
      if (error.code === 'VALIDATION_ERROR') throw error;
      throw this._formatError(error.message, 'LOGIN_ERROR');
    }
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.#jwtSecret);
    } catch (error) {
      throw this._formatError('Invalid or expired token', 'TOKEN_ERROR');
    }
  }

  // Private — Encapsulation
  async #hashPassword(password) {
    return await bcrypt.hash(password, this.#saltRounds);
  }

  async #comparePassword(plain, hash) {
    return await bcrypt.compare(plain, hash);
  }

  #generateToken(userId, email) {
    return jwt.sign({ id: userId, email }, this.#jwtSecret, { expiresIn: '7d' });
  }

  #sanitizeUser(user) {
    // Strips password before returning the object
    const { password: _, ...sanitized } = user;
    return sanitized;
  }
}

module.exports = AuthService;
