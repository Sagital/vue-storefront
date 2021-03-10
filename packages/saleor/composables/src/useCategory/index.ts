import {
  Context,
  UseCategory,
  useCategoryFactory,
  UseCategoryFactoryParams
} from '@vue-storefront/core';
import { Category } from '@vue-storefront/saleor-api';

const params: UseCategoryFactoryParams<Category, any> = {
  categorySearch: async (
    context: Context,
    { customQuery, ...searchParams }
  ) => {
    const categoryResponse = await context.saleor.api.getCategory(
      searchParams,
      customQuery
    );
    return categoryResponse.data.categories.results;
  }
};

const useCategory: (
  id: string
) => UseCategory<Category, any> = useCategoryFactory<Category, any>(params);

export default useCategory;
