import { RestaurantService,restaurantService } from "../service/restaurant.service";
import { NextFunction, Request, Response } from 'express';
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateRestaurantDTO } from "../dto/restaurant.dto";
import { UpdateRestaurantDTO } from "../dto/restaurant.dto";

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


create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = plainToInstance(CreateRestaurantDTO, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      return res.status(400).json({ error: "Validation error" });
    }

    const result = await this.restaurantService.createWithOwner(req.user, dto);

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};



update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const restaurantId = Number(req.params.id);

    const dto = plainToInstance(UpdateRestaurantDTO, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      return res.status(400).json({ error: "Validation error" });
    }

    const result = await this.restaurantService.update(
      (req as any).user,
      restaurantId,
      dto
    );

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};



}

export const restaurantController=new RestaurantController(restaurantService);