import Header from "@/components/header";
import { useProducts } from "@/hooks/products/useProducts";
import { ProductTypeResponse } from "@/types/products";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Shop() {
  const { data: productsData, isLoading, isError } = useProducts();
  const [products, setProducts] = useState<ProductTypeResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = async (pageNumber = 1) => {
    if (pageNumber === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    try {
      const start = (pageNumber - 1) * 10;
      const end = start + 10;
      const paginatedData = productsData.slice(start, end);
      if (pageNumber === 1) {
        setProducts(paginatedData);
      } else {
        setProducts((prevProducts) => [...prevProducts, ...paginatedData]);
      }
      setHasMore(end < productsData.length);
      setPage(pageNumber);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreProducts = () => {
    if (hasMore && !loadingMore && !loading) {
      fetchProducts(page + 1);
    }
  };
  useEffect(() => {
    if (productsData) {
      fetchProducts(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsData]);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="Shop" showBackButton showCart />
      <View className="flex-row gap-2 mb-3 mx-4 my-2">
        {/* for seach bar */}
        <View className="flex-1 flex-row items-center bg-white rounded-xl border border-gray-100">
          <Ionicons name="search" size={20} color="black" className=" ml-4" />
          <TextInput
            placeholder="Search products..."
            className="flex-1 ml-2 text-black  px-4 py-3"
            returnKeyType="search"
          />
        </View>
        {/* for filter button */}
        <TouchableOpacity className="bg-primary  w-12 h-12 items-center justify-center rounded-xl ">
          <Ionicons name="options-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {/* Loading and error states */}
      {isLoading || loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : isError ? (
        <View className="flex-1 justify-center items-center">
          <Text>Failed to load products</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => (
            <View
              key={item.id}
              className="w-[48%] mb-4 bg-white rounded-md overflow-hidden "
            >
              <Link href={`/product/${item.id}`} asChild>
              <TouchableOpacity
               activeOpacity={0.9}>
                <View className="relative w-full h-48">
                  <Image
                    source={{ uri: item.images?.[0].replace("http://", "https://") }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
                <View className="p-3">
                  <Text
                    className="text-sm font-medium text-slate-800 mb-1"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <View className="flex-row items-center gap-4 mt-2">
                    <Text className="font-bold text-slate-900">
                      {item.price} RWF
                    </Text>
                    {item.oldPrice ? (
                      <Text className="line-through text-gray-200">
                        {item.oldPrice}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </TouchableOpacity>
              </Link>
            </View>
          )}
          onEndReached={loadMoreProducts}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View className="py-4">
                <ActivityIndicator size="small" color="#0000ff" />
              </View>
            ) : null
          }
          ListEmptyComponent={
            !loading && (
              <View className="flex-1 items-center justify-center py-20">
                <Text>No products found</Text>
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
}
