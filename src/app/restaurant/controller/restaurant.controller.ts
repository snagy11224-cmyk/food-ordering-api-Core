import { RestaurantService,restaurantService } from "../service/restaurant.service";
import { NextFunction, Request, Response } from 'express';

export class RestaurantController {
constructor(private readonly restaurantService:RestaurantService){}


getAll= async(req:Request ,res:Response , next:NextFunction)=>{
try{
const result=await this.restaurantService.findAll();
res.status(200).json({data:result});
}
catch(err){
next(err)
}
};

getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const restaurantId = Number(req.params.id);

    const result = await this.restaurantService.findById(restaurantId);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};



}

export const restaurantController=new RestaurantController(restaurantService);