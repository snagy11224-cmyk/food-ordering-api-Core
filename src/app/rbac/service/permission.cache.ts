import { hoursToMs } from "../../../common/time/time";
import { getPermissionsByRoleName } from "../repository/permission.repo";

class PermissionCacheService {

  // roleName -> permissions + cache timestamp
  private cache = new Map<
    string,
    {
      permissions: string[];
      cachedAt: number;
    }
  >();

  // cache expires after 1 hour
  private readonly TTL = hoursToMs(1);

  async getPermissions(
    roleName: string
  ): Promise<string[]> {

    // check cache first
    const cached = this.cache.get(roleName);

    // cache hit and not expired
    if (
      cached &&
      Date.now() - cached.cachedAt < this.TTL
    ) {
      return cached.permissions;
    }

    // cache miss -> fetch from database
    const permissions =
      await getPermissionsByRoleName(roleName);

    // store in cache
    this.cache.set(roleName, {
      permissions,
      cachedAt: Date.now(),
    });

    return permissions;
  }



  hasPermission(
    permissions: string[],
    resource: string,
    action: string
): boolean {

    return permissions.includes(
        `${resource}:${action}`
    );
}
}

export const permissionCache =
  new PermissionCacheService();