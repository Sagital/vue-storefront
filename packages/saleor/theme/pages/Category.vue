<template>
  <div id="category">
    <SfBreadcrumbs
      class="breadcrumbs desktop-only"
      :breadcrumbs="breadcrumbs"
    />
    <div class="navbar section">
      <div class="navbar__aside desktop-only">
        <LazyHydrate never>
          <SfHeading
            :level="3"
            :title="$t('Categories')"
            class="navbar__title"/>
        </LazyHydrate>
      </div>

      <div class="navbar__main">
        <LazyHydrate on-interaction>
          <SfButton
            class="sf-button--text navbar__filters-button"
            data-cy="category-btn_filters"
            aria-label="Filters"
            @click="toggleFilterSidebar"
          >
            <SfIcon
              size="24px"
              color="dark-secondary"
              icon="filter2"
              class="navbar__filters-icon"
              data-cy="category-icon_"
            />
            {{ $t('Filters') }}
          </SfButton>
        </LazyHydrate>

        <div class="navbar__sort desktop-only">
          <span class="navbar__label">{{ $t('Sort by') }}:</span>
          <LazyHydrate on-interaction>
            <SfSelect
              v-model="sortBy"
              placeholder="Select sorting"
              data-cy="category-select_sortBy"
              class="navbar__select"
              @input="() =>changeSorting(category)"
            >
              <SfSelectOption
                v-for="option in sortOptions.options"
                :key="option.id"
                :value="option.id"
                class="sort-by__option"
              >{{ option.value }}
              </SfSelectOption
              >
            </SfSelect>
          </LazyHydrate>
        </div>

        <div class="navbar__counter">
          <span class="navbar__label desktop-only">{{ $t('Products found') }}: </span>
          <span class="desktop-only">{{ pagination.totalItems }}</span>
          <span class="navbar__label smartphone-only">{{ pagination.totalItems }} {{ $t('Items') }}</span>
        </div>

        <div class="navbar__view">
          <span class="navbar__view-label desktop-only">{{ $t('View') }}</span>
          <SfIcon
            data-cy="category-icon_grid-view"
            class="navbar__view-icon"
            :color="isCategoryGridView ? 'black' : 'dark-secondary'"
            icon="tiles"
            size="12px"
            role="button"
            aria-label="Change to grid view"
            :aria-pressed="isCategoryGridView"
            @click="toggleCategoryGridView"
          />
          <SfIcon
            data-cy="category-icon_list-view"
            class="navbar__view-icon"
            :color="!isCategoryGridView ? 'black' : 'dark-secondary'"
            icon="list"
            size="12px"
            role="button"
            aria-label="Change to list view"
            :aria-pressed="!isCategoryGridView"
            @click="toggleCategoryGridView"
          />
        </div>
      </div>
    </div>

    <div class="main section">
      <div class="sidebar desktop-only">
        <SfAccordion
          :open="activeCategory"
          :show-chevron="true"
        >
          <SfAccordionItem
            v-for="(cat, i) in categoryTree && categoryTree.items"
            :key="i"
            :header="cat.label"
          >
            <template>
              <SfList class="list">
                <SfListItem class="list__item">
                  <SfMenuItem
                    :count="cat.count || ''"
                    :data-cy="`category-link_subcategory_${cat.slug}`"
                    :label="cat.label"
                  >
                    <template #label>
                      <nuxt-link
                        :to="localePath(th.getCatLink(cat))"
                        :class="cat.isCurrent ? 'sidebar--cat-selected' : ''"
                      >
                        All
                      </nuxt-link>
                    </template>
                  </SfMenuItem>
                </SfListItem>
                <SfListItem
                  class="list__item"
                  v-for="(subCat, j) in cat.items"
                  :key="j"
                >
                  <SfMenuItem
                    :count="subCat.count || ''"
                    :data-cy="`category-link_subcategory_${subCat.slug}`"
                    :label="subCat.label"
                  >
                    <template #label="{ label }">
                      <nuxt-link
                        :to="localePath(th.getCatLink(subCat))"
                        :class="subCat.isCurrent ? 'sidebar--cat-selected' : ''"
                      >
                        {{ label }}
                      </nuxt-link>
                    </template>
                  </SfMenuItem>
                </SfListItem>
              </SfList>
            </template>
          </SfAccordionItem>
        </SfAccordion>
      </div>

      <div class="products" v-if="!loading">
        <transition-group
          v-if="isCategoryGridView"
          appear
          name="products__slide"
          tag="div"
          class="products__grid"
        >
          <SfProductCard
            data-cy="category-product-card"
            v-if="isCategoryGridView"
            v-for="(product, i) in products"
            :key="productGetters.getSlug(product)"
            :style="{ '--index': i }"
            :title="productGetters.getName(product)"
            :image="productGetters.getCoverImage(product)"
            :regular-price="$n(productGetters.getPrice(product).regular, 'currency')"
            :special-price="productGetters.getPrice(product).special && $n(productGetters.getPrice(product).special, 'currency')"
            :max-rating="5"
            :score-rating="productGetters.getAverageRating(product)"
            :show-add-to-cart-button="true"
            :isOnWishlist="false"
            :isAddedToCart="isInCart({ product })"
            :link="localePath(`/p/${productGetters.getId(product)}/${productGetters.getSlug(product)}`)"
            class="products__product-card"
            @click:wishlist="addItemToWishlist({ product })"
            @click:add-to-cart="addItemToCart({ product, quantity: 1 })"
          />
        </transition-group>
        <transition-group
          v-else
          appear
          name="products__slide"
          tag="div"
          class="products__list"
        >
          <SfProductCardHorizontal
            data-cy="category-product-cart_wishlist"
            v-for="(product, i) in products"
            :key="productGetters.getSlug(product)"
            :style="{ '--index': i }"
            :title="productGetters.getName(product)"
            :description="productGetters.getDescription(product)"
            :image="productGetters.getCoverImage(product)"
            :regular-price="$n(productGetters.getPrice(product).regular, 'currency')"
            :special-price="productGetters.getPrice(product).special && $n(productGetters.getPrice(product).special, 'currency')"
            :max-rating="5"
            :score-rating="3"
            :is-on-wishlist="false"
            class="products__product-card-horizontal"
            @click:wishlist="addItemToWishlist({ product })"
            @click:add-to-cart="addItemToCart({ product, quantity: 1 })"
            :link="localePath(`/p/${productGetters.getId(product)}/${productGetters.getSlug(product)}`)"
          >
            <template #configuration>
              <SfProperty
                class="desktop-only"
                name="Size"
                value="XS"
                style="margin: 0 0 1rem 0;"
              />
              <SfProperty class="desktop-only" name="Color" value="white"/>
            </template>
            <template #actions>
              <SfButton
                class="sf-button--text desktop-only"
                style="margin: 0 0 1rem auto; display: block;"
                @click="() => {}"
              >
                {{ $t('Save for later') }}
              </SfButton>
            </template>
          </SfProductCardHorizontal>
        </transition-group>
      </div>
    </div>

    <LazyHydrate when-visible>
      <SfSidebar
        :visible="isFilterSidebarOpen"
        title="Filters"
        class="sidebar-filters"
        @close="toggleFilterSidebar"
      >
        <div class="filters desktop-only">
        </div>
        <SfAccordion class="filters smartphone-only">
        </SfAccordion>
        <template #content-bottom>
          <div class="filters__buttons">
            <SfButton
              class="sf-button--full-width"
              @click="applyFilters"
            >{{ $t('Done') }}
            </SfButton
            >
            <SfButton
              class="sf-button--full-width filters__button-clear"
              @click="clearFilters"
            >{{ $t('Clear all') }}
            </SfButton
            >
          </div>
        </template>
      </SfSidebar>
    </LazyHydrate>
  </div>
