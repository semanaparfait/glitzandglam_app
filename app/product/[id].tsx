import { useCart, useCartItems } from "@/hooks/cart/useCart";
import { useProducts } from "@/hooks/useProducts";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

export default function ProductDetails() {
  // All hooks must be called before any return
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined,
  );
  const [quantity, setQuantity] = useState(1);
  const { data: products, isLoading, isError } = useProducts();
  const { mutateAsync: addToCart } = useCart();
  const { data: cartItems } = useCartItems();

  if (isLoading) {
    return <Text>loading product details</Text>;
  }
  if (isError) {
    return <Text>Failed to load product details</Text>;
  }
  useEffect(() => {
    if (products && id) {
      const foundProduct = products.find(
        (product: { id: string }) => product.id === id,
      );
      if (foundProduct?.images?.length) {
        setSelectedImage(foundProduct.images[0]);
      }
    }
  }, [products, id]);

  const product = products?.find(
    (product: { id: string }) => product.id === id,
  );
  if (!product) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="font-bold text-2xl">Product not found</Text>
        <Text onPress={() => router.back()} className="text-blue-500 mt-3">
          Go Back
        </Text>
      </SafeAreaView>
    );
  }
  const handleAddToCart = async () => {
    if (!products) return;

    try {
      await addToCart({
        productId: product.id,
        quantity: quantity,
      });

      Toast.show({
        type: "success",
        text1: "Added to cart",
        text2: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to add to cart",
        text2: `${product.name} could not be added to your cart.`,
      });
    }
  };
  const itemsCount =
    cartItems?.items?.reduce(
      (total: number, item: any) => total + item.quantity,
      0,
    ) || 0;

  const isInCart = cartItems?.items?.some(
    (item: any) => String(item.product?.id).trim() === String(product.id).trim()
  );
  return (
    <View className="flex-1 bg-white">
      {/* product images */}
      <ScrollView contentContainerStyle={{ padding: 10 }}>
        <View
          className="relative  mb-6 flex items-center justify-center"
          style={{ minHeight: 420 }}
        >
          <View className="items-center w-full">
            <View
              className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 mb-4 mx-auto"
              style={{ width: width * 0.95, height: 400 }}
            >
              <Image
                source={{ uri: selectedImage }}
                style={{ width: width * 0.95, height: 400 }}
                resizeMode="cover"
              />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                justifyContent: "center",
                alignItems: "center",
                gap: 16,
                paddingHorizontal: 12,
              }}
              className="flex-row mb-2 mx-auto"
              style={{ maxWidth: width * 0.95 }}
            >
              {(Array.isArray(product.images)
                ? product.images
                : [product.images]
              ).map((img: string, i: number) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 mx-1 transition-all duration-200 flex items-center justify-center
                    ${selectedImage === img ? "border-primary shadow-md" : "border-gray-200 opacity-60"}`}
                  style={{ backgroundColor: "#f8f8f8" }}
                  activeOpacity={0.7}
                >
                  <Image
                    source={{ uri: img }}
                    className="w-full h-full rounded-xl"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View className="absolute top-8 left-4 right-4 flex-row justify-between items-center z-10">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-white/80 items-center justify-center shadow"
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsLiked(!isLiked)}
              className="w-10 h-10 rounded-full bg-white/80 items-center justify-center shadow"
            >
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={24}
                color={isLiked ? "#907764" : "#333"}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* product details */}
        <View className="px-4 pb-8">
          <View>
            <Text className=" text-[#D9534F] mb-2 font-bold text-[11px] uppercase tracking-widest">
              <Ionicons name="flash" size={18} />
              ONLY {product.stockQuantity} ITEMS IN STOCK
            </Text>
          </View>
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-2xl font-bold mb-0 flex-1" numberOfLines={2}>
              {product.name}
            </Text>
            <View className="flex-row items-center ml-2">
              <Ionicons name="star" size={18} color="#facc15" />
              <Text className="text-sm font-bold ml-1">4.5</Text>
            </View>
          </View>
          <View className="flex-row items-baseline mb-2 gap-5">
            <Text className="text-2xl font-bold text-[#907764] mb-2">
              {product.price.toLocaleString("rw-RW")} RWF
            </Text>
            {product?.oldPrice && (
              <Text className="text-base line-through text-gray-400">
                {product.oldPrice} RWF
              </Text>
            )}
          </View>
          <View>
            <Text className="font-bold pb-3">Description</Text>
            <Text className="text-base text-gray-700 leading-relaxed">
              {product.description}
            </Text>
          </View>
        </View>
      </ScrollView>
      {/* footer */}
      <View className="absolute bottom-0 left-0 flex-row right-0 p-4 bg-white border-t border-gray-100">
        {isInCart ? (
          <View className="w-4/5 bg-gray-300 py-4 rounded-full items-center shadow-lg flex-row justify-center opacity-70">
            <Ionicons name="checkmark-done-outline" size={20} color="white" />
            <Text className="text-white font-bold text-base ml-2">
              Already in Cart
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleAddToCart}
            className="w-4/5 bg-primary py-4 rounded-full items-center shadow-lg flex-row justify-center"
          >
            <Ionicons name="bag-outline" size={20} color="white" />
            <Text className="text-white font-bold text-base ml-2">
              Add to Cart
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity className="w-1/5 py-3 flex-row justify-center relative">
          <Ionicons name="cart-outline" size={24} />
          <View className="absolute top-1 right-3 size-4  z-10 bg-primary rounded-full justify-center items-center">
            <Text className="text-white text-[9px]">{itemsCount}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
