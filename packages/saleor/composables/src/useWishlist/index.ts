/* istanbul ignore file */

import {
  useWishlistFactory,
  UseWishlistFactoryParams,
  Context
} from '@vue-storefront/core';
import { ref, Ref } from '@vue/composition-api';
import { CheckoutLine, ProductVariant } from '@vue-storefront/saleor-api';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Wishlist {}

export const wishlist: Ref<Wishlist> = ref(null);

// @todo: implement wishlist
// https://github.com/DivanteLtd/vue-storefront/issues/4420

const params: UseWishlistFactoryParams<
  Wishlist,
  CheckoutLine,
  ProductVariant
> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  load: async (_: Context) => {
    return {};
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addItem: async (_: Context, { currentWishlist, product }) => {
    return {};
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeItem: async (_: Context, { currentWishlist, product }) => {
    return {};
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clear: async (_: Context, { currentWishlist }) => {
    return {};
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isInWishlist: (_: Context, { currentWishlist }) => {
    return false;
  }
};

export default useWishlistFactory<Wishlist, CheckoutLine, ProductVariant>(
  params
);
