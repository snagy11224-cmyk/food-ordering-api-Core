import { Router } from "express";
import { addressController } from "../address/controller/address.controller";
import { authenticate } from "../../common/auth/guard";

export const addressRouter= Router();
addressRouter.get("/addresses", authenticate, addressController.getCustomerAddress);
addressRouter.post("/addresses",authenticate,addressController.addCustomerAddress);
addressRouter.patch("/addresses/:addressId",authenticate,addressController.updateCustomerAddress);
addressRouter.delete("/addresses/:addressId",authenticate,addressController.deleteCustomerAddress);