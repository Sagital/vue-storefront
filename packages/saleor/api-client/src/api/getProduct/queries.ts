import gql from 'graphql-tag';
import { DefaultProductVariantFragment } from '../../fragments';

const productsQuery = gql`
  query Products(
    $filter: ProductFilterInput
    $first: Int
    $after: String
    $sortBy: ProductOrder
  ) {
    products(filter: $filter, first: $first, after: $after, sortBy: $sortBy) {
      edges {
        node {
          id
          slug
          name
          thumbnail {
            url
            alt
          }
          slug
          defaultVariant {
            id
            name
            sku
            pricing {
              price {
                net {
                  currency
                  amount
                }
              }
              discount {
                net {
                  currency
                  amount
                }
              }
            }
          }
          images {
            id
            url
            alt
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

const productQuery = gql`
  ${DefaultProductVariantFragment}
  query Product($id: ID) {
    product(id: $id) {
      id
      seoTitle
      category {
        id
      }
      seoDescription
      name
      description
      descriptionJson
      slug
      thumbnail {
        url
        alt
      }
      attributes {
        attribute {
          name
        }
        values {
          name
        }
      }
      updatedAt
      images {
        id
        url
        alt
      }
      variants {
        ...DefaultProductVariantFragment
      }
      defaultVariant {
        ...DefaultProductVariantFragment
      }
    }
  }
`;

export { productQuery, productsQuery };
