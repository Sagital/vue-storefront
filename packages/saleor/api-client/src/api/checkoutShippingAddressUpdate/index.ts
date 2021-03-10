import gql from 'graphql-tag';
import { AddressInput, CheckoutShippingAddressUpdate } from '../../';
import mutation from './defaultMutation';

const checkoutShippingAddressUpdate = async (
  context,
  checkoutId: string,
  shippingAddress: AddressInput
): Promise<CheckoutShippingAddressUpdate> => {
  const variables = {
    checkoutId,
    shippingAddress
  };

  const response = await context.client.mutate({
    mutation: gql`
      ${mutation}
    `,
    variables,
    fetchPolicy: 'no-cache'
  });

  if (
    response.data.checkoutShippingAddressUpdate.checkout?.email ===
    'dummy@example.com'
  ) {
    // we don't report the dummy email to the client
    response.data.checkoutShippingAddressUpdate.checkout.email = null;
  }

  return response.data.checkoutShippingAddressUpdate;
};

export default checkoutShippingAddressUpdate;
