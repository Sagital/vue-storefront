import { Logger } from '@vue-storefront/core';
import { isUserOperation } from './restrictedOperations';

export const handleBeforeAuth = async () => {};

export const handleAfterAuth = async ({ auth, apolloReq, response }) => {
  if (isUserOperation(apolloReq.operationName)) {
    Logger.debug(
      'Apollo authLinkAfter, customerPasswordFlow',
      apolloReq.operationName
    );

    const jwtToken = response.data.tokenCreate.token;

    auth.onTokenChange(jwtToken);

    Logger.debug(
      'Apollo authLinkAfter, customerPasswordFlow, generated token: ',
      jwtToken
    );

    return jwtToken;
  }

  return null;
};

export const handleRetry = () => () => {
  return false;
};
