import { useState } from "react";
import { View, Text, FlatList, Image, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DUMMY_USERS = [
  { id: "1", name: "Ahmed Khan", email: "ahmed@gmail.com", profileImage: null, joinedDate: "Jan 15, 2026" },
  { id: "2", name: "Sara Ali", email: "sara.ali@gmail.com", profileImage: null, joinedDate: "Feb 02, 2026" },
  { id: "3", name: "Usman Farooq", email: "usman.f@gmail.com", profileImage: null, joinedDate: "Feb 20, 2026" },
  { id: "4", name: "Fatima Noor", email: "fatima.n@gmail.com", profileImage: null, joinedDate: "Mar 05, 2026" },
  { id: "5", name: "Bilal Hassan", email: "bilal.h@gmail.com", profileImage: null, joinedDate: "Mar 18, 2026" },
  { id: "6", name: "Ayesha Malik", email: "ayesha.m@gmail.com", profileImage: null, joinedDate: "Mar 25, 2026" },
];

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase();

const AVATAR_COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f43f5e", "#f59e0b", "#06b6d4"];

export default function UsersScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = DUMMY_USERS.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderUser = ({ item, index }: { item: (typeof DUMMY_USERS)[0]; index: number }) => (
    <View
      className="mx-5 mb-2.5 flex-row items-center rounded-2xl border border-slate-100 bg-white px-4 py-4"
    >
      {item.profileImage ? (
        <Image source={{ uri: item.profileImage }} className="h-12 w-12 rounded-full" />
      ) : (
        <View
          className="h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
        >
          <Text className="text-[14px] font-bold text-white">
            {getInitials(item.name)}
          </Text>
        </View>
      )}

      <View className="ml-3.5 flex-1">
        <Text className="text-[15px] font-semibold text-slate-800">{item.name}</Text>
        <Text className="mt-1 text-[13px] text-slate-400">{item.email}</Text>
      </View>

      <View className="items-end gap-1">
        <Ionicons name="calendar-outline" size={13} color="#c3c8d0" />
        <Text className="text-[11px] text-slate-400">{item.joinedDate}</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-[#f8fafc]" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pb-1 pt-5">
        <Text className="text-[26px] font-bold text-slate-900">Users</Text>
        <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-50">
          <Ionicons name="people" size={20} color="#3b82f6" />
        </View>
      </View>
      <Text className="mb-4 px-5 text-[13px] text-slate-400">
        {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"} found
      </Text>

      {/* Search */}
      <View className="mx-5 mb-5 flex-row items-center rounded-2xl border border-slate-100 bg-white px-4">
        <Ionicons name="search-outline" size={18} color="#94a3b8" />
        <TextInput
          className="ml-3 flex-1 py-3.5 text-[14px] text-slate-800"
          placeholder="Search by name or email..."
          placeholderTextColor="#b0b8c4"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== "" && (
          <TouchableOpacity onPress={() => setSearchQuery("")} className="p-1">
            <Ionicons name="close-circle" size={18} color="#cbd5e1" />
          </TouchableOpacity>
        )}
      </View>

      {/* List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View className="items-center pt-20">
            <View className="mb-3 h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <Ionicons name="search-outline" size={24} color="#94a3b8" />
            </View>
            <Text className="text-[15px] font-medium text-slate-400">No users found</Text>
            <Text className="mt-1 text-[13px] text-slate-300">Try searching something else</Text>
          </View>
        }
      />
    </View>
  );
}
