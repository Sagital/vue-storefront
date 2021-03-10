import gql from 'graphql-tag';
import { AddressInput, CheckoutBillingAddressUpdate } from '../../';
import mutation from './defaultMutation';

const checkoutBillingAddressUpdate = async (
  context,
  checkoutId: string,
  billingAddress: AddressInput
): Promise<CheckoutBillingAddressUpdate> => {
  const variables = {
    checkoutId,
    billingAddress
  };

  const response = await context.client.mutate({
    mutation: gql`
      ${mutation}
    `,
    variables,
    fetchPolicy: 'no-cache'
  });

  return response.data.checkoutBillingAddressUpdate;
};

export default checkoutBillingAddressUpdate;
