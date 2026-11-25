import { Router } from 'express';
import { ticketController } from '../controllers/ticketController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', ticketController.index);
router.get('/:id', ticketController.show);
router.post('/', ticketController.store);
router.put('/:id', ticketController.update);
router.delete('/:id', ticketController.destroy);

export default router;
