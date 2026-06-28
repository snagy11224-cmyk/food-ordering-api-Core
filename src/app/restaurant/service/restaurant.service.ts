import { Knex } from "knex";
import { registerRestaurantDto } from "../../auth/dto/auth.dto";
import { Restaurant } from "../entity/restaurant.entity";
import { RestaurantStatus } from "../enums/restaurant.enums";
import { createRestaurant, findAllRestaurants, findRestaurantById,updateRestaurant } from "../repository/restaurant.repo";
import { RestaurantMember } from "../../rbac/entity/restaurant.member.entity";
import { MemberStatus, RestaurantRole } from "../../rbac/enums";
import { createRestaurantMember } from "../../rbac/repository/restaurant.member.repository";
import { RestauranNotFoundError } from "../../branch/errors";
import bcrypt from "bcrypt";
import { db } from "../../../common/knex/knex";
import { CreateRestaurantDTO } from "../dto/restaurant.dto";
import { User } from "../../user/entity/user.entity";
import { SystemRole } from "../../user/enums";
import { createUser, findUserExistsByEmailOrPhone } from "../../user/repository/users.repo";
import { OwnerRoleNotFoundError, RestauratntCreationError } from "../error";
import { findRoleByName } from "../../rbac/repository/role.repo";
import { userAlreadyExistsError } from "../../auth/errors";
import { UpdateRestaurantDTO } from "../dto/restaurant.dto";

export class RestaurantService{

//craete restaurant service function
//this will be called in the auth.service inside the register function
create=async (userId:number , data:registerRestaurantDto, trx:Knex):Promise<Restaurant> =>
{
const now=new Date();
const restaurant = new Restaurant(
     {
        ownerId:userId,
        name:data.name,
        logoURL:data.logoUrl,
        primaryCountry:data.primaryCountry,
        status:RestaurantStatus.PENDING,
        createdAt:now,
        updatedAt:now,
        statusUpdatedAt:now

    }
);

const result=await createRestaurant(restaurant, trx);

return result;
}



findAll=async()=>{
    const result= await findAllRestaurants();
    return result;
}

createOwner = async (
  userId: number,
  restaurantId: number,
  trx: Knex
): Promise<RestaurantMember> => {
  const now = new Date();

  const ownerRole = await findRoleByName(RestaurantRole.OWNER);
  if (!ownerRole) {
  throw OwnerRoleNotFoundError;
}
  const member = new RestaurantMember({
    userId,
    restaurantId,
    roleId: ownerRole,
    status: MemberStatus.ACTIVE,
    createdAt: now,
    updatedAt: now,
  });

  const result = await createRestaurantMember(member, trx);

  return result;
};


findById = async (restaurantId: number): Promise<Restaurant> => {
  const restaurant = await findRestaurantById(restaurantId);

  if (!restaurant) {
    throw RestauranNotFoundError;
  }

  return restaurant;
};



createWithOwner = async (
  currentUser: any,
  data: CreateRestaurantDTO
) => {
  if (currentUser.role !== SystemRole.SYSTEM_ADMIN) {
    throw new Error("Permission denied");
  }

  const exists = await findUserExistsByEmailOrPhone(
    data.owner.email,
    data.owner.phone
  );

  if (exists) {
    throw userAlreadyExistsError;
  }

  const trx = await db.transaction();

  try {
    const now = new Date();

    const passwordHash = await bcrypt.hash(data.owner.password, 10);

    const owner = new User({
      email: data.owner.email,
      phone: data.owner.phone,
      name: data.owner.name,
      passwordHash,
      systemRole: SystemRole.RESTAURANT_USER,
      createdAt: now,
      updatedAt: now,
    });

    const createdOwner = await createUser(owner, trx);

    const restaurant = new Restaurant({
      ownerId: createdOwner.id,
      name: data.name,
      logoURL: data.logoUrl,
      primaryCountry: data.primaryCountry,
      status: RestaurantStatus.PENDING,
      createdAt: now,
      updatedAt: now,
      statusUpdatedAt: now,
    });

    const createdRestaurant = await createRestaurant(restaurant, trx);

    if (!createdRestaurant.id) {
       throw RestauratntCreationError;
    }

    await this.createOwner(createdOwner.id, createdRestaurant.id!, trx);

    await trx.commit();

    return {
      message: "Restaurant created successfully",
      restaurant: {
        id: createdRestaurant.id,
        ownerId: createdRestaurant.ownerId,
        name: createdRestaurant.name,
        logoURL: createdRestaurant.logoURL,
        primaryCountry: createdRestaurant.primaryCountry,
        status: createdRestaurant.status,
        createdAt: createdRestaurant.createdAt,
      },
      owner: {
        id: createdOwner.id,
        email: createdOwner.email,
        phone: createdOwner.phone,
        name: createdOwner.name,
        systemRole: createdOwner.systemRole,
      },
    };
  } catch (err) {
    await trx.rollback();
    throw err;
  }
};



update = async (
  currentUser: any,
  restaurantId: number,
  data: UpdateRestaurantDTO
) => {
  const restaurant = await findRestaurantById(restaurantId);

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  const isSystemAdmin = currentUser.role === SystemRole.SYSTEM_ADMIN;
  const isOwner = Number(restaurant.ownerId) === Number(currentUser.userId);

  if (!isSystemAdmin && !isOwner) {
    throw new Error("Permission denied");
  }

  const updatedRestaurant = await updateRestaurant(restaurantId, {
    name: data.name,
    logoURL: data.logoUrl,
    primaryCountry: data.primaryCountry,
  });

  return {
    message: "Restaurant updated successfully",
    restaurant: {
      id: updatedRestaurant.id,
      name: updatedRestaurant.name,
      logoURL: updatedRestaurant.logoURL,
      primaryCountry: updatedRestaurant.primaryCountry,
      status: updatedRestaurant.status,
      updatedAt: updatedRestaurant.updatedAt,
    },
  };
};

}


export const  restaurantService=new RestaurantService()