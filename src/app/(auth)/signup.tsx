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
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function SignUp() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);

  const pickImage = async (source: "gallery" | "camera") => {
    setShowImagePicker(false);
    if (source === "camera") {
      const permission =
        await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission needed", "Camera permission is required.");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } else {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission needed", "Gallery permission is required.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    }
  };

  const removePhoto = () => {
    setShowImagePicker(false);
    setProfileImage(null);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-50"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-7 py-12">
          {/* Header */}
          <View className="mb-8 items-center">
            <Text className="text-3xl font-bold tracking-tight text-slate-900">
              Create Account
            </Text>
            <Text className="mt-2 text-base text-slate-500">
              Join us and start your journey
            </Text>
          </View>

          {/* Profile Image */}
          <TouchableOpacity
            className="mb-8 items-center"
            onPress={() => setShowImagePicker(true)}
          >
            <View className="h-28 w-28 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-white">
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  className="h-28 w-28 rounded-full"
                />
              ) : (
                <View className="items-center">
                  <Ionicons name="camera-outline" size={28} color="#94a3b8" />
                  <Text className="mt-1 text-xs text-slate-400">
                    Add Photo
                  </Text>
                </View>
              )}
            </View>
            {profileImage && (
              <View className="mt-2 flex-row items-center">
                <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
                <Text className="ml-1 text-xs text-green-600">
                  Photo added
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Username */}
          <View className="mb-5">
            <Text className="mb-2 text-sm font-medium text-slate-700">
              Username
            </Text>
            <View className="flex-row items-center rounded-xl border border-slate-200 bg-white px-4">
              <Ionicons name="person-outline" size={20} color="#94a3b8" />
              <TextInput
                className="ml-3 flex-1 py-4 text-base text-slate-900"
                placeholder="Choose a username"
                placeholderTextColor="#94a3b8"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Email */}
          <View className="mb-5">
            <Text className="mb-2 text-sm font-medium text-slate-700">
              Email Address
            </Text>
            <View className="flex-row items-center rounded-xl border border-slate-200 bg-white px-4">
              <Ionicons name="mail-outline" size={20} color="#94a3b8" />
              <TextInput
                className="ml-3 flex-1 py-4 text-base text-slate-900"
                placeholder="example@email.com"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password */}
          <View className="mb-8">
            <Text className="mb-2 text-sm font-medium text-slate-700">
              Password
            </Text>
            <View className="flex-row items-center rounded-xl border border-slate-200 bg-white px-4">
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#94a3b8"
              />
              <TextInput
                className="ml-3 flex-1 py-4 text-base text-slate-900"
                placeholder="Create a strong password"
                placeholderTextColor="#94a3b8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#94a3b8"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            className="mb-6 rounded-xl bg-blue-600 py-4 shadow-sm shadow-blue-300"
            onPress={() => router.push("/(auth)/otp")}
            activeOpacity={0.8}
          >
            <Text className="text-center text-lg font-bold text-white">
              Sign Up
            </Text>
          </TouchableOpacity>

          {/* Go to Sign In */}
          <View className="flex-row justify-center">
            <Text className="text-sm text-slate-500">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/signin")}>
              <Text className="text-sm font-bold text-blue-600">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Image Picker Bottom Sheet Modal */}
      <Modal
        visible={showImagePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowImagePicker(false)}
      >
        <Pressable
          className="flex-1 bg-black/50"
          onPress={() => setShowImagePicker(false)}
        >
          <Pressable
            className="mt-auto rounded-t-3xl bg-white px-6 pb-10 pt-4"
            onPress={() => {}}
          >
            {/* Handle Bar */}
            <View className="mb-6 items-center">
              <View className="h-1 w-10 rounded-full bg-slate-300" />
            </View>

            {/* Title */}
            <Text className="mb-6 text-center text-xl font-bold text-slate-900">
              Upload Photo
            </Text>

            {/* Options */}
            <View className="gap-3">
              {/* Camera */}
              <TouchableOpacity
                className="flex-row items-center rounded-2xl bg-slate-50 px-5 py-4"
                onPress={() => pickImage("camera")}
                activeOpacity={0.7}
              >
                <View className="h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <Ionicons name="camera" size={24} color="#2563eb" />
                </View>
                <View className="ml-4">
                  <Text className="text-base font-semibold text-slate-900">
                    Camera
                  </Text>
                  <Text className="text-sm text-slate-500">
                    Take a new photo
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#94a3b8"
                  style={{ marginLeft: "auto" }}
                />
              </TouchableOpacity>

              {/* Gallery */}
              <TouchableOpacity
                className="flex-row items-center rounded-2xl bg-slate-50 px-5 py-4"
                onPress={() => pickImage("gallery")}
                activeOpacity={0.7}
              >
                <View className="h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <Ionicons name="images" size={24} color="#7c3aed" />
                </View>
                <View className="ml-4">
                  <Text className="text-base font-semibold text-slate-900">
                    Gallery
                  </Text>
                  <Text className="text-sm text-slate-500">
                    Choose from your photos
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#94a3b8"
                  style={{ marginLeft: "auto" }}
                />
              </TouchableOpacity>

              {/* Remove Photo */}
              {profileImage && (
                <TouchableOpacity
                  className="flex-row items-center rounded-2xl bg-red-50 px-5 py-4"
                  onPress={removePhoto}
                  activeOpacity={0.7}
                >
                  <View className="h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <Ionicons name="trash" size={24} color="#dc2626" />
                  </View>
                  <View className="ml-4">
                    <Text className="text-base font-semibold text-red-600">
                      Remove Photo
                    </Text>
                    <Text className="text-sm text-red-400">
                      Delete current photo
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            {/* Cancel Button */}
            <TouchableOpacity
              className="mt-5 rounded-2xl border border-slate-200 bg-white py-4"
              onPress={() => setShowImagePicker(false)}
              activeOpacity={0.7}
            >
              <Text className="text-center text-base font-semibold text-slate-600">
                Cancel
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}
