const prisma = require('../config/prisma');

const serialize = (data) => JSON.parse(JSON.stringify(data, (key, value) => typeof value === 'bigint' ? value.toString() : value));

exports.getNotes = async (req, res) => {
  const tripId = BigInt(req.params.tripId);
  try {
    const notes = await prisma.tripNote.findMany({
      where: { tripId },
      orderBy: { createdAt: 'desc' },
      include: { stop: { include: { city: true } } }
    });
    res.json(serialize(notes));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

exports.createNote = async (req, res) => {
  const tripId = BigInt(req.params.tripId);
  const { title, content, stopId } = req.body;
  try {
    const note = await prisma.tripNote.create({
      data: {
        tripId,
        stopId: stopId ? BigInt(stopId) : null,
        title,
        content
      },
      include: { stop: { include: { city: true } } }
    });
    res.json(serialize(note));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create note' });
  }
};

exports.updateNote = async (req, res) => {
  const id = BigInt(req.params.id);
  const { title, content, stopId } = req.body;
  try {
    const note = await prisma.tripNote.update({
      where: { id },
      data: {
        title,
        content,
        stopId: stopId ? BigInt(stopId) : null,
      },
      include: { stop: { include: { city: true } } }
    });
    res.json(serialize(note));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update note' });
  }
};

exports.deleteNote = async (req, res) => {
  const id = BigInt(req.params.id);
  try {
    await prisma.tripNote.delete({ where: { id } });
    res.json({ message: 'Note deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
};
