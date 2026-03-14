import Header from "@/components/header";
import { useAddresses } from "@/hooks/addresses/useAddress";
import { useCartItems } from "@/hooks/cart/useCart";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Checkout() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "cash" | "phoneNumber"
  >("phoneNumber");
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const {
    data: addresses,
    isLoading: isAddressesLoading,
    error: addressesError,
  } = useAddresses();
  const router = useRouter();
  const { data: cartItems, isLoading, error } = useCartItems();

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
      </ScrollView>
    </SafeAreaView>
  );
}
