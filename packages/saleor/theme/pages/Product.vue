<template>
  <div id="product">
    <SfBreadcrumbs
      class="breadcrumbs desktop-only"
      :breadcrumbs="breadcrumbs"
    />
    <div class="product">
      <LazyHydrate when-idle>
        <SfGallery :images="productGallery" class="product__gallery" />
      </LazyHydrate>

      <div class="product__info">
        <div class="product__header">
          <SfHeading
            :title="productGetters.getName(product)"
            :level="3"
            class="sf-heading--no-underline sf-heading--left"
          />
          <SfIcon
            icon="drag"
            size="xxl"
            color="var(--c-text-disabled)"
            class="product__drag-icon smartphone-only"
          />
        </div>
        <div class="product__price-and-rating">
          <SfPrice
            v-if="!loading"
            :regular="$n(regularPrice, 'currency')"
            :special="specialPrice && $n(specialPrice, 'currency')"
          />

          <div>
            <div class="product__rating">
            </div>
          </div>
        </div>
        <div>
          <p class="product__description desktop-only">
            <strong>SKU</strong> {{ variant ? variant.sku : ''}}
          </p>

          <SfSelect
            data-cy="product-select_size"
            v-if="variants.length > 1"
            :value="variant.id"
            @input="(variantId) => updateFilter(product, variantId)"
            label="Variant"
            class="sf-select--underlined product__select-size"
            :required="true"
          >
            <SfSelectOption
              v-for="variant in variants"
              :key="variant.id"
              :value="variant.id"
            >
              {{ variant.name }}
            </SfSelectOption>
          </SfSelect>
          <SfAddToCart
            data-cy="product-cart_add"
            :stock="variant? variant.stock : 0"
            v-model="qty"
            :disabled="loading"
            :canAddToCart="variant && variant.stock > 0"
            class="product__add-to-cart"
            @click="addItemToCheckout( product,  parseInt(qty))"
          />
        </div>

        <LazyHydrate when-idle>
          <SfTabs :open-tab="1" class="product__tabs">
            <SfTab data-cy="product-tab_description" title="Description">
              <div class="product__description">
                {{ productGetters.getDescription(product) }}
              </div>
            </SfTab>
            <SfTab
              title="Additional Information"
              data-cy="product-tab_additional"
              class="product__additional-info"
            >
              <div class="product__additional-info">

                <div v-for="attribute in product.attributes">

                  <p class="product__additional-info__title">
                    {{ $t(attribute.attribute.name) }}

                  </p>

                  <p class="product__additional-info__paragraph">
                    {{ attribute.values.length ? attribute.values[0].name : '' }}
                  </p>

                </div>

              </div>
            </SfTab>
          </SfTabs>
        </LazyHydrate>
      </div>
    </div>

    <LazyHydrate when-visible>
      <InstagramFeed/>
    </LazyHydrate>

    <LazyHydrate when-visible>
      <MobileStoreBanner/>
    </LazyHydrate>

  </div>
</template>
<script>
import {
  SfAddToCart,
  SfAlert,
  SfBanner,
  SfBreadcrumbs,
  SfButton,
  SfColor,
  SfGallery,
  SfHeading,
  SfIcon,
  SfImage,
  SfPrice,
  SfProperty,
  SfRating,
  SfSelect,
  SfSticky,
  SfTabs
} from '@storefront-ui/vue';

import InstagramFeed from '~/components/InstagramFeed.vue';
import {ref} from '@vue/composition-api';
import {productGetters, useCart} from '@vue-storefront/saleor';
import MobileStoreBanner from '~/components/MobileStoreBanner.vue';
import LazyHydrate from 'vue-lazy-hydration';
import {ssrRef} from '@nuxtjs/composition-api';

export default {
  name: 'Product',
  transition: 'fade',

  setup(props, context) {

    const qty = ref(1);
    const {id} = context.root.$route.params;
    const {addItem} = useCart();

    const variant = ssrRef(null, 'product-variant-' + id);
    const regularPrice = ssrRef(0, id + 'special-price');
    const specialPrice = ssrRef(0, id + 'regular-price');
    const loading = ssrRef(false, 'variant loading');

    //     const options = computed(() => productGetters.getAttributes(product.value, ['color', 'size']));
    // const configuration = computed(() => productGetters.getAttributes(product.value, ['color', 'size']));
    //    const categories = computed(() => productGetters.getCategoryIds(product.value));

    // TODO: Breadcrumbs are temporary disabled because productGetters return undefined. We have a mocks in data
    // const breadcrumbs = computed(() => productGetters.getBreadcrumbs ? productGetters.getBreadcrumbs(product.value) : props.fallbackBreadcrumbs);
    // const productGallery = computed(() => productGetters.getGallery(product.value).map(img => ({
    //   mobile: { url: img.small },
    //   desktop: { url: img.normal },
    //   big: { url: img.big },
    //   alt: product.value._name || product.value.name
    // })));

    const addItemToCheckout = async (product, qty) => {

      // variant.value will be null at page load
      const activeVariant = variant.value ? variant.value : product.defaultVariant;

      await addItem({product: activeVariant, quantity: qty});
    };

    // TODO couldn't find a way to pass
    const updateFilter = async (product, variantId) => {
      console.log('update filter');

      loading.value = true;

      const newVariant = product.variants.find(v => v.id === variantId);

      variant.value = product.variants.find(v => v.id === variantId);
      //
      const pricing = productGetters.getProductVariantPrice(newVariant);

      regularPrice.value = pricing.regular;
      specialPrice.value = pricing.special;
      loading.value = false;
    };

    return {
      updateFilter,
      variant,
      specialPrice,
      regularPrice,
      qty,
      addItemToCheckout,
      loading,
      productGetters,
      breadcrumbs: []
    };
  },

  async asyncData(context) {

    const product = await context.$vsf.$saleor.api.getProduct({productId: context.params.id});

    const defaultVariant = product.defaultVariant;

    const productGallery = productGetters.getGallery(product).map(img => ({
      mobile: {url: img.small},
      desktop: {url: img.normal},
      big: {url: img.big},
      alt: product.name
    }));

    const pricing = productGetters.getProductVariantPrice(defaultVariant);

    const regularPrice = pricing.regular;
    const specialPrice = pricing.special;

    return {product, productGallery, variant: defaultVariant, variants: product.variants, regularPrice, specialPrice};
  },

  components: {
    SfAlert,
    SfColor,
    SfProperty,
    SfHeading,
    SfPrice,
    SfRating,
    SfSelect,
    SfAddToCart,
    SfTabs,
    SfGallery,
    SfIcon,
    SfImage,
    SfBanner,
    SfSticky,
    SfBreadcrumbs,
    SfButton,
    InstagramFeed,
    MobileStoreBanner,
    LazyHydrate
  }
};
</script>

