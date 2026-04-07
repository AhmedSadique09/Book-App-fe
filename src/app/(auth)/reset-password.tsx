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

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

          {/* New Password */}
          <View className="mb-5">
            <Text className="mb-2 text-sm font-medium text-slate-700">
              New Password
            </Text>
            <View className="flex-row items-center rounded-xl border border-slate-200 bg-white px-4">
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#94a3b8"
              />
              <TextInput
                className="ml-3 flex-1 py-4 text-base text-slate-900"
                placeholder="Enter new password"
                placeholderTextColor="#94a3b8"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNew}
              />
              <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                <Ionicons
                  name={showNew ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#94a3b8"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View className="mb-8">
            <Text className="mb-2 text-sm font-medium text-slate-700">
              Confirm Password
            </Text>
            <View className="flex-row items-center rounded-xl border border-slate-200 bg-white px-4">
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#94a3b8"
              />
              <TextInput
                className="ml-3 flex-1 py-4 text-base text-slate-900"
                placeholder="Re-enter new password"
                placeholderTextColor="#94a3b8"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirm}
              />
              <TouchableOpacity
                onPress={() => setShowConfirm(!showConfirm)}
              >
                <Ionicons
                  name={showConfirm ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#94a3b8"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Reset Button */}
          <TouchableOpacity
            className="mb-4 rounded-xl bg-blue-600 py-4 shadow-sm shadow-blue-300"
            onPress={() => router.push("/(auth)/signin")}
            activeOpacity={0.8}
          >
            <Text className="text-center text-lg font-bold text-white">
              Reset Password
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
