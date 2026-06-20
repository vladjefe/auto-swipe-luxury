import React, { useEffect, useRef } from "react";
import { Animated, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenShell } from "../components/common";
import { ACCENT, FONT } from "../theme";
import { useApp } from "../context/AppContext";
import { carById, userAvatar } from "../data/cars";

export default function MatchScreen({ params }) {
  const { closeOverlay, setTab } = useApp();
  const car = carById(params?.carId) || carById("porsche-911");
  const pop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(pop, { toValue: 1, friction: 6, tension: 70, useNativeDriver: true }).start();
  }, [pop]);

  const scale = pop.interpolate({ inputRange: [0, 1], outputRange: [0.82, 1] });
  const opacity = pop.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  const openGarage = () => {
    setTab("garage");
    closeOverlay();
  };

  return (
    <ScreenShell>
      <Animated.View style={[styles.content, { opacity, transform: [{ scale }] }]}>
        <View style={styles.copy}>
          <Text style={styles.title}>Взаимный интерес</Text>
          <Text style={styles.subtitle}>Вы сохранили {car.name}.{"\n"}Автомобиль уже в вашем гараже.</Text>
        </View>

        <View style={styles.avatarPair}>
          <View style={styles.avatarRing}>
            <Image source={{ uri: userAvatar }} style={styles.avatarImage} />
          </View>
          <View style={[styles.avatarRing, styles.carAvatarRing]}>
            <Image source={{ uri: car.image }} style={styles.avatarImage} />
          </View>
          <View style={styles.heartBetween}>
            <Ionicons name="heart" size={22} color="#ffffff" />
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable onPress={openGarage} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <Text style={styles.primaryButtonText}>Открыть гараж</Text>
          </Pressable>
          <Pressable onPress={closeOverlay} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
            <Text style={styles.secondaryButtonText}>Продолжить выбор</Text>
          </Pressable>
        </View>
      </Animated.View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 20 },
  copy: { alignItems: "center", marginBottom: 46 },
  title: { color: "#ffffff", fontSize: 32, fontWeight: "900", fontFamily: FONT.display },
  subtitle: { color: "#92959c", fontSize: 17, lineHeight: 24, fontWeight: "600", fontFamily: FONT.bodySemi, textAlign: "center", marginTop: 10 },
  avatarPair: { width: 212, height: 118, alignItems: "center", justifyContent: "center", marginBottom: 92 },
  avatarRing: { position: "absolute", left: 0, width: 102, height: 102, borderRadius: 51, padding: 4, backgroundColor: "#ffffff" },
  carAvatarRing: { left: 86 },
  avatarImage: { width: "100%", height: "100%", borderRadius: 48, resizeMode: "cover", backgroundColor: "#111" },
  heartBetween: {
    position: "absolute",
    bottom: 6,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ACCENT,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: ACCENT,
    shadowOpacity: 0.35,
    shadowRadius: 18
  },
  actions: { width: "100%", gap: 15 },
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
  primaryButtonText: { color: "#0b0b0d", fontSize: 16, fontWeight: "800", fontFamily: FONT.bodyExtra },
  secondaryButton: {
    height: 58,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)"
  },
  secondaryButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "800", fontFamily: FONT.bodyExtra },
  pressed: { opacity: 0.82, transform: [{ scale: 0.98 }] }
});
