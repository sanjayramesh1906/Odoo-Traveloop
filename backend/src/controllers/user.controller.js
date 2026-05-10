const prisma = require('../config/prisma');

const serialize = (data) => JSON.parse(JSON.stringify(data, (key, value) => typeof value === 'bigint' ? value.toString() : value));

exports.getProfile = async (req, res) => {
  const userId = BigInt(req.user.sub);
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        photoUrl: true,
        languagePreference: true,
      }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(serialize(user));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

exports.updateProfile = async (req, res) => {
  const userId = BigInt(req.user.sub);
  const { name, photoUrl, languagePreference } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        photoUrl,
        languagePreference
      },
      select: {
        id: true,
        name: true,
        email: true,
        photoUrl: true,
        languagePreference: true,
      }
    });
    res.json(serialize(user));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

exports.deleteAccount = async (req, res) => {
  const userId = BigInt(req.user.sub);
  try {
    // Delete user. Cascading deletes should handle trips where user is owner
    await prisma.user.delete({
      where: { id: userId }
    });
    res.json({ message: 'Account deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
};
