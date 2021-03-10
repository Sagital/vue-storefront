import { AgnosticCoupon } from '@vue-storefront/core';
import { Checkout } from '@vue-storefront/saleor-api';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (checkout: Checkout): AgnosticCoupon[] => {
  return null;

  // TODO
  // return coupons.map(coupon => ({
  //   id: coupon.discountCode.id,
  //   name: coupon.discountCode.name,
  //   code: coupon.discountCode.code,
  //   value: null
  // })
  // );
};
