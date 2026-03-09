import { View, Text, TouchableOpacity, Image } from 'react-native'
import React,{useState} from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function Header({title = "Home",showBackButton = false,showMenu = false,showCart = false,showLogo = false,showSearch = false}) {

    const router = useRouter()
    const {itemCount} = {itemCount:6}
  return (
    <View className='flex-row items-center justify-between px-4 py-3 bg-white'>
        {/* left side */}
      <View className='flex-row items-center flex-1 '>
        {showBackButton && (

        <TouchableOpacity onPress={()=> router.back()}>
        <Ionicons name= 'arrow-back' size={24} color='#000'/>
        </TouchableOpacity>
        )}

            {showMenu && (
                <TouchableOpacity>
                    <Ionicons name='menu' size={24} color='#000' />
                </TouchableOpacity>
            )}

            {showLogo ? (
                <View className='flex-1'>
                    <Image source={require('@/assets/images/logo.png')} style={{width:"100%", height:24}} resizeMode='contain' />
                    </View>
            ) : title && (
                <Text className='text-xl font-bold text-primary text-center flex-1 mr-8'>{title}</Text>
            )}

            {(!title && !showSearch) && <View className='flex-1' />}
    </View>
        {/* right side */}
        <View className='flex-row items-center gap-4'>
            {showSearch && (
                <TouchableOpacity>
                    <Ionicons name='search-outline' size={24} color='#000' />
                </TouchableOpacity>
            )}
            {showCart && (
                <TouchableOpacity onPress={()=> router.push('/(tabs)/cart')}>
                    <View className='relative'>
                    <Ionicons name='bag-outline' size={24} color='#000' />
                    <View>
                    <Text className='absolute   -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                        {itemCount}
                    </Text>
                    </View>
                    </View>
                </TouchableOpacity>
            )}
        </View>
    </View>
  )
}