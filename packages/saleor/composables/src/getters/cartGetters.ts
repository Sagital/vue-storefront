import {
  CartGetters,
  AgnosticCoupon,
  AgnosticPrice,
  AgnosticTotals,
  AgnosticDiscount
} from '@vue-storefront/core';
import { getProductAttributes } from './productGetters';
import { createPrice } from './_utils';
import { getCouponsFromCart } from '../helpers/internals';
import { Checkout, CheckoutLine } from '@vue-storefront/saleor-api';
export const getCartItems = (checkout: Checkout): CheckoutLine[] => {
  if (!checkout) {
    return [];
  }

  return checkout.lines;
};

export const getCartItemName = (product: CheckoutLine): string =>
  product.variant.name;

export const getCartItemImage = (product: CheckoutLine): string =>
  product.variant.product.thumbnail.url;

export const getCartItemPrice = (product: CheckoutLine): AgnosticPrice =>
  createPrice(product.variant);

export const getCartItemQty = (product: CheckoutLine): number =>
  product.quantity;

export const getCartItemAttributes = (
  product: CheckoutLine,
  filterByAttributeName?: Array<string>
) => getProductAttributes(product.variant, filterByAttributeName);

export const getCartItemSku = (product: CheckoutLine): string =>
  product.variant.sku;

export const getCartTotals = (checkout: Checkout): AgnosticTotals => {
  if (!checkout) {
    return {
      total: 0,
      subtotal: 0,
      special: 0
    };
  }

  // TODO calculate
  return {
    total: 0,
    subtotal: 0,
    special: 0
  };
};

// TODO net or gross
export const getCartShippingPrice = (checkout: Checkout): number =>
  checkout && checkout.shippingPrice
    ? checkout.shippingPrice.net.amount / 100
    : 0;

export const getCartTotalItems = (cart: Checkout): number => {
  if (!cart || !cart.lines) {
    return 0;
  }

  return cart.lines.reduce(
    (previous, current) => previous + current.quantity,
    0
  );
};

export const getFormattedPrice = (price: number) => (price as any) as string;

export const getCoupons = (checkout: Checkout): AgnosticCoupon[] => {
  return getCouponsFromCart(checkout);
};

// eslint-disable-next-line
export const getDiscounts = (_: Checkout): AgnosticDiscount[] => {
  return [];
};

const cartGetters: CartGetters<Checkout, CheckoutLine> = {
  getTotals: getCartTotals,
  getShippingPrice: getCartShippingPrice,
  getItems: getCartItems,
  getItemName: getCartItemName,
  getItemImage: getCartItemImage,
  getItemPrice: getCartItemPrice,
  getItemQty: getCartItemQty,
  getItemAttributes: getCartItemAttributes,
  getItemSku: getCartItemSku,
  getTotalItems: getCartTotalItems,
  getFormattedPrice,
  getCoupons,
  getDiscounts
};

export default cartGetters;
