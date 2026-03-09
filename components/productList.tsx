import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { useProducts } from '@/hooks/useProducts';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ProductList() {
  const router = useRouter();
  const { data: products, isLoading, error } = useProducts();

  if (isLoading) {
    return <Text className="text-center mt-4">Loading products...</Text>;
  }

  if (error) {
    return <Text className="text-center mt-4 text-red-500">Error loading products</Text>;
  }

  return (
    <View className="mt-8">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 mb-4">
        <Text className="text-lg font-bold text-slate-900">Special For You</Text>
        <TouchableOpacity onPress={() => router.push('/shop')}>
          <Text className="text-sm text-gray-500">See all</Text>
        </TouchableOpacity>
      </View>

      {/* Product Grid */}
      <View className="flex-row flex-wrap justify-between px-1">
        {products.slice(0, 4).map((product: any) => {
          const isLiked = product.isLiked || false; 

          return (
            <View key={product.id} className="w-[48%] mb-4">
              <Link href={`/product/${product.id}`} asChild>
                <TouchableOpacity
                  activeOpacity={0.9}
                  className="bg-white rounded-xl shadow-md   overflow-hidden"
                >
                  <View className="relative w-full h-48 bg-slate-50">
                    <Image
                      source={{ uri: product.images?.[0] }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />

                    {/* Favorite Heart */}
                    <TouchableOpacity
                      className="absolute top-3 right-3 z-10 p-2 bg-white/90 rounded-full shadow-md"
                      onPress={(e) => e.stopPropagation()}
                    >
                      <Ionicons
                        name={isLiked ? 'heart' : 'heart-outline'}
                        size={18}
                        color={isLiked ? '#ef4444' : '#64748b'}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Product Info */}
                  <View className="p-3">
                    <Text
                      className="text-sm font-medium text-slate-800  mb-1"
                      numberOfLines={1}
                    >
                      {product.name}
                    </Text>
                    <View className='flex-row items-center gap-4 mt-2'>
                    <Text className="  font-bold text-slate-900">
                      {product.price} RWF
                    </Text>
                        <Text className="  line-through text-gray-200">
                      {product?.oldPrice} 
                    </Text>

                    </View>
                  </View>
                </TouchableOpacity>
              </Link>
            </View>
          );
        })}
      </View>
    </View>
  );
}