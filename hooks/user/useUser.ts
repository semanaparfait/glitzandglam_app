import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";

const getUserProfile = async () => {
  const token = await AsyncStorage.getItem("auth_token");

  if (!token) {
    throw new Error("No auth token found. Please sign in again.");
  }

  const res = await fetch(
    `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/user/profile`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!res.ok) {
    let message = "Failed to fetch user profile";

    try {
      const body = await res.json();
      if (typeof body?.message === "string") {
        message = body.message;
      }
    } catch {
    }

    throw new Error(message);
  }
  return res.json();
};

export const useGetUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getUserProfile(),
  });
};
