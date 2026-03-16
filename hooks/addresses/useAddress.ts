import { baseApi } from "@/hooks/baseApi";
import { useQuery } from "@tanstack/react-query";

const fetchAddresses = async () => {
  return baseApi("/api/v1/address");
};

export const useAddresses = (token: string | null) => {
  return useQuery({
    queryKey: ["addresses", token], 
    queryFn: fetchAddresses,
    enabled: !!token,
  });
};
