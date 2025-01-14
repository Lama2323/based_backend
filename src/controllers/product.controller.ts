import { Request, Response } from "express";
import ProductService from "../services/product.service";

class ProductController {
  async getProducts(req: Request, res: Response) {
    try {
      const products = await ProductService.getProducts();
      return res.status(200).json(products);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to get products" });
    }
  }
}

const productController = new ProductController();
export default productController;
