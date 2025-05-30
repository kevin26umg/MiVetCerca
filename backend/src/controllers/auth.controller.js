import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const register = async (req, res) => {
  const { email, password, name, role, phone, clinicData } = req.body;

  if (!email || !password || !name || !phone || !role) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role,
      },
    });

    let clinic = null;

    if (role === 'CLINICA') {
      if (!clinicData) {
        return res.status(400).json({ error: 'Faltan datos de la clínica' });
      }

      const { name, address, phone, email, lat, lng, services, openHours } = clinicData;

      clinic = await prisma.clinic.create({
        data: {
          name,
          address,
          phone,
          email,
          lat,
          lng,
          services,
          openHours,
          users: {
            connect: { id: user.id }
          }
        }
      });

      // actualizar user con clinicId (opcional pero recomendable)
      await prisma.user.update({
        where: { id: user.id },
        data: { clinicId: clinic.id }
      });
    }

    res.json({ message: 'Usuario creado', user, clinic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar' });
  }
};



export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: 'Usuario no existe' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' });

const token = jwt.sign(
  {
    id: user.id,
    role: user.role,
    clinicId: user.clinicId || null, // 👈 importante
  },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);



 res.json({
  token,
  user: {
    id: user.id,
    name: user.name,
    role: user.role,
    clinicId: user.clinicId ?? null
  }
});

};
