import { CheckoutGetters } from '@vue-storefront/core';
import { ShippingMethod } from '@vue-storefront/saleor-api';

export const getShippingMethodId = (shippingMethod: ShippingMethod): string =>
  shippingMethod ? shippingMethod.id : '';

export const getShippingMethodName = (shippingMethod: ShippingMethod): string =>
  shippingMethod ? shippingMethod.name : '';

export const getShippingMethodDescription = (
  shippingMethod: ShippingMethod
): string => (shippingMethod ? shippingMethod.name : '');

export const getShippingMethodPrice = (
  shippingMethod: ShippingMethod
): number => {
  if (!shippingMethod || !shippingMethod.price) {
    return null;
  }

  return shippingMethod.price.amount;
};

export const getFormattedPrice = (price: number) => (price as any) as string;

const checkoutGetters: CheckoutGetters<ShippingMethod> = {
  getShippingMethodId,
  getShippingMethodName,
  getShippingMethodDescription,
  getShippingMethodPrice,
  getFormattedPrice
};

export default checkoutGetters;
