import {useMutation,useQuery,useQueryClient } from '@tanstack/react-query'

const addToCart = async (newCart: any) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/cart/item/add`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json',},
    body: JSON.stringify(newCart),
  });
  return response.json();
};


export const useCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

const fetchCart = async () => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/cart`, {
    method: 'GET',
    headers: {'Content-Type': 'application/json',},
  });
  return response.json();
}

export const useCartItems = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: fetchCart
  });
}
