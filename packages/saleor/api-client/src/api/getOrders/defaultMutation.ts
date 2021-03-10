import gql from 'graphql-tag';

export default gql`
  mutation UserOrders($token: String!, $first: Int!) {
    tokenVerify(token: $token) {
      user {
        orders(first: $first) {
          edges {
            node {
              id
              created
              total {
                gross {
                  amount
                }
              }
            }
          }
        }
      }
    }
  }
`;
