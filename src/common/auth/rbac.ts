// check for permissions

// system admin bypass this

// restaurant users must have permissions for their role

// router.post('/products', authenticate, rbac({resource:"product",action:"create"}), productController.create

export function rbac(options: any): void {
    // req.user is there , if not we will bail

    // if he is a system admin -> bypass


    // if restaurant user
    // 1. fetch permissions
    // 2. check if the permissions has the action for this resource
    // 3. if you are updating/acting on your assigned restaurant id
    // pass

    // if not restaurant user -> throw err
}