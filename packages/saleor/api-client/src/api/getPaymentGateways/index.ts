import defaultQuery from './defaultQuery';
import gql from 'graphql-tag';
import ApolloClient from 'apollo-client';
import { PaymentGateway } from '../..';

const getPaymentGateways = async (
  { client },
  checkoutToken
): Promise<PaymentGateway[]> => {
  const response = await (client as ApolloClient<any>).query({
    query: gql`
      ${defaultQuery}
    `,
    variables: { token: checkoutToken },
    fetchPolicy: 'no-cache'
  });

  return response.data.checkout.availablePaymentGateways;
};

export default getPaymentGateways;
