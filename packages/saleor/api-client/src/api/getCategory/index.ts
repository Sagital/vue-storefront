import gql from 'graphql-tag';
import ApolloClient from 'apollo-client';
import query from './defaultQuery';
import { Category } from '../..';

const getCategory = async (context, params): Promise<Category> => {
  const variables = {
    slug: params.slug
  };

  const request = await (context.client as ApolloClient<any>).query({
    query: gql`
      ${query}
    `,
    variables,
    fetchPolicy: 'no-cache'
  });

  return request.data.category;
};

export default getCategory;
