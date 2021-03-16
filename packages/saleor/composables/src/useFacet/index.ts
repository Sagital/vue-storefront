import {
  useFacetFactory,
  FacetSearchResult,
  Context
} from '@vue-storefront/core';
import { FacetResultsData } from '../types';

// TODO: move to the config file
const ITEMS_PER_PAGE = [10, 50, 100];

const factoryParams = {
  search: async (
    context: Context,
    params: FacetSearchResult<FacetResultsData>
  ): Promise<FacetResultsData> => {
    const itemsPerPage = params.input.itemsPerPage;

    const category = await context.$saleor.api.getCategory({
      slug: params.input.categorySlug
    });

    return {
      products: null,
      pageInfo: null,
      categories: [category],
      facets: {},
      total: 10,
      perPageOptions: ITEMS_PER_PAGE,
      itemsPerPage
    };
  }
};

export default useFacetFactory<FacetResultsData>(factoryParams);
