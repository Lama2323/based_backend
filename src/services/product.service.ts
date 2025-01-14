import { supabase } from '../utils/supabase'

class ProductService {
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
}

const productService = new ProductService();
export default productService;