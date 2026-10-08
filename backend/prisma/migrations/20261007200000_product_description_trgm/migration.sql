-- Helps ILIKE / contains search on product descriptions (title index already exists)
CREATE INDEX "Product_description_trgm_idx" ON "Product" USING GIN ("description" gin_trgm_ops);
