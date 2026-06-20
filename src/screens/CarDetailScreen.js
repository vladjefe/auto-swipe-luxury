import React, { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, Ionicons } from "@expo/vector-icons";
import { ScreenShell, SpecTile } from "../components/common";
import { ACCENT, FONT } from "../theme";
import { useApp } from "../context/AppContext";
import { carById } from "../data/cars";

function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export default function CarDetailScreen({ params }) {
  const { closeOverlay, favoriteIds, toggleFavorite, removeFromGarage } = useApp();
  const car = carById(params?.carId);
  const [imageFailed, setImageFailed] = useState(false);

  if (!car) {
    return (
      <ScreenShell>
        <View style={styles.missing}>
          <Text style={styles.missingText}>Автомобиль не найден</Text>
          <Pressable onPress={closeOverlay} style={styles.missingBtn}>
            <Text style={styles.missingBtnText}>Назад</Text>
          </Pressable>
        </View>
      </ScreenShell>
    );
  }

  const isFav = favoriteIds.includes(car.id);

  const remove = () => {
    removeFromGarage(car.id);
    closeOverlay();
  };

  return (
    <ScreenShell>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          {imageFailed ? (
            <LinearGradient colors={["#2a2d31", "#141618", "#0a0b0d"]} style={StyleSheet.absoluteFillObject} />
          ) : (
            <Image
              source={{ uri: car.image }}
              style={StyleSheet.absoluteFillObject}
              resizeMode="cover"
              onError={() => setImageFailed(true)}
            />
          )}
          <LinearGradient colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.05)", "rgba(0,0,0,0.85)"]} style={StyleSheet.absoluteFillObject} />

          <View style={styles.heroTop}>
            <Pressable style={styles.roundButton} onPress={closeOverlay}>
              <Feather name="chevron-left" size={24} color="#ffffff" />
            </Pressable>
            <Pressable style={styles.roundButton} onPress={() => toggleFavorite(car.id)}>
              <Ionicons name={isFav ? "star" : "star-outline"} size={22} color={isFav ? ACCENT : "#ffffff"} />
            </Pressable>
          </View>

          <View style={styles.heroBottom}>
            <Text style={styles.carName}>{car.name}</Text>
            <Text style={styles.carMeta}>
              {car.year} · {car.mileage}
            </Text>
            <View style={styles.priceBadge}>
              <Text style={styles.priceText}>{car.price}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.blockTitle}>Технические характеристики</Text>
        <View style={styles.specGrid}>
          <SpecTile label="0-100 км/ч" value={car.acceleration} />
          <SpecTile label="Макс. скорость" value={car.topSpeed} />
          <SpecTile label="Мощность" value={car.hp} />
          <SpecTile label="Крутящий момент" value={car.torque} />
        </View>

        <View style={styles.detailCard}>
          <DetailRow label="Двигатель" value={car.engine} />
          <DetailRow label="Коробка" value={car.transmission} />
          <DetailRow label="Привод" value={car.drive} />
          <DetailRow label="Кузов" value={car.body} />
          <DetailRow label="Топливо" value={car.fuel} />
          <DetailRow label="Локация" value={car.location} />
        </View>

        <Pressable onPress={remove} style={({ pressed }) => [styles.removeButton, pressed && styles.pressed]}>
          <Ionicons name="trash-outline" size={20} color={ACCENT} />
          <Text style={styles.removeText}>Удалить из гаража</Text>
        </Pressable>
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 30 },
  hero: { height: 360, marginHorizontal: -18, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, overflow: "hidden" },
  heroTop: { position: "absolute", top: 14, left: 18, right: 18, flexDirection: "row", justifyContent: "space-between" },
  roundButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)"
  },
  heroBottom: { position: "absolute", left: 22, right: 22, bottom: 22 },
  carName: { color: "#ffffff", fontSize: 30, fontWeight: "900", fontFamily: FONT.display },
  carMeta: { color: "rgba(255,255,255,0.82)", fontSize: 16, fontWeight: "700", fontFamily: FONT.bodyBold, marginTop: 4 },
  priceBadge: {
    alignSelf: "flex-start",
    marginTop: 12,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)"
  },
  priceText: { color: "#ffffff", fontSize: 15, fontWeight: "900", fontFamily: FONT.displaySemi },
  blockTitle: { color: "#ffffff", fontSize: 18, fontWeight: "900", fontFamily: FONT.displaySemi, marginTop: 26, marginBottom: 14 },
  specGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  detailCard: {
    marginTop: 18,
    borderRadius: 20,
    paddingHorizontal: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)"
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.08)"
  },
  detailLabel: { color: "#8e9299", fontSize: 15, fontWeight: "700", fontFamily: FONT.bodyBold },
  detailValue: { color: "#ffffff", fontSize: 15, fontWeight: "800", fontFamily: FONT.bodyExtra },
  removeButton: {
    marginTop: 24,
    height: 56,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "rgba(255,75,75,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,75,75,0.35)"
  },
  removeText: { color: ACCENT, fontSize: 16, fontWeight: "800", fontFamily: FONT.bodyExtra },
  missing: { flex: 1, alignItems: "center", justifyContent: "center", gap: 18 },
  missingText: { color: "#ffffff", fontSize: 18, fontWeight: "800", fontFamily: FONT.displaySemi },
  missingBtn: {
    paddingHorizontal: 28,
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff"
  },
  missingBtnText: { color: "#0b0b0d", fontSize: 15, fontWeight: "800", fontFamily: FONT.bodyExtra },
  pressed: { opacity: 0.82, transform: [{ scale: 0.98 }] }
});
