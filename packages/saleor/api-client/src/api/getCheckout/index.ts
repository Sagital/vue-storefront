import { Checkout } from '../../';
import gql from 'graphql-tag';
import ApolloClient from 'apollo-client';
import query from './defaultQuery';

const getCheckout = async ({ client }, token: string): Promise<Checkout> => {
  const variables = {
    token: token
  };

  const response = await (client as ApolloClient<any>).query({
    query: gql`
      ${query}
    `,
    variables,
    // temporary, seems like bug in apollo:
    // @link: https://github.com/apollographql/apollo-client/issues/3234
    fetchPolicy: 'no-cache'
  });

  if (response.data.checkout?.email === 'dummy@example.com') {
    // we don't report the dummy email to the client
    response.data.checkout.email = null;
  }

  console.log('GETTING REMOTE CHECKOUT');

  return response.data.checkout;
};

export default getCheckout;
