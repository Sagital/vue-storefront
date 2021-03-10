import { AgnosticAttribute, AgnosticPrice } from '@vue-storefront/core';
import {
  Attribute,
  ProductVariant,
  SelectedAttribute
} from '@vue-storefront/saleor-api';

export const getAttributeValue = (attribute: Attribute) => {
  // TODO array?
  return attribute.values ? attribute.values[0] : '';
};

export const formatAttributeList = (
  attributes: Array<SelectedAttribute>
): AgnosticAttribute[] =>
  attributes.map((attr) => {
    const attrValue = getAttributeValue(attr.attribute);
    return {
      name: attr.attribute.name,
      value: attrValue,
      label: attr.attribute.name
    };
  });

export const getVariantByAttributes = (
  products: ProductVariant[] | Readonly<ProductVariant[]>,
  attributes: any
): ProductVariant => {
  console.log(attributes);

  if (!products || products.length === 0) {
    return null;
  }

  // TODO

  // const configurationKeys = Object.keys(attributes);

  return products.find((productVariant: ProductVariant) => {
    console.log(productVariant);
    // const currentAttributes = formatAttributeList(product.attributesRaw);
    //
    // return configurationKeys.every((attrName) =>
    //   currentAttributes.find(({ name, value }) => attrName === name && attributes[attrName] === value)
    // );
  });
};

// const getPrice = (price: Money) => (price ? price.amount : null);

// const getDiscount = (_: ProductVariant | CheckoutLine) => 0;

// const getSpecialPrice = (product: ProductVariant | CheckoutLine) => {
//   const discount = getDiscount(product);
//
//   // TODO
//   // if (product.__typename === 'LineItem') {
//   //   const { discountedPricePerQuantity } = product;
//   //   const discountsLength = discountedPricePerQuantity.length;
//   //
//   //   if (discountsLength > 0) {
//   //     return getPrice(
//   //       discountedPricePerQuantity[discountsLength - 1].discountedPrice
//   //     );
//   //   }
//   // }
//   //
//   // if (discount?.discount.isActive) {
//   //   return getPrice(discount);
//   // }
//
//   return null;
// };

export const createPrice = (product: ProductVariant): AgnosticPrice => {
  if (!product) {
    return { regular: null, special: null };
  }

  const regularPrice = (product as ProductVariant).pricing.price.net.amount;
  const specialPrice = (product as ProductVariant).pricing.discount?.net.amount;

  return {
    regular: regularPrice,
    special: specialPrice
  };
};
