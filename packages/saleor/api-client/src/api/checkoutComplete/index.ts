import mutation from './defaultMutation';
import gql from 'graphql-tag';
import { CheckoutComplete } from '../../';

const checkoutComplete = async (
  { client },
  checkoutId: string
): Promise<CheckoutComplete> => {
  const variables = {
    checkoutId
  };

  const response = await client.mutate({
    mutation: gql`
      ${mutation}
    `,
    variables,
    fetchPolicy: 'no-cache'
  });

  return response.data.checkoutComplete;
};

export default checkoutComplete;
