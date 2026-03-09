import {useQuery} from '@tanstack/react-query'

const fetchCategories = async () => {
    const res = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/category`)
    if(!res.ok) {
        throw new Error('Failed to fetch categories')
    }
    return res.json()
}

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5000,
  });
};