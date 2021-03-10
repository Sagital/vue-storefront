import gql from 'graphql-tag';

export default gql`
  mutation accountRegister($input: AccountRegisterInput!) {
    accountRegister(input: $input) {
      user {
        id
        email
      }
      requiresConfirmation
      accountErrors {
        field
        message
        code
      }
    }
  }
`;
