export type Product = Omit<DBProduct & DBStocks, 'product_id'>

export type DBProduct = {
  id: string;
  title: string;
  description: string;
  price: number;
}

export type DBStocks = {
    product_id: string;
    count: number;
}