import {
  AgnosticCategoryTree,
  AgnosticGroupedFacet,
  AgnosticPagination,
  AgnosticSort,
  AgnosticBreadcrumb,
  AgnosticFacet
} from '@vue-storefront/core';
import { getCategoryTree as buildCategoryTree } from './categoryGetters';
import {
  buildBreadcrumbs,
  buildFacets,
  reduceForGroupedFacets,
  reduceForFacets
} from '../useFacet/_utils';
import { SearchData } from '../types';
import { Category, ProductVariant } from '@vue-storefront/saleor-api';

const getAll = (searchData: SearchData, criteria?: string[]): AgnosticFacet[] =>
  buildFacets(searchData, reduceForFacets, criteria);

const getGrouped = (
  searchData: SearchData,
  criteria?: string[]
): AgnosticGroupedFacet[] =>
  buildFacets(searchData, reduceForGroupedFacets, criteria);

// we might want to adapt this for different product type
const getSortOptions = (): AgnosticSort => {
  const options = [
    { type: 'sort', id: 'latest', value: 'Latest', count: null },
    {
      type: 'sort',
      id: 'price-up',
      value: 'Price from low to high',
      count: null
    },
    {
      type: 'sort',
      id: 'price-down',
      value: 'Price from high to low',
      count: null
    }
  ];

  return { options, selected: null };
};

const getCategoryTree = (searchData: SearchData): AgnosticCategoryTree => {
  if (!searchData.data) {
    return {} as any;
  }

  return buildCategoryTree(searchData.data.categories[0]);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getProducts = (searchData: SearchData): ProductVariant[] => {
  return null;
};

const getPagination = (searchData: SearchData): AgnosticPagination => {
  if (!searchData.data) {
    return {} as any;
  }

  return {
    currentPage: searchData.input.page,
    endCursor: searchData.data.pageInfo?.endCursor,
    hasNextPage: searchData.data.pageInfo?.hasNextPage,
    totalPages: Math.ceil(searchData.data.total / searchData.data.itemsPerPage),
    totalItems: searchData.data.total,
    itemsPerPage: searchData.input.itemsPerPage,
    pageOptions: searchData.data.perPageOptions
  };
};

const getBreadcrumbs = (category: Category): AgnosticBreadcrumb[] => {
  if (!category) {
    return [];
  }

  return [
    { text: 'Home', link: '/' },
    ...buildBreadcrumbs(category).map((b) => ({
      ...b,
      link: `/c${b.link}`
    }))
  ];
};

const facetGetters = {
  getSortOptions,
  getGrouped,
  getAll,
  getProducts,
  getCategoryTree,
  getBreadcrumbs,
  getPagination
};

export default facetGetters;
