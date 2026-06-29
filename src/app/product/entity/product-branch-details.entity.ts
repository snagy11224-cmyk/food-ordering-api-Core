export class ProductBranchDetails {
  id: number;
  branchId: number;
  productId: number;
  price: number;
  stock: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<ProductBranchDetails>) {
    this.id = data.id!;
    this.branchId = data.branchId!;
    this.productId = data.productId!;
    this.price = data.price ?? 0;
    this.stock = data.stock ?? 0;
    this.isAvailable = data.isAvailable ?? false;
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
  }
}