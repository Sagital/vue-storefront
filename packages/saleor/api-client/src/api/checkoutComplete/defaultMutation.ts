import gql from 'graphql-tag';

export default gql`
  mutation checkoutComplete($checkoutId: ID!) {
    checkoutComplete(checkoutId: $checkoutId) {
      order {
        id
        status
        paymentStatus
      }
      checkoutErrors {
        field
        message
      }
    }
  }
`;
