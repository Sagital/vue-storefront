import { sharedRef, generateContext } from '@vue-storefront/core';
import useCart from '../useCart';
import { AddressInput, CountryCode } from '@vue-storefront/saleor-api';
import convertAddressToAddressInput from '../helpers/internals/convertAddressToAddressInput';

export default () => {
  const { cart, setCart } = useCart();

  const billingDetails = sharedRef({}, 'useBillingDetails');
  const isSameAsShipping = sharedRef(
    false,
    'useBillingDetails-isSameAsShipping'
  );

  const context = generateContext({});

  if (cart.value.billingAddress) {
    billingDetails.value = convertAddressToAddressInput(
      cart.value.billingAddress
    );
  } else {
    billingDetails.value = {
      // TODO this should be in the component
      country: CountryCode.Us
    };
  }

  const copyFromShipping = () => {
    if (!cart.value.shippingAddress) {
      return;
    }

    // TODO This needs to be the default
    billingDetails.value = convertAddressToAddressInput(
      cart.value.shippingAddress
    );

    console.log('copied');
    console.log(billingDetails.value);
  };

  const saveBillingDetails = async (addressInput: AddressInput) => {
    console.log('in saveBillingDetails');
    console.log(addressInput);
    console.log(billingDetails);
    console.log(cart.value.billingAddress);

    const cartResponse = await context.$saleor.api.checkoutBillingAddressUpdate(
      cart.value.id,
      addressInput
    );

    const updatedCart = {
      ...cart.value,
      billingAddress: cartResponse.checkout.billingAddress
    };

    setCart(updatedCart);
  };

  return {
    billingDetails,
    copyFromShipping,
    isSameAsShipping,
    saveBillingDetails
  };
};
