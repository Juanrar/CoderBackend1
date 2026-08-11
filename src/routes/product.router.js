import { Router } from 'express';
import { ProductoController } from '../controllers/producto.controller.js'

const router = Router();

router.get('/', ProductoController.getAll)
router.get('/:id', ProductoController.getById)
router.post('/', ProductoController.create)
router.delete('/:id', ProductoController.delete)
router.put('/:id', ProductoController.update)

export default router;