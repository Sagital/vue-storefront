import {
  ProductGetters,
  AgnosticMediaGalleryItem,
  AgnosticAttribute,
  AgnosticPrice
} from '@vue-storefront/core';
import { formatAttributeList, createPrice } from './_utils';
import {
  Product,
  ProductImage,
  ProductVariant
} from '@vue-storefront/saleor-api';

interface ProductVariantFilters {
  master?: boolean;
  attributes?: Record<string, string>;
}

export const getProductName = (
  product: Product | Readonly<ProductVariant>
): string => (product as any)?.name || '';

export const getProductSlug = (product: Product): string => product.slug || '';

export const getProductPrice = (product: Product): AgnosticPrice =>
  createPrice(product.defaultVariant);

export const getProductVariantPrice = (
  variant: ProductVariant
): AgnosticPrice => {
  return createPrice(variant);
};

export const getVariantGallery = (
  product: Product,
  variantId = null
): AgnosticMediaGalleryItem[] => {
  const variant = product.variants.find((v) => v.id === variantId);
  const images = variant.images.length ? variant.images : product.images;
  return images.map((image: ProductImage) => ({
    small: image.url,
    big: image.url,
    normal: image.url
  }));
};

export const getProductGallery = (
  product: Product
): AgnosticMediaGalleryItem[] => {
  const images = product.images || [];

  return images.map((image: ProductImage) => ({
    small: image.url,
    big: image.url,
    normal: image.url
  }));
};

export const getProductCoverImage = (product: Product): string =>
  product?.thumbnail?.url || '';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getProductFiltered = (
  products: Product[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: ProductVariantFilters | any = {}
): Product[] => {
  return [];
};

export const getProductAttributes = (
  products: Product[] | Product,
  filterByAttributeName?: string[]
): Record<string, AgnosticAttribute | string> => {
  const isSingleProduct = !Array.isArray(products);
  const productList = (isSingleProduct ? [products] : products) as Product[];

  if (!products || productList.length === 0) {
    return {} as any;
  }

  // TODO this no longer works and the characters are empty
  const formatAttributes = (product: Product): AgnosticAttribute[] =>
    formatAttributeList(product.attributes || []).filter((attribute) =>
      filterByAttributeName
        ? filterByAttributeName.includes(attribute.name)
        : attribute
    );

  const reduceToUniques = (prev, curr) => {
    const isAttributeExist = prev.some(
      (el) => el.name === curr.name && el.value === curr.value
    );

    if (!isAttributeExist) {
      return [...prev, curr];
    }

    return prev;
  };

  const reduceByAttributeName = (prev, curr) => ({
    ...prev,
    [curr.name]: isSingleProduct
      ? curr.value
      : [
        ...(prev[curr.name] || []),
        {
          value: curr.value,
          label: curr.label
        }
      ]
  });

  return productList
    .map((product) => formatAttributes(product))
    .reduce((prev, curr) => [...prev, ...curr], [])
    .reduce(reduceToUniques, [])
    .reduce(reduceByAttributeName, {});
};

export const getProductDescription = (product: Product): any =>
  product.descriptionJson || product.description;

export const getProductCategoryIds = (product: Product): string[] => {
  if (!product) {
    // TODO is this legit ?
    return [''];
  } else {
    return [product.category.id];
  }
};

export const getProductId = (product: Product): string => product.id || '';

export const getFormattedPrice = (price: number) => (price as any) as string;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getTotalReviews = (product: Product): number => 0;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getAverageRating = (product: Product): number => 0;

const productGetters: ProductGetters<Product, ProductVariantFilters> = {
  getName: getProductName,
  getSlug: getProductSlug,
  getPrice: getProductPrice,
  getGallery: getProductGallery,
  getCoverImage: getProductCoverImage,
  getFiltered: getProductFiltered,
  getAttributes: getProductAttributes,
  getDescription: getProductDescription,
  getCategoryIds: getProductCategoryIds,
  getId: getProductId,
  getFormattedPrice,
  getTotalReviews,
  getProductVariantPrice,
  getVariantGallery,
  getAverageRating
};

export default productGetters;
