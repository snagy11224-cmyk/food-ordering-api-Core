import { AddressService ,addressService } from './../service/address.service';
import { NextFunction, Request, Response } from 'express';

export class AddressController {
  constructor(
    private readonly addressService: AddressService
  ) {}

 getCustomerAddress = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
try{

const userId = req.user!.userId;    
const result= await this.addressService.getCustomerAddresses(userId);
res.status(200).json(result);
}catch (err) {
      next(err);
    }

  };



}

export const addressController=new AddressController(addressService);