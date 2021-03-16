import gql from 'graphql-tag';
import ApolloClient from 'apollo-client';
import {
  OrderDirection,
  Product,
  ProductCountableConnection,
  ProductFilterInput,
  ProductOrder,
  ProductOrderField,
  ProductWhereSearch
} from '../../';
import { productsQuery, productQuery } from './queries';

const queryProducts = async (
  context,
  params: ProductWhereSearch
): Promise<ProductCountableConnection> => {
  const filter: ProductFilterInput = {};

  if (params.catId) {
    filter.categories = [params.catId];
  }

  const sortBy: ProductOrder = {
    direction: OrderDirection.Asc,
    field: ProductOrderField.Published
  };

  switch (params.sort?.[0]) {
    case 'price-up':
      sortBy.direction = OrderDirection.Asc;
      sortBy.field = ProductOrderField.MinimalPrice;
      break;

    case 'price-down':
      sortBy.direction = OrderDirection.Desc;
      sortBy.field = ProductOrderField.MinimalPrice;
      break;

    case 'latest':
      sortBy.direction = OrderDirection.Desc;
      sortBy.field = ProductOrderField.PublicationDate;
      break;
  }

  const variables = {
    filter,
    first: params.first || 1,
    after: params.endCursor || '',
    sortBy: sortBy
  };

  const response = await (context.client as ApolloClient<any>).query({
    query: gql`
      ${productsQuery}
    `,
    variables,
    // temporary, seems like bug in apollo:
    // @link: https://github.com/apollographql/apollo-client/issues/3234
    fetchPolicy: 'no-cache'
  });

  return response.data.products;
};

const getProduct = async (context, { productId }): Promise<Product> => {
  const variables = {
    id: productId
  };

  const response = await (context.client as ApolloClient<any>).query({
    query: gql`
      ${productQuery}
    `,
    variables,
    // temporary, seems like bug in apollo:
    // @link: https://github.com/apollographql/apollo-client/issues/3234
    fetchPolicy: 'no-cache'
  });

  return response.data.product;
};

export { getProduct, queryProducts };
