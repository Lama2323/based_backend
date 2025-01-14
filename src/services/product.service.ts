import { supabase } from '../utils/supabase'

class ProductService {
  async getAllProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async getProductById(product_id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('product_id', product_id)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
}

const productService = new ProductService();
export default productService;