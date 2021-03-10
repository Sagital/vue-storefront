/* istanbul ignore file */

import useCategory from './useCategory';
import useProduct from './useProduct';
import useCart from './useCart';
import usePersonalDetails from './usePersonalDetails';
import useUser from './useUser';
import useUserOrders from './useUserOrders';
import { useReview } from './useReview';
import useMakeOrder from './useMakeOrder';
import useFacet from './useFacet';
import useUserShipping from './useUserShipping';
import useUserBilling from './useUserBilling';
import useWishlist from './useWishlist';
import useShipping from './useShipping';
import useBilling from './useBilling';
import useShippingMethods from './useShippingMethods';
import usePaymentMethods from './usePaymentMethods';
import { track } from '@vue-storefront/core';

track('VSFsaleor');

export {
  useBilling,
  useCategory,
  useProduct,
  usePersonalDetails,
  useCart,
  useUser,
  useUserOrders,
  useUserBilling,
  useWishlist,
  useUserShipping,
  useReview,
  useMakeOrder,
  useFacet,
  useShipping,
  usePaymentMethods,
  useShippingMethods
};

export * from './getters';
