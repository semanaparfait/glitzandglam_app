import {useQuery} from '@tanstack/react-query'

const fetchProducts = async () => {
    const res = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/product`)
    if(!res.ok) {
        throw new Error('Failed to fetch products')
    }
    return res.json()
}

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 5000,
  });
}