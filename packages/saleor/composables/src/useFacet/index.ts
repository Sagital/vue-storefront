import {
  useFacetFactory,
  FacetSearchResult,
  Context
} from '@vue-storefront/core';
import { enhanceProduct } from './../helpers/internals';
import { FacetResultsData } from '../types';

// TODO: move to the config file
const ITEMS_PER_PAGE = [20, 40, 100];

const factoryParams = {
  search: async (
    context: Context,
    params: FacetSearchResult<FacetResultsData>
  ): Promise<FacetResultsData> => {
    const itemsPerPage = params.input.itemsPerPage;

    const category = await context.$saleor.api.getCategory({
      slug: params.input.categorySlug
    });

    // TODO input filters
    // const inputFilters = params.input.filters;
    // const filters = Object.keys(inputFilters).reduce((prev, curr) => ([
    //   ...prev,
    //   ...inputFilters[curr].map(value => ({ type: AttributeType.STRING, name: curr, value }))
    // ]), []);

    const products = await context.$saleor.api.getProduct({
      catId: category.id,
      limit: itemsPerPage,
      offset: (params.input.page - 1) * itemsPerPage
      //    filters
      // TODO: https://github.com/DivanteLtd/vue-storefront/issues/4857
      // sort: params.sort
    });

    const productVariants = enhanceProduct(products);

    // TODO facets
    // const facets = getFiltersFromProductsAttributes(products);

    return {
      products: productVariants,
      categories: [category],
      facets: {},
      total: productVariants.length,
      perPageOptions: ITEMS_PER_PAGE,
      itemsPerPage
    };
  }
};

export default useFacetFactory<FacetResultsData>(factoryParams);
