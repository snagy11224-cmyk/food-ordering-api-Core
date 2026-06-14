import { CreateAddressDTO, UpdateAddressDTO } from '../dto/address.dto';
import {AddressType} from '../enums';
import {findAddressesByUserId, insertCustomerAddressTransaction , updateCustomerAddresses} from'../repository/address.repo';
import {addressNotFoundError} from '../errors';

type AddressResponse = {
  id: number;  
  label: string;
  country: string;
  city: string;  
  street: string;
  building?: string;
  apartmentNumber?: string;  
  type: AddressType;
  lat: number;
  lng:number;
  isDefault:boolean;
  
};
type GetAddressResponse = {
  data: AddressResponse[];
};
 export type AddressMutationResponse  = {
  message: string;
  address: AddressResponse;
};

export class AddressService {

//get customer address logic 
  getCustomerAddresses = async (userId:number): Promise<GetAddressResponse> => {

    //call get address details funstion mn repo 
  const addresses = await findAddressesByUserId(userId);

    //return result
  return {
  data: addresses.map((address) => (
    {
    id: address.id,
    label: address.label,
    country: address.country,
    city: address.city,
    street: address.street,
    building: address.building,
    apartmentNumber: address.apartmentNumber,
    type: address.type,
    lat: address.lat,
    lng: address.lng,
    isDefault: address.isDefault,
  }
)),
};  
  };



  
 addCustomerAddress = async (userId: number, data: CreateAddressDTO): Promise<AddressMutationResponse > => { 
    //call create address from repo 
    const row=await insertCustomerAddressTransaction(userId,data);
    //return result
  return{
    message:"Address Added",
    address: {
    id: row.id,
    label: row.label,
    country: row.country,
    city: row.city,
    street: row.street,
    building: row.building,
    apartmentNumber: row.apartmentNumber,
    type: row.type,
    lat: row.lat,
    lng: row.lng,
    isDefault: row.isDefault,
}
}
}


updateCustomerAddress = async (userId: number,addressId: number,data: UpdateAddressDTO): Promise<AddressMutationResponse > => { 
    //call update address from repo 
    const address=await updateCustomerAddresses(userId,addressId,data);

    //address exists?
    if (!address) {
  throw addressNotFoundError;
}
    //return result
  return{
    message:"Address updated",
    address: {
    id: address.id,
    label: address.label,
    country: address.country,
    city: address.city,
    street: address.street,
    building: address.building,
    apartmentNumber: address.apartmentNumber,
    type: address.type,
    lat: address.lat,
    lng: address.lng,
    isDefault: address.isDefault,
}
}
}

}
export const addressService=new AddressService();