</template>

<script>
import {
  SfSidebar,
  SfButton,
  SfList,
  SfIcon,
  SfHeading,
  SfMenuItem,
  SfFilter,
  SfProductCard,
  SfProductCardHorizontal,
  SfPagination,
  SfAccordion,
  SfSelect,
  SfBreadcrumbs,
  SfLoader,
  SfColor,
  SfProperty
} from '@storefront-ui/vue';

import {ref, onMounted} from '@vue/composition-api';
import {
  useCart,
  useWishlist,
  productGetters,
  facetGetters,
  categoryGetters
} from '@vue-storefront/saleor';
import {useUiHelpers, useUiState} from '~/composables';
import LazyHydrate from 'vue-lazy-hydration';
import Vue from 'vue';
import {ssrRef} from '@nuxtjs/composition-api';

// TODO this needs to be configurable
const ITEMS_PER_PAGE = 40;

// TODO(addToCart qty, horizontal): https://github.com/vuestorefront/storefront-ui/issues/1606
export default {
  transition: 'fade',

  setup(props, context) {

    const th = useUiHelpers();
    const facetParams = th.getFacetsFromURL();

    const uiState = useUiState();
    const {addItem: addItemToCart, isInCart} = useCart();
    const {addItem: addItemToWishlist} = useWishlist();

    const products = ssrRef([], 'products-' + facetParams.categorySlug);
    const loading = ssrRef(false, 'loading-products-' + facetParams.categorySlug);
    const pagination = ssrRef({}, 'category-' + facetParams.categorySlug + '-pageInfo');

    const {changeFilters, isFacetColor} = useUiHelpers();
    const {toggleFilterSidebar} = useUiState();
    const selectedFilters = ref({});

    const sortBy = ref('');

    onMounted(() => {
      context.root.$scrollTo(context.root.$el, 2000);
      // TODO there were the facets here
    });

    const isFilterSelected = (facet, option) => (selectedFilters.value[facet.id] || []).includes(option.id);

    const selectFilter = (facet, option) => {
      if (!selectedFilters.value[facet.id]) {
        Vue.set(selectedFilters.value, facet.id, []);
      }

      if (selectedFilters.value[facet.id].find(f => f === option.id)) {
        selectedFilters.value[facet.id] = selectedFilters.value[facet.id].filter(f => f !== option.id);
        return;
      }

      selectedFilters.value[facet.id].push(option.id);
    };

    // we are passing category here cause I didn't find a better way to pass it form asyncData to setup
    const changeSorting = async (category) => {

      const params = {
        first: ITEMS_PER_PAGE,
        catId: category.id,
        sort: [sortBy.value]
      };

      const {edges} = await context.root.$vsf.$saleor.api.queryProducts(params);
      products.value = edges.map(e => e.node);
    };

    const clearFilters = () => {
      toggleFilterSidebar();
      selectedFilters.value = {};
      changeFilters(selectedFilters.value);
    };

    const applyFilters = () => {
      toggleFilterSidebar();
      changeFilters(selectedFilters.value);
    };

    return {
      ...uiState,
      th,
      changeSorting,
      sortBy,
      products,
      loading,
      productGetters,
      pagination,
      addItemToWishlist,
      addItemToCart,
      isInCart,
      isFacetColor,
      selectFilter,
      isFilterSelected,
      selectedFilters,
      clearFilters,
      applyFilters
    };
  },
  components: {
    SfButton,
    SfSidebar,
    SfIcon,
    SfList,
    SfFilter,
    SfProductCard,
    SfProductCardHorizontal,
    SfPagination,
    SfMenuItem,
    SfAccordion,
    SfSelect,
    SfBreadcrumbs,
    SfLoader,
    SfColor,
    SfHeading,
    SfProperty,
    LazyHydrate
  },

  async asyncData(context) {

    // TODO: this need to change in subcategories
    const rootCatSlug = context.params.slug_1;
    const category = await context.$vsf.$saleor.api.getCategory({slug: rootCatSlug});
    const categoryTree = categoryGetters.getTree(category);

    // TODO At some point we want to add the sorting params in the query (without reloading the page!) so that the user
    // can go back and see the products sorted in the same order
    const params = {
      first: ITEMS_PER_PAGE,
      catId: category.id,
      sort: []
    };

    const {edges, pageInfo} = await context.$vsf.$saleor.api.queryProducts(params);

    // TODO change this when we add pagination
    pageInfo.totalItems = edges.length;

    const initialProducts = edges.map(e => e.node);
    const sortOptions = facetGetters.getSortOptions(category);

    const breadcrumbs = facetGetters.getBreadcrumbs(category);

    return {
      categoryTree,
      products: initialProducts,
      activeCategory: category.slug,
      sortOptions,
      category,
      breadcrumbs,
      pagination: pageInfo
    };
  }

};
</script>

