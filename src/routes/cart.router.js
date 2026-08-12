import { Router } from 'express';
import { CartController } from '../controllers/cart.controller.js'

const router = Router();

router.post('/', CartController.create)
router.get('/',CartController.getAll)
router.get('/:id',CartController.getById)
router.post('/:cid/products/:pid',CartController.addProduct)



export default router;