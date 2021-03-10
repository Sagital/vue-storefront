import gql from 'graphql-tag';
import { DefaultGuestCheckoutFragment } from '../../fragments';

export default gql`
  ${DefaultGuestCheckoutFragment}

  mutation checkoutShippingAddressUpdate(
    $checkoutId: ID!
    $shippingAddress: AddressInput!
  ) {
    checkoutShippingAddressUpdate(
      checkoutId: $checkoutId
      shippingAddress: $shippingAddress
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
