import { Product } from '@declarations/Product';
import { productsMock } from '@mocks/productsMock';

export class ProductsStorage {
  private products: Product[] = productsMock;

  async getProducts(): Promise<Product[]> {
    return this.products;
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const product = this.products.find((product) => product.id === id);

    return product;
  }
}

export const productsStorage = new ProductsStorage();
