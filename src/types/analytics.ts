export type SalesStatistics = {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: ProductSalesInfo[];
  salesByHour: Map<number, number>;
  salesByDay: Map<string, number>;
};

export type ProductSalesInfo = {
  productId: string;
  productName: string;
  totalQuantitySold: number;
  totalRevenue: number;
};
