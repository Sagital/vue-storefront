import {
  useUserOrderFactory,
  UseUserOrderFactoryParams,
  Context
} from '@vue-storefront/core';
import { OrderSearchParams } from '../types';
import { Order } from '@vue-storefront/saleor-api';

const params: UseUserOrderFactoryParams<Order[], OrderSearchParams> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  searchOrders: async (context: Context, { customQuery }): Promise<Order[]> => {
    return null;
  }
};

export default useUserOrderFactory<Order[], OrderSearchParams>(params);
