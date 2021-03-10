import useCart from '../useCart';

import {
  UseMakeOrder,
  useMakeOrderFactory,
  Context
} from '@vue-storefront/core';
import { Order } from '@vue-storefront/saleor-api';

const factoryParams = {
  provide() {
    return {
      cart: useCart()
    };
  },

  make: async (context: Context): Promise<Order> => {
    const { id } = context.cart.cart.value;

    const checkoutComplete = await context.$saleor.api.checkoutComplete(id);

    if (checkoutComplete.order) {
      // TODO move it to another context part
      context.$saleor.config.removeGuestCheckoutToken();
      context.cart.setCart(null);
      return checkoutComplete.order;
    }

    throw new Error(JSON.stringify(checkoutComplete.checkoutErrors));
  }
};

const useMakeOrder: () => UseMakeOrder<Order> = useMakeOrderFactory<Order>(
  factoryParams
);

export default useMakeOrder;
