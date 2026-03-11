export interface CartItemResponse {
  id: string;
  items: [
    {
      id: string;
      product:{
        id: string;
        image: string;
        name: string;
        stockquantity: number;
      }
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      unitPriceFormatted: string;
      totalPriceFormatted: string;
    },
]
}