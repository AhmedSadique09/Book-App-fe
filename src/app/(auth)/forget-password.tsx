import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-50"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 px-7">
        {/* Back Button */}
        <TouchableOpacity
          className="mt-14 h-11 w-11 items-center justify-center rounded-full bg-white"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="#334155" />
        </TouchableOpacity>

        <View className="flex-1 justify-center">
          {/* Header */}
          <View className="mb-10 items-center">
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-amber-100">
              <Ionicons name="key-outline" size={32} color="#d97706" />
            </View>
            <Text className="text-3xl font-bold tracking-tight text-slate-900">
              Forgot Password?
            </Text>
            <Text className="mt-2 text-center text-base text-slate-500">
              No worries! Enter your email and we'll{"\n"}send you a reset link
            </Text>
          </View>

          {/* Email */}
          <View className="mb-8">
            <Text className="mb-2 text-sm font-medium text-slate-700">
              Email Address
            </Text>
            <View className="flex-row items-center rounded-xl border border-slate-200 bg-white px-4">
              <Ionicons name="mail-outline" size={20} color="#94a3b8" />
              <TextInput
                className="ml-3 flex-1 py-4 text-base text-slate-900"
                placeholder="example@email.com"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Send Button */}
          <TouchableOpacity
            className="mb-4 rounded-xl bg-blue-600 py-4 shadow-sm shadow-blue-300"
            onPress={() => router.push("/(auth)/reset-password")}
            activeOpacity={0.8}
          >
            <Text className="text-center text-lg font-bold text-white">
              Send Reset Link
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
