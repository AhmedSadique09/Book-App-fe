import { View, Text, Image, TouchableOpacity, ScrollView, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

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

export default function BookDetailScreen() {
  const insets = useSafeAreaInsets();
  const { title, authorName, category, description, coverImage, pdfUrl, createdAt } = useLocalSearchParams<{
    id: string;
    title: string;
    authorName: string;
    category: string;
    description: string;
    coverImage: string;
    pdfUrl: string;
    createdAt: string;
  }>();

  const catStyle = CATEGORY_COLORS[category || ""] || { bg: "#f1f5f9", text: "#64748b" };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
  };

  const openPdf = () => {
    if (pdfUrl) Linking.openURL(pdfUrl);
  };

  return (
    <View className="flex-1 bg-[#f8fafc]" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pb-2 pt-4">
        <TouchableOpacity
          className="h-10 w-10 items-center justify-center rounded-full bg-white"
          onPress={() => router.back()}
          style={{ elevation: 2, shadowColor: "#64748b", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 }}
        >
          <Ionicons name="arrow-back" size={20} color="#334155" />
        </TouchableOpacity>
        <Text className="flex-1 ml-3 text-lg font-bold text-slate-900" numberOfLines={1}>
          Book Details
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Cover Image Hero Section */}
        <View className="items-center bg-white pb-8 pt-6"
          style={{ elevation: 1, shadowColor: "#64748b", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 }}
        >
          <View style={{ elevation: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12 }}>
            {coverImage ? (
              <Image
                source={{ uri: coverImage }}
                className="h-72 w-48 rounded-2xl"
                resizeMode="cover"
              />
            ) : (
              <View className="h-72 w-48 items-center justify-center rounded-2xl bg-blue-50">
                <Ionicons name="book" size={56} color="#2563eb" />
              </View>
            )}
          </View>

          {/* Title & Author */}
          <Text className="mt-6 px-8 text-center text-[22px] font-bold text-slate-900">
            {title}
          </Text>
          <View className="mt-2 flex-row items-center">
            <Ionicons name="person-outline" size={14} color="#94a3b8" />
            <Text className="ml-1.5 text-[15px] text-slate-500">{authorName}</Text>
          </View>

          {/* Category Badge */}
          <View className="mt-4 rounded-full px-4 py-1.5" style={{ backgroundColor: catStyle.bg }}>
            <Text className="text-[13px] font-bold capitalize" style={{ color: catStyle.text }}>
              {category}
            </Text>
          </View>
        </View>

        {/* Added Date */}
        <View className="mx-5 mt-5 flex-row items-center justify-center">
          <Ionicons name="calendar-outline" size={14} color="#94a3b8" />
          <Text className="ml-1.5 text-[13px] text-slate-400">
            Added {formatDate(createdAt) || "Recently"}
          </Text>
        </View>

        {/* Description Card */}
        <View
          className="mx-5 mt-4 rounded-2xl bg-white p-5"
          style={{ elevation: 2, shadowColor: "#64748b", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 }}
        >
          <View className="mb-3 flex-row items-center">
            <View className="h-8 w-8 items-center justify-center rounded-lg bg-slate-50">
              <Ionicons name="reader-outline" size={16} color="#64748b" />
            </View>
            <Text className="ml-2.5 text-[15px] font-bold text-slate-900">About this book</Text>
          </View>
          <Text className="text-[14px] leading-6 text-slate-600">{description}</Text>
        </View>

        {/* Read PDF Button */}
        {pdfUrl && (
          <View className="mx-5 mt-5">
            <TouchableOpacity
              className="flex-row items-center justify-center rounded-2xl bg-blue-600 py-[15px]"
              activeOpacity={0.8}
              onPress={openPdf}
            >
              <Ionicons name="book-outline" size={20} color="#ffffff" />
              <Text className="ml-2 text-[16px] font-bold text-white">Read Book</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-3 flex-row items-center justify-center rounded-2xl border border-slate-200 bg-white py-[15px]"
              activeOpacity={0.7}
              onPress={openPdf}
            >
              <Ionicons name="download-outline" size={20} color="#2563eb" />
              <Text className="ml-2 text-[16px] font-bold text-blue-600">Download PDF</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
