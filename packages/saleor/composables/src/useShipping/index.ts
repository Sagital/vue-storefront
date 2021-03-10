import {
  useShippingFactory,
  UseShippingParams,
  Context
} from '@vue-storefront/core';
import useCart from '../useCart';
import { AddressInput, CountryCode } from '@vue-storefront/saleor-api';
import convertAddressToAddressInput from '../helpers/internals/convertAddressToAddressInput';
import { usePersonalDetails } from '../index';
const params: UseShippingParams<AddressInput, {}> = {
  provide() {
    const { personalDetails } = usePersonalDetails();
    const { cart } = useCart();

    return {
      cart,
      personalDetails
    };
  },
  load: async (context: Context): Promise<AddressInput> => {
    if (!context.cart?.value?.shippingAddress) {
      return {
        firstName: context.personalDetails.value.firstName,
        lastName: context.personalDetails.value.lastName,
        country: CountryCode.Us
      };
    } else {
      return convertAddressToAddressInput(context.cart.value.shippingAddress);
    }
  },
  save: async (context: Context, { shippingDetails }) => {
    const response = await context.$saleor.api.checkoutShippingAddressUpdate(
      context.cart.value.id,
      shippingDetails
    );

    context.cart.value.shippingAddress = response.checkout.shippingAddress;

    return convertAddressToAddressInput(response.checkout.shippingAddress);
  }
};

export default useShippingFactory<AddressInput, {}>(params);
