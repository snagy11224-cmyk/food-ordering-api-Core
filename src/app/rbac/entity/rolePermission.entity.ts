export class RolePermission {
  roleId: number;
  permissionId: number;
  createdAt: Date;

  constructor(data: Partial<RolePermission>) {
    this.roleId = data.roleId!;
    this.permissionId = data.permissionId!;
    this.createdAt = data.createdAt ?? new Date();
  }
}