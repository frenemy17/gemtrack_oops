const prisma = require('../prismaClient.js');

exports.getUnprintedItems = async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      where: { barcodePrinted: false, isSold: false, userId: req.user.id },
      select: { id: true, name: true, sku: true },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch items.' });
  }
};

exports.markAsPrinted = async (req, res) => {
  try {
    const { itemIds } = req.body;
    await prisma.item.updateMany({
      where: { id: { in: itemIds }, userId: req.user.id },
      data: { barcodePrinted: true },
    });
    res.json({ message: 'Items marked as printed' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update items.' });
  }
};

exports.getAllItems = async (req, res) => {
  const { page = 1, limit = 10, search = '', purity = '', category = '', sortBy = 'createdAt', order = 'desc' } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  try {
    const where = { userId: req.user.id };
    if (search) {
      where.OR = [{ name: { contains: search } }, { sku: { contains: search } }, { huid: { contains: search } }];
    }
    if (purity && purity !== 'all') where.purity = purity;
    if (category && category !== 'all') where.category = category;

    const items = await prisma.item.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy]: order },
      include: {
        saleItems: {
          include: {
            sale: {
              include: {
                customer: {
                  select: { name: true }
                }
              }
            }
          }
        }
      }
    });
    const totalItems = await prisma.item.count({ where });

    res.json({ items, currentPage: parseInt(page), totalPages: Math.ceil(totalItems / take), totalItems });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: 'Failed to fetch items.' });
  }
};

exports.getItemBySku = async (req, res) => {
  try {
    const item = await prisma.item.findFirst({ where: { sku: req.params.sku, userId: req.user.id } });
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch item.' });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await prisma.item.findFirst({ where: { id: parseInt(req.params.id), userId: req.user.id } });
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch item.' });
  }
};

exports.createItem = async (req, res) => {
  const { name, sku, huid, purity, category, metal, grossWeight, netWeight, makingPerGm, wastagePct, hallmarkingCharges, stoneCharges, otherCharges, cgstPct, sgstPct, cost, price } = req.body;
  if (!name || !sku) return res.status(400).json({ message: 'Name and SKU are required.' });

  try {
    const newItem = await prisma.item.create({
      data: {
        name, sku, huid, purity, category, metal,
        grossWeight: grossWeight ? parseFloat(grossWeight) : null,
        netWeight: netWeight ? parseFloat(netWeight) : null,
        makingPerGm: makingPerGm ? parseFloat(makingPerGm) : null,
        wastagePct: wastagePct ? parseFloat(wastagePct) : null,
        hallmarkingCharges: hallmarkingCharges ? parseInt(hallmarkingCharges) : null,
        stoneCharges: stoneCharges ? parseInt(stoneCharges) : null,
        otherCharges: otherCharges ? parseInt(otherCharges) : null,
        cgstPct: cgstPct ? parseFloat(cgstPct) : null,
        sgstPct: sgstPct ? parseFloat(sgstPct) : null,
        cost: cost ? parseFloat(cost) : null,
        price: price ? parseFloat(price) : null,
        userId: req.user.id
      },
    });
    res.status(201).json(newItem);
  } catch (error) {
    if (error.code === 'P2002') return res.status(409).json({ message: 'SKU already exists.' });
    res.status(500).json({ message: 'Failed to create item.' });
  }
};

exports.updateItem = async (req, res) => {
  const { name, sku, huid, purity, category, metal, grossWeight, netWeight, makingPerGm, wastagePct, hallmarkingCharges, stoneCharges, otherCharges, cgstPct, sgstPct, cost, price } = req.body;
  if (!name || !sku) return res.status(400).json({ message: 'Name and SKU required.' });

  try {
    // Verify ownership
    const existingItem = await prisma.item.findFirst({ where: { id: parseInt(req.params.id), userId: req.user.id } });
    if (!existingItem) return res.status(404).json({ message: 'Item not found.' });

    const updatedItem = await prisma.item.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name, sku, huid, purity, category, metal,
        grossWeight: grossWeight ? parseFloat(grossWeight) : null,
        netWeight: netWeight ? parseFloat(netWeight) : null,
        makingPerGm: makingPerGm ? parseFloat(makingPerGm) : null,
        wastagePct: wastagePct ? parseFloat(wastagePct) : null,
        hallmarkingCharges: hallmarkingCharges ? parseInt(hallmarkingCharges) : null,
        stoneCharges: stoneCharges ? parseInt(stoneCharges) : null,
        otherCharges: otherCharges ? parseInt(otherCharges) : null,
        cgstPct: cgstPct ? parseFloat(cgstPct) : null,
        sgstPct: sgstPct ? parseFloat(sgstPct) : null,
        cost: cost ? parseFloat(cost) : null,
        price: price ? parseFloat(price) : null,
      },
    });
    res.json(updatedItem);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ message: 'Item not found.' });
    if (error.code === 'P2002') return res.status(409).json({ message: 'SKU already exists.' });
    res.status(500).json({ message: 'Failed to update item.' });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await prisma.item.findFirst({ where: { id: parseInt(req.params.id), userId: req.user.id } });
    if (!item) return res.status(404).json({ message: 'Item not found.' });

    const saleItems = await prisma.saleItem.findFirst({ where: { itemId: parseInt(req.params.id) } });
    if (saleItems) return res.status(400).json({ message: 'Cannot delete sold item.' });
    await prisma.item.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Item deleted.' });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ message: 'Item not found.' });
    res.status(500).json({ message: 'Failed to delete item.' });
  }
};
