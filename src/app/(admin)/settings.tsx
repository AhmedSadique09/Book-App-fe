import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HttpService } from "@/services/base.service";

export default function AdminSettingsScreen() {
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    await HttpService.clearStorage();
    router.replace("/(auth)/signin");
  };

  return (
    <ScrollView
      className="flex-1 bg-[#f8fafc]"
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pb-1 pt-5">
        <Text className="text-[26px] font-bold text-slate-900">Settings</Text>
        <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-50">
          <Ionicons name="settings" size={20} color="#3b82f6" />
        </View>
      </View>
      <Text className="mb-5 px-5 text-[13px] text-slate-400">Admin Panel</Text>

      {/* Profile Card */}
      <View className="mx-5 mb-6 rounded-2xl border border-slate-100 bg-white p-5">
        <View className="flex-row items-center">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-blue-600">
            <Text className="text-xl font-bold text-white">A</Text>
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-[17px] font-bold text-slate-900">Admin User</Text>
            <Text className="mt-0.5 text-[13px] text-slate-400">admin@bookapp.com</Text>
            <View className="mt-2 self-start rounded-full bg-blue-50 px-3 py-1">
              <Text className="text-[11px] font-bold text-blue-600">ADMIN</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity
        className="mx-5 mt-2 flex-row items-center justify-center rounded-2xl border border-red-100 bg-red-50 py-4"
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
        <Text className="ml-2 text-[15px] font-bold text-red-500">Log Out</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}
