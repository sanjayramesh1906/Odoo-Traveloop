const prisma = require('../config/prisma');

const serialize = (data) => JSON.parse(JSON.stringify(data, (key, value) => typeof value === 'bigint' ? value.toString() : value));

exports.getPackingList = async (req, res) => {
  const tripId = BigInt(req.params.tripId);
  try {
    const list = await prisma.packingList.findMany({
      where: { tripId },
      orderBy: { createdAt: 'asc' }
    });
    res.json(serialize(list));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch packing list' });
  }
};

exports.addItem = async (req, res) => {
  const tripId = BigInt(req.params.tripId);
  const { itemName, category } = req.body;
  try {
    const item = await prisma.packingList.create({
      data: {
        tripId,
        itemName,
        category: category || 'Miscellaneous',
        isPacked: false
      }
    });
    res.json(serialize(item));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add item' });
  }
};

exports.updateItem = async (req, res) => {
  const id = BigInt(req.params.id);
  const { itemName, category, isPacked } = req.body;
  try {
    const item = await prisma.packingList.update({
      where: { id },
      data: {
        itemName,
        category,
        isPacked
      }
    });
    res.json(serialize(item));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update item' });
  }
};

exports.deleteItem = async (req, res) => {
  const id = BigInt(req.params.id);
  try {
    await prisma.packingList.delete({ where: { id } });
    res.json({ message: 'Item deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
};

exports.resetList = async (req, res) => {
  const tripId = BigInt(req.params.tripId);
  try {
    await prisma.packingList.updateMany({
      where: { tripId },
      data: { isPacked: false }
    });
    res.json({ message: 'List reset' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reset list' });
  }
};
