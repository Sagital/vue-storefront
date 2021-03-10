import { IntegrationContext } from '@vue-storefront/core';
import { ClientInstance, ApiInstance, Config } from '@vue-storefront/saleor-api';

declare module '@vue-storefront/core' {
  export interface Context {
    $saleor: IntegrationContext<ClientInstance, Config, ApiInstance>;
  }
}
