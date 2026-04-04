const CustomerRepository = require('../repositories/CustomerRepository');
const customerRepo = new CustomerRepository();

exports.getAllCustomers = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const result = await customerRepo.findAll({ page, limit, search, userId: req.user.id });
    res.json({
      customers: result.customers,
      currentPage: result.page,
      totalPages: result.totalPages,
      totalCustomers: result.total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch customers.' });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const { name, phone, email, address, city, pincode, pancard } = req.body;
    if (!name) return res.status(400).json({ message: 'Customer name is required.' });
    
    const newCustomer = await customerRepo.create({
      name, phone: phone?.trim() || null, email: email?.trim() || null,
      address, city, pincode, pancard, userId: req.user.id
    });
    res.status(201).json(newCustomer);
  } catch (error) {
    if (error.message.includes('Unique constraint')) return res.status(409).json({ message: 'Customer with this phone or email already exists.' });
    res.status(500).json({ message: 'Failed to create customer.' });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);
    const existingCustomer = await customerRepo.findById(parsedId);
    if (!existingCustomer || existingCustomer.userId !== req.user.id) return res.status(404).json({ message: 'Customer not found.' });
    
    const { name, phone, email, address, city, pincode, pancard } = req.body;
    if (!name) return res.status(400).json({ message: 'Customer name cannot be empty.' });
    
    const updatedCustomer = await customerRepo.update(parsedId, {
      name, phone: phone?.trim() || null, email: email?.trim() || null,
      address, city, pincode, pancard
    });
    res.json(updatedCustomer);
  } catch (error) {
    if (error.code === 'NOT_FOUND') return res.status(404).json({ message: 'Customer not found.' });
    res.status(500).json({ message: 'Failed to update customer.' });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);
    const customer = await customerRepo.findById(parsedId);
    if (!customer || customer.userId !== req.user.id) return res.status(404).json({ message: 'Customer not found.' });
    
    await customerRepo.delete(parsedId);
    res.json({ message: 'Customer deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete customer.' });
  }
};