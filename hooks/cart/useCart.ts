import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("auth_token");

  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`,
  };
};

const addToCart = async (newCart: any) => {
  const authHeaders = await getAuthHeaders();

  const response = await axios.post(
    `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/cart/item/add`,
    newCart,
    {
      headers: { "Content-Type": "application/json", ...authHeaders },
      withCredentials: true,
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
  const authHeaders = await getAuthHeaders();

  const response = await axios.get(
    `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/cart`,
    {
      headers: authHeaders,
      withCredentials: true,
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
  const authHeaders = await getAuthHeaders();

  const response = await axios.delete(
    `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/cart/item/remove/${itemId}`,
    {
      headers: authHeaders,
      withCredentials: true,
    },
  );
  return response.data;
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

const updateCartItemQuantity = async ({
  itemId,
  quantity,
}: {
  itemId: string;
  quantity: number;
}) => {
  const authHeaders = await getAuthHeaders();

  const response = await axios.patch(
    `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/cart/item/update/${itemId}`,
    { quantity },
    {
      headers: { "Content-Type": "application/json", ...authHeaders },
      withCredentials: true,
    },
  );
  return response.data;
};

export const useUpdateCartItemQuantity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCartItemQuantity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
