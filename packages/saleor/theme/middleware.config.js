module.exports = {
  integrations: {
    saleor: {
      location: '@vue-storefront/saleor-api/server',
      configuration: {
        api: {
          uri: 'https://api.cablu.io/graphql/',
          scopes: [
            'manage_products:vsf-ct-dev',
            'create_anonymous_token:vsf-ct-dev',
            'manage_my_profile:vsf-ct-dev',
            'manage_customer_groups:vsf-ct-dev',
            'view_categories:vsf-ct-dev',
            'introspect_oauth_tokens:vsf-ct-dev',
            'manage_my_payments:vsf-ct-dev',
            'manage_my_orders:vsf-ct-dev',
            'manage_my_shopping_lists:vsf-ct-dev',
            'view_published_products:vsf-ct-dev'
          ]
        },
        currency: 'USD',
        country: 'US'
      }
    }
  }
};
