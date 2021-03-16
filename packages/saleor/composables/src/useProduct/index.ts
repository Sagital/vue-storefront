import { ProductsSearchParams } from '../types';
import { generateContext, sharedRef } from '@vue-storefront/core';
import { enhanceProduct } from '../helpers/internals';
import { ssrRef } from '@nuxtjs/composition-api';
import { PageInfo, ProductVariant } from '@vue-storefront/saleor-api';
export default () => {
  const context = generateContext({});

  const loading = sharedRef(false, 'useProduct-loading');
  const products = ssrRef([]);

  const loadProductVariants = async (
    params: ProductsSearchParams
  ): Promise<{
    pageInfo: PageInfo;
    productVariants: ProductVariant[];
  }> => {
    try {
      loading.value = true;

      const productsEdges = await context.$saleor.api.queryProducts(params);

      const productVariants = productsEdges.edges.flatMap((edge) =>
        enhanceProduct(edge.node)
      );

      return { productVariants, pageInfo: productsEdges.pageInfo };
    } finally {
      loading.value = false;
    }
  };

  const loadProductVariantsByProductId = async (
    productId
  ): Promise<ProductVariant[]> => {
    try {
      loading.value = true;

      const product = await context.$saleor.api.getProduct({ productId });

      if (!product) {
        // TODO error handling, maybe throw exception. This should throw a 404
        return null;
      }
      return enhanceProduct(product);
    } finally {
      loading.value = false;
    }
  };

  return {
    loadProductVariants,
    loadProductVariantsByProductId,
    loading,
    products
  };
};
