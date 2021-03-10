import { BaseSearch } from '@vue-storefront/saleor-api';

export default ({
  page,
  perPage
}: {
  perPage?: number;
  page?: number;
  sort?: any;
  term?: any;
  filters?: any;
  [_: string]: any;
}): Pick<BaseSearch, 'limit' | 'offset'> | undefined => {
  if (perPage && page) {
    return {
      limit: perPage,
      offset: (page - 1) * perPage
    };
  }
};
