import gql from 'graphql-tag';
import { CheckoutShippingMethodUpdate } from '../../';
import mutation from './defaultMutation';

const checkoutShippingMethodUpdate = async (
  context,
  checkoutId: string,
  shippingMethodId: string
): Promise<CheckoutShippingMethodUpdate> => {
  const variables = {
    checkoutId,
    shippingMethodId
  };

  const response = await context.client.mutate({
    mutation: gql`
      ${mutation}
    `,
    variables,
    fetchPolicy: 'no-cache'
  });

  if (
    response.data.checkoutShippingMethodUpdate.checkout?.email ===
    'dummy@example.com'
  ) {
    // we don't report the dummy email to the client
    response.data.checkoutShippingMethodUpdate.checkout.email = null;
  }

  return response.data.checkoutShippingMethodUpdate;
};

export default checkoutShippingMethodUpdate;
