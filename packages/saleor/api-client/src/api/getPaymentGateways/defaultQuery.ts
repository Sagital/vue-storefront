import gql from 'graphql-tag';

export default gql`  
  query paymentGateways($token: UUID!) {
    checkout(token: $token) {
      availablePaymentGateways {
        id
        name
        config {
          field
          value
        }
      }
    }
  }
`;
