import { Request, Response, NextFunction } from "express";
import { ProductService, productService } from "../service/product.service";

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

}

export const productController =
  new ProductController(productService);