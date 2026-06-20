import React, { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenShell } from "../components/common";
import { ACCENT, FONT, PHONE_WIDTH } from "../theme";
import { useApp } from "../context/AppContext";

export default function OnboardingScreen() {
  const { completeOnboarding } = useApp();
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 2200, easing: Easing.inOut(Easing.quad), useNativeDriver: true })
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [float]);

  const carTranslate = float.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });
  const carScale = float.interpolate({ inputRange: [0, 1], outputRange: [1, 1.025] });

  return (
    <ScreenShell>
      <View style={styles.onboardingContent}>
        <View style={styles.onboardingCopy}>
          <Text style={styles.heroEyebrow}>Премиум подбор авто</Text>
          <Text style={styles.heroTitle}>Найди{"\n"}идеальный{"\n"}автомобиль</Text>
          <Text style={styles.heroSubtitle}>Свайпай вправо, если нравится,{"\n"}и влево, если не твое</Text>
        </View>
        <Animated.Image
          source={{ uri: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1300&q=85" }}
          style={[styles.onboardingCar, { transform: [{ translateY: carTranslate }, { scale: carScale }] }]}
        />
        <LinearGradient colors={["transparent", "rgba(0,0,0,0.97)"]} style={styles.onboardingFade} />
        <View style={styles.onboardingActions}>
          <Pressable onPress={completeOnboarding} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <Text style={styles.primaryButtonText}>Начать</Text>
          </Pressable>
          <Pressable onPress={completeOnboarding} style={styles.textButton}>
            <Text style={styles.loginText}>Войти</Text>
          </Pressable>
        </View>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  onboardingContent: { flex: 1, justifyContent: "space-between" },
  onboardingCopy: { marginTop: 74, zIndex: 3 },
  heroEyebrow: {
    color: ACCENT,
    fontFamily: FONT.bodyExtra,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.4,
    marginBottom: 15,
    textTransform: "uppercase"
  },
  heroTitle: { color: "#ffffff", fontFamily: FONT.display, fontSize: 39, lineHeight: 43, fontWeight: "900" },
  heroSubtitle: { color: "#a0a4ab", fontFamily: FONT.bodySemi, fontSize: 18, lineHeight: 25, fontWeight: "600", marginTop: 18 },
  onboardingCar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 122,
    width: "100%",
    height: Math.min(PHONE_WIDTH * 0.92, 380),
    resizeMode: "cover",
    borderRadius: 22,
    opacity: 0.95
  },
  onboardingFade: { position: "absolute", left: -18, right: -18, bottom: 0, height: 320 },
  onboardingActions: { paddingBottom: 28, zIndex: 2 },
  primaryButton: {
    height: 58,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    shadowColor: "#ffffff",
    shadowOpacity: 0.22,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 }
  },
  primaryButtonText: { color: "#0b0b0d", fontFamily: FONT.bodyExtra, fontSize: 16, fontWeight: "800" },
  textButton: { alignItems: "center", justifyContent: "center", paddingVertical: 22 },
  loginText: { color: "#888c94", fontFamily: FONT.bodyBold, fontSize: 16, fontWeight: "700" },
  pressed: { opacity: 0.82, transform: [{ scale: 0.98 }] }
});
