/* eslint-disable */
import {
  mapConfigToSetupObject,
  SALEOR_TOKEN_COOKIE_NAME,
  SALEOR_GUEST_CHECKOUT_TOKEN_COOKIE_NAME
} from '@vue-storefront/saleor/nuxt/helpers';
import { integrationPlugin } from '@vue-storefront/core';

const moduleOptions = JSON.parse('<%= JSON.stringify(options) %>');

export default integrationPlugin(({ app, integration }) => {
  const onTokenChange = (newToken) => {
    try {
      const currentToken = app.$cookies.get(SALEOR_TOKEN_COOKIE_NAME);

      // TODO change token here

      if (
        !currentToken ||
        currentToken.access_token !== newToken.access_token
      ) {
        app.$cookies.set(SALEOR_TOKEN_COOKIE_NAME, newToken);
      }
    } catch (e) {
      // Cookies on is set after request has sent.
    }
  };

  const setGuestCheckoutToken = (checkoutToken) => {
    app.$cookies.set(SALEOR_GUEST_CHECKOUT_TOKEN_COOKIE_NAME, checkoutToken);
  };

  const removeGuestCheckoutToken = () => {
    app.$cookies.remove(SALEOR_GUEST_CHECKOUT_TOKEN_COOKIE_NAME);
  };

  const getGuestCheckoutToken = () => {
    return app.$cookies.get(SALEOR_GUEST_CHECKOUT_TOKEN_COOKIE_NAME);
  };

  const onTokenRemove = () => {
    app.$cookies.remove(SALEOR_TOKEN_COOKIE_NAME);
  };

  const onTokenRead = () => {
    console.log('ON TOKEN READ');
    console.log(process.browser);
    return app.$cookies.get(SALEOR_TOKEN_COOKIE_NAME);
  };

  const settings = mapConfigToSetupObject({
    moduleOptions,
    app,
    additionalProperties: {
      auth: {
        onTokenChange,
        onTokenRead,
        onTokenRemove
      },
      setGuestCheckoutToken,
      getGuestCheckoutToken,
      removeGuestCheckoutToken
    }
  });

  integration.configure('saleor', settings);
});
