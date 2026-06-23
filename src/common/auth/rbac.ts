import { UnauthorizedError, UserUnauthorizedError } from './../../app/auth/errors';
import { Request,Response,NextFunction } from "express";
export interface RBACoptions{
resource:string,
action :string,
allowSystemAdmin ?:boolean,
checkOwnership ? :boolean
}

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

      console.log("USER IN RBAC", req.user);
  console.log("RBAC OPTIONS", options);
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
    if (allowSystemAdmin && req.user.role === SystemRole.SYSTEM_ADMIN) {
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
          return;
        }  

        return next()
}
    // if not restaurant user -> throw err
res.status(403).json({
            error: "Permission denied",
          });

          return 

          
}catch(error){
    next(error)
}

};
}




export function requireRestaurantMember(paramName:string='restaurantId'){
    return async (
    req: Request,
    res: Response,
    next: NextFunction
  )=>{
    const restaurantId=parseInt(req.params[paramName] as string)
 
  if(!restaurantId){
 res.status(400).json({
    "message":"something went wrong"
});
return;
  }


if (Number(req.user?.restaurantId) !== restaurantId) {

    if (req.user?.role === SystemRole.SYSTEM_ADMIN) {
        return next();
    }

   res.status(403).json({
        error: "Permission denied",
    });
    return;
     
}

return next();

}

}




export function requireBranchAccess(
  paramName: string = "branchId"
) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {

    // user must be authenticated
    if (!req.user) {
      throw UserUnauthorizedError;
    }

    // get branch id from route
    const branchId = parseInt(
      req.params[paramName] as string
    );

    if (!branchId) {
      res.status(400).json({
        error: "Invalid branch id",
      });
      return;
    }

    // system admin bypass
    if (req.user.role === SystemRole.SYSTEM_ADMIN) {
      return next();
    }

    // check if user has access to this branch
    if (
      !req.user.branchIds ||
      !req.user.branchIds.includes(branchId)
    ) {
      res.status(403).json({
  error: "Permission denied",
});
return;
    }

    return next();
  };
}