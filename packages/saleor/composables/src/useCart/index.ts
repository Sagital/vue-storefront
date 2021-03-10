import {
  AgnosticCoupon,
  Context,
  useCartFactory,
  UseCartFactoryParams
} from '@vue-storefront/core';
import {
  Checkout,
  CheckoutLine,
  ProductVariant
} from '@vue-storefront/saleor-api';

const getBasketItemByProduct = ({ currentCart, product }) => {
  return currentCart.lines?.find((item) => item.productId === product._id);
};

const params: UseCartFactoryParams<
  Checkout,
  CheckoutLine,
  ProductVariant,
  AgnosticCoupon
> = {
  load: async (context: Context) => {
    const { $saleor } = context;

    const isGuest = await $saleor.api.isGuest();

    if (isGuest) {
      const guestCheckoutToken = await context.$saleor.config.getGuestCheckoutToken();

      if (!guestCheckoutToken) {
        return null;
      }

      return await context.$saleor.api.getCheckout(guestCheckoutToken);
    } else {
      const user = await context.$saleor.api.getMe();
      return user.checkout;
    }
  },
  addItem: async (context: Context, { currentCart, product, quantity }) => {
    const isGuest = await context.$saleor.api.isGuest();

    let existingCheckoutId = null;

    if (currentCart) {
      existingCheckoutId = currentCart.id;
    } else if (isGuest) {
      // new visit, take the checkout it from the local storage.
      // TODO It shouldn't get here though, because the checkout is loaded along with the user
      const guestCheckoutParams = await context.$saleor.config.getGuestCheckoutToken();
      if (guestCheckoutParams) {
        throw new Error('he has a checkout token but no current tokent');
      }
    }

    // TODO set the totatl
    if (existingCheckoutId) {
      const checkoutLinesAdd = await context.$saleor.api.checkoutsLinesAdd(
        existingCheckoutId,
        product.id,
        quantity
      );

      return checkoutLinesAdd.checkout;
    } else {
      const checkoutCreate = await context.$saleor.api.checkoutCreate(
        product.id,
        quantity
      );

      if (isGuest) {
        context.$saleor.config.setGuestCheckoutToken(
          checkoutCreate.checkout.token
        );
      }

      return checkoutCreate.checkout;
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeItem: async (_: Context, { currentCart }) => {
    // const loadedCart = await getCurrentCart(context, currentCart);
    //
    // const { data } = await context.$saleor.api.removeFromCart(loadedCart, product, customQuery);
    //    return data.cart;
    return null;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateItemQty: async (_: Context, { currentCart }) => {
    // const loadedCart = await getCurrentCart(context, currentCart);
    //
    // const { data } = await context.$saleor.api.updateCartQuantity(loadedCart, { ...product, quantity }, customQuery);
    // return data.cart;
    return null;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clear: async (_: Context, { currentCart }) => {
    return currentCart;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applyCoupon: async (_: Context, { currentCart, couponCode, customQuery }) => {
    // No coupon yet
    return null;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeCoupon: async (_: Context, { currentCart, coupon, customQuery }) => {
    // No coupon yet
    return null;
  },
  isInCart: (context: Context, { currentCart, product }): boolean => {
    return Boolean(
      currentCart && getBasketItemByProduct({ currentCart, product })
    );
  }
};

export default useCartFactory<
  Checkout,
  CheckoutLine,
  ProductVariant,
  AgnosticCoupon
>(params);
