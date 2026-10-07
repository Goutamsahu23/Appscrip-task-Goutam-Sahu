import { Router } from 'express';

import { categoriesRouter } from '../modules/categories/categories.routes';

export const apiRouter = Router();

apiRouter.use('/categories', categoriesRouter);
