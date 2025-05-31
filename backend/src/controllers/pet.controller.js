import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getPets = async (req, res) => {
  const { id: userId, role, clinicId } = req.user;

  try {
    const pets = await prisma.pet.findMany({
      where: role === "CLINICA"
        ? { clinicId: clinicId }
        : { ownerId: userId },
      orderBy: { id: 'desc' }
    });

    res.json(pets);
  } catch (err) {
    console.error("Error al obtener mascotas", err);
    res.status(500).json({ error: "Error al obtener mascotas" });
  }
};


export const createPet = async (req, res) => {
  const { name, species, breed, age, weight, clinicId, phone } = req.body;
  const { id: userId, role, clinicId: userClinicId } = req.user;

  try {
    if (!name || !phone) {
      return res.status(400).json({ error: "Nombre y teléfono son obligatorios." });
    }

    const data = {
      name,
      phone,
    };

    if (role === "USUARIO") {
      if (!clinicId) {
        return res.status(400).json({ error: "Debes seleccionar una clínica." });
      }

      Object.assign(data, {
        species,
        breed,
        age: age ? Number(age) : null,
        weight: weight ? Number(weight) : null,
        ownerId: userId,
        clinicId: Number(clinicId),
      });
    }

if (role === "CLINICA") {
  data.age = age ? Number(age) : null;
  data.weight = weight ? Number(weight) : null;
  data.clinicId = userClinicId;
  data.species = species || null;  
  data.breed = breed || null;    
}



    const pet = await prisma.pet.create({ data });
    res.status(201).json(pet);
  } catch (err) {
    console.error("Error al registrar mascota", err);
    res.status(500).json({ error: "Error al registrar mascota" });
  }
};



export const updatePet = async (req, res) => {
  const { id } = req.params;
  const { name, species, breed, age, weight, phone } = req.body;
  const { id: userId, role, clinicId: userClinicId } = req.user;

  try {
    const pet = await prisma.pet.findUnique({ where: { id: Number(id) } });
    if (!pet) return res.status(404).json({ error: "Mascota no encontrada" });

    if (role === "USUARIO" && pet.ownerId !== userId) {
      return res.status(403).json({ error: "No puedes editar esta mascota" });
    }

    if (role === "CLINICA" && pet.clinicId !== userClinicId) {
      return res.status(403).json({ error: "No puedes editar mascotas de otra clínica" });
    }

const updateData =
  role === "CLINICA"
    ? {
        name,
        phone,
        age: age ? Number(age) : null,
        weight: weight ? Number(weight) : null,
        species: species || null,
        breed: breed || null,
      }
    : {
        name,
        species,
        breed,
        age: Number(age),
        weight: Number(weight),
        phone,
      };

    const updated = await prisma.pet.update({
      where: { id: Number(id) },
      data: updateData,
    });

    res.json(updated);
  } catch (err) {
    console.error("Error al actualizar mascota", err);
    res.status(500).json({ error: "Error al actualizar mascota" });
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
export const getAllPets = async (req, res) => {
  const { role } = req.user;

  if (role !== 'CLINICA') {
    return res.status(403).json({ error: "Solo una clínica puede ver todas las mascotas" });
  }

  try {
    const pets = await prisma.pet.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(pets);
  } catch (err) {
    console.error("Error al obtener mascotas:", err);
    res.status(500).json({ error: "Error al obtener mascotas" });
  }
};
