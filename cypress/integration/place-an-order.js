/* eslint no-undef: 0 */

describe('shopping path', () => {
  beforeEach(() => {
    // cy.visit(
    //   '/p/38143c0c-c9b0-448c-93cd-60eb90d8da57/aspesi-shirt-h805-white'
    // ).wait(2000);
    // cy.url().should('include', '/p/38143c0c-c9b0-448c-93cd-60eb90d8da57/aspesi-shirt-h805-white');
    // cy.get('[data-cy=product-cart_add]').click().wait(500);
    // cy.get('.sf-header__action').eq(2).click();
    // cy.get('[data-cy=cart-sidebar-btn_checkout]').click({ force: true });
    // cy.scrollTo('top');
  });
  afterEach(() => {
    // cy.clearLocalStorage();
    // cy.clearCookies();
    // cy.reload(true);
  });
  it.skip('Place an order as a guest', () => {
    cy.server();

    cy.route('POST', '/api/saleor/getProduct').as('getProduct');
    cy.route('POST', '/api/saleor/checkoutCreate').as('checkoutCreate');
    cy.route('POST', '/api/saleor/checkoutLinesAdd').as('checkoutLinesAdd');
    cy.route('GET', '/api/saleor/isGuest').as('isGuest');
    cy.route('POST', '/api/saleor/updateCheckoutShippingMethod').as(
      'checkoutUpdateShippingMethod'
    );

    cy.visit('/c/accessories');

    cy.contains('Colored Parrot Cushion').click();

    cy.wait('@getProduct');

    cy.contains('Add to cart').click();

    cy.wait('@checkoutCreate');

    cy.get('[data-cy=\'app-header-toggle-cart\']').click();
    cy.contains('Go to checkout').click({ force: true });

    cy.url().should('include', '/checkout/personal-details');

    cy.get('input[id=firstName]')
      .clear()
      .type('John');
    cy.get('input[id=lastName]')
      .clear()
      .type('Doe');
    cy.get('input[id=email]')
      .clear()
      .type('john@doe.com');

    cy.contains('button', 'Continue to shipping').click();

    cy.url().should('include', '/checkout/shipping');

    cy.get('input[name="streetName"]').type('Brannon Avenue');
    cy.get('input[name="apartment"]').type('3232', { force: true });
    cy.get('input[name="city"]').type('Jacksonville');
    cy.get('input[name="postalCode"]').type('32208');
    cy.get('select[id="Country"]').select('US');
    cy.get('input[name="phone"]').type('9047105785');
    cy.get('select[id="State"]').select('FL');

    cy.contains('button', 'Select shipping method').click();

    cy.contains('div', 'DHL').click();
    cy.wait('@checkoutUpdateShippingMethod');

    cy.contains('Continue to payment').click();

    cy.url().should('include', '/checkout/payment');
    cy.contains('Copy address data from shipping').click();
    cy.contains('Select payment method').click();
    cy.contains('button', 'Review my order').click();

    cy.url().should('include', '/checkout/order-review');
    cy.contains('Make an order').click();

    cy.url().should('include', '/checkout/thank-you');
  });

  it('Place an order as a customer', () => {
    cy.server();

    cy.route('POST', '/api/saleor/getProduct').as('getProduct');
    cy.route('POST', '/api/saleor/checkoutCreate').as('checkoutCreate');
    cy.route('POST', '/api/saleor/isGuest').as('isGuest');
    cy.route('POST', '/api/saleor/tokenCreate').as('login');
    cy.route('POST', '/api/saleor/updateCheckoutShippingMethod').as(
      'checkoutUpdateShippingMethod'
    );

    cy.visit('/c/accessories');
    cy.wait(3000);

    cy.get('[data-cy=\'app-header-account\']').click();
    // cy.get(`[data-cy='app-header-toggle-wishlist']`).click({ force: true });

    cy.wait(1000);

    cy.contains('login in to your account').click();

    cy.get('[data-cy=\'login-input_email\']').type('admin@example.com');
    cy.get('[data-cy=\'login-input_password\']').type('admin');
    cy.get('[data-cy=\'login-btn_submit\']').click();

    cy.wait('@login');

    cy.contains('Colored Parrot Cushion').click();

    cy.wait('@getProduct');

    cy.contains('Add to cart').click();

    cy.wait(1000);
    cy.wait('@isGuest');
    // TODO this needs to be done on cleancy.wait('@checkoutCreate');

    cy.get('[data-cy=\'app-header-toggle-cart\']').click();
    // need to be forced only when this is the first order
    cy.contains('Go to checkout').click({ force: true });

    cy.contains('button', 'Select shipping method').click();

    cy.contains('div', 'DHL').click();
    cy.wait('@checkoutUpdateShippingMethod');

    cy.contains('Continue to payment').click();

    cy.url().should('include', '/checkout/payment');
    cy.contains('Copy address data from shipping').click();
    cy.contains('Select payment method').click();
    cy.contains('button', 'Review my order').click();

    cy.url().should('include', '/checkout/order-review');
    cy.contains('Make an order').click();

    cy.url().should('include', '/checkout/thank-you');
  });
});
