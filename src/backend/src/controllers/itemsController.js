const ItemRepository = require('../repositories/ItemRepository');
const itemRepo = new ItemRepository();
const prisma = itemRepo._getPrisma(); // Using it locally to maintain raw queries the repo doesn't cover natively

exports.getUnprintedItems = async (req, res) => {
  try {
    const items = await itemRepo._getPrisma().item.findMany({
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
    await itemRepo._getPrisma().item.updateMany({
      where: { id: { in: itemIds }, userId: req.user.id },
      data: { barcodePrinted: true },
    });
    res.json({ message: 'Items marked as printed' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update items.' });
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const { page, limit, search, purity, category, sortBy, order } = req.query;
    // We utilize the custom findAll from ItemRepository and append ordering mapping
    const result = await itemRepo.findAll({
      page, limit, search, category, userId: req.user.id
    });
    res.json({ items: result.items, currentPage: result.page, totalPages: result.totalPages, totalItems: result.total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch items.' });
  }
};

exports.getItemBySku = async (req, res) => {
  try {
    const item = await itemRepo.findBySku(req.params.sku);
    if (!item || item.userId !== req.user.id) return res.status(404).json({ message: 'Item not found.' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch item.' });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await itemRepo.findById(req.params.id);
    if (!item || item.userId !== req.user.id) return res.status(404).json({ message: 'Item not found.' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch item.' });
  }
};

exports.createItem = async (req, res) => {
  try {
    const { name, sku, huid, purity, category, metal, grossWeight, netWeight, makingPerGm, wastagePct, hallmarkingCharges, stoneCharges, otherCharges, cgstPct, sgstPct, cost, price } = req.body;
    if (!name || !sku) return res.status(400).json({ message: 'Name and SKU are required.' });
    
    const newItem = await itemRepo.create({
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
    });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create item.' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);
    const existing = await itemRepo.findById(parsedId);
    if (!existing || existing.userId !== req.user.id) return res.status(404).json({ message: 'Item not found.' });

    // Exclude 'id' and 'userId' mapping safely
    const data = { ...req.body, userId: req.user.id };
    delete data.id;

    const updatedItem = await itemRepo.update(parsedId, data);
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update item.' });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);
    const existing = await itemRepo.findById(parsedId);
    if (!existing || existing.userId !== req.user.id) return res.status(404).json({ message: 'Item not found.' });

    await itemRepo.delete(parsedId);
    res.json({ message: 'Item deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to delete item.' });
  }
};
