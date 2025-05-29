import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAppointments = async (req, res) => {
  const appointments = await prisma.appointment.findMany({
    include: { user: true, clinic: true },
  });
  res.json(appointments);
};

export const createAppointment = async (req, res) => {
  const { userId, clinicId, date } = req.body;
  try {
    const appointment = await prisma.appointment.create({
      data: { userId, clinicId, date: new Date(date) },
    });
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear la cita' });
  }
};

export const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const appointment = await prisma.appointment.update({
      where: { id: Number(id) },
      data,
    });
    res.json(appointment);
  } catch {
    res.status(404).json({ error: 'Cita no encontrada' });
  }
};

export const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.appointment.delete({ where: { id: Number(id) } });
    res.status(204).end();
  } catch {
    res.status(404).json({ error: 'Cita no encontrada' });
  }
};
