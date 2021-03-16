import gql from 'graphql-tag';
import { DefaultProductVariantFragment } from '../../fragments';

export default gql`
  ${DefaultProductVariantFragment}

  mutation checkoutLinesAdd(
    $checkoutId: ID!
    $variantId: ID!
    $quantity: Int!
  ) {
    checkoutLinesAdd(
      checkoutId: $checkoutId
      lines: [{ quantity: $quantity, variantId: $variantId }]
    ) {
      checkout {
        id
        token
        email
        lines {
          id
          quantity
          variant {
            ...DefaultProductVariantFragment
            product {
              id
              id
              name
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
              images {
                id
                url
                alt
              }
            }
          }
        }
        shippingPrice {
          net {
            amount
            currency
          }
        }
        quantity
        totalPrice {
          net {
            amount
          }
          gross {
            amount
          }
        }
      }
      checkoutErrors {
        field
        code
        message
      }
    }
  }
`;
