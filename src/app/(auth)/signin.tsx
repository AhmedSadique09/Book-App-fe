import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router, Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signinSchema, type ISignin } from "@/validations/signin";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ISignin>({
    resolver: yupResolver(signinSchema),
    defaultValues: { email: "", password: "" },
  });

  const watchedFields = watch();
  const isFormFilled = watchedFields.email !== "" && watchedFields.password !== "";

  const onSubmit = async (data: ISignin) => {
    setLoading(true);
    console.log("Sign In Data:", data);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

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

          {/* Email */}
          <View className="mb-5">
            <Text className="mb-2 text-sm font-medium text-slate-700">
              Email Address
            </Text>
            <View
              className={`flex-row items-center rounded-xl border bg-white px-4 ${errors.email ? "border-red-400" : "border-slate-200"}`}
            >
              <Ionicons name="mail-outline" size={20} color={errors.email ? "#f87171" : "#94a3b8"} />
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="ml-3 flex-1 py-4 text-base text-slate-900"
                    placeholder="example@email.com"
                    placeholderTextColor="#94a3b8"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
              />
            </View>
            {errors.email && (
              <Text className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </Text>
            )}
          </View>

          {/* Password */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-slate-700">
              Password
            </Text>
            <View
              className={`flex-row items-center rounded-xl border bg-white px-4 ${errors.password ? "border-red-400" : "border-slate-200"}`}
            >
              <Ionicons name="lock-closed-outline" size={20} color={errors.password ? "#f87171" : "#94a3b8"} />
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="ml-3 flex-1 py-4 text-base text-slate-900"
                    placeholder="Enter your password"
                    placeholderTextColor="#94a3b8"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showPassword}
                  />
                )}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#94a3b8"
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </Text>
            )}
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
          <TouchableOpacity
            style={{
              marginBottom: 24,
              borderRadius: 12,
              backgroundColor: isFormFilled ? "#2563eb" : "#93c5fd",
              paddingVertical: 16,
              opacity: loading ? 0.8 : 1,
            }}
            activeOpacity={0.8}
            onPress={handleSubmit(onSubmit)}
            disabled={!isFormFilled || loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
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
            )}
          </TouchableOpacity>

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
