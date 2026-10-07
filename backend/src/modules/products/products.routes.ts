import { Router } from 'express';

import { validate } from '../../middlewares/validate';
import * as productsController from './products.controller';
import { listProductsQuerySchema, productIdParamsSchema } from './products.schema';

export const productsRouter = Router();

productsRouter.get(
  '/',
  validate({ query: listProductsQuerySchema }),
  productsController.listProducts,
);

productsRouter.get(
  '/:id',
  validate({ params: productIdParamsSchema }),
  productsController.getProductById,
);
