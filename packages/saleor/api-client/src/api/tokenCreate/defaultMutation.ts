import gql from 'graphql-tag';
import { DefaultGuestCheckoutFragment } from '../../fragments';

export default gql`
  ${DefaultGuestCheckoutFragment}

  mutation tokenCreate($email: String!, $password: String!) {
    tokenCreate(email: $email, password: $password) {
      token
      user {
        id
        lastName
        email
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
