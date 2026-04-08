const EventEmitter = require('events');

/**
 * @class SaleObserver
 * @description Demonstrates the Observer Pattern (Week 7: decoupled event handling).
 * It listens for internal 'saleCompleted' events and triggers multiple independent sub-systems natively.
 */
class SaleNotifier extends EventEmitter {}
const saleNotifier = new SaleNotifier();

// Observer 1: The Audit Logger
saleNotifier.on('saleCompleted', (sale) => {
  console.log(`\n\x1b[36m[OBSERVER - AUDIT]\x1b[0m Sale recorded successfully! Bill Number: ${sale.billNumber} | Total: ₹${sale.totalSaleAmount}`);
});

// Observer 2: Mock Notification Service
saleNotifier.on('saleCompleted', (sale) => {
  console.log(`\x1b[32m[OBSERVER - NOTIFY]\x1b[0m Mock SMS queued for Customer ID ${sale.customerId} (Bill: ${sale.billNumber})\n`);
});

module.exports = saleNotifier;
