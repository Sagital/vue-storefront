import gql from 'graphql-tag';
import { CheckoutEmailUpdate } from '../../';
import mutation from './defaultMutation';

const checkoutEmailUpdate = async (
  { client },
  checkoutId,
  email
): Promise<CheckoutEmailUpdate> => {
  const variables = {
    checkoutId: checkoutId,
    email: email
  };

  const response = await client.mutate({
    mutation: gql`
      ${mutation}
    `,
    variables,
    fetchPolicy: 'no-cache'
  });

  if (
    response.data.checkoutEmailUpdate.checkout?.email === 'dummy@example.com'
  ) {
    // we don't report the dummy email to the client
    response.data.checkoutEmailUpdate.checkout.email = null;
  }

  return response.data.checkoutEmailUpdate;
};

export default checkoutEmailUpdate;
