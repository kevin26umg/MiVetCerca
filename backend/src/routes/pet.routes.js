import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getPets, createPet, updatePet, deletePet, getAllPets } from '../controllers/pet.controller.js';

const router = Router();
router.use(verifyToken);

router.get('/', getPets);
router.post('/', createPet);
router.put('/:id', updatePet);
router.delete('/:id', deletePet);
router.get('/all', verifyToken, getAllPets);

export default router;
