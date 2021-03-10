import query from './defaultQuery';
import gql from 'graphql-tag';
import ApolloClient from 'apollo-client';
import { ShippingMethod } from '../../';

const getShippingMethods = async (
  { client },
  checkoutToken
): Promise<ShippingMethod[]> => {
  const response = await (client as ApolloClient<any>).query({
    query: gql`
      ${query}
    `,
    variables: { token: checkoutToken },
    fetchPolicy: 'no-cache'
  });

  return response.data.checkout.availableShippingMethods;
};

export default getShippingMethods;
