import { MemberStatus } from "../enums";

export class RestaurantMember {
  id?: number;
  restaurantId: number;
  userId: number;
  roleId: number;
  status: MemberStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<RestaurantMember>) {
    this.id = data.id;
    this.restaurantId = data.restaurantId!;
    this.userId = data.userId!;
    this.roleId = data.roleId!;
    this.status = data.status ?? MemberStatus.ACTIVE;
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
  }

  suspend() {
    this.status = MemberStatus.SUSPENDED;
    this.updatedAt = new Date();
  }

  activate() {
    this.status = MemberStatus.ACTIVE;
    this.updatedAt = new Date();
  }
}