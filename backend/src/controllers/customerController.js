const prisma = require('../prismaClient.js');

exports.getAllCustomers = async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  try {
    const where = { userId: req.user.id };
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const customers = await prisma.customer.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });

    const totalCustomers = await prisma.customer.count({ where });
    const totalPages = Math.ceil(totalCustomers / take);

    res.json({
      customers,
      currentPage: parseInt(page),
      totalPages,
      totalCustomers,
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Failed to fetch customers.' });
  }
};

exports.createCustomer = async (req, res) => {
  const { name, phone, email, address, city, pincode, pancard } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Customer name is required.' });
  }

  try {
    const newCustomer = await prisma.customer.create({
      data: {
        name,
        phone: phone && phone.trim() ? phone.trim() : null,
        email: email && email.trim() ? email.trim() : null,
        address,
        city,
        pincode,
        pancard,
        userId: req.user.id
      },
    });
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);

    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Customer with this phone or email already exists.' });
    }
    res.status(500).json({ message: 'Failed to create customer.' });
  }
};

exports.updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, address, city, pincode, pancard } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Customer name cannot be empty.' });
  }

  try {
    // Verify ownership
    const existingCustomer = await prisma.customer.findFirst({ where: { id: parseInt(id), userId: req.user.id } });
    if (!existingCustomer) return res.status(404).json({ message: 'Customer not found.' });

    const updatedCustomer = await prisma.customer.update({
      where: { id: parseInt(id) },
      data: {
        name,
        phone: phone && phone.trim() ? phone.trim() : null,
        email: email && email.trim() ? email.trim() : null,
        address,
        city,
        pincode,
        pancard,
      },
    });
    res.json(updatedCustomer);
  } catch (error) {
    console.error('Error updating customer:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Customer not found.' });
    }
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Customer with this phone or email already exists.' });
    }
    res.status(500).json({ message: 'Failed to update customer.' });
  }
};

exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await prisma.customer.findFirst({ where: { id: parseInt(id), userId: req.user.id } });
    if (!customer) return res.status(404).json({ message: 'Customer not found.' });

    await prisma.customer.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Customer deleted successfully.' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Customer not found.' });
    }
    res.status(500).json({ message: 'Failed to delete customer.' });
  }
};