<style lang="scss" scoped>
#product {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1272px;
    margin: 0 auto;
  }
}

.product {
  @include for-desktop {
    display: flex;
  }

  &__info {
    margin: var(--spacer-sm) auto;
    @include for-desktop {
      max-width: 32.625rem;
      margin: 0 0 0 7.5rem;
    }
  }

  &__header {
    --heading-title-color: var(--c-link);
    --heading-title-font-weight: var(--font-weight--bold);
    --heading-padding: 0;
    margin: 0 var(--spacer-sm);
    display: flex;
    justify-content: space-between;
    @include for-desktop {
      --heading-title-font-weight: var(--font-weight--semibold);
      margin: 0 auto;
    }
  }

  &__drag-icon {
    animation: moveicon 1s ease-in-out infinite;
  }

  &__price-and-rating {
    margin: 0 var(--spacer-sm) var(--spacer-base);
    align-items: center;
    @include for-desktop {
      display: flex;
      justify-content: space-between;
      margin: var(--spacer-sm) 0 var(--spacer-lg) 0;
    }
  }

  &__rating {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: var(--spacer-xs) 0 var(--spacer-xs);
  }

  &__count {
    @include font(
        --count-font,
        var(--font-weight--normal),
        var(--font-size--sm),
        1.4,
        var(--font-family--secondary)
    );
    color: var(--c-text);
    text-decoration: none;
    margin: 0 0 0 var(--spacer-xs);
  }

  &__description {
    @include font(
        --product-description-font,
        var(--font-weight--light),
        var(--font-size--base),
        1.6,
        var(--font-family--primary)
    );
  }

  &__select-size {
    margin: 0 var(--spacer-sm);
    @include for-desktop {
      margin: 0;
    }
  }

  &__colors {
    @include font(
        --product-color-font,
        var(--font-weight--normal),
        var(--font-size--lg),
        1.6,
        var(--font-family--secondary)
    );
    display: flex;
    align-items: center;
    margin-top: var(--spacer-xl);
  }

  &__color-label {
    margin: 0 var(--spacer-lg) 0 0;
  }

  &__color {
    margin: 0 var(--spacer-2xs);
  }

  &__add-to-cart {
    margin: var(--spacer-base) var(--spacer-sm) 0;
    @include for-desktop {
      margin-top: var(--spacer-2xl);
    }
  }

  &__guide,
  &__compare,
  &__save {
    display: block;
    margin: var(--spacer-xl) 0 var(--spacer-base) auto;
  }

  &__compare {
    margin-top: 0;
  }

  &__tabs {
    margin: var(--spacer-lg) auto var(--spacer-2xl);
    --tabs-title-font-size: var(--font-size--lg);
    @include for-desktop {
      margin-top: var(--spacer-2xl);
    }
  }

  &__property {
    margin: var(--spacer-base) 0;

    &__button {
      --button-font-size: var(--font-size--base);
    }
  }

  &__review {
    padding-bottom: 24px;
    border-bottom: var(--c-light) solid 1px;
    margin-bottom: var(--spacer-base);
  }

  &__additional-info {
    color: var(--c-link);
    @include font(
        --additional-info-font,
        var(--font-weight--light),
        var(--font-size--sm),
        1.6,
        var(--font-family--primary)
    );

    &__title {
      font-weight: var(--font-weight--normal);
      font-size: var(--font-size--base);
      margin: 0 0 var(--spacer-sm);

      &:not(:first-child) {
        margin-top: 3.5rem;
      }
    }

    &__paragraph {
      margin: 0;
    }
  }

  &__gallery {
    flex: 1;
  }
}

.breadcrumbs {
  margin: var(--spacer-base) auto var(--spacer-lg);
}

@keyframes moveicon {
  0% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, 30%, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}
</style>
