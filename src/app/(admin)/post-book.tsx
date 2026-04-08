import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PostBookScreen() {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [pdfFile, setPdfFile] = useState<{ name: string; uri: string } | null>(null);

  const CATEGORIES = [
    "Fiction",
    "Non-Fiction",
    "Science",
    "Technology",
    "History",
    "Self Help",
    "Biography",
    "Business",
    "Poetry",
    "Religion",
    "Education",
    "Children",
  ];

  const isFormFilled = title !== "" && author !== "" && description !== "" && category !== "" && pdfFile !== null;

  const handlePost = () => {
    Toast.show({
      type: "success",
      text1: "Book Posted",
      text2: "Your book has been posted successfully!",
    });
    setTitle("");
    setAuthor("");
    setDescription("");
    setCategory("");
    setCoverImage(null);
    setPdfFile(null);
  };

  const pickImage = async (source: "gallery" | "camera") => {
    setShowImagePicker(false);
    if (source === "camera") {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission needed", "Camera permission is required.");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });
      if (!result.canceled) setCoverImage(result.assets[0].uri);
    } else {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission needed", "Gallery permission is required.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });
      if (!result.canceled) setCoverImage(result.assets[0].uri);
    }
  };

  const pickPdf = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets?.[0]) {
      setPdfFile({
        name: result.assets[0].name,
        uri: result.assets[0].uri,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#f8fafc]"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pb-1 pt-5">
          <Text className="text-[26px] font-bold text-slate-900">Post a Book</Text>
          <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-50">
            <Ionicons name="book" size={20} color="#3b82f6" />
          </View>
        </View>
        <Text className="mb-5 px-5 text-[13px] text-slate-400">
          Add a new book to the collection
        </Text>

        <View className="px-5 pb-8">
          {/* Cover Image */}
          <TouchableOpacity
            className="mb-6 self-center"
            onPress={() => setShowImagePicker(true)}
          >
            <View
              className="h-48 w-36 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-white"
              style={{
                borderWidth: coverImage ? 0 : 1.5,
                borderColor: "#e2e8f0",
                borderStyle: coverImage ? "solid" : "dashed",
              }}
            >
              {coverImage ? (
                <Image source={{ uri: coverImage }} className="h-48 w-36 rounded-2xl" />
              ) : (
                <View className="items-center">
                  <View className="mb-2 h-11 w-11 items-center justify-center rounded-full bg-slate-50">
                    <Ionicons name="image-outline" size={22} color="#94a3b8" />
                  </View>
                  <Text className="text-[12px] font-medium text-slate-400">Add Cover</Text>
                  <Text className="mt-0.5 text-[11px] text-slate-300">Tap to upload</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          {/* PDF Upload */}
          <TouchableOpacity
            className="mx-2 mb-6 flex-row items-center rounded-2xl border border-slate-100 bg-white px-4 py-4"
            onPress={pickPdf}
            activeOpacity={0.7}
          >
            <View className="h-11 w-11 items-center justify-center rounded-full bg-red-50">
              <Ionicons name="document-text-outline" size={22} color="#ef4444" />
            </View>
            <View className="ml-3 flex-1">
              {pdfFile ? (
                <>
                  <Text className="text-[14px] font-semibold text-slate-800" numberOfLines={1}>
                    {pdfFile.name}
                  </Text>
                  <Text className="mt-0.5 text-[12px] text-green-500">PDF uploaded</Text>
                </>
              ) : (
                <>
                  <Text className="text-[14px] font-medium text-slate-700">Upload Book PDF</Text>
                  <Text className="mt-0.5 text-[12px] text-slate-400">Tap to select a PDF file</Text>
                </>
              )}
            </View>
            {pdfFile ? (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  setPdfFile(null);
                }}
                className="p-1"
              >
                <Ionicons name="close-circle" size={20} color="#cbd5e1" />
              </TouchableOpacity>
            ) : (
              <Ionicons name="cloud-upload-outline" size={20} color="#94a3b8" />
            )}
          </TouchableOpacity>

          {/* Form inside a card */}
          <View className="rounded-2xl border border-slate-100 bg-white p-4">
            {/* Book Title */}
            <View className="mb-4">
              <Text className="mb-1.5 text-[13px] font-medium text-slate-500">Book Title</Text>
              <View className="flex-row items-center rounded-xl border border-slate-100 bg-[#f8fafc] px-3.5">
                <Ionicons name="book-outline" size={17} color="#94a3b8" />
                <TextInput
                  className="ml-2.5 flex-1 py-3.5 text-[15px] text-slate-800"
                  placeholder="Enter book title"
                  placeholderTextColor="#b0b8c4"
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
            </View>

            {/* Author */}
            <View className="mb-4">
              <Text className="mb-1.5 text-[13px] font-medium text-slate-500">Author</Text>
              <View className="flex-row items-center rounded-xl border border-slate-100 bg-[#f8fafc] px-3.5">
                <Ionicons name="person-outline" size={17} color="#94a3b8" />
                <TextInput
                  className="ml-2.5 flex-1 py-3.5 text-[15px] text-slate-800"
                  placeholder="Enter author name"
                  placeholderTextColor="#b0b8c4"
                  value={author}
                  onChangeText={setAuthor}
                />
              </View>
            </View>

            {/* Category Dropdown */}
            <View className="mb-4">
              <Text className="mb-1.5 text-[13px] font-medium text-slate-500">Category</Text>
              <TouchableOpacity
                className="flex-row items-center rounded-xl border border-slate-100 bg-[#f8fafc] px-3.5 py-3.5"
                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                activeOpacity={0.7}
              >
                <Ionicons name="pricetag-outline" size={17} color="#94a3b8" />
                <Text
                  className={`ml-2.5 flex-1 text-[15px] ${category ? "text-slate-800" : "text-[#b0b8c4]"}`}
                >
                  {category || "Select a category"}
                </Text>
                <Ionicons
                  name={showCategoryDropdown ? "chevron-up" : "chevron-down"}
                  size={16}
                  color="#94a3b8"
                />
              </TouchableOpacity>
              {showCategoryDropdown && (
                <View className="mt-1.5 overflow-hidden rounded-xl border border-slate-100 bg-white">
                  {CATEGORIES.map((cat, index) => (
                    <TouchableOpacity
                      key={cat}
                      className={`flex-row items-center px-4 py-3 ${index !== CATEGORIES.length - 1 ? "border-b border-slate-50" : ""} ${category === cat ? "bg-blue-50" : ""}`}
                      onPress={() => {
                        setCategory(cat);
                        setShowCategoryDropdown(false);
                      }}
                      activeOpacity={0.6}
                    >
                      <Text
                        className={`flex-1 text-[14px] ${category === cat ? "font-semibold text-blue-600" : "text-slate-700"}`}
                      >
                        {cat}
                      </Text>
                      {category === cat && (
                        <Ionicons name="checkmark" size={16} color="#2563eb" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Description */}
            <View>
              <Text className="mb-1.5 text-[13px] font-medium text-slate-500">Description</Text>
              <View className="rounded-xl border border-slate-100 bg-[#f8fafc] px-3.5">
                <TextInput
                  className="py-3.5 text-[15px] text-slate-800"
                  placeholder="Write a brief description..."
                  placeholderTextColor="#b0b8c4"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  textAlignVertical="top"
                  style={{ minHeight: 100 }}
                />
              </View>
            </View>
          </View>

          {/* Post Button */}
          <TouchableOpacity
            className={`mt-5 flex-row items-center justify-center rounded-2xl py-[15px] ${isFormFilled ? "bg-blue-600" : "bg-slate-200"}`}
            onPress={handlePost}
            activeOpacity={0.8}
            disabled={!isFormFilled}
          >
            <Ionicons
              name="cloud-upload-outline"
              size={18}
              color={isFormFilled ? "#ffffff" : "#94a3b8"}
            />
            <Text className={`ml-2 text-[16px] font-bold ${isFormFilled ? "text-white" : "text-slate-400"}`}>
              Post Book
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Image Picker Modal */}
      <Modal
        visible={showImagePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowImagePicker(false)}
      >
        <Pressable className="flex-1 bg-black/50" onPress={() => setShowImagePicker(false)}>
          <Pressable className="mt-auto rounded-t-3xl bg-white px-6 pb-10 pt-4" onPress={() => {}}>
            <View className="mb-5 items-center">
              <View className="h-1 w-10 rounded-full bg-slate-200" />
            </View>
            <Text className="mb-5 text-center text-lg font-bold text-slate-900">Book Cover</Text>
            <View className="gap-3">
              <TouchableOpacity
                className="flex-row items-center rounded-2xl border border-slate-100 bg-white px-4 py-3.5"
                onPress={() => pickImage("camera")}
                activeOpacity={0.7}
              >
                <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                  <Ionicons name="camera-outline" size={20} color="#3b82f6" />
                </View>
                <View className="ml-3">
                  <Text className="text-[15px] font-medium text-slate-800">Camera</Text>
                  <Text className="text-[12px] text-slate-400">Take a new photo</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center rounded-2xl border border-slate-100 bg-white px-4 py-3.5"
                onPress={() => pickImage("gallery")}
                activeOpacity={0.7}
              >
                <View className="h-10 w-10 items-center justify-center rounded-full bg-purple-50">
                  <Ionicons name="images-outline" size={20} color="#8b5cf6" />
                </View>
                <View className="ml-3">
                  <Text className="text-[15px] font-medium text-slate-800">Gallery</Text>
                  <Text className="text-[12px] text-slate-400">Choose from photos</Text>
                </View>
              </TouchableOpacity>
              {coverImage && (
                <TouchableOpacity
                  className="flex-row items-center rounded-2xl border border-red-100 bg-red-50 px-4 py-3.5"
                  onPress={() => { setShowImagePicker(false); setCoverImage(null); }}
                  activeOpacity={0.7}
                >
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-red-100">
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </View>
                  <Text className="ml-3 text-[15px] font-medium text-red-500">Remove Cover</Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              className="mt-4 items-center rounded-2xl bg-slate-50 py-3.5"
              onPress={() => setShowImagePicker(false)}
              activeOpacity={0.7}
            >
              <Text className="text-[15px] font-medium text-slate-500">Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}
