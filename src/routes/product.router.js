import { Router } from 'express';
import { ProductoController } from '../controllers/producto.controller.js'

const router = Router();

router.get('/', ProductoController.getAll)
router.get('/:id', ProductoController.getById)


export default router;