export class Product {
  id: number;
  restaurantId: number;
  categoryId: number | null;
  name: string;
  description: string | null;
  imageUrl: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Product>) {
    this.id = data.id!;
    this.restaurantId = data.restaurantId!;
    this.categoryId = data.categoryId ?? null;
    this.name = data.name!;
    this.description = data.description ?? null;
    this.imageUrl = data.imageUrl ?? null;
    this.deletedAt = data.deletedAt ?? null;
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
  }
}