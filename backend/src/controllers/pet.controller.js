import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getPets = async (req, res) => {
  try {
    const pets = await prisma.pet.findMany({
      where: { ownerId: req.user.id },
    });
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener mascotas' });
  }
};

export const createPet = async (req, res) => {
  try {
    const { name, species, breed, age, weight } = req.body;
    const pet = await prisma.pet.create({
      data: {
        name,
        species,
        breed,
        age: Number(age),
        weight: Number(weight),
        ownerId: req.user.id,
      },
    });
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar mascota' });
  }
};

export const updatePet = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, species, breed, age, weight } = req.body;

    const pet = await prisma.pet.update({
      where: { id: Number(id) },
      data: { name, species, breed, age: Number(age), weight: Number(weight) },
    });
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar mascota' });
  }
};

export const deletePet = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.pet.delete({ where: { id: Number(id) } });
    res.json({ message: 'Mascota eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar mascota' });
  }
};
