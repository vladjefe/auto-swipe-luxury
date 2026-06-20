import React, { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { ScreenShell, TabBar } from "../components/common";
import { ACCENT, FONT } from "../theme";
import { useApp } from "../context/AppContext";

function EmptyGarage({ favorites, onDiscover }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons name={favorites ? "star-outline" : "heart-outline"} size={42} color={ACCENT} />
      </View>
      <Text style={styles.emptyTitle}>{favorites ? "Нет избранного" : "Гараж пуст"}</Text>
      <Text style={styles.emptyText}>
        {favorites
          ? "Отмечайте лучшие машины звёздочкой,\nчтобы быстро к ним возвращаться."
          : "Свайпайте вправо понравившиеся\nавтомобили — они появятся здесь."}
      </Text>
      <Pressable onPress={onDiscover} style={({ pressed }) => [styles.emptyBtn, pressed && styles.pressed]}>
        <Text style={styles.emptyBtnText}>Перейти к подбору</Text>
      </Pressable>
    </View>
  );
}

export default function GarageScreen() {
  const { garageCars, favoriteIds, toggleFavorite, setTab, openOverlay } = useApp();
  const [tab, setLocalTab] = useState("all");

  const visibleCars = tab === "favorites" ? garageCars.filter((car) => favoriteIds.includes(car.id)) : garageCars;
  const isEmpty = visibleCars.length === 0;

  return (
    <ScreenShell withNav>
      <View style={styles.garageHeader}>
        <View>
          <Text style={styles.sectionTitle}>Гараж</Text>
          <View style={styles.tabs}>
            <Pressable onPress={() => setLocalTab("all")} style={styles.tab}>
              <Text style={[styles.tabText, tab === "all" && styles.tabTextActive]}>Все авто</Text>
              {tab === "all" && <View style={styles.tabUnderline} />}
            </Pressable>
            <Pressable onPress={() => setLocalTab("favorites")} style={styles.tab}>
              <Text style={[styles.tabText, tab === "favorites" && styles.tabTextActive]}>Избранное</Text>
              {tab === "favorites" && <View style={styles.tabUnderline} />}
            </Pressable>
          </View>
        </View>
        <Pressable style={styles.addButton} onPress={() => setTab("discover")}>
          <Feather name="plus" size={25} color="#ffffff" />
        </Pressable>
      </View>

      {isEmpty ? (
        <EmptyGarage favorites={tab === "favorites"} onDiscover={() => setTab("discover")} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.garageScroll}>
          <View style={styles.garageList}>
            {visibleCars.map((car) => {
              const isFav = favoriteIds.includes(car.id);
              return (
                <Pressable
                  key={car.id}
                  onPress={() => openOverlay("carDetail", { carId: car.id })}
                  style={({ pressed }) => [styles.garageRow, pressed && styles.pressed]}
                >
                  <Image source={{ uri: car.image }} style={styles.garageThumb} />
                  <View style={styles.garageInfo}>
                    <Text style={styles.garageName} numberOfLines={1}>
                      {car.name}
                    </Text>
                    <Text style={styles.garageMeta}>
                      {car.year} · {car.mileage}
                    </Text>
                    <Text style={styles.garagePrice}>{car.price}</Text>
                  </View>
                  <Pressable hitSlop={10} onPress={() => toggleFavorite(car.id)} style={styles.favButton}>
                    <Ionicons name={isFav ? "star" : "star-outline"} size={24} color={isFav ? ACCENT : "#707278"} />
                  </Pressable>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      )}

      <TabBar activeTab="garage" onChange={setTab} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  garageHeader: { paddingTop: 28, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  sectionTitle: { color: "#ffffff", fontFamily: FONT.display, fontSize: 30, fontWeight: "900" },
  addButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  tabs: { flexDirection: "row", gap: 22, marginTop: 25 },
  tab: { paddingBottom: 10 },
  tabText: { color: "#8d9097", fontFamily: FONT.bodyBold, fontSize: 16, fontWeight: "700" },
  tabTextActive: { color: "#ffffff" },
  tabUnderline: { position: "absolute", bottom: 0, left: 0, right: 0, height: 2, borderRadius: 1, backgroundColor: ACCENT },
  garageScroll: { paddingTop: 24, paddingBottom: 16 },
  garageList: { gap: 19 },
  garageRow: { minHeight: 86, flexDirection: "row", alignItems: "center" },
  garageThumb: { width: 88, height: 68, borderRadius: 8, resizeMode: "cover", backgroundColor: "#111" },
  garageInfo: { flex: 1, marginLeft: 14, paddingRight: 12 },
  garageName: { color: "#ffffff", fontFamily: FONT.bodyExtra, fontSize: 16, fontWeight: "800", marginBottom: 5 },
  garageMeta: { color: "#878b92", fontFamily: FONT.bodySemi, fontSize: 14, fontWeight: "600", lineHeight: 20 },
  garagePrice: { color: "#d7d9dd", fontFamily: FONT.displaySemi, fontSize: 14, fontWeight: "800", marginTop: 3 },
  favButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 40 },
  emptyIcon: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,75,75,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,75,75,0.3)",
    marginBottom: 24
  },
  emptyTitle: { color: "#ffffff", fontFamily: FONT.displaySemi, fontSize: 22, fontWeight: "900" },
  emptyText: { color: "#8e9299", fontFamily: FONT.bodySemi, fontSize: 15, lineHeight: 22, fontWeight: "600", textAlign: "center", marginTop: 10 },
  emptyBtn: {
    marginTop: 28,
    height: 54,
    paddingHorizontal: 32,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff"
  },
  emptyBtnText: { color: "#0b0b0d", fontFamily: FONT.bodyExtra, fontSize: 16, fontWeight: "800" },
  pressed: { opacity: 0.82, transform: [{ scale: 0.98 }] }
});
