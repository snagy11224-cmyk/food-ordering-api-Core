import { AddressType } from "../enums";
export class CustomerAddress {
  id: number;
  userId: number;
  addressLine1: string;
  label: string;
  country: string;
  city: string;
  street: string;
  building?: string|undefined;
  apartmentNumber?: string|undefined;
  type:AddressType; 
  lat: number; 
  lng: number;          
  isDefault: boolean;
  createdAt: Date;
  updatedAt:Date

  constructor(data: Partial<CustomerAddress>) {
    this.id = data.id!;
    this.userId = data.userId!;
    this.addressLine1 = data.addressLine1!;
    this.label = data.label!;
    this.country = data.country!;
    this.city = data.city!;
    this.street = data.street!;

    this.building = data.building;
    this.apartmentNumber = data.apartmentNumber;

    this.type = data.type!;
    this.lat = data.lat!;
    this.lng = data.lng!;

    this.isDefault = data.isDefault!;

    this.createdAt = data.createdAt!;
    this.updatedAt = data.updatedAt!;
  }



  isHome(): boolean {
    return this.type === AddressType.HOME;
  }

  isOffice(): boolean {
    return this.type === AddressType.OFFICE;
  }

  isPublic(): boolean {
    return this.type === AddressType.PUBLIC;
  }

  isDefaultAddress(): boolean {
    return this.isDefault;
  }
}
