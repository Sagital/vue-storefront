import { ProductsSearchParams } from '../types';
import { enhanceProduct, mapPaginationParams } from './../helpers/internals';
import { useProductFactory, UseProduct, Context } from '@vue-storefront/core';
import { ProductVariant } from '@vue-storefront/saleor-api';

const productsSearch = async (
  context: Context,
  { ...searchParams }
): Promise<ProductVariant[]> => {
  const apiSearchParams = {
    ...searchParams,
    ...mapPaginationParams(searchParams)
  };

  const products = await context.$saleor.api.getProduct(apiSearchParams);
  return enhanceProduct(products);
};

const useProduct: (
  cacheId: string
) => UseProduct<ProductVariant[], ProductsSearchParams> = useProductFactory<
  ProductVariant[],
  ProductsSearchParams
>({
  productsSearch
});

export default useProduct;
