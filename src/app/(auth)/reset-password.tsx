import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import Toast from "react-native-toast-message";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema, type IResetPassword } from "@/validations/reset-password";
import { authService } from "@/services/auth.service";

export default function ResetPassword() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IResetPassword>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const watchedFields = watch();
  const isFormFilled = watchedFields.newPassword !== "" && watchedFields.confirmPassword !== "";

  const onSubmit = async (data: IResetPassword) => {
    setLoading(true);
    try {
      const response = await authService.resetPassword({
        email: email || "",
        newPassword: data.newPassword,
      });
      console.log("Reset Password Response:", response);
      Toast.show({ type: "success", text1: "Success", text2: "Password reset successfully" });
      setShowSuccess(true);
    } catch (error: any) {
      console.log("Reset Password Error:", JSON.stringify(error?.response?.data || error?.message));
      const message =
        error?.response?.data?.message || error?.message || "Failed to reset password.";
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
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Ionicons name="lock-open-outline" size={32} color="#16a34a" />
            </View>
            <Text className="text-3xl font-bold tracking-tight text-slate-900">
              New Password
            </Text>
            <Text className="mt-2 text-center text-base text-slate-500">
              Create a strong password for{"\n"}your account
            </Text>
          </View>

          {/* Email Display */}
          {email && (
            <Text className="mb-8 text-center text-sm text-slate-400">
              {email}
            </Text>
          )}

          {/* New Password */}
          <View className="mb-5">
            <Text className="mb-2 text-sm font-medium text-slate-700">
              New Password
            </Text>
            <View
              className={`flex-row items-center rounded-xl border bg-white px-4 ${errors.newPassword ? "border-red-400" : "border-slate-200"}`}
            >
              <Ionicons name="lock-closed-outline" size={20} color={errors.newPassword ? "#f87171" : "#94a3b8"} />
              <Controller
                control={control}
                name="newPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="ml-3 flex-1 py-4 text-base text-slate-900"
                    placeholder="Enter new password"
                    placeholderTextColor="#94a3b8"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showNew}
                  />
                )}
              />
              <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                <Ionicons
                  name={showNew ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#94a3b8"
                />
              </TouchableOpacity>
            </View>
            {errors.newPassword && (
              <Text className="mt-1 text-xs text-red-500">
                {errors.newPassword.message}
              </Text>
            )}
          </View>

          {/* Confirm Password */}
          <View className="mb-8">
            <Text className="mb-2 text-sm font-medium text-slate-700">
              Confirm Password
            </Text>
            <View
              className={`flex-row items-center rounded-xl border bg-white px-4 ${errors.confirmPassword ? "border-red-400" : "border-slate-200"}`}
            >
              <Ionicons name="lock-closed-outline" size={20} color={errors.confirmPassword ? "#f87171" : "#94a3b8"} />
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="ml-3 flex-1 py-4 text-base text-slate-900"
                    placeholder="Re-enter new password"
                    placeholderTextColor="#94a3b8"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showConfirm}
                  />
                )}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                <Ionicons
                  name={showConfirm ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#94a3b8"
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text className="mt-1 text-xs text-red-500">
                {errors.confirmPassword.message}
              </Text>
            )}
          </View>

          {/* Reset Button */}
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
                Reset Password
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Success Modal */}
      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/50 px-7"
          onPress={() => {}}
        >
          <View className="w-full rounded-3xl bg-white px-6 pb-8 pt-10">
            {/* Success Icon */}
            <View className="mb-5 items-center">
              <View className="h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <Ionicons name="checkmark-circle" size={50} color="#16a34a" />
              </View>
            </View>

            {/* Title */}
            <Text className="mb-2 text-center text-2xl font-bold text-slate-900">
              Password Reset!
            </Text>

            {/* Message */}
            <Text className="mb-8 text-center text-base leading-6 text-slate-500">
              Your password has been reset successfully.{"\n"}You can now sign in
              with your new password.
            </Text>

            {/* Button */}
            <TouchableOpacity
              className="rounded-xl bg-blue-600 py-4 shadow-sm shadow-blue-300"
              onPress={() => {
                setShowSuccess(false);
                router.push("/(auth)/signin");
              }}
              activeOpacity={0.8}
            >
              <Text className="text-center text-lg font-bold text-white">
                Back to Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}
