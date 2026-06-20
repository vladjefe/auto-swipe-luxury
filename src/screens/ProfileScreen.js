import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { ScreenShell, TabBar } from "../components/common";
import { ACCENT, FONT } from "../theme";
import { useApp } from "../context/AppContext";
import { userAvatar } from "../data/cars";

const PREFERENCES = ["Купе или лифтбек", "450+ л.с.", "Пробег до 20 000 км", "Черный или серебристый"];

export default function ProfileScreen() {
  const { likedIds, rejectedIds, favoriteIds, resetDeck, setTab } = useApp();
  const seen = likedIds.length + rejectedIds.length;

  const stats = [
    { value: seen, label: "Просмотрено" },
    { value: likedIds.length, label: "Лайков" },
    { value: favoriteIds.length, label: "Избранное" }
  ];

  return (
    <ScreenShell withNav>
      <View style={styles.profileHeader}>
        <Text style={styles.sectionTitle}>Профиль</Text>
        <Pressable style={styles.headerIcon}>
          <Feather name="settings" size={22} color="#ffffff" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.profileCard}>
          <Image source={{ uri: userAvatar }} style={styles.profileAvatar} />
          <Text style={styles.profileName}>Алексей Морозов</Text>
          <Text style={styles.profileSubtitle}>Ищу быстрый, редкий и ухоженный автомобиль для города и выходных.</Text>
        </View>

        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statBox}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.preferenceCard}>
          <Text style={styles.preferenceTitle}>Идеальный гараж</Text>
          {PREFERENCES.map((item) => (
            <View key={item} style={styles.preferenceRow}>
              <Ionicons name="checkmark-circle" size={19} color={ACCENT} />
              <Text style={styles.preferenceText}>{item}</Text>
            </View>
          ))}
        </View>

        <Pressable onPress={() => setTab("garage")} style={({ pressed }) => [styles.actionRow, pressed && styles.pressed]}>
          <Ionicons name="heart-outline" size={20} color="#ffffff" />
          <Text style={styles.actionText}>Мой гараж</Text>
          <Feather name="chevron-right" size={20} color="#6f7177" />
        </Pressable>
        <Pressable onPress={resetDeck} style={({ pressed }) => [styles.actionRow, pressed && styles.pressed]}>
          <Ionicons name="refresh-outline" size={20} color="#ffffff" />
          <Text style={styles.actionText}>Сбросить историю просмотров</Text>
          <Feather name="chevron-right" size={20} color="#6f7177" />
        </Pressable>
      </ScrollView>

      <TabBar activeTab="profile" onChange={setTab} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  profileHeader: { paddingTop: 28, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { color: "#ffffff", fontFamily: FONT.display, fontSize: 30, fontWeight: "900" },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.07)"
  },
  scroll: { paddingBottom: 20 },
  profileCard: { alignItems: "center", paddingTop: 34, paddingBottom: 28 },
  profileAvatar: { width: 114, height: 114, borderRadius: 57, borderWidth: 3, borderColor: "#ffffff" },
  profileName: { color: "#ffffff", fontFamily: FONT.displaySemi, fontSize: 26, fontWeight: "900", marginTop: 18 },
  profileSubtitle: {
    color: "#8e9299",
    fontFamily: FONT.bodySemi,
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 20
  },
  statsRow: { flexDirection: "row", gap: 12, marginTop: 8 },
  statBox: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 20,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)"
  },
  statValue: { color: "#ffffff", fontFamily: FONT.display, fontSize: 24, fontWeight: "900" },
  statLabel: { color: "#8e9299", fontFamily: FONT.bodyBold, fontSize: 13, fontWeight: "700", marginTop: 4 },
  preferenceCard: {
    marginTop: 24,
    borderRadius: 22,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)"
  },
  preferenceTitle: { color: "#ffffff", fontFamily: FONT.displaySemi, fontSize: 19, fontWeight: "900", marginBottom: 14 },
  preferenceRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 },
  preferenceText: { color: "#d7d9dd", fontFamily: FONT.bodyBold, fontSize: 16, fontWeight: "700" },
  actionRow: {
    marginTop: 14,
    height: 58,
    paddingHorizontal: 18,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)"
  },
  actionText: { color: "#ffffff", fontFamily: FONT.bodyBold, fontSize: 16, fontWeight: "700", flex: 1 },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] }
});
