import { View, Text, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/header';
import { banners } from '@/assets/banner/banner';
import CategoryList from '@/components/categoryList';
import ProductList from '@/components/productList';
import NewsLetter from '@/components/newsLetter';


const { width } = Dimensions.get('window');

export default function Home() {
  return (
<SafeAreaView className="flex-1" edges={['top']}>
  <Header title="Glitz & Glam" showMenu showCart showLogo />

  <ScrollView
    className="flex-1 px-2 "
    showsVerticalScrollIndicator={false}
  >
    {/* Banner Scroll */}
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      scrollEventThrottle={16}
    >
      {banners.map((banner) => (
        <View
          key={banner.id}
          className="relative overflow-hidden rounded-xl mr-4"
          style={{ width: width - 32, height: 200 }}
        >
          <Image
            source={banner.image}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />

          <View className="absolute inset-0 bg-black/40 rounded-xl" />

          <View className="absolute bottom-4 left-4 z-10">
            <Text className="text-white text-2xl font-bold">
              {banner.title}
            </Text>
            <Text className="text-white text-sm font-medium">
              {banner.subtitle}
            </Text>

            <TouchableOpacity className="mt-2 bg-white px-4 py-2 rounded-full self-start">
              <Text className="text-primary text-xs font-bold">
                Get Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>

    {/* Categories */}
    <CategoryList />

    {/* Products */}
    <ProductList />
    {/* new letter */}
    <NewsLetter />

  </ScrollView>
</SafeAreaView>
  );
}