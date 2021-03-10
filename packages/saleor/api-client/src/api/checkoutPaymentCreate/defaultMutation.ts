import gql from 'graphql-tag';

export default gql`
  mutation checkoutPaymentCreate($checkoutId: ID!, $input: PaymentInput!) {
    checkoutPaymentCreate(checkoutId: $checkoutId, input: $input) {
      payment {
        id
        chargeStatus
        isActive
      }
      paymentErrors {
        message
      }
    }
  }
`;
