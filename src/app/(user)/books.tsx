import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { bookService } from "@/services/book.service";

interface Book {
  _id: string;
  title: string;
  authorName: string;
  category: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
  createdAt: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  fiction: { bg: "#ede9fe", text: "#7c3aed" },
  "non-fiction": { bg: "#fef3c7", text: "#d97706" },
  science: { bg: "#dcfce7", text: "#16a34a" },
  technology: { bg: "#dbeafe", text: "#2563eb" },
  history: { bg: "#fef3c7", text: "#d97706" },
  "self help": { bg: "#fce7f3", text: "#db2777" },
  biography: { bg: "#ccfbf1", text: "#0d9488" },
  business: { bg: "#f1f5f9", text: "#64748b" },
  poetry: { bg: "#ede9fe", text: "#7c3aed" },
  religion: { bg: "#dcfce7", text: "#16a34a" },
  education: { bg: "#dbeafe", text: "#2563eb" },
  children: { bg: "#fce7f3", text: "#db2777" },
};

const BOOK_COLORS = ["#dbeafe", "#ede9fe", "#dcfce7", "#fef3c7", "#fce7f3", "#ccfbf1"];
const BOOK_ICON_COLORS = ["#2563eb", "#7c3aed", "#16a34a", "#d97706", "#db2777", "#0d9488"];

export default function BooksScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBooks = useCallback(async (pageNum: number, search: string, append = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const response = await bookService.getBooks({ search, page: pageNum, limit: 10 });

      setBooks((prev) => (append ? [...prev, ...response.books] : response.books));
      setTotalPages(response.pagination.totalPages);
      setPage(pageNum);
    } catch {
      Toast.show({ type: "error", text1: "Error", text2: "Failed to load books" });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks(1, "");
  }, []);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBooks(1, searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadMore = () => {
    if (!loadingMore && page < totalPages) {
      fetchBooks(page + 1, searchQuery, true);
    }
  };

  const renderBook = ({ item, index }: { item: Book; index: number }) => {
    const catStyle = CATEGORY_COLORS[item.category] || { bg: "#f1f5f9", text: "#64748b" };

    return (
      <TouchableOpacity
        className="mx-5 mb-3 flex-row rounded-2xl bg-white p-4"
        activeOpacity={0.7}
        style={{ elevation: 2, shadowColor: "#64748b", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 }}
        onPress={() =>
          router.push({
            pathname: "/(user)/book-detail",
            params: {
              id: item._id,
              title: item.title,
              authorName: item.authorName,
              category: item.category,
              description: item.description,
              coverImage: item.coverImage,
              pdfUrl: item.pdfUrl,
              createdAt: item.createdAt,
            },
          })
        }
      >
        {/* Book Cover */}
        {item.coverImage ? (
          <Image source={{ uri: item.coverImage }} className="h-28 w-20 rounded-xl" resizeMode="cover" />
        ) : (
          <View
            className="h-28 w-20 items-center justify-center rounded-xl"
            style={{ backgroundColor: BOOK_COLORS[index % BOOK_COLORS.length] }}
          >
            <Ionicons name="book" size={28} color={BOOK_ICON_COLORS[index % BOOK_ICON_COLORS.length]} />
          </View>
        )}

        {/* Book Info */}
        <View className="ml-4 flex-1 justify-between">
          <View>
            <Text className="text-base font-bold text-slate-900" numberOfLines={2}>
              {item.title}
            </Text>
            <Text className="mt-1 text-sm text-slate-500">{item.authorName}</Text>
          </View>

          <View className="mt-2 flex-row items-center justify-between">
            <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: catStyle.bg }}>
              <Text className="text-xs font-semibold capitalize" style={{ color: catStyle.text }}>
                {item.category}
              </Text>
            </View>
          </View>

          <Text className="mt-1 text-xs text-slate-400" numberOfLines={1}>
            {item.description}
          </Text>
        </View>

        <View className="justify-center">
          <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-5 pb-2 pt-4">
        <Text className="text-2xl font-bold text-slate-900">Books</Text>
        <Text className="mt-1 text-sm text-slate-500">
          Discover your next favorite read
        </Text>
      </View>

      {/* Search Bar */}
      <View className="mx-5 mb-4 mt-2 flex-row items-center rounded-xl border border-slate-200 bg-white px-4">
        <Ionicons name="search" size={20} color="#94a3b8" />
        <TextInput
          className="ml-3 flex-1 py-3.5 text-base text-slate-800"
          placeholder="Search books..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== "" && (
          <TouchableOpacity onPress={() => setSearchQuery("")} className="p-1">
            <Ionicons name="close-circle" size={18} color="#cbd5e1" />
          </TouchableOpacity>
        )}
      </View>

      {/* Books List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item._id}
          renderItem={renderBook}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator size="small" color="#2563eb" className="py-4" /> : null
          }
          ListEmptyComponent={
            <View className="items-center pt-20">
              <View className="mb-3 h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                <Ionicons name="book-outline" size={24} color="#94a3b8" />
              </View>
              <Text className="text-[15px] font-medium text-slate-400">No books found</Text>
              <Text className="mt-1 text-[13px] text-slate-300">Try searching something else</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
