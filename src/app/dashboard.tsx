import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Dashboard() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-50">
      <View className="mb-4 h-20 w-20 items-center justify-center rounded-2xl bg-blue-100">
        <Ionicons name="home-outline" size={40} color="#2563eb" />
      </View>
      <Text className="text-2xl font-bold text-slate-900">
        This is Dashboard
      </Text>
      <Text className="mt-2 text-base text-slate-500">
        Welcome to your account
      </Text>
    </View>
  );
}
