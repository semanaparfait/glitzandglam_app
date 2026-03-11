import { View, Text, ScrollView, TouchableOpacity,Image } from 'react-native'
import React from 'react'
import Header from "@/components/header";
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome, AntDesign, Ionicons } from '@expo/vector-icons';

export default function Profile() {
  return (
     <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <Header title="Profile" showBackButton/>
      <ScrollView className="items-center justify-center">
        <View className='flex-col items-center justify-center gap-3 '>
        <View className="items-center ">
          <Image 
            source={require("@/assets/account/undraw_secure-login_m11a.png")} 
            resizeMode="contain"
            style={{ width: 200, height: 180 }} 
          />
        </View>
          <Text className="font-bold text-2xl mb-3">Let's You in</Text>
          <View className='flex-col gap-2'>
              <TouchableOpacity className="border border-gray-200 py-2 px-10 rounded-lg flex-row items-center gap-2 ">
                <Image source={require("@/assets/account/facebook.png")} 
                 style={{ width: 20, height: 20 }} 
                 />
                <Text className="font-semibold">Continue with Facebook</Text>
              </TouchableOpacity>
                <TouchableOpacity className="border border-gray-200 py-2 px-10 rounded-lg flex-row items-center gap-2 ">
                <Image source={require("@/assets/account/google.png")} 
                 style={{ width: 20, height: 20 }} 
                 />
                <Text className="font-semibold">Continue with Google</Text>
              </TouchableOpacity>

        </View>
        </View>
        <Text className="text-center py-3">OR</Text>
        <View>
          <TouchableOpacity className="bg-primary rounded-full py-3">
            <Text className="font-semibold text-white text-center">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
        <Text className="text-sm text-gray-500 mt-2 text-center"> have an account? <Text className="text-primary font-semibold">Sign In</Text></Text>
    </SafeAreaView>
  )
}