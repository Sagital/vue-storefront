import { sharedRef, generateContext } from '@vue-storefront/core';
import useCart from '../useCart';
import { computed } from '@vue/composition-api';

export default () => {
  const { cart } = useCart();

  const paymentMethods = sharedRef([], 'usePaymentMethods-availableMethods');

  const loading = sharedRef(false, 'useShippingMethods-loading');

  const completed = sharedRef(false, 'useShippingMethods-completed');

  const context = generateContext({});

  const loadPaymentMethods = async () => {
    loading.value = true;
    try {
      // TODO load it from checkout
      paymentMethods.value = await context.$saleor.api.getPaymentGateways(
        cart.value.token
      );
      completed.value = true;
    } finally {
      loading.value = false;
    }
  };

  const createPayment = async (paymentMethod) => {
    loading.value = true;

    // TODO this might not be updated, we need to keep it up to date when we add/remove item from cart

    const paymentInput = {
      gateway: paymentMethod.id,
      amount: cart.value.totalPrice.gross.amount,
      token: 'dummy'
    };

    try {
      await context.$saleor.api.checkoutPaymentCreate(
        cart.value.id,
        paymentInput
      );
      // TODO this returns a payment and a checkout not sure if we need to store it separately
    } finally {
      loading.value = false;
    }
  };

  return {
    loadPaymentMethods,
    createPayment,
    paymentMethods: computed(() => paymentMethods.value),
    loading: computed(() => loading.value),
    completed: computed(() => completed.value)
  };
};
