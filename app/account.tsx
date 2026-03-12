import Header from "@/components/header";
import { useLoginUser, useRegisterUser } from "@/hooks/auth/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Button, TextInput, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const getErrorMessages = (error: any, fallback: string) => {
  const details = Array.isArray(error?.details)
    ? error.details.filter((item: unknown) => typeof item === "string")
    : [];

  if (details.length > 0) {
    return {
      text1: details[0],
      text2: details.slice(1).join(" | "),
    };
  }

  return {
    text1: fallback,
    text2: error?.message || "Something went wrong",
  };
};

const getTokenFromResponse = (payload: any): string | null => {
  if (!payload || typeof payload !== "object") return null;

  const directToken =
    payload.accessToken || payload.token || payload.jwt || payload.idToken;
  if (typeof directToken === "string" && directToken.length > 0) {
    return directToken;
  }

  const nestedToken =
    payload.data?.accessToken ||
    payload.data?.token ||
    payload.data?.jwt ||
    payload.data?.idToken;

  if (typeof nestedToken === "string" && nestedToken.length > 0) {
    return nestedToken;
  }

  return null;
};

export default function Account() {
  const [action, setAction] = useState<"signup" | "signin" | "forgotPassword">(
    "signin",
  );
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const router = useRouter();
const { mutateAsync: loginUser, isPending: loginLoading } = useLoginUser();
const { mutateAsync: registerUser, isPending: registerLoading } = useRegisterUser();

  const title = useMemo(() => {
    if (action === "signup") return "Create your account";
    if (action === "forgotPassword") return "Reset your password";
    return "Login your Account";
  }, [action]);

  const primaryButtonLabel =
    action === "signup"
      ? "Create Your Account"
      : action === "forgotPassword"
        ? "Send Reset Link"
        : "Sign In";

  const isFormInvalid =
    action === "forgotPassword"
      ? email.trim().length === 0
      : action === "signup"
        ? email.trim().length === 0 ||
          phoneNumber.trim().length === 0 ||
          password.trim().length === 0
        : email.trim().length === 0 || password.trim().length === 0;

  const handleSubmit = async () => {
    if (action === "forgotPassword") {
      Toast.show({
        type: "info",
        text1: "Reset flow not wired yet",
        text2: "Please connect forgot-password API.",
      });
      return;
    }

    if (action === "signup") {
      try {
        await registerUser({ email, password, phoneNumber });
        setAction("signin");
        setPhoneNumber("");
        setPassword("");
        Toast.show({
          type: "success",
          text1: "Account created successfully",
          text2: "Please sign in with your new account.",
        });
      } catch (error: any) {
        console.error("Signup error:", error);
        const msg = getErrorMessages(error, "Signup failed");
        Toast.show({
          type: "error",
          text1: msg.text1,
          text2: msg.text2,
        });
      }
      return;
    }

    try {
      const loginResponse = await loginUser({ email, password });
      setEmail("");
        setPassword("");
      const token = getTokenFromResponse(loginResponse);

      if (token) {
        await AsyncStorage.setItem("auth_token", token);
      }

      Toast.show({
        type: "success",
        text1: "Signed in successfully",
      });
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Login error:", error);
      const msg = getErrorMessages(error, "Login failed");
      Toast.show({
        type: "error",
        text1: msg.text1,
        text2: msg.text2,
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surafce" edges={["top"]}>
      <Header title="Account" showBackButton />
      <ScrollView
        className="px-4 mt-4 flex-1 justify-center "
        showsVerticalScrollIndicator={false}
      >
        <View className="">
          <View className="mb-10">
            <Text className="text-2xl font-bold text-gray-900">{title}</Text>
          </View>

          <View className="mb-5 flex-row rounded-xl bg-gray-100 p-1 hidden">
            <TouchableOpacity
              className={`flex-1 rounded-lg py-2 ${action === "signin" ? "bg-white" : ""}`}
              onPress={() => setAction("signin")}
            >
              <Text
                className={`text-center font-semibold ${
                  action === "signin" ? "text-primary" : "text-gray-500"
                }`}
              >
                Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 rounded-lg py-2 ${action === "signup" ? "bg-white" : ""}`}
              onPress={() => setAction("signup")}
            >
              <Text
                className={`text-center font-semibold ${
                  action === "signup" ? "text-primary" : "text-gray-500"
                }`}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            label="Email"
            placeholder="example@gmail.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            mode="outlined"
            style={{ marginBottom: 20, backgroundColor: "white" }}
          />

          {action === "signup" && (
            <TextInput
              label="Phone Number"
              placeholder="+2507XXXXXXXX"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              autoCapitalize="none"
              keyboardType="phone-pad"
              mode="outlined"
              style={{ marginBottom: 20, backgroundColor: "white" }}
            />
          )}

          {action !== "forgotPassword" && (
            <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            mode="outlined"
            right={
                <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
                />
            }
            />
          )}

          {action === "signin" && (
            <TouchableOpacity
              className="self-end mb-4"
              onPress={() => setAction("forgotPassword")}
            >
              <Text className="font-medium text-primary">Forgot password?</Text>
            </TouchableOpacity>
          )}
          <Text className="text-center">Or Continue With</Text>
          <View className="flex-row items-center justify-center my-4 gap-2">
            <TouchableOpacity className="border border-gray-200 py-2 px-10 rounded-lg flex-row items-center gap-2 ">
              <Image
                source={require("@/assets/account/facebook.png")}
                style={{ width: 20, height: 20 }}
              />
            </TouchableOpacity>
            <TouchableOpacity className="border border-gray-200 py-2 px-10 rounded-lg flex-row items-center gap-2 ">
              <Image
                source={require("@/assets/account/google.png")}
                style={{ width: 20, height: 20 }}
              />
            </TouchableOpacity>
          </View>

            <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={isFormInvalid || loginLoading || registerLoading}
            loading={loginLoading || registerLoading}
            style={{ marginTop: 8 }}
            buttonColor={theme.colors.primary}
            >
            {primaryButtonLabel}
            </Button>

          <View className="mt-5 flex-row justify-center">
            <Text className="text-gray-500">
              {action === "signup"
                ? "Already have an account?"
                : "Don\'t have an account?"}
            </Text>
            <TouchableOpacity
              onPress={() =>
                setAction(action === "signup" ? "signin" : "signup")
              }
            >
              <Text className="ml-1 font-semibold text-primary">
                {action === "signup" ? "Sign In" : "Sign Up"}
              </Text>
            </TouchableOpacity>
          </View>

          {action === "forgotPassword" && (
            <TouchableOpacity
              className="mt-4 self-center"
              onPress={() => setAction("signin")}
            >
              <Text className="font-medium text-primary">Back to Sign In</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
