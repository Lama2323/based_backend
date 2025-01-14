import { Router } from 'express';
import { productController } from '../controllers';

const productRouter = Router();

productRouter.get('/', productController.getAllProducts);
productRouter.get('/:product_id', productController.getProductById);
productRouter.post('/', productController.createProduct);
productRouter.put('/:product_id', productController.updateProduct);
productRouter.delete('/:product_id', productController.deleteProduct);

export default productRouter;