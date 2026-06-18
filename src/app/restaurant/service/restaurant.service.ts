import { Knex } from "knex";
import { registerRestaurantDto } from "../../auth/dto/auth.dto";
import { Restaurant } from "../entity/restaurant.entity";
import { RestaurantStatus } from "../enums/restaurant.enums";
import { createRestaurant, findAllRestaurants } from "../repository/restaurant.repo";

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

}


export const  restaurantService=new RestaurantService()