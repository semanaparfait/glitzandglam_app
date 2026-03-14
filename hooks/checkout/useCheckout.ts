import {useMutation} from '@tanstack/react-query'
import {CheckoutData} from '@/hooks/checkout/checkoutType'

const checkout = async (checkoutData: CheckoutData) => {
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/checkout`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutData),
    },
  );
    if (!res.ok) {
    let message = 'Checkout failed';

    try {
        const body = await res.json();
        if (typeof body?.message === 'string') {
            message = body.message;
        }
    } catch {
    }

    throw new Error(message);
  }
    return res.json();
};

export const useCheckout = () => {
  return useMutation({
    mutationFn: checkout,
  });
};



