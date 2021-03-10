import { sharedRef, generateContext } from '@vue-storefront/core';
import useCart from '../useCart';
import { computed } from '@vue/composition-api';

export default () => {
  const { cart, setCart } = useCart();

  const personalDetails = sharedRef({}, 'usePersonalDetails');

  const loading = sharedRef(false, 'usePersonalDetails-loading');

  const context = generateContext({});

  if (cart.value.shippingAddress) {
    personalDetails.value.firstName = cart.value.shippingAddress.firstName;
    personalDetails.value.lastName = cart.value.shippingAddress.lastName;
  }
  personalDetails.value.email = cart.value.email;

  const saveCheckoutEmail = async (email) => {
    loading.value = true;

    try {
      const checkoutEmailUpdate = await context.$saleor.api.checkoutEmailUpdate(
        cart.value.id,
        email
      );

      const newCart = {
        ...cart.value,
        email: checkoutEmailUpdate.checkout.email
      };

      setCart(newCart);
    } finally {
      loading.value = false;
    }
  };

  return {
    personalDetails: computed(() => personalDetails.value),
    loading,
    saveCheckoutEmail: saveCheckoutEmail
  };
};
