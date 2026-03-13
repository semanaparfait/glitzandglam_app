import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function NewsLetter() {
  const route = useRouter();
  return (
    <View className="mt-7 flex-row items-center justify-center bg-[#f7eff0] gap-7 py-9">
      <View className="">
        <Image
          source={require("@/assets/sample1.png")}
          style={{ width: 96, height: 160, borderRadius: 12 }}
          resizeMode="cover"
        />
      </View>
      <View className=" flex-col items-start gap-1.5">
        <Text className="font-bold text-[#fddde1]">STAND OUT IN STYLE</Text>
        <Text className="">Silver And Diamonds Earings</Text>
        <TouchableOpacity onPress={()=> route.push('/shop')}>
          <Text className="border py-1.5 px-2">see More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
