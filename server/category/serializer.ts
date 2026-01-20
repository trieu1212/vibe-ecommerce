export const categorySerializer = {
  serializeCategory(category: any) {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      parentId: category.parentId,
      productCount: category._count?.products || 0,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  },

  serializeCategories(categories: any[]) {
    return categories.map((category) => this.serializeCategory(category));
  },

  serializeCategoryList(data: { categories: any[]; total: number }) {
    return {
      categories: this.serializeCategories(data.categories),
      total: data.total,
    };
  },
};
