import { Request, Response, RequestHandler } from "express";
import ProductService from "../services/product.service";

class ProductController {
  getAllProducts: RequestHandler = async (req: Request, res: Response) => {
    try {
      const products = await ProductService.getAllProducts();
      res.status(200).json(products);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to get products" });
    }
  };

  getProductById: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { product_id } = req.params;
      const product = await ProductService.getProductById(product_id);
      res.status(200).json(product);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to get product" });
    }
  };

  createProduct: RequestHandler = async (req: Request, res: Response) => {
    try {
      const product = req.body;
      const newProduct = await ProductService.createProduct(product);
      res.status(201).json(newProduct);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to create product" });
    }
  };

  updateProduct: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { product_id } = req.params;
      const product = req.body;
      const updatedProduct = await ProductService.updateProduct(product_id, product);
      res.status(200).json(updatedProduct);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to update product" });
    }
  };

  deleteProduct: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { product_id } = req.params;
      await ProductService.deleteProduct(product_id);
      res.status(204).end();
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to delete product" });
    }
  };
}

const productController = new ProductController();
export default productController;