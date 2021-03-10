import { sharedRef, generateContext } from '@vue-storefront/core';
import useCart from '../useCart';
import { computed } from '@vue/composition-api';

export default () => {
  const { cart, setCart } = useCart();

  const shippingMethods = sharedRef([], 'useShippingMethods');

  const loading = sharedRef(false, 'useShippingMethods-loading');

  const context = generateContext({});

  const loadShippingMethods = async () => {
    loading.value = true;
    try {
      // TODO load it from checkout
      shippingMethods.value = await context.$saleor.api.getShippingMethods(
        cart.value.token
      );
    } finally {
      loading.value = false;
    }
  };

  const saveShippingMethod = async (shippingMethod) => {
    loading.value = true;

    try {
      await context.$saleor.api.checkoutShippingMethodUpdate(
        cart.value.id,
        shippingMethod.id
      );

      // TODO check for errors

      const checkout = { ...cart.value };
      checkout.shippingMethod = shippingMethod;
      setCart(checkout);
    } finally {
      loading.value = false;
    }
  };

  return {
    loadShippingMethods,
    shippingMethods: computed(() => shippingMethods.value),
    loading: computed(() => loading.value),
    saveShippingMethod
  };
};
