import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const addToCart = async (newCart: any) => {
  const response = await axios.post(
    `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/cart/item/add`,
    newCart,
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // send cookies
    },
  );
  return response.data;
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
  // No need to manually set token/guestId headers if backend uses cookies
  const response = await axios.get(
    `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/cart`,
    {
      withCredentials: true, // send cookies
    },
  );
  return response.data;
};

export const useCartItems = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
  });
};

const removeFromCart = async (itemId: string) => {
  const response = await axios.delete(
    `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/cart/item/remove/${itemId}`,
    {
      withCredentials: true, 
    },
  );
  return response.data;
}

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};


const updateCartItemQuantity = async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
  const response = await axios.patch(
    `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/cart/item/update/${itemId}`,
    { quantity },
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    },
  );
  return response.data;
}

export const useUpdateCartItemQuantity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCartItemQuantity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
