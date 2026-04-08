import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { adminService } from "@/services/admin.service";

interface User {
  _id: string;
  username: string;
  email: string;
  profileImage: string;
  createdAt: string;
}

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase();

const AVATAR_COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f43f5e", "#f59e0b", "#06b6d4"];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
};

export default function UsersScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = useCallback(async (pageNum: number, search: string, append = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const response = await adminService.getUsers({ search, page: pageNum, limit: 10 });

      setUsers((prev) => (append ? [...prev, ...response.users] : response.users));
      setTotalPages(response.pagination.totalPages);
      setPage(pageNum);
    } catch {
      Toast.show({ type: "error", text1: "Error", text2: "Failed to load users" });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(1, "");
  }, []);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(1, searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadMore = () => {
    if (!loadingMore && page < totalPages) {
      fetchUsers(page + 1, searchQuery, true);
    }
  };

  const renderUser = ({ item, index }: { item: User; index: number }) => (
    <View className="mx-5 mb-2.5 flex-row items-center rounded-2xl border border-slate-100 bg-white px-4 py-4">
      {item.profileImage ? (
        <Image source={{ uri: item.profileImage }} className="h-12 w-12 rounded-full" />
      ) : (
        <View
          className="h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
        >
          <Text className="text-[14px] font-bold text-white">
            {getInitials(item.username)}
          </Text>
        </View>
      )}

      <View className="ml-3.5 flex-1">
        <Text className="text-[15px] font-semibold text-slate-800">{item.username}</Text>
        <Text className="mt-1 text-[13px] text-slate-400">{item.email}</Text>
      </View>

      <View className="items-end gap-1">
        <Ionicons name="calendar-outline" size={13} color="#c3c8d0" />
        <Text className="text-[11px] text-slate-400">{formatDate(item.createdAt)}</Text>
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
        {users.length} {users.length === 1 ? "user" : "users"} found
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
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderUser}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator size="small" color="#3b82f6" className="py-4" />
            ) : null
          }
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
      )}
    </View>
  );
}
