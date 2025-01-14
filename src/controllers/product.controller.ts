import { Request, Response, RequestHandler } from "express";
import ProductService from "../services/product.service";

class ProductController {
  getProducts: RequestHandler = async (req: Request, res: Response) => {
    try {
      const products = await ProductService.getProducts();
      res.status(200).json(products);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to get products" });
    }
  };
}

const productController = new ProductController();
export default productController;