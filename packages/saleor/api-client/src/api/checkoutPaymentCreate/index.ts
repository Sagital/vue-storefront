import defaultMutation from './defaultMutation';
import gql from 'graphql-tag';
import { CheckoutPaymentCreate, PaymentInput } from '../../';

const checkoutPaymentCreate = async (
  { client },
  checkoutId: string,
  paymentInput: PaymentInput
): Promise<CheckoutPaymentCreate> => {
  const variables = {
    checkoutId,
    input: paymentInput
  };

  const response = await client.mutate({
    mutation: gql`
      ${defaultMutation}
    `,
    variables,
    fetchPolicy: 'no-cache'
  });

  return response.data.checkoutPaymentCreate;
};

export default checkoutPaymentCreate;
