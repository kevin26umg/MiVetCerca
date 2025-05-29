import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllClinics = async (req, res) => {
  const clinics = await prisma.clinic.findMany();
  res.json(clinics);
};

export const getClinicById = async (req, res) => {
  const { id } = req.params;
  try {
    const clinic = await prisma.clinic.findUnique({ where: { id: Number(id) } });
    if (!clinic) return res.status(404).json({ error: 'Clínica no encontrada' });
    res.json(clinic);
  } catch {
    res.status(500).json({ error: 'Error al obtener la clínica' });
  }
};

export const updateClinic = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    // Validación: solo puede editar su propia clínica
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (user.clinicId !== Number(id)) return res.status(403).json({ error: 'Acceso denegado' });

    const clinic = await prisma.clinic.update({
      where: { id: Number(id) },
      data,
    });

    res.json(clinic);
  } catch {
    res.status(500).json({ error: 'Error al actualizar la clínica' });
  }
};
