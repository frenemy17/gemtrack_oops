/**
 * @class BaseService
 * @description Demonstrates Abstraction.
 * All services must implement validate() and execute().
 */
class BaseService {
  constructor() {
    if (new.target === BaseService) {
      throw new Error('Cannot instantiate abstract class BaseService directly');
    }
  }

  async validate(data) {
    throw new Error('Not implemented: validate must be implemented by concrete subclasses');
  }

  async execute(data) {
    throw new Error('Not implemented: execute must be implemented by concrete subclasses');
  }

  // Shared utility used by all services (Inheritance benefit)
  _formatError(message, code) {
    return {
      message,
      code,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = BaseService;
