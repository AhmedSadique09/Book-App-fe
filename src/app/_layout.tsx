import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import "./globals.css";

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast position="top" topOffset={50} />
    </>
  );
}
