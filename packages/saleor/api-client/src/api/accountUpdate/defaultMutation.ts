import gql from 'graphql-tag';
import { DefaultUserFragment } from '../../fragments';

export default gql`
  ${DefaultUserFragment}

  mutation accountUpdate($input: AccountInput!) {
    accountUpdate(input: $input) {
      user {
        ...DefaultUserFragment
      }
      accountErrors {
        field
        message
        code
      }
    }
  }
`;
