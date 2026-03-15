export interface CheckoutData {
  shippingAddressSnapshot: {
    fullName: string;
    phoneNumber: string;
    email: string;
    country: string;
    state: string;
    city: string;
    province: string;
    district: string;
    sector: string;
    addressLine1: string;
    postalCode?: string;
  };
  saveAddress?: boolean; 
  phoneNumber: string;
}