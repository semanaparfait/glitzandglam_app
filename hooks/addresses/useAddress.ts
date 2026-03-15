import {useQuery} from '@tanstack/react-query'
import {baseApi} from '@/hooks/baseApi'

const fetchAddresses = async () => {
  return baseApi('/api/v1/address');
};

export const useAddresses = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: fetchAddresses,
  });
};

     