<style lang="scss" scoped>
#category {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: 0 auto;
  }
}

.main {
  &.section {
    padding: var(--spacer-xs);
    @include for-desktop {
      padding: 0;
    }
  }
}

.breadcrumbs {
  margin: var(--spacer-base) auto var(--spacer-lg);
}

.navbar {
  position: relative;
  display: flex;
  border: 1px solid var(--c-light);
  border-width: 0 0 1px 0;
  @include for-desktop {
    border-width: 1px 0 1px 0;
  }

  &.section {
    padding: var(--spacer-sm);
    @include for-desktop {
      padding: 0;
    }
  }

  &__aside,
  &__main {
    display: flex;
    align-items: center;
    padding: var(--spacer-sm) 0;
  }

  &__aside {
    flex: 0 0 15%;
    padding: var(--spacer-sm) var(--spacer-sm);
    border: 1px solid var(--c-light);
    border-width: 0 1px 0 0;
  }

  &__main {
    flex: 1;
    padding: 0;
    justify-content: space-between;
    @include for-desktop {
      padding: var(--spacer-xs) var(--spacer-xl);
    }
  }

  &__title {
    --heading-title-font-weight: var(--font-weight--semibold);
    --heading-title-font-size: var(--font-size--xl);
  }

  &__filters-icon {
    margin: 0 0 0 var(--spacer-xs);
    order: 1;
    @include for-desktop {
      margin: 0 var(--spacer-xs) 0 0;
      order: 0;
    }
  }

  &__filters-button {
    display: flex;
    align-items: center;
    --button-font-size: var(--font-size--base);
    --button-text-decoration: none;
    --button-color: var(--c-link);
    --button-font-weight: var(--font-weight--normal);
    @include for-mobile {
      --button-font-weight: var(--font-weight--medium);
      order: 2;
    }

    svg {
      fill: var(--c-text-muted);
      transition: fill 150ms ease;
    }

    &:hover {
      svg {
        fill: var(--c-primary);
      }
    }
  }

  &__label {
    font-family: var(--font-family--secondary);
    font-weight: var(--font-weight--normal);
    color: var(--c-text-muted);
    @include for-desktop {
      color: var(--c-link);
      margin: 0 var(--spacer-2xs) 0 0;
    }
  }

  &__select {
    --select-width: 220px;
    --select-padding: 0;
    --select-height: auto;
    --select-selected-padding: 0 var(--spacer-lg) 0 var(--spacer-2xs);
    --select-margin: 0;
    --select-option-font-size: var(--font-size-sm);
    --select-error-message-height: 0;

    ::v-deep .sf-select__dropdown {
      font-size: var(--font-size-sm);
      font-family: var(--font-family--secondary);
      font-weight: var(--font-weight--light);
      margin: 0;
    }

    ::v-deep .sf-select__placeholder {
      --select-option-font-size: var(--font-size-sm);
    }
  }

  &__sort {
    display: flex;
    align-items: center;
    margin: 0 auto 0 var(--spacer-2xl);
  }

  &__counter {
    font-family: var(--font-family--secondary);
    order: 1;
    @include for-desktop {
      margin: auto 0 auto auto;
      order: 0;
    }
  }

  &__view {
    display: flex;
    align-items: center;
    order: 0;
    @include for-desktop {
      margin: 0 0 0 var(--spacer-2xl);
      order: 0;
    }

    &-icon {
      cursor: pointer;
      margin: 0 var(--spacer-base) 0 0;

      &:last-child {
        margin: 0;
      }
    }

    &-label {
      margin: 0 var(--spacer-sm) 0 0;
      font: var(--font-weight--normal) var(--font-size--base) / 1.6 var(--font-family--secondary);
      text-decoration: none;
      color: var(--c-link);
    }
  }
}

.sort-by {
  flex: unset;
  width: 11.875rem;
}

.main {
  display: flex;
}

.sidebar {
  flex: 0 0 15%;
  padding: var(--spacer-sm);
  border: 1px solid var(--c-light);
  border-width: 0 1px 0 0;
}

.sidebar-filters {
  --overlay-z-index: 3;
  --sidebar-title-display: none;
  --sidebar-top-padding: 0;
  @include for-desktop {
    --sidebar-content-padding: 0 var(--spacer-xl);
    --sidebar-bottom-padding: 0 var(--spacer-xl);
  }
}

.list {
  --menu-item-font-size: var(--font-size--sm);

  &__item {
    &:not(:last-of-type) {
      --list-item-margin: 0 0 var(--spacer-sm) 0;
    }

    .nuxt-link-exact-active {
      text-decoration: underline;
    }
  }
}

.products {
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 0;

  &__grid {
    justify-content: center;
    @include for-desktop {
      justify-content: flex-start;
    }
  }

  &__grid,
  &__list {
    display: flex;
    flex-wrap: wrap;
  }

  &__product-card {
    --product-card-title-margin: var(--spacer-base) 0 0 0;
    --product-card-title-font-weight: var(--font-weight--medium);
    --product-card-title-margin: var(--spacer-xs) 0 0 0;
    flex: 1 1 50%;
    @include for-desktop {
      --product-card-title-font-weight: var(--font-weight--normal);
      --product-card-add-button-bottom: var(--spacer-base);
      --product-card-title-margin: var(--spacer-sm) 0 0 0;
    }
  }

  &__product-card-horizontal {
    flex: 0 0 100%;
    @include for-mobile {
      ::v-deep .sf-image {
        --image-width: 5.3125rem;
        --image-height: 7.0625rem;
      }
    }
  }

  &__slide-enter {
    opacity: 0;
    transform: scale(0.5);
  }

  &__slide-enter-active {
    transition: all 0.2s ease;
    transition-delay: calc(0.1s * var(--index));
  }

  @include for-desktop {
    &__grid {
      margin: var(--spacer-sm) 0 0 var(--spacer-sm);
    }
    &__pagination {
      display: flex;
      justify-content: flex-start;
      margin: var(--spacer-xl) 0 0 0;
    }
    &__product-card-horizontal {
      margin: var(--spacer-lg) 0;
    }
    &__product-card {
      flex: 1 1 25%;
    }
    &__list {
      margin: 0 0 0 var(--spacer-sm);
    }
  }

  &__show-on-page {
    display: flex;
    justify-content: flex-end;
    align-items: baseline;

    &__label {
      font-family: var(--font-family--secondary);
      font-size: var(--font-size--sm);
    }
  }
}

