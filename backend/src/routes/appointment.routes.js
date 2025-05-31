import { Router } from 'express';
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  confirmAppointment,
  cancelAppointment
} from '../controllers/appointment.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();


router.get('/', verifyToken, getAppointments);


router.post('/', verifyToken, createAppointment);


router.put('/:id', verifyToken, updateAppointment);


router.delete('/:id', verifyToken, deleteAppointment);


router.patch('/:id/confirm', verifyToken, confirmAppointment);


router.patch('/:id/cancel', verifyToken, cancelAppointment);




export default router;
