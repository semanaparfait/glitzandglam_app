import {  Tabs } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import {
  useCartItems,
} from "@/hooks/cart/useCart";
import { View ,Text} from "react-native";

export default function TabsLayout() {
  const {data: cartItems} = useCartItems();
  return (
  <Tabs
  screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: '#907764',
    tabBarInactiveTintColor: '',
    tabBarShowLabel:false,
    tabBarStyle:{
      backgroundColor: '#fff',
      borderTopWidth:1,
      borderTopColor: '#F0F0F0',
      height: 56,
      paddingTop:8,
    }
  }}
  >
    <Tabs.Screen
      name="index"
      options={{
        tabBarIcon: ({color,focused}) => <Ionicons name={focused ? "home" : "home-outline"} size={26} color={color} />,
        headerShown: false,
        title: "Home",
      }}
    />

    <Tabs.Screen
      name="cart"
      options={{
        tabBarIcon: ({color,focused}) => (
        <View className="relative">
          <Feather name={focused ? "shopping-cart" : "shopping-cart"} size={26} color={color} />
          {cartItems?.items?.length > 0 && (
            <View className="absolute -top-2 -right-2 bg-primary rounded-full w-5 h-5 items-center justify-center">
              <Text className="text-white text-xs font-bold">
                {cartItems?.items?.length || 0}
              </Text>
            </View>
          )}
        </View>),
        headerShown: false,
        title: "Cart",
      }}
    />

    <Tabs.Screen
      name="favorities"
      options={{
        tabBarIcon: ({color,focused}) => <Ionicons name={focused ? "heart" : "heart-outline"} size={26} color={color} />,
        headerShown: false,
        title: "Favorities",
      }}
    />
    <Tabs.Screen
      name="profile"
      options={{
        tabBarIcon: ({color,focused}) => <Ionicons name={focused ? "person" : "person-outline"} size={26} color={color} />,
        headerShown: false,
        title: "Profile",
      }}
    />
  </Tabs>
)
}
