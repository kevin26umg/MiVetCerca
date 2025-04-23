import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { pets: true, clinic: true }
    });
    res.json(user);
  } catch {
    res.status(500).json({ error: 'No se pudo obtener el perfil' });
  }
};
