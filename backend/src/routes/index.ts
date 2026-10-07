import { Router } from 'express';

import { categoriesRouter } from '../modules/categories/categories.routes';
import { productsRouter } from '../modules/products/products.routes';

export const apiRouter = Router();

apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/products', productsRouter);
