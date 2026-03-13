import Header from "@/components/header";
import { useLogoutUser } from "@/hooks/auth/useAuth";
import { useGetUserProfile } from "@/hooks/user/useUser";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
export default function Profile() {
  const router = useRouter();
  const { data: currentUser } = useGetUserProfile();
  const { mutateAsync: logout } = useLogoutUser();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await logout();
      queryClient.setQueryData(["userProfile"], null);
      await queryClient.removeQueries({ queryKey: ["userProfile"] });

      Toast.show({ type: "success", text1: "Logged out successfully" });
      router.replace("/");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Logout failed",
        text2: error?.message || "Please try again",
      });
    }
  };
  // console.log("User Profile:", currentUser);
  const PROFILE_MENU = [
    { id: 1, title: "My Order", icon: "book", route: "/orders" },
    { id: 2, title: "Shipping Addreses", icon: "location", route: "address" },
    { id: 3, title: "My review", icon: "star", route: "/reviews" },
    { id: 4, title: "Settings", icon: "settings", route: "/settings" },
  ];
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <Header title="Profile" showBackButton />
      <ScrollView className="px-4 items-center justify-center">
        {!currentUser ? (
          <>
            <View className="flex-col items-center justify-center gap-3 ">
              <View className="items-center ">
                <Image
                  source={require("@/assets/account/undraw_secure-login_m11a.png")}
                  resizeMode="contain"
                  style={{ width: 200, height: 180 }}
                />
              </View>
              <Text className="font-bold text-2xl mb-3">Let's You in</Text>
              <View className="flex-col gap-2">
                <TouchableOpacity className="border border-gray-200 py-2 px-10 rounded-lg flex-row items-center gap-2 ">
                  <Image
                    source={require("@/assets/account/facebook.png")}
                    style={{ width: 20, height: 20 }}
                  />
                  <Text className="font-semibold">Continue with Facebook</Text>
                </TouchableOpacity>
                <TouchableOpacity className="border border-gray-200 py-2 px-10 rounded-lg flex-row items-center gap-2 ">
                  <Image
                    source={require("@/assets/account/google.png")}
                    style={{ width: 20, height: 20 }}
                  />
                  <Text className="font-semibold">Continue with Google</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text className="text-center py-3">OR</Text>
            <View>
              <TouchableOpacity
                onPress={() => {
                  router.push("/account");
                }}
                className="bg-primary rounded-full py-3"
              >
                <Text className="font-semibold text-white text-center">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
            <Text className="text-sm text-gray-500 mt-2 text-center">
              {" "}
              have an account?{" "}
              <Text className="text-primary font-semibold">Sign In</Text>
            </Text>
          </>
        ) : (
          <>
            <View className="flex-col items-center justify-center gap-3 mt-10 w-full">
          <View className="items-center">
                {currentUser.profile ? (
                  <Image
                    source={{ uri: currentUser.profile }}
                    resizeMode="contain"
                    style={{ width: 100, height: 100, borderRadius: 50 }}
                  />
                ) : (
                  <View
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                      backgroundColor: '#907764',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 40, color: '#fff' }}>
                      {currentUser.email.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
              <Text className="font-bold text-2xl ">
                {currentUser.fullName}
              </Text>
              <Text className="text-gray-500 mb-3">
                {currentUser.email} | {currentUser.phoneNumber}
              </Text>
              <View className="bg-white rounded-xl  p-2 mb-4 w-full">
                {PROFILE_MENU.map((item) => (
                  <TouchableOpacity
                    onPress={() => router.push(item.route as any)}
                    key={item.id}
                    className=" py-3 px-4 border-b border-gray-300  flex-row items-center justify-between gap-2 "
                  >
                    <View className="flex-row gap-2">
                      <Ionicons
                        name={item.icon as any}
                        size={20}
                        color="#555"
                      />
                      <Text className="font-semibold">{item.title}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="black" />
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                onPress={handleLogout}
                className="bg-red-500 rounded-full py-3 w-full"
              >
                <Text className="font-semibold text-white text-center">
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