.loading {
  margin: var(--spacer-3xl) auto;
  @include for-desktop {
    margin-top: 6.25rem;
  }

  &--categories {
    @include for-desktop {
      margin-top: 3.75rem;
    }
  }
}

::v-deep .sf-sidebar__aside {
  --sidebar-z-index: 3;
}

.sf-button__button-center {
  margin: var(--spacer-xl) auto var(--spacer-base) auto;
  width: 16rem;
}

.filters {
  &__title {
    --heading-title-font-size: var(--font-size--xl);
    margin: var(--spacer-xl) 0 var(--spacer-base) 0;

    &:first-child {
      margin: calc(var(--spacer-xl) + var(--spacer-base)) 0 var(--spacer-xs) 0;
    }
  }

  &__colors {
    display: flex;
  }

  &__color {
    margin: var(--spacer-xs) var(--spacer-xs) var(--spacer-xs) 0;
  }

  &__chosen {
    color: var(--c-text-muted);
    font-weight: var(--font-weight--normal);
    font-family: var(--font-family--secondary);
    position: absolute;
    right: var(--spacer-xl);
  }

  &__item {
    --radio-container-padding: 0 var(--spacer-sm) 0 var(--spacer-xl);
    --radio-background: transparent;
    --filter-label-color: var(--c-secondary-variant);
    --filter-count-color: var(--c-secondary-variant);
    --checkbox-padding: 0 var(--spacer-sm) 0 var(--spacer-xl);
    padding: var(--spacer-sm) 0;
    border-bottom: 1px solid var(--c-light);

    &:last-child {
      border-bottom: 0;
    }

    @include for-desktop {
      --checkbox-padding: 0;
      margin: var(--spacer-sm) 0;
      border: 0;
      padding: 0;
    }
  }

  &__accordion-item {
    --accordion-item-content-padding: 0;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    width: 100vw;
  }

  &__buttons {
    margin: var(--spacer-sm) 0;
  }

  &__button-clear {
    --button-background: var(--c-light);
    --button-color: var(--c-dark-variant);
    margin: var(--spacer-xs) 0 0 0;
  }
}
</style>
