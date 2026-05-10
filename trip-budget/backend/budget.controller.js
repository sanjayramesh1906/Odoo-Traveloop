const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get budget items and summary for a trip
const getTripBudget = async (req, res) => {
  try {
    const tripId = BigInt(req.params.tripId);
    
    // Check if trip exists
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: { id: true, startDate: true, endDate: true }
    });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    const budgetItems = await prisma.budgetItem.findMany({
      where: { tripId },
      orderBy: { date: 'asc' }
    });

    // Calculate totals
    let totalEstimated = 0;
    const breakdown = {
      Transport: 0,
      Stay: 0,
      Meal: 0,
      Activity: 0,
      Miscellaneous: 0
    };

    const formattedItems = budgetItems.map(item => {
      const amount = parseFloat(item.amount);
      totalEstimated += amount;
      if (breakdown[item.category] !== undefined) {
        breakdown[item.category] += amount;
      } else {
         breakdown.Miscellaneous += amount;
      }
      return {
        id: item.id.toString(),
        category: item.category,
        description: item.description,
        amount: amount,
        date: item.date ? item.date.toISOString().split('T')[0] : null,
      };
    });

    // Calculate average per day
    let averagePerDay = 0;
    let durationDays = 1;
    if (trip.startDate && trip.endDate) {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      const diffTime = Math.abs(end - start);
      durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
    }
    
    if (totalEstimated > 0) {
      averagePerDay = totalEstimated / durationDays;
    }

    res.status(200).json({
      tripId: tripId.toString(),
      totalEstimated,
      averagePerDay,
      durationDays,
      breakdown,
      items: formattedItems
    });
  } catch (error) {
    console.error('[getTripBudget Error]', error);
    res.status(500).json({ message: 'Error retrieving budget.' });
  }
};

// Add a new budget item
const addBudgetItem = async (req, res) => {
  try {
    const tripId = BigInt(req.params.tripId);
    const { category, description, amount, date } = req.body;

    if (!category || amount === undefined) {
      return res.status(400).json({ message: 'Category and amount are required.' });
    }

    const newItem = await prisma.budgetItem.create({
      data: {
        tripId,
        category,
        description,
        amount: parseFloat(amount),
        date: date ? new Date(date) : null
      }
    });

    res.status(201).json({
      id: newItem.id.toString(),
      category: newItem.category,
      description: newItem.description,
      amount: parseFloat(newItem.amount),
      date: newItem.date ? newItem.date.toISOString().split('T')[0] : null
    });
  } catch (error) {
    console.error('[addBudgetItem Error]', error);
    res.status(500).json({ message: 'Error adding budget item.' });
  }
};

// Update a budget item
const updateBudgetItem = async (req, res) => {
  try {
    const itemId = BigInt(req.params.itemId);
    const { category, description, amount, date } = req.body;

    const updatedItem = await prisma.budgetItem.update({
      where: { id: itemId },
      data: {
        category,
        description,
        amount: amount !== undefined ? parseFloat(amount) : undefined,
        date: date ? new Date(date) : null
      }
    });

    res.status(200).json({
      id: updatedItem.id.toString(),
      category: updatedItem.category,
      description: updatedItem.description,
      amount: parseFloat(updatedItem.amount),
      date: updatedItem.date ? updatedItem.date.toISOString().split('T')[0] : null
    });
  } catch (error) {
    console.error('[updateBudgetItem Error]', error);
    res.status(500).json({ message: 'Error updating budget item.' });
  }
};

// Delete a budget item
const deleteBudgetItem = async (req, res) => {
  try {
    const itemId = BigInt(req.params.itemId);

    await prisma.budgetItem.delete({
      where: { id: itemId }
    });

    res.status(200).json({ message: 'Budget item deleted successfully.' });
  } catch (error) {
    console.error('[deleteBudgetItem Error]', error);
    res.status(500).json({ message: 'Error deleting budget item.' });
  }
};

module.exports = {
  getTripBudget,
  addBudgetItem,
  updateBudgetItem,
  deleteBudgetItem
};
