import {
  Category,
  Filter,
  PageInfo,
  ProductCountableConnection
} from '@vue-storefront/saleor-api';
import { FacetSearchResult } from '@vue-storefront/core';

export type OrderSearchParams = {
  id?: string;
  page?: number;
  perPage?: number;
};

export interface ProductsSearchParams {
  perPage?: number;
  page?: number;
  first?: number;
  sort?: any;
  term?: any;
  endCursor?: string;
  filters?: Record<string, Filter>;
  catId?: string | string[];
  skus?: string[];
  slug?: string;
  id?: string;
}

export interface FacetResultsData {
  products: ProductCountableConnection;
  categories: Category[];
  pageInfo: PageInfo;
  facets: Record<string, Filter>;
  total: number;
  perPageOptions: number[];
  itemsPerPage: number;
}

export type SearchData = FacetSearchResult<FacetResultsData>;
