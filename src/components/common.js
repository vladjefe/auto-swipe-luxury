import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ACCENT, FONT, IS_WEB, PHONE_WIDTH } from "../theme";

export function ScreenShell({ children, withNav = false }) {
  return (
    <LinearGradient colors={["#141617", "#050607", "#151719"]} style={styles.appBackground}>
      <View style={[styles.phoneShell, IS_WEB && styles.phoneShellWeb]}>
        <LinearGradient colors={["#06090b", "#020303", "#111313"]} style={styles.screen}>
          <View style={styles.radialGlow} />
          <View style={styles.redGlow} />
          <SafeAreaView style={[styles.safeArea, withNav && styles.safeWithNav]} edges={["top", "left", "right"]}>
            {children}
          </SafeAreaView>
        </LinearGradient>
      </View>
    </LinearGradient>
  );
}

export function IconButton({ icon, active, onPress, size = 26, dark = false }) {
  const scale = useRef(new Animated.Value(1)).current;
  const animateScale = (toValue) => {
    Animated.spring(scale, { toValue, friction: 5, tension: 180, useNativeDriver: true }).start();
  };
  return (
    <Pressable onPress={onPress} onPressIn={() => animateScale(0.9)} onPressOut={() => animateScale(1)} style={styles.iconPressable}>
      <Animated.View
        style={[
          styles.iconButton,
          dark ? styles.darkIconButton : styles.lightIconButton,
          active && styles.iconButtonActive,
          { transform: [{ scale }] }
        ]}
      >
        <Ionicons name={icon} size={size} color={active ? ACCENT : dark ? "#ffffff" : "#0e0f11"} />
      </Animated.View>
    </Pressable>
  );
}

export function SpecTile({ label, value }) {
  return (
    <View style={styles.specTile}>
      <Text style={styles.specValue}>{value}</Text>
      <Text style={styles.specLabel}>{label}</Text>
    </View>
  );
}

export function SwipeButtons({ onReject, onLike }) {
  return (
    <View style={styles.swipeButtons}>
      <IconButton icon="close" dark onPress={onReject} size={34} />
      <IconButton icon="heart" active onPress={onLike} size={33} />
    </View>
  );
}

export function TabBar({ activeTab, onChange }) {
  const items = [
    { key: "discover", icon: "home-outline", activeIcon: "home", label: "Главная" },
    { key: "garage", icon: "heart-outline", activeIcon: "heart", label: "Гараж" },
    { key: "profile", icon: "person-outline", activeIcon: "person", label: "Профиль" }
  ];
  return (
    <BlurView intensity={28} tint="dark" style={styles.bottomNav}>
      {items.map((item) => {
        const isActive = activeTab === item.key;
        return (
          <Pressable key={item.key} onPress={() => onChange(item.key)} style={styles.navItem}>
            <Ionicons name={isActive ? item.activeIcon : item.icon} size={24} color={isActive ? ACCENT : "#8f9196"} />
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{item.label}</Text>
            <View style={[styles.navDot, isActive && styles.navDotActive]} />
          </Pressable>
        );
      })}
    </BlurView>
  );
}

export function Chip({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export function HeaderIconButton({ icon, onPress, badge }) {
  return (
    <Pressable style={styles.headerIcon} onPress={onPress}>
      <Feather name={icon} size={22} color="#ffffff" />
      {badge ? (
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{badge}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  appBackground: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#050607" },
  phoneShell: { width: PHONE_WIDTH, flex: 1, overflow: "hidden", backgroundColor: "#020405" },
  phoneShellWeb: { maxHeight: 844, borderRadius: 0 },
  screen: { flex: 1, backgroundColor: "#020405", overflow: "hidden" },
  safeArea: { flex: 1, paddingHorizontal: 18 },
  safeWithNav: { paddingBottom: 104 },
  radialGlow: {
    position: "absolute",
    top: -120,
    right: -90,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(255,255,255,0.08)",
    shadowColor: "#ffffff",
    shadowOpacity: 0.2,
    shadowRadius: 80
  },
  redGlow: {
    position: "absolute",
    bottom: 72,
    left: -120,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(255,75,75,0.08)",
    shadowColor: ACCENT,
    shadowOpacity: 0.22,
    shadowRadius: 70
  },
  iconPressable: { borderRadius: 39 },
  iconButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.34,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 5
  },
  darkIconButton: { backgroundColor: "rgba(255,255,255,0.08)" },
  lightIconButton: { backgroundColor: "#ffffff" },
  iconButtonActive: { backgroundColor: "#ffffff", shadowColor: ACCENT, shadowOpacity: 0.24 },
  specTile: {
    width: "48%",
    borderRadius: 15,
    paddingVertical: 11,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)"
  },
  specValue: { color: "#ffffff", fontFamily: FONT.display, fontSize: 16, fontWeight: "900" },
  specLabel: { color: "#9da1a9", fontFamily: FONT.bodyBold, fontSize: 11, fontWeight: "700", marginTop: 3 },
  swipeButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 34,
    paddingTop: 18
  },
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 102,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    backgroundColor: "rgba(28,29,31,0.74)",
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 18
  },
  navItem: { width: 82, height: 66, alignItems: "center", justifyContent: "center" },
  navLabel: { color: "#8f9196", fontFamily: FONT.bodyExtra, fontSize: 11, fontWeight: "800", marginTop: 3 },
  navLabelActive: { color: "#ffffff" },
  navDot: { width: 18, height: 2, borderRadius: 1, marginTop: 6, backgroundColor: "transparent" },
  navDotActive: { backgroundColor: ACCENT },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)"
  },
  chipActive: { backgroundColor: "#ffffff", borderColor: "#ffffff" },
  chipText: { color: "#d7d9dd", fontFamily: FONT.bodyBold, fontSize: 14, fontWeight: "700" },
  chipTextActive: { color: "#0b0b0d" },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.07)"
  },
  headerBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: ACCENT,
    alignItems: "center",
    justifyContent: "center"
  },
  headerBadgeText: { color: "#ffffff", fontFamily: FONT.displaySemi, fontSize: 11, fontWeight: "900" }
});
