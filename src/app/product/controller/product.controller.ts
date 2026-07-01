import { Request, Response, NextFunction } from "express";
import { ProductService, productService } from "../service/product.service";
import { SystemRole } from "../../user/enums";
import { CreateProductDTO } from "../dto/product.dto";
import { validateBody } from "../../../common/validation/validate";


export class ProductController {

  constructor(
    private readonly productService: ProductService
  ) {}

  findCategories = async (
    req: Request<{ restaurantId: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {

      const categories =
        await this.productService.findCategories(
          Number(req.params.restaurantId)
        );

      res.status(200).json({
        data: categories,
      });

    } catch (err) {
      next(err);
    }
  };


  findByBranch = async (
  req: Request<{ branchId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await this.productService.findByBranch(
      Number(req.params.branchId)
    );

    res.status(200).json({
      data: products,
    });
  } catch (err) {
    next(err);
  }
};


findByRestaurant = async (
  req: Request<{ restaurantId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await this.productService.findByRestaurant(
      Number(req.params.restaurantId),
      req.user?.userId!,
      req.user?.role! as SystemRole
    );

    res.status(200).json({
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

findById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await this.productService.findById(
      Number(req.params.id)
    );

    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

create = async (
  req: Request<{ restaurantId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await validateBody(CreateProductDTO, req.body);

    const result = await this.productService.create(
      Number(req.params.restaurantId),
      req.user?.userId!,
      req.user?.role! as SystemRole,
      data
    );

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

}

export const productController =
  new ProductController(productService);