import gql from 'graphql-tag';
import { DefaultGuestCheckoutFragment } from '../../fragments';

export default gql`
  ${DefaultGuestCheckoutFragment}

  mutation checkoutBillingAddressUpdate(
    $checkoutId: ID!
    $billingAddress: AddressInput!
  ) {
    checkoutBillingAddressUpdate(
      checkoutId: $checkoutId
      billingAddress: $billingAddress
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
