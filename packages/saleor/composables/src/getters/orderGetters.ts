import { UserOrderGetters, AgnosticOrderStatus } from '@vue-storefront/core';
import { Order, OrderLine, OrderStatus } from '@vue-storefront/saleor-api';

export const getOrderDate = (order: Order): string => order?.created || '';

export const getOrderId = (order: Order): string => order?.id || '';

const orderStatusMap = {
  [OrderStatus.Draft]: AgnosticOrderStatus.Open,
  [OrderStatus.Unfulfilled]: AgnosticOrderStatus.Confirmed,
  [OrderStatus.Fulfilled]: AgnosticOrderStatus.Complete,
  [OrderStatus.Canceled]: AgnosticOrderStatus.Cancelled
};

export const getOrderStatus = (order: Order): AgnosticOrderStatus | '' =>
  order?.status ? orderStatusMap[order.status] : '';

export const getOrderPrice = (order: Order): number =>
  order ? order.total.gross.amount : 0;

export const getOrderItems = (order: Order): OrderLine[] => order?.lines || [];

export const getOrderItemSku = (item: OrderLine): string =>
  item?.variant.id || '';

export const getOrderItemName = (item: OrderLine): string =>
  item?.variant.name || '';

export const getOrderItemQty = (item: OrderLine): number => item?.quantity || 0;

export const getOrderItemPrice = (item: OrderLine): number =>
  item ? item.variant.price.amount : 0;

export const getFormattedPrice = (price: number) => (price as any) as string;

const orderGetters: UserOrderGetters<Order, OrderLine> = {
  getDate: getOrderDate,
  getId: getOrderId,
  getStatus: getOrderStatus,
  getPrice: getOrderPrice,
  getItems: getOrderItems,
  getItemSku: getOrderItemSku,
  getItemName: getOrderItemName,
  getItemQty: getOrderItemQty,
  getItemPrice: getOrderItemPrice,
  getFormattedPrice
};

export default orderGetters;
