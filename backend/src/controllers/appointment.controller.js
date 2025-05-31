import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Obtener citas (usuario ve sus citas, clínica ve las que programó)
export const getAppointments = async (req, res) => {
  const { role, id, clinicId } = req.user;

  try {
    const appointments = await prisma.appointment.findMany({
      where: role === 'CLINICA'
        ? { clinicId }
        : { userId: id },
      include: {
        pet: true,
        clinic: true,
      },
      orderBy: { date: 'asc' },
    });

    res.json(appointments);
  } catch (err) {
    console.error("Error al obtener citas:", err);
    res.status(500).json({ error: "Error al obtener citas" });
  }
};

// Crear cita (solo clínica)
export const createAppointment = async (req, res) => {
  const { role, id: currentUserId, clinicId } = req.user;

  if (role !== 'CLINICA') {
    return res.status(403).json({ error: "Solo una clínica puede crear citas" });
  }

  const { petId, date, description } = req.body;

  try {
    const pet = await prisma.pet.findUnique({ where: { id: petId } });
    if (!pet) return res.status(404).json({ error: "Mascota no encontrada" });

    const appointment = await prisma.appointment.create({
      data: {
        userId: pet.ownerId ?? currentUserId,  // si la mascota no tiene dueño, asignamos el userId de la clínica
        clinicId,
        petId,
        date: new Date(date),
        description,
      },
    });

    res.json(appointment);
  } catch (err) {
    console.error("Error al crear cita:", err);
    res.status(500).json({ error: "No se pudo crear la cita" });
  }
};


// Actualizar cita (solo clínica)
export const updateAppointment = async (req, res) => {
  const { role, clinicId } = req.user;
  const { id } = req.params;
  const data = req.body;

  if (role !== 'CLINICA') {
    return res.status(403).json({ error: 'Solo una clínica puede actualizar citas' });
  }

  try {
    const existing = await prisma.appointment.findUnique({ where: { id: Number(id) } });
    if (!existing || existing.clinicId !== clinicId) {
      return res.status(404).json({ error: 'Cita no encontrada o no autorizada' });
    }

    const updated = await prisma.appointment.update({
      where: { id: Number(id) },
      data,
    });

    res.json(updated);
  } catch (err) {
    console.error("Error al actualizar cita:", err);
    res.status(500).json({ error: 'Error al actualizar cita' });
  }
};

// Eliminar cita (solo clínica)
export const deleteAppointment = async (req, res) => {
  const { role, clinicId } = req.user;
  const { id } = req.params;

  if (role !== 'CLINICA') {
    return res.status(403).json({ error: 'Solo una clínica puede eliminar citas' });
  }

  try {
    const existing = await prisma.appointment.findUnique({ where: { id: Number(id) } });
    if (!existing || existing.clinicId !== clinicId) {
      return res.status(404).json({ error: 'Cita no encontrada o no autorizada' });
    }

    await prisma.appointment.delete({ where: { id: Number(id) } });
    res.status(204).end();
  } catch (err) {
    console.error("Error al eliminar cita:", err);
    res.status(500).json({ error: 'Error al eliminar cita' });
  }
};

export const confirmAppointment = async (req, res) => {
  const { role, clinicId } = req.user;
  const { id } = req.params;

  if (role !== 'CLINICA') {
    return res.status(403).json({ error: 'Solo una clínica puede confirmar citas' });
  }

  try {
    const appointment = await prisma.appointment.findUnique({ where: { id: Number(id) } });

    if (!appointment || appointment.clinicId !== clinicId) {
      return res.status(404).json({ error: 'Cita no encontrada o no autorizada' });
    }

    const updated = await prisma.appointment.update({
      where: { id: Number(id) },
      data: { confirmed: true },
    });

    res.json(updated);
  } catch (err) {
    console.error("Error al confirmar cita:", err);
    res.status(500).json({ error: 'Error al confirmar cita' });
  }
};


export const cancelAppointment = async (req, res) => {
  const { role, id: userId, clinicId } = req.user;
  const { id } = req.params;

  try {
    const appointment = await prisma.appointment.findUnique({ where: { id: Number(id) } });

    if (!appointment) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    const isAuthorized =
      (role === 'USUARIO' && appointment.userId === userId) ||
      (role === 'CLINICA' && appointment.clinicId === clinicId);

    if (!isAuthorized) {
      return res.status(403).json({ error: 'No autorizado para cancelar esta cita' });
    }

    const updated = await prisma.appointment.update({
      where: { id: Number(id) },
      data: { cancelled: true },
    });

    res.json(updated);
  } catch (err) {
    console.error("Error al cancelar cita:", err);
    res.status(500).json({ error: 'Error al cancelar cita' });
  }
};

