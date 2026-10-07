import type { RequestHandler } from 'express';

import * as categoriesService from './categories.service';

export const listCategories: RequestHandler = async (_req, res) => {
  const data = await categoriesService.listCategories();
  res.status(200).json({ data });
};
