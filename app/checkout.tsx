import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, {useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {useCartItems} from '@/hooks/cart/useCart'
import { useRouter } from 'expo-router'
import Header from '@/components/header'
import { Ionicons } from '@expo/vector-icons'

export default function Checkout() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"cash" | "phoneNumber">("phoneNumber");
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const router = useRouter();
  const {data:cartItems, isLoading, error} = useCartItems();
  if(isLoading) {
    return <Text>Loading cart to checkout...</Text>
  }
  if(error) {
    return <Text>Error loading cart items</Text>
  }

  return (
    <SafeAreaView className='flex-1 bg-surafce' edges={["top"]}>
      <Header title="Checkout" showBackButton  />
      <ScrollView className='px-4 mt-4 flex-1'>
        <View>
          <Text className='font-bold text-lg mb-3'>Shipping Address</Text>
          {selectedAddress ? (
            <View className='border-dashed border-2 border-gray-300 rounded-md p-6 mb-6 bg-white items-center justify-center'>
              <Text className='font-bold items-center justify-center'>{selectedAddress}</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => router.push('/addresses')}
              className='border-dashed border-2 border-gray-300 rounded-md p-6 mb-6 bg-white items-center justify-center'
            >
              <Text className='font-bold items-center justify-center'><Ionicons name="add" size={20} /> Add Address</Text>
              {/* <Text>{selectedAddress ? selectedAddress : "Add Address"}</Text> */}
            </TouchableOpacity>
          )}
          
        </View>
      </ScrollView>

    </SafeAreaView>
  )
}