import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import petRoutes from './routes/pet.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import clinicRoutes from './routes/clinic.routes.js';



const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/clinics', clinicRoutes);

app.listen(8000, () => {
  console.log('Servidor escuchando en http://localhost:8000');
});
