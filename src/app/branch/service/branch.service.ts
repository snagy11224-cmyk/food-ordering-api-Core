import { CreateBranchDTO, UpdateBranchDTO } from './../dto/branch.dto';
import {  UserUnauthorizedError } from "../../auth/errors";
import { findRestaurantById } from "../../restaurant/repository/restaurant.repo";
import { SystemRole } from "../../user/enums";
import { Branch } from "../entity/branch.entity";
import { createBranch, findNearbyBranches , findBranchesByRestaurant, updateBranch, findBranchById } from "../repository/branch.repository";
import { BranchNotFoundError, RestauranNotFoundError } from '../errors';

export class BranchService {

    //create branch restaurant
  create = async (
    restaurantId: number,
    userId:number,
    userRole:SystemRole,
    data:CreateBranchDTO
  ): Promise<Branch> => {

//if loggeed in user is not admin orr restaurant_owner , throw unauthorized err
    //1- find restaurant 
    const restaurant= await findRestaurantById(restaurantId)
     
     
  if (!restaurant) {
    throw RestauranNotFoundError;
  }

  console.log({
  userId,
  userRole,
  restaurantOwnerId: restaurant?.ownerId,
  restaurantId,
});
    //2- check role 
const isAdmin = userRole === SystemRole.SYSTEM_ADMIN;
const isOwner = Number(restaurant.ownerId) === Number(userId);
if (!isAdmin && !isOwner) {
  throw UserUnauthorizedError;
}
    
    //ELSE call the create function
       const now = new Date();

        const branch: Branch = await createBranch({
        restaurantId: restaurantId,

        label: data.label,
        countryCode: data.countryCode,

        lat: data.lat,
        lng: data.lng,

        addressText: data.addressText,

        isActive: false,

        opensAt: data.opensAt,
        closesAt: data.closesAt,

        currency: data.currency,

        deliveryRadius: data.deliveryRadius,

        commission: 0,

        createdAt: now,
        updatedAt: now,

        acceptOrders: true,
        });
    return branch;
  };


  //find near by barnch
  findNearby = async (lat: number, lng: number) => {
    const rows = await findNearbyBranches(lat, lng);

    return rows.map((row) => ({
      id: row.id,
      restaurantId: row.restaurant_id,
      countryCode: row.country_code,
      addressText: row.address_text,
      label: row.label,
      lat: Number(row.lat),
      lng: Number(row.lng),
      isActive: row.is_active,
      acceptOrders: row.accept_orders,
      deliveryRadius: row.delivery_radius,
      currency: row.currency,
      commission: row.commission,

      restaurantName: row.name,
      restaurantLogoUrl: row.logo_url,
      distanceMeters: Number(row.distance_meters),
    }));
  };



  findByRestaurant = async (restaurantId: number) => {
  const branches = await findBranchesByRestaurant(restaurantId);

  return {
    data: branches.map((branch) => ({
      id: branch.id,
      restaurantId: branch.restaurantId,
      label: branch.label,
      countryCode: branch.countryCode,
      addressText: branch.addressText,
      lat: branch.lat,
      lng: branch.lng,
      isActive: branch.isActive,
      opensAt: branch.opensAt,
      closesAt: branch.closesAt,
      acceptOrders: branch.acceptOrders,
      deliveryRadius: branch.deliveryRadius,
      currency: branch.currency,
      commission: branch.commission,
    })),
  };
};

update = async (
  branchId: number,
  userId: number,
  userRole: SystemRole,
  data: UpdateBranchDTO
) => {
  const branch = await findBranchById(branchId);

  if (!branch) {
    throw BranchNotFoundError;
  }

  const restaurant = await findRestaurantById(branch.restaurantId);

  if (!restaurant) {
    throw RestauranNotFoundError;
  }

  const isAdmin = userRole === SystemRole.SYSTEM_ADMIN;
  const isOwner = Number(restaurant.ownerId) === Number(userId);

  if (!isAdmin && !isOwner) {
    throw UserUnauthorizedError;
  }

  const updatedBranch = await updateBranch(branchId, {
    label: data.label,
    addressText: data.addressText,
    lat: data.lat,
    lng: data.lng,
    opensAt: data.opensAt,
    closesAt: data.closesAt,
    deliveryRadius: data.deliveryRadius,
    currency: data.currency,
    acceptOrders: data.acceptOrders,
  });

  return {
    message: "Branch updated successfully",
    branch: updatedBranch,
  };
};

}

export const branchService = new BranchService();