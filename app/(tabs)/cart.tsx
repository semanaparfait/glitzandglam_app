import Header from "@/components/header";
import {
  useCartItems,
  useRemoveFromCart,
  useUpdateCartItemQuantity,
} from "@/hooks/cart/useCart";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function Cart() {

  function formatCurrency(amount: number) {
    return amount.toLocaleString() + " Frw";
  }

  const { data: cartItems, isLoading, error } = useCartItems();
  const { mutate: removeFromCart } = useRemoveFromCart();
  const { mutate: updateCartItemQuantity } = useUpdateCartItemQuantity();
  const router = useRouter();

  const items = cartItems?.items || [];


  const subtotal = items.reduce(
    (sum: number, item: any) => sum + (item.totalPrice || 0),
    0,
  );
  const subtotalFormatted = formatCurrency(subtotal);

  const handleRemove = (itemId: string) => {
    removeFromCart(itemId);
    Toast.show({
      type: "success",
      text1: "Item removed from cart",
    });
  };
  const increaseQuantity = (item: any) => {
    const newQuantity = item.quantity + 1;
    console.log(newQuantity);
    updateCartItemQuantity({ itemId: item.id, quantity: newQuantity });
  };

  const reduceQuantity = (item: any) => {
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      updateCartItemQuantity({ itemId: item.id, quantity: newQuantity });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="My Cart" showBackButton />
      {items.length > 0 ? (
        <>
          <ScrollView
            className="flex-1 px-4 mt-4"
            showsVerticalScrollIndicator={false}
          >
            {items.map((item: any) => (
              // <View  className="p-4 border-b border-gray-200">
              <View
                key={item.id}
                className="flex-row mb-4 bg-white p-3 rounded-xl"
              >
                <View className="w-20 h-20 rounded-lg overflow-hidden mr-3 bg-gray-100">
                  <Image
                    source={{
                      uri: item.product.image.replace("http://", "https://"),
                    }}
                    className="w-full h-full "
                    resizeMode="cover"
                  />
                </View>

                <View className="flex-1 justify-between">
                  <View className="flex-row justify-between items-start">
                    <View>
                      <Text className="text-sm font-semibold">
                        {item.product.name}
                      </Text>
                      <Text className=" text-[#D9534F] mb-2 font-bold text-[11px] uppercase tracking-widest">
                        <Ionicons name="flash" size={18} />
                        ONLY {item.product.stockquantity} ITEMS IN STOCK
                      </Text>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.6}
                      className="p-2"
                      onPress={() => handleRemove(item.id)}
                    >
                      <Ionicons name="trash" size={20} color="#FF4C3B" />
                    </TouchableOpacity>
                  </View>

                  <View className="flex-row justify-between items-center mt-2">
                    <Text className="font-bold text-base">
                      {item.totalPriceFormatted}
                    </Text>
                    <View className="flex-row items-center bg-gray-200 rounded-full px-2 py-1">
                      <TouchableOpacity
                        className="p-1"
                        onPress={() => reduceQuantity(item)}
                      >
                        <Ionicons name="remove" size={16} color="#1f2937" />
                      </TouchableOpacity>
                      <Text className="mx-2 text-sm">{item.quantity}</Text>
                      <TouchableOpacity
                        className="p-1"
                        onPress={() => increaseQuantity(item)}
                        disabled={item.quantity >= item.product.stockquantity}
                        style={
                          item.quantity >= item.product.stockquantity
                            ? { opacity: 0.4 }
                            : {}
                        }
                      >
                        <Ionicons name="add" size={16} color="#1f2937" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View className="p-4 bg-white rounded-t-3xl shadow-sm">
            <View className="flex-row justify-between mb-4">
              <Text className="text-gray-500">SubTotal</Text>
              <Text className=" font-bold">
                {cartItems?.totalPriceFormatted || subtotalFormatted}
              </Text>
            </View>

            <View className="flex-row justify-between mb-4">
              <Text className="text-gray-500">Shipping </Text>
              <Text className=" font-bold">1000 Frw</Text>
            </View>

            <View className="h-px bg-border mb-4"/>
              <View className="flex-row justify-between mb-4">
              <Text className=" font-bold text-lg">Total </Text>
              <Text className=" font-bold">{cartItems?.totalPriceFormatted || subtotalFormatted}</Text>
            </View>

            <TouchableOpacity
            onPress={()=> router.push('/checkout')}
             className="bg-primary py-4 rounded-full items-center">
              <Text className="text-white font-bold text-base">Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View className="flex-1 justify-center items-center bg-white px-10">
          <View className="w-24 h-24 bg-gray-50 rounded-full items-center justify-center mb-8">
            <Ionicons name="bag" size={42} color="#1f2937" strokeWidth={1.2} />
          </View>
          <Text className="text-2xl font-serif text-gray-900 tracking-tight">
            Your Bag is Empty
          </Text>
          <Text className="text-center text-gray-500 mt-3 leading-6 font-light">
            Items you add to your shopping bag will appear here for a seamless
            checkout.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/shop")}
            className="mt-12 bg-gray-900 px-12 py-4 shadow-sm"
            activeOpacity={0.8}
          >
            <Text className="text-white font-medium uppercase tracking-widest text-xs">
              Start Shopping
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
