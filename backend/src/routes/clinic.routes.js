import { Router } from 'express';
import { getAllClinics, getClinicById, updateClinic } from '../controllers/clinic.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllClinics);
router.get('/:id', getClinicById);
router.put('/:id', verifyToken, updateClinic);

export default router;
