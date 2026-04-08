import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DUMMY_BOOKS = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: "850",
    category: "Fiction",
    coverImage: null,
    rating: 4.5,
  },
  {
    id: "2",
    title: "Atomic Habits",
    author: "James Clear",
    price: "1200",
    category: "Self Help",
    coverImage: null,
    rating: 4.8,
  },
  {
    id: "3",
    title: "Clean Code",
    author: "Robert C. Martin",
    price: "1500",
    category: "Technology",
    coverImage: null,
    rating: 4.6,
  },
  {
    id: "4",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    price: "950",
    category: "History",
    coverImage: null,
    rating: 4.7,
  },
  {
    id: "5",
    title: "Deep Work",
    author: "Cal Newport",
    price: "1100",
    category: "Productivity",
    coverImage: null,
    rating: 4.4,
  },
  {
    id: "6",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    price: "900",
    category: "Finance",
    coverImage: null,
    rating: 4.7,
  },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Fiction: { bg: "#ede9fe", text: "#7c3aed" },
  "Self Help": { bg: "#dcfce7", text: "#16a34a" },
  Technology: { bg: "#dbeafe", text: "#2563eb" },
  History: { bg: "#fef3c7", text: "#d97706" },
  Productivity: { bg: "#fce7f3", text: "#db2777" },
  Finance: { bg: "#ccfbf1", text: "#0d9488" },
};

const BOOK_COLORS = ["#dbeafe", "#ede9fe", "#dcfce7", "#fef3c7", "#fce7f3", "#ccfbf1"];
const BOOK_ICON_COLORS = ["#2563eb", "#7c3aed", "#16a34a", "#d97706", "#db2777", "#0d9488"];

export default function BooksScreen() {
  const insets = useSafeAreaInsets();

  const renderBook = ({ item, index }: { item: (typeof DUMMY_BOOKS)[0]; index: number }) => {
    const catStyle = CATEGORY_COLORS[item.category] || { bg: "#f1f5f9", text: "#64748b" };

    return (
      <TouchableOpacity
        className="mx-5 mb-3 flex-row rounded-2xl bg-white p-4"
        activeOpacity={0.7}
        style={{ elevation: 2, shadowColor: "#64748b", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 }}
      >
        {/* Book Cover Placeholder */}
        <View
          className="h-28 w-20 items-center justify-center rounded-xl"
          style={{ backgroundColor: BOOK_COLORS[index % BOOK_COLORS.length] }}
        >
          <Ionicons name="book" size={28} color={BOOK_ICON_COLORS[index % BOOK_ICON_COLORS.length]} />
        </View>

        {/* Book Info */}
        <View className="ml-4 flex-1 justify-between">
          <View>
            <Text className="text-base font-bold text-slate-900" numberOfLines={2}>
              {item.title}
            </Text>
            <Text className="mt-1 text-sm text-slate-500">{item.author}</Text>
          </View>

          <View className="mt-2 flex-row items-center justify-between">
            <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: catStyle.bg }}>
              <Text className="text-xs font-semibold" style={{ color: catStyle.text }}>
                {item.category}
              </Text>
            </View>

            <View className="flex-row items-center">
              <Ionicons name="star" size={14} color="#f59e0b" />
              <Text className="ml-1 text-sm font-semibold text-slate-700">{item.rating}</Text>
            </View>
          </View>

          <Text className="mt-1 text-lg font-bold text-blue-600">Rs {item.price}</Text>
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
        <Text className="ml-3 flex-1 py-3.5 text-base text-slate-400">
          Search books...
        </Text>
        <View className="h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
          <Ionicons name="options-outline" size={16} color="#2563eb" />
        </View>
      </View>

      {/* Books List */}
      <FlatList
        data={DUMMY_BOOKS}
        keyExtractor={(item) => item.id}
        renderItem={renderBook}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
