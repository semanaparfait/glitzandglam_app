import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useCategories } from '@/hooks/useCategories'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function CategoryList() {
  const { data: categories, isLoading, isError } = useCategories()

  if (isLoading) {
    return <Text>Loading categories...</Text>
  }

  if (isError) {
    return <Text>Error occurred while fetching categories</Text>
  }

  return (
<View className='px-2'>
  <Text className="font-bold py-4 text-base">Categories</Text>
<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  className=" py-2"
>
  {categories?.map((category: any) => (
    <TouchableOpacity
      key={category.id}
      className="mr-4 items-center"
    >
      <Image
        source={{ uri: category.image?.replace("http://", "https://") }}
        className="w-16 h-16 rounded-full mb-2"
      />

      <Text>{category.name}</Text>
    </TouchableOpacity>
  ))}
</ScrollView>
</View>

  )
}