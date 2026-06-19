import { Currency } from "../enums";

export class Branch {
  id: number;
  restaurantId: number;
  countryCode: string;
  addressText: string;
  label: string;
  lat: number;
  lng: number;
  isActive: boolean;
  opensAt: string;
  closesAt: string;
  acceptOrders: boolean;
  createdAt: Date;
  updatedAt: Date;
  deliveryRadius: number;
  currency: Currency;
  commission: number;

  constructor(data: Partial<Branch>) {
    this.id = data.id!;
    this.restaurantId = data.restaurantId!;
    this.countryCode = data.countryCode!;
    this.addressText = data.addressText!;
    this.label = data.label!;
    this.lat = data.lat!;
    this.lng = data.lng!;
    this.isActive = data.isActive ?? false;
    this.opensAt = data.opensAt!;
    this.closesAt = data.closesAt!;
    this.acceptOrders = data.acceptOrders!;
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
    this.deliveryRadius = data.deliveryRadius??0;
    this.currency = data.currency!;
    this.commission = data.commission??0;
  }

  updateAddress(addressText: string, lat: number, lng: number) {
    this.addressText = addressText;
    this.lat = lat;
    this.lng = lng;
    this.updatedAt = new Date();
  }

  updateOpeningHours(opensAt: string, closesAt: string) {
    this.opensAt = opensAt;
    this.closesAt = closesAt;
    this.updatedAt = new Date();
  }

  updateAcceptOrders(acceptOrders: boolean) {
    this.acceptOrders = acceptOrders;
    this.updatedAt = new Date();
  }

  deactivate() {
    this.isActive = false;
    this.acceptOrders = false;
    this.updatedAt = new Date();
  }

  activate() {
    this.isActive = true;
    this.updatedAt = new Date();
  }
}