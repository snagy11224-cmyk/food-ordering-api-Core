import { Request,Response,NextFunction } from "express";
export interface RBACoptions{
resource:string,
action :string,
allowSystemAdmin :boolean,
checkOwnership:boolean
}


import { UnauthorizedError } from "../../app/auth/errors";
import { SystemRole } from "../../app/user/enums";
import { permissionCache } from "../../app/rbac/service/permission.cache";
// check for permissions
// system admin bypass this
// restaurant users must have permissions for their role
// router.post('/products', authenticate, rbac({resource:"product",action:"create"}), productController.create

export function rbac(options: RBACoptions) {

 return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {



try{
    // req.user is there , if not we will bail
if (!req.user) {
   throw UnauthorizedError;
}



      const {
        resource,
        action,
        allowSystemAdmin = true,
        checkOwnership = false,
      } = options;


    // if he is a system admin -> bypass
    if (allowSystemAdmin && req.user.role == SystemRole.SYSTEM_ADMIN) {
        return next();
      }


    // if restaurant user
    // 1. fetch permissions
    // 2. check if the permissions has the action for this resource
    // 3. if you are updating/acting on your assigned restaurant id
    // pass
    if(req.user.role === SystemRole.RESTAURANT_USER) {

    const permissions : string[] =
        await permissionCache.getPermissions(req.user.restaurantRole!);

    if(!permissionCache.hasPermission(
        permissions,
        resource,
        action
    )) {
          res.status(403).json({
            error: "Permission denied",
          });
        }  

        next()
}
    // if not restaurant user -> throw err
res.status(403).json({
            error: "Permission denied",
          });
}catch(error){
    next(error)
}

};
}