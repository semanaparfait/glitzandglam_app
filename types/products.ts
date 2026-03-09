export interface ProductTypeResponse {
  id: string;
  images: string[];
  name: string;
  description: string;
  category: {
    id: string;
    name: string;
    image: string;
  };
    price: number;
    priceFormatted: string;
    oldPrice: number;
    oldPriceFormatted: string;
    stockQuantity: number;
    ingredients: string;

}