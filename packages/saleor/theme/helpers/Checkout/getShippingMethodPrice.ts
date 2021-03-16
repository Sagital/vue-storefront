import { ShippingMethod } from '@vue-storefront/saleor-api';

export default (shippingMethod: ShippingMethod) => shippingMethod.price.amount;
