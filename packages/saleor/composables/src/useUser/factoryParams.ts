import {
  UseUserFactoryParams,
  Context,
  UseCart,
  AgnosticCoupon,
  Logger
} from '@vue-storefront/core';

import useCart from '../useCart';
import {
  Checkout,
  CheckoutLine,
  ProductVariant,
  User
} from '@vue-storefront/saleor-api';

type UserContext = UseCart<
  Checkout,
  CheckoutLine,
  ProductVariant,
  AgnosticCoupon
> &
  Context;

const load = async (context: Context): Promise<User> => {
  const isGuest = await context.$saleor.api.isGuest();
  if (isGuest) {
    return null;
  }

  return await context.$saleor.api.getMe();
};

export const params: UseUserFactoryParams<User, any, any> = {
  provide() {
    return useCart();
  },
  load,
  logOut: async (context: UserContext) => {
    await context.$saleor.api.tokenRemove();
    context.setCart(null);
  },
  updateUser: async (
    context: UserContext,
    { updatedUserData }
  ): Promise<User> => {
    // TODO change email?
    const accountInput = {
      firstName: updatedUserData.firstName,
      lastName: updatedUserData.lastName
    };

    const accountUpdate = await context.$saleor.api.accountUpdate(accountInput);

    return accountUpdate.user;
  },
  register: async (
    context: UserContext,
    { email, password }
  ): Promise<User> => {
    try {
      const accountRegister = await context.$saleor.api.accountRegister(
        email,
        password
      );

      return accountRegister.user;
    } catch (err) {
      // TODO : do we ever catch this ?
      err.message = err?.graphQLErrors?.[0]?.message || err.message;
      Logger.error('useUser.authenticate', err.message);
      throw err;
    }
  },

  logIn: async (
    context: UserContext,
    { username, password }
  ): Promise<User> => {
    try {
      const tokenCreateResponse = await context.$saleor.api.tokenCreate(
        username,
        password
      );

      const user = tokenCreateResponse.user;

      if (user.checkout) {
        context.setCart(user.checkout);
      }
      return user;
    } catch (err) {
      err.message = err?.graphQLErrors?.[0]?.message || err.message;
      Logger.error('useUser.authenticate', err.message);
      throw err;
    }
  },
  changePassword: async function changePassword(context: UserContext) {
    // TODO change password
    await context.$saleor.api.tokenRemove();
    return null;
  }
};
