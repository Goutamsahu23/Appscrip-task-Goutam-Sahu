import { Router } from 'express';

import * as categoriesController from './categories.controller';

export const categoriesRouter = Router();

categoriesRouter.get('/', categoriesController.listCategories);
