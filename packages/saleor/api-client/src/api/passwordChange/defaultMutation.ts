import gql from 'graphql-tag';
import { DefaultUserFragment } from '../../fragments';

export default gql`
  ${DefaultUserFragment}

  mutation passwordChange($newPassword: String!, $oldPassword: String!) {
    passwordChange(newPassword: $newPassword, oldPassword: $oldPassword) {
      ...DefaultUserFragment
    }
  }
`;
