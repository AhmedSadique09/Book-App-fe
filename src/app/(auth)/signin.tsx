import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router, Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-50"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-7 py-12">
          {/* Header */}
          <View className="mb-10 items-center">
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">
              <Ionicons name="book" size={32} color="white" />
            </View>
            <Text className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome Back
            </Text>
            <Text className="mt-2 text-base text-slate-500">
              Sign in to continue to your account
            </Text>
          </View>

          {/* Form */}
          <View className="mb-6">
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

          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-slate-700">
              Password
            </Text>
            <View className="flex-row items-center rounded-xl border border-slate-200 bg-white px-4">
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#94a3b8"
              />
              <TextInput
                className="ml-3 flex-1 py-4 text-base text-slate-900"
                placeholder="Enter your password"
                placeholderTextColor="#94a3b8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#94a3b8"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            className="mb-8 self-end"
            onPress={() => router.push("/(auth)/forget-password")}
          >
            <Text className="text-sm font-semibold text-blue-600">
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <Link href="/dashboard" asChild>
            <TouchableOpacity
              style={{
                marginBottom: 24,
                borderRadius: 12,
                backgroundColor: "#2563eb",
                paddingVertical: 16,
              }}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#ffffff",
                }}
              >
                Sign In
              </Text>
            </TouchableOpacity>
          </Link>

          {/* Divider */}
          <View className="mb-6 flex-row items-center">
            <View className="h-px flex-1 bg-slate-200" />
            <Text className="mx-4 text-sm text-slate-400">or</Text>
            <View className="h-px flex-1 bg-slate-200" />
          </View>

          {/* Go to Sign Up */}
          <TouchableOpacity
            className="rounded-xl border border-slate-200 bg-white py-4"
            onPress={() => router.push("/(auth)/signup")}
            activeOpacity={0.8}
          >
            <Text className="text-center text-base font-semibold text-slate-700">
              Create New Account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
