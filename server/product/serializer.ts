import { Product } from "@prisma/client";

export const productSerializer = {
  serializeProduct(product: any) {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      comparePrice: product.comparePrice,
      images: JSON.parse(product.images),
      stock: product.stock,
      sku: product.sku,
      category: product.category ? {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
      } : null,
      isFeatured: product.isFeatured,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  },

  serializeProducts(products: any[]) {
    return products.map((product) => this.serializeProduct(product));
  },

  serializeProductList(data: { products: any[]; total: number }) {
    return {
      products: this.serializeProducts(data.products),
      total: data.total,
    };
  },
};
