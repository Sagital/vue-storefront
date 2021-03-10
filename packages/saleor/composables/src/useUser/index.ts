import { params } from './factoryParams';
import { useUserFactory } from '@vue-storefront/core';
import { User } from '@vue-storefront/saleor-api';

export default useUserFactory<User, any, any>(params);
