import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HttpService } from "@/services/base.service";
import { userService } from "@/services/user.service";

export default function UserSettingsScreen() {
  const insets = useSafeAreaInsets();
  const [isEditing, setIsEditing] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [newProfileImage, setNewProfileImage] = useState<string | null>(null);

  // Password fields
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Load user data from storage
  useEffect(() => {
    (async () => {
      const storedName = await HttpService.getItem("fullName");
      const storedEmail = await HttpService.getItem("email");
      const storedImage = await HttpService.getItem("profilePicture");
      if (storedName) setName(storedName);
      if (storedEmail) setEmail(storedEmail);
      if (storedImage) setProfileImage(storedImage);
    })();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);

      const updateData: {
        username?: string;
        currentPassword?: string;
        newPassword?: string;
        profileImage?: string | null;
      } = { username: name };

      if (currentPassword && newPassword) {
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      }

      if (newProfileImage) {
        updateData.profileImage = newProfileImage;
      }

      const response = await userService.updateProfile(updateData);

      // Update storage with new data
      if (response.user?.username) await HttpService.setItem("fullName", response.user.username);
      if (response.user?.profileImage) {
        await HttpService.setItem("profilePicture", response.user.profileImage);
        setProfileImage(response.user.profileImage);
      }

      setNewProfileImage(null);
      setIsEditing(false);
      setShowPasswordSection(false);
      setCurrentPassword("");
      setNewPassword("");
      Toast.show({
        type: "success",
        text1: "Profile Updated",
        text2: "Your changes have been saved.",
      });
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to update profile.";
      Toast.show({ type: "error", text1: "Error", text2: message });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await HttpService.clearStorage();
    router.replace("/(auth)/signin");
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
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
        setNewProfileImage(result.assets[0].uri);
      }
    } else {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
      if (!result.canceled) setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-50"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pb-2 pt-4">
          <View>
            <Text className="text-2xl font-bold text-slate-900">Settings</Text>
            <Text className="mt-1 text-sm text-slate-500">Manage your account</Text>
          </View>
          {!isEditing ? (
            <TouchableOpacity
              className="rounded-xl bg-blue-50 px-4 py-2.5"
              onPress={() => setIsEditing(true)}
            >
              <Text className="text-sm font-bold text-blue-600">Edit</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="rounded-xl bg-blue-600 px-4 py-2.5"
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text className="text-sm font-bold text-white">Save</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Profile Card */}
        <View
          className="mx-5 mb-6 mt-4 items-center rounded-2xl bg-white p-6"
          style={{ elevation: 2, shadowColor: "#64748b", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 }}
        >
          <TouchableOpacity
            onPress={() => isEditing && setShowImagePicker(true)}
            activeOpacity={isEditing ? 0.7 : 1}
          >
            <View className="relative">
              {profileImage ? (
                <Image source={{ uri: profileImage }} className="h-24 w-24 rounded-full" />
              ) : (
                <View className="h-24 w-24 items-center justify-center rounded-full bg-blue-100">
                  <Text className="text-3xl font-bold text-blue-600">
                    {name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                  </Text>
                </View>
              )}
              {isEditing && (
                <View className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-600">
                  <Ionicons name="camera" size={14} color="#ffffff" />
                </View>
              )}
            </View>
          </TouchableOpacity>

          {!isEditing ? (
            <>
              <Text className="mt-4 text-xl font-bold text-slate-900">{name}</Text>
              <Text className="mt-1 text-sm text-slate-500">{email}</Text>
            </>
          ) : (
            <View className="mt-4 w-full">
              <Text className="mb-2 text-sm font-medium text-slate-700">Full Name</Text>
              <View className="flex-row items-center rounded-xl border border-slate-200 bg-slate-50 px-4">
                <Ionicons name="person-outline" size={20} color="#94a3b8" />
                <TextInput
                  className="ml-3 flex-1 py-3.5 text-base text-slate-900"
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  placeholderTextColor="#94a3b8"
                />
              </View>
              <Text className="mb-2 mt-4 text-sm font-medium text-slate-700">Email</Text>
              <View className="flex-row items-center rounded-xl border border-slate-200 bg-slate-100 px-4">
                <Ionicons name="mail-outline" size={20} color="#94a3b8" />
                <Text className="ml-3 flex-1 py-3.5 text-base text-slate-400">{email}</Text>
                <Ionicons name="lock-closed" size={14} color="#cbd5e1" />
              </View>
            </View>
          )}
        </View>

        {/* Change Password Section */}
        {isEditing && (
          <View className="mx-5 mb-6">
            <TouchableOpacity
              className="flex-row items-center justify-between rounded-2xl bg-white px-5 py-4"
              onPress={() => setShowPasswordSection(!showPasswordSection)}
              style={{ elevation: 2, shadowColor: "#64748b", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 }}
            >
              <View className="flex-row items-center">
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                  <Ionicons name="key-outline" size={20} color="#d97706" />
                </View>
                <Text className="ml-3 text-base font-medium text-slate-900">Change Password</Text>
              </View>
              <Ionicons
                name={showPasswordSection ? "chevron-up" : "chevron-down"}
                size={18}
                color="#94a3b8"
              />
            </TouchableOpacity>

            {showPasswordSection && (
              <View
                className="mt-2 rounded-2xl bg-white p-5"
                style={{ elevation: 2, shadowColor: "#64748b", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 }}
              >
                <Text className="mb-2 text-sm font-medium text-slate-700">Current Password</Text>
                <View className="mb-4 flex-row items-center rounded-xl border border-slate-200 bg-slate-50 px-4">
                  <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />
                  <TextInput
                    className="ml-3 flex-1 py-3.5 text-base text-slate-900"
                    placeholder="Enter current password"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={!showCurrentPassword}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                  />
                  <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                    <Ionicons
                      name={showCurrentPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#94a3b8"
                    />
                  </TouchableOpacity>
                </View>

                <Text className="mb-2 text-sm font-medium text-slate-700">New Password</Text>
                <View className="flex-row items-center rounded-xl border border-slate-200 bg-slate-50 px-4">
                  <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />
                  <TextInput
                    className="ml-3 flex-1 py-3.5 text-base text-slate-900"
                    placeholder="Enter new password"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={!showNewPassword}
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                  <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                    <Ionicons
                      name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#94a3b8"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Menu Items (when not editing) */}
        {!isEditing && (
          <View
            className="mx-5 mb-6 overflow-hidden rounded-2xl bg-white"
            style={{ elevation: 2, shadowColor: "#64748b", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 }}
          >
            <TouchableOpacity className="flex-row items-center border-b border-slate-100 px-5 py-4">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <Ionicons name="book-outline" size={20} color="#2563eb" />
              </View>
              <Text className="ml-3 flex-1 text-base font-medium text-slate-900">My Library</Text>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center border-b border-slate-100 px-5 py-4">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                <Ionicons name="notifications-outline" size={20} color="#7c3aed" />
              </View>
              <Text className="ml-3 flex-1 text-base font-medium text-slate-900">Notifications</Text>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center px-5 py-4">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <Ionicons name="help-circle-outline" size={20} color="#64748b" />
              </View>
              <Text className="ml-3 flex-1 text-base font-medium text-slate-900">Help & Support</Text>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
            </TouchableOpacity>
          </View>
        )}

        {/* Logout */}
        <View className="mx-5 mb-6">
          <TouchableOpacity
            className="flex-row items-center justify-center rounded-2xl bg-red-50 py-4"
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={22} color="#dc2626" />
            <Text className="ml-2 text-base font-bold text-red-600">Log Out</Text>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <View className="items-center pb-6">
          <Text className="text-xs text-slate-400">Book App v1.0.0</Text>
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
            <View className="mb-6 items-center">
              <View className="h-1 w-10 rounded-full bg-slate-300" />
            </View>
            <Text className="mb-6 text-center text-xl font-bold text-slate-900">
              Profile Photo
            </Text>
            <View className="gap-3">
              <TouchableOpacity
                className="flex-row items-center rounded-2xl bg-slate-50 px-5 py-4"
                onPress={() => pickImage("camera")}
              >
                <View className="h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <Ionicons name="camera" size={24} color="#2563eb" />
                </View>
                <View className="ml-4">
                  <Text className="text-base font-semibold text-slate-900">Camera</Text>
                  <Text className="text-sm text-slate-500">Take a new photo</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center rounded-2xl bg-slate-50 px-5 py-4"
                onPress={() => pickImage("gallery")}
              >
                <View className="h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <Ionicons name="images" size={24} color="#7c3aed" />
                </View>
                <View className="ml-4">
                  <Text className="text-base font-semibold text-slate-900">Gallery</Text>
                  <Text className="text-sm text-slate-500">Choose from photos</Text>
                </View>
              </TouchableOpacity>
              {profileImage && (
                <TouchableOpacity
                  className="flex-row items-center rounded-2xl bg-red-50 px-5 py-4"
                  onPress={() => { setShowImagePicker(false); setProfileImage(null); }}
                >
                  <View className="h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <Ionicons name="trash" size={24} color="#dc2626" />
                  </View>
                  <View className="ml-4">
                    <Text className="text-base font-semibold text-red-600">Remove Photo</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              className="mt-5 rounded-2xl border border-slate-200 bg-white py-4"
              onPress={() => setShowImagePicker(false)}
            >
              <Text className="text-center text-base font-semibold text-slate-600">Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}
