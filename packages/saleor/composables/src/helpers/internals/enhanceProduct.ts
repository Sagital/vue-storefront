import {
  ProductCountableConnection,
  ProductVariant
} from '@vue-storefront/saleor-api';

const enhanceProduct = (
  productResponse: ProductCountableConnection
): ProductVariant[] => {
  return productResponse.edges.flatMap((edge) => {
    const product = edge.node;

    return product.variants.map((variant) => {
      const result: ProductVariant = {
        meta: undefined,
        privateMeta: undefined,
        quantity: 0,
        stockQuantity: 0,
        attributes: product.attributes.concat(variant.attributes),
        quantityAvailable: 10,
        id: variant.id,
        name: product.name,
        images: product.images,
        sku: variant.sku,
        pricing: variant.pricing,
        privateMetadata: [],
        metadata: [],
        product: product,
        trackInventory: true
      };

      return result;
    });
  });
};

export default enhanceProduct;
