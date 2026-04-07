import { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from "react-native";
import { router, Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const RESEND_SECONDS = 30;

export default function OTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = useCallback(() => {
    setTimer(RESEND_SECONDS);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    inputs.current[0]?.focus();
  }, []);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const isComplete = otp.every((digit) => digit !== "");
  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-50"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 px-7">
        {/* Back Button */}
        <TouchableOpacity
          className="mt-14 h-11 w-11 items-center justify-center rounded-full bg-white"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="#334155" />
        </TouchableOpacity>

        <View className="flex-1 justify-center">
          {/* Header Icon */}
          <View className="mb-8 items-center">
            <View className="mb-5 h-24 w-24 items-center justify-center rounded-3xl bg-blue-600">
              <Ionicons name="mail-open" size={44} color="white" />
            </View>
            <Text className="text-3xl font-bold tracking-tight text-slate-900">
              Check your email
            </Text>
            <Text className="mt-3 text-center text-base leading-6 text-slate-500">
              We sent a verification code to{"\n"}
              <Text className="font-semibold text-slate-700">
                your email address
              </Text>
            </Text>
          </View>



          {/* OTP Boxes */}
          <View className="mb-4 flex-row justify-center gap-3">
            {otp.map((digit, index) => (
              <View key={index}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => inputs.current[index]?.focus()}
                >
                  <View
                    className={`h-16 w-12 items-center justify-center rounded-2xl border-2 ${
                      digit
                        ? "border-blue-600 bg-blue-50"
                        : focusedIndex === index
                          ? "border-blue-400 bg-white"
                          : "border-slate-200 bg-white"
                    }`}
                  >
                    <TextInput
                      ref={(ref) => {
                        inputs.current[index] = ref;
                      }}
                      className="h-full w-full text-center text-2xl font-bold text-blue-600"
                      maxLength={1}
                      keyboardType="number-pad"
                      value={digit}
                      onChangeText={(text) => handleChange(text, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      onFocus={() => setFocusedIndex(index)}
                      caretHidden
                    />
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Timer */}
          <View className="mb-8 items-center">
            {!canResend && (
              <View className="flex-row items-center rounded-full bg-slate-100 px-4 py-2">
                <Ionicons name="time-outline" size={16} color="#64748b" />
                <Text className="ml-2 text-sm font-medium text-slate-500">
                  Resend code in{" "}
                  <Text className="font-bold text-slate-700">
                    {formatTime(timer)}
                  </Text>
                </Text>
              </View>
            )}
          </View>

          {/* Verify Button */}
          <Link href="/dashboard" asChild disabled={!isComplete}>
            <TouchableOpacity
              style={{
                marginBottom: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 16,
                paddingVertical: 16,
                backgroundColor: isComplete ? "#2563eb" : "#e2e8f0",
              }}
              activeOpacity={0.8}
              disabled={!isComplete}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: isComplete ? "#ffffff" : "#94a3b8",
                }}
              >
                Verify & Continue
              </Text>
              {isComplete && (
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color="white"
                  style={{ marginLeft: 8 }}
                />
              )}
            </TouchableOpacity>
          </Link>

          {/* Resend */}
          <View className="items-center">
            <Text className="mb-3 text-sm text-slate-500">
              Didn't receive the code?
            </Text>
            <TouchableOpacity
              className={`rounded-xl px-6 py-3 ${
                canResend ? "bg-slate-900" : "bg-slate-100"
              }`}
              onPress={handleResend}
              disabled={!canResend}
              activeOpacity={0.8}
            >
              <Text
                className={`text-sm font-bold ${
                  canResend ? "text-white" : "text-slate-400"
                }`}
              >
                Resend Code
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
