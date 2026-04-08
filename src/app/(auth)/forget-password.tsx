import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgetPasswordSchema, type IForgetPassword } from "@/validations/forget-password";
import { authService } from "@/services/auth.service";

export default function ForgetPassword() {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IForgetPassword>({
    resolver: yupResolver(forgetPasswordSchema),
    defaultValues: { email: "" },
  });

  const isFormFilled = watch("email") !== "";

  const onSubmit = async (data: IForgetPassword) => {
    setLoading(true);
    try {
      const response = await authService.forgotPassword({ email: data.email });
      console.log("Forgot Password Response:", response);
      router.push({
        pathname: "/(auth)/otp",
        params: { email: data.email, flow: "reset" },
      });
    } catch (error: any) {
      console.log("Forgot Password Error:", JSON.stringify(error?.response?.data || error?.message));
      const message =
        error?.response?.data?.message || error?.message || "Failed to send OTP.";
      Toast.show({ type: "error", text1: "Error", text2: message });
    } finally {
      setLoading(false);
    }
  };

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

          {/* Send Button */}
          <TouchableOpacity
            className={`mb-4 rounded-xl py-4 ${isFormFilled ? "bg-blue-600 shadow-sm shadow-blue-300" : "bg-blue-300"}`}
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.8}
            disabled={!isFormFilled || loading}
            style={{ opacity: loading ? 0.8 : 1 }}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-center text-lg font-bold text-white">
                Send Reset Link
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
