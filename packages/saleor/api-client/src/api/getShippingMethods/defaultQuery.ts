import gql from 'graphql-tag';

export default gql`  
  query shippingMethods($token: UUID!) {
    checkout(token: $token) {
      availableShippingMethods {
        id
        name
        price {
          amount
        }
      }
    }
  }
`;
