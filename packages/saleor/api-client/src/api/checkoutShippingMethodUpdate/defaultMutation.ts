import gql from 'graphql-tag';
import { DefaultGuestCheckoutFragment } from '../../fragments';

export default gql`
  ${DefaultGuestCheckoutFragment}

  mutation checkoutShippingMethodUpdate(
    $checkoutId: ID!
    $shippingMethodId: ID!
  ) {
    checkoutShippingMethodUpdate(
      checkoutId: $checkoutId
      shippingMethodId: $shippingMethodId
    ) {
      checkout {
        ...DefaultGuestCheckout
      }
      checkoutErrors {
        field
        code
        message
      }
    }
  }
`;
