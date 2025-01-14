import { supabase } from '../utils/supabase';
import {
  Product,
  ProductVariant,
  Attribute,
  AttributeValue,
} from '../interfaces';

class ProductService {

  async getAllProducts(): Promise<Product[]> {
    const { data, error }: any = await supabase
      .from('products')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  async getProductById(product_id: string): Promise<
    Product & {
      variants: (ProductVariant & {
        attributes: (Attribute & {
          values: AttributeValue[];
        })[];
      })[];
    }
  > {
    // 1. Lấy thông tin sản phẩm
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('product_id', product_id)
      .single();

    if (productError) {
      throw new Error(productError.message);
    }

    if (!product) {
      throw new Error('Product not found');
    }

    // 2. Lấy các biến thể của sản phẩm (bao gồm cả biến thể mặc định)
    const { data: variants, error: variantsError } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', product_id);

    if (variantsError) {
      throw new Error(variantsError.message);
    }

    if (!variants || variants.length === 0) {
      throw new Error('Product variants not found. This might be a data integrity issue.');
    }

    // 3. Lấy thông tin thuộc tính và giá trị của từng biến thể
    const variantsWithAttributes = await Promise.all(
      variants.map(async (variant) => {
        const { data: variantAttributes, error: variantAttributesError } =
          await supabase
            .from('product_variant_attribute_values')
            .select('attribute_value_id, product_variant_id')
            .eq('product_variant_id', variant.product_variant_id);

        if (variantAttributesError) {
          throw new Error(variantAttributesError.message);
        }

        // Nếu không có thuộc tính, trả về biến thể với mảng attributes rỗng
        if (!variantAttributes || variantAttributes.length === 0) {
          return {
            ...variant,
            attributes: [],
          };
        }

        const attributes = await Promise.all(
          variantAttributes.map(async (va) => {
            // Lấy thông tin attribute_value
            const { data: attributeValue, error: attributeValueError } =
              await supabase
                .from('attribute_values')
                .select('*, attribute_id')
                .eq('attribute_value_id', va.attribute_value_id)
                .single();

            if (attributeValueError) {
              throw new Error(attributeValueError.message);
            }

            // lấy thông tin attribute
            const { data: attribute, error: attributeError } =
              await supabase
                .from('attributes')
                .select('*')
                .eq('attribute_id', attributeValue.attribute_id)
                .single();

            if (attributeError) {
              throw new Error(attributeError.message);
            }

            return {
              ...attribute,
              values: [attributeValue],
            };
          })
        );

        return {
          ...variant,
          attributes,
        };
      })
    );

    return {
      ...product,
      variants: variantsWithAttributes,
    };
  }

  async createProduct(product: Product): Promise<Product> {
    const { data, error }: any = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async updateProduct(product_id: string, product: Product): Promise<Product> {
    const { data, error }: any = await supabase
      .from('products')
      .update(product)
      .eq('product_id', product_id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async deleteProduct(product_id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('product_id', product_id);

    if (error) {
      throw new Error(error.message);
    }
  }
  
}

const productService = new ProductService();
export default productService;