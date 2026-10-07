import type { RequestHandler } from 'express';

import * as productsService from './products.service';
import type { ListProductsQuery, ProductIdParams } from './products.schema';

export const listProducts: RequestHandler = async (_req, res) => {
  const query = res.locals.query as ListProductsQuery;
  const result = await productsService.listProducts(query);
  res.status(200).json(result);
};

export const getProductById: RequestHandler = async (_req, res) => {
  const { id } = res.locals.params as ProductIdParams;
  const data = await productsService.getProductById(id);
  res.status(200).json({ data });
};
