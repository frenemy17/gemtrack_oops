const SaleService = require('../services/SaleService');
const ItemRepository = require('../repositories/ItemRepository');
const CustomerRepository = require('../repositories/CustomerRepository');

// Applying Dependency Injection (DI) locally
const itemRepo = new ItemRepository();
const customerRepo = new CustomerRepository();
const saleService = new SaleService(itemRepo, customerRepo);

exports.checkout = async (req, res) => {
  try {
    const result = await saleService.execute({
      action: 'processSale',
      payload: { ...req.body, userId: req.user.id }
    });
    res.status(201).json({ message: 'Checkout successful!', saleId: result.id, billNumber: result.billNumber });
  } catch (error) {
    console.error(error);
    if (error.code === 'VALIDATION_ERROR') return res.status(400).json({ message: error.message });
    res.status(500).json({ message: 'Failed to process checkout.' });
  }
};

exports.getAllSales = async (req, res) => {
  try {
    const { page, limit, paymentStatus } = req.query;
    // Uses the OOP isolated service method mapping
    const result = await saleService.getAllSales({ page, limit, paymentStatus, userId: req.user.id });
    res.json({
      sales: result.sales,
      currentPage: result.page,
      totalPages: result.totalPages,
      totalSales: result.total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sales history.' });
  }
};

exports.getSaleById = async (req, res) => {
  try {
    const sale = await saleService.getSaleById(req.params.id);
    if (!sale || sale.userId !== req.user.id) return res.status(404).json({ message: 'Sale not found.' });
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sale details.' });
  }
};