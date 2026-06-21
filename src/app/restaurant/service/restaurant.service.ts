import { Knex } from "knex";
import { registerRestaurantDto } from "../../auth/dto/auth.dto";
import { Restaurant } from "../entity/restaurant.entity";
import { RestaurantStatus } from "../enums/restaurant.enums";
import { createRestaurant, findAllRestaurants } from "../repository/restaurant.repo";
import { RestaurantMember } from "../../rbac/entity/restaurant.member.entity";
import { MemberStatus } from "../../rbac/enums";
import { createRestaurantMember } from "../../rbac/repository/restaurant.member.repository";

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

  const member = new RestaurantMember({
    userId,
    restaurantId,
    status: MemberStatus.ACTIVE,
    createdAt: now,
    updatedAt: now,
  });

  const result = await createRestaurantMember(member, trx);

  return result;
};


}


export const  restaurantService=new RestaurantService()