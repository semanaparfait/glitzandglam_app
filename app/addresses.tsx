import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Header from "@/components/header";
import { Ionicons } from "@expo/vector-icons";

export default function Addresses() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-surafce" edges={["top"]}>
      <Header title="Shipping Addresses" showBackButton />
      <ScrollView className="px-4 mt-4 flex-1">
        <Text>No Addresses Found</Text>
        <TouchableOpacity
          onPress={() => router.push("/addresses")}
          className="border-dashed border-2 border-gray-300 rounded-md p-6 mb-6 bg-white items-center justify-center"
        >
          <Text className="font-bold items-center justify-center">
            <Ionicons name="add" size={20} /> Add New Address
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
