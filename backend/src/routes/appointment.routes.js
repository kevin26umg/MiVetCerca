import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '../controllers/appointment.controller.js';

const router = Router();
router.use(verifyToken); 

router.get('/', getAppointments);
router.post('/', createAppointment);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

export default router;
