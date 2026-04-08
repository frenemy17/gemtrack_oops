/**
 * @abstract
 * Demonstrates the Strategy Pattern for calculating dynamic discounts.
 */
class DiscountStrategy {
  calculate(totalAmount) {
    throw new Error('calculate() must be implemented');
  }
}

class FlatDiscountStrategy extends DiscountStrategy {
  constructor(amount) {
    super();
    this.amount = Number(amount) || 0;
  }
  calculate(totalAmount) {
    return Math.min(this.amount, totalAmount);
  }
}

class PercentageDiscountStrategy extends DiscountStrategy {
  constructor(percentage) {
    super();
    this.percentage = Number(percentage) || 0;
  }
  calculate(totalAmount) {
    return totalAmount * (this.percentage / 100);
  }
}

class NoDiscountStrategy extends DiscountStrategy {
  calculate(totalAmount) {
    return 0;
  }
}

class DiscountFactory {
  static getStrategy(type, value) {
    if (!value || value <= 0) return new NoDiscountStrategy();
    
    switch (type?.toUpperCase()) {
      case 'PERCENTAGE':
        return new PercentageDiscountStrategy(value);
      case 'FLAT':
      default:
        return new FlatDiscountStrategy(value);
    }
  }
}

module.exports = { DiscountFactory, DiscountStrategy, FlatDiscountStrategy, PercentageDiscountStrategy, NoDiscountStrategy };
