import mutation from './defaultMutation';
import gql from 'graphql-tag';
import ApolloClient from 'apollo-client';
import { OrderCountableConnection } from '../..';

const getOrders = async ({
  config,
  client
}): Promise<OrderCountableConnection> => {
  const token = config.auth.onTokenRead();

  // TODO pagination
  const variables = {
    token: token,
    first: 100
  };

  const response = await (client as ApolloClient<any>).mutate({
    mutation: gql`
      ${mutation}
    `,
    variables,
    fetchPolicy: 'no-cache'
  });

  return response.data.tokenVerify.orders;
};

export default getOrders;
