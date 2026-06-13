import {AddressType} from '../enums';
import {findAddressesByUserId} from'../repository/address.repo';
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

export class AddressService {


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



}

export const addressService=new AddressService();