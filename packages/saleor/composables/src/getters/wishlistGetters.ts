/* istanbul ignore file */

import {
  WishlistGetters,
  AgnosticPrice,
  AgnosticTotals
} from '@vue-storefront/core';
import { CheckoutLine } from '@vue-storefront/saleor-api';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Wishlist {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getWishlistItems = (_: Wishlist): CheckoutLine[] => [];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getWishlistItemName = (_: CheckoutLine): string => '';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getWishlistItemImage = (_: CheckoutLine): string => '';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getWishlistItemPrice = (_: CheckoutLine): AgnosticPrice => ({
  regular: 0,
  special: 0
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getWishlistItemQty = (_: CheckoutLine): number => 1;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getWishlistItemAttributes = (_1: CheckoutLine, _2?: string[]) => ({
  '': ''
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getWishlistItemSku = (_: CheckoutLine): string => '';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getWishlistTotals = (_: Wishlist): AgnosticTotals => ({
  total: 0,
  subtotal: 0
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getWishlistShippingPrice = (_: Wishlist): number => 0;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getWishlistTotalItems = (_: Wishlist): number => 0;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getFormattedPrice = (_: number): string => '';

const wishlistGetters: WishlistGetters<Wishlist, CheckoutLine> = {
  getTotals: getWishlistTotals,
  getShippingPrice: getWishlistShippingPrice,
  getItems: getWishlistItems,
  getItemName: getWishlistItemName,
  getItemImage: getWishlistItemImage,
  getItemPrice: getWishlistItemPrice,
  getItemQty: getWishlistItemQty,
  getItemAttributes: getWishlistItemAttributes,
  getItemSku: getWishlistItemSku,
  getTotalItems: getWishlistTotalItems,
  getFormattedPrice
};

export default wishlistGetters;
