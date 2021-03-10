import gql from 'graphql-tag';
import { DefaultGuestCheckoutFragment } from '../../fragments';
import { DefaultUserFragment } from '../../fragments';

export default gql`
  ${DefaultUserFragment}
  ${DefaultGuestCheckoutFragment}

  mutation tokenVerify($token: String!) {
    tokenVerify(token: $token) {
      user {
        ...DefaultUserFragment
        checkout {
          ...DefaultGuestCheckout
        }
      }
      accountErrors {
        field
        code
        message
      }
    }
  }
`;
