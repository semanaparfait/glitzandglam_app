import Header from "@/components/header";
import { useAddresses } from "@/hooks/addresses/useAddress";
import { useCartItems } from "@/hooks/cart/useCart";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Checkout() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "cash" | "phoneNumber"
  >("phoneNumber");
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const {
    data: addresses,
    isLoading: isAddressesLoading,
    error: addressesError,
  } = useAddresses(token);
  const router = useRouter();
  const { data: cartItems, isLoading, error } = useCartItems();

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem("auth_token");
      setToken(storedToken);
    };

    loadToken();
  }, []);

  const subtotal = useMemo(
    () =>
      cartItems?.items?.reduce(
        (sum: number, item: any) => sum + item.totalPrice,
        0,
      ) ?? 0,
    [cartItems],
  );

  const addressList = useMemo(() => {
    if (Array.isArray(addresses)) return addresses;
    if (Array.isArray((addresses as any)?.data)) return (addresses as any).data;
    return [];
  }, [addresses]);

  if (isLoading) {
    return <Text>Loading cart to checkout...</Text>;
  }
  if (error) {
    return <Text>Error loading cart items</Text>;
  }

  return (
    <SafeAreaView className="flex-1 bg-surafce" edges={["top"]}>
      <Header title="Checkout" showBackButton />
      <ScrollView className="px-4 mt-4 flex-1">
        <View>
          <Text className="font-bold text-lg mb-3">Shipping Address</Text>
          {selectedAddress ? (
            <View className="border-dashed border-2 border-gray-300 rounded-md p-6 mb-6 bg-white items-center justify-center">
              <Text className="font-bold items-center justify-center">
                {selectedAddress}
              </Text>
            </View>
          ) : (
            <>
              {isAddressesLoading && (
                <Text className="text-gray-500 mb-3">Loading addresses...</Text>
              )}

              {addressesError && (
                <Text className="text-red-500 mb-3">
                  Failed to load addresses.
                </Text>
              )}

              {!isAddressesLoading &&
                !addressesError &&
                addressList.map((address: any) => (
                  <View
                    key={address.id}
                    className="flex-row  justify-between bg-white shadow rounded-lg py-2 px-4 mb-3 "
                  >
                    <View className=" items-center justify-between mb-3">
                      <View className="flex-row items-center gap-2 mb-1">
                        <Ionicons name="home" size={20} color="#6b7280" />
                        <Text className="font-bold text-base">Home</Text>
                        <Text className="bg-gray-200 py-1.5 font-semibold px-4 rounded-md">
                          {address.isDefault ? "Default" : "Not Default"}
                        </Text>
                      </View>
                      <Text>
                        {" "}
                        {address.addressLine1}, {address.city},{" "}
                        {address.country}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-4">
                      <Ionicons name="pencil" size={20} color="#6b7280" />
                      <Ionicons name="trash" size={20} color="red" />
                    </View>
                  </View>
                ))}

              {!isAddressesLoading &&
                !addressesError &&
                addressList.length === 0 && (
                  <Text className="text-gray-500 mb-3">
                    No saved addresses yet.
                  </Text>
                )}

              <TouchableOpacity
                onPress={() => router.push("/addresses")}
                className="border-dashed border-2 border-gray-300 rounded-md p-6 mb-6 bg-white items-center justify-center"
              >
                <Text className="font-bold items-center justify-center">
                  <Ionicons name="add" size={20} /> Add Address
                </Text>
                {/* <Text>{selectedAddress ? selectedAddress : "Add Address"}</Text> */}
              </TouchableOpacity>
            </>
          )}
        </View>
        {/* ----------------payments---------------- */}
        <Text className="font-bold text-lg mb-3">Payment Method</Text>
        <View className="  gap-4 mb-6">
          <TouchableOpacity
            onPress={() => setSelectedPaymentMethod("phoneNumber")}
            className={`bg-white p-4 rounded-xl mb-2 shadow-sm  flex-row items-center  border-2  ${
              selectedPaymentMethod === "phoneNumber"
                ? "border-primary "
                : "border-transparent"
            }`}
          >
            <Ionicons name="phone-portrait" size={20} color="#6b7280" />
            <View className="ml-2 flex-1">
              <Text className="font-bold text-base">Phone Number</Text>
              <Text className="text-sm mt-1">
                Pay with MOMO or Airtel Money
              </Text>
            </View>
            {selectedPaymentMethod === "phoneNumber" && (
              <Ionicons name="checkmark-circle" size={24} color="#907764" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedPaymentMethod("cash")}
            className={`bg-white p-4 rounded-xl mb-4 shadow-sm  flex-row items-center  border-2${
              selectedPaymentMethod === "cash"
                ? "border-primary "
                : "border-transparent "
            }`}
          >
            <Ionicons name="cash-outline" size={20} color="#6b7280" />
            <View className="ml-2 flex-1">
              <Text className="font-bold text-base">Cash on Delivery</Text>
              <Text className="text-sm mt-1">
                Pay when you receive the package
              </Text>
            </View>
            {selectedPaymentMethod === "cash" && (
              <Ionicons name="checkmark-circle" size={24} color="#907764" />
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* ---------summary----------- */}
      <View>
        <View className="p-4 border-t bg-white shadow-lg border-gray-100">
          <Text className="text-lg font-bold mb-4">Order Summary</Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-400">subTotal</Text>
            <Text className="font-bold">{subtotal.toLocaleString()} RWF</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-400">Tax</Text>
            <Text className="font-bold">0.00 FRW</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="font-bold text-xl">Total</Text>
            <Text className="font-bold text-xl ">
              {subtotal.toLocaleString()} RWF
            </Text>
          </View>
          <TouchableOpacity className="bg-primary py-3 rounded-full mt-4">
            <Text className="text-white text-center font-bold text-lg">
              Place Order
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
