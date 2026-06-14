import { validateBody } from '../../../common/validation/validate';
import { CreateAddressDTO, UpdateAddressDTO } from '../dto/address.dto';
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



  addCustomerAddress = async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
  try{
   const userId = req.user!.userId; 
  //validate body
  const data=await validateBody(CreateAddressDTO,req.body);
  const result=await addressService.addCustomerAddress(userId,data);
  res.status(201).json(result)
  }catch (err) {
        next(err);
      }
  
    };
  


    
  updateCustomerAddress = async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
  try{
   const userId = req.user!.userId; 
   const addressId = Number(req.params.addressId);

  //validate body
  const data=await validateBody(UpdateAddressDTO,req.body);
  const result=await this.addressService.updateCustomerAddress(userId,addressId,data);
  res.status(200).json(result)
  }catch (err) {
        next(err);
      }
  
    };
  


}

export const addressController=new AddressController(addressService);