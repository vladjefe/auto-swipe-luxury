import React, { useRef, useState } from "react";
import { Animated, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, Ionicons } from "@expo/vector-icons";
import { ACCENT, CARD_HEIGHT, CARD_WIDTH, FONT } from "../theme";
import { SpecTile } from "./common";

export default function CarCard({
  car,
  positionLabel,
  overlay = "none",
  animatedStyle,
  detailProgress,
  expanded = false,
  onPress
}) {
  const fallbackProgress = useRef(new Animated.Value(0)).current;
  const [imageFailed, setImageFailed] = useState(false);
  const progress = detailProgress || fallbackProgress;
  const detailsOpacity = progress.interpolate({ inputRange: [0, 0.55, 1], outputRange: [0, 0, 1] });
  const detailsTranslate = progress.interpolate({ inputRange: [0, 1], outputRange: [22, 0] });
  const hintOpacity = progress.interpolate({ inputRange: [0, 0.5], outputRange: [1, 0] });
  const dimOpacity = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 0.22] });

  return (
    <Animated.View style={[styles.carCard, expanded && styles.carCardExpanded, animatedStyle]}>
      <Pressable onPress={onPress} style={styles.cardPressable}>
        {imageFailed ? (
          <LinearGradient colors={["#2a2d31", "#141618", "#0a0b0d"]} style={StyleSheet.absoluteFillObject} />
        ) : (
          <Image source={{ uri: car.image }} style={styles.carImage} onError={() => setImageFailed(true)} />
        )}
        <LinearGradient
          colors={["rgba(0,0,0,0.76)", "rgba(0,0,0,0.16)", "rgba(0,0,0,0.88)"]}
          locations={[0, 0.46, 1]}
          style={StyleSheet.absoluteFillObject}
        />
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFillObject, styles.cardDim, { opacity: dimOpacity }]} />

        <View style={styles.cardTopContent}>
          <View>
            <Text style={styles.carName}>{car.name}</Text>
            <Text style={styles.carMeta}>
              {car.year} · {car.mileage}
            </Text>
            <Text style={styles.carMeta}>
              {car.engine} · {car.hp}
            </Text>
          </View>
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>{car.price}</Text>
          </View>
        </View>

        {overlay !== "none" && (
          <View style={[styles.swipeOverlay, overlay === "like" ? styles.likeOverlay : styles.rejectOverlay]}>
            <Ionicons name={overlay === "like" ? "heart" : "close"} size={68} color={overlay === "like" ? "#ffffff" : ACCENT} />
          </View>
        )}

        <Animated.View pointerEvents="none" style={[styles.tapHint, { opacity: hintOpacity }]}>
          <Feather name="maximize-2" size={15} color="#ffffff" />
          <Text style={styles.tapHintText}>Нажмите для характеристик</Text>
        </Animated.View>

        <Animated.View
          pointerEvents={expanded ? "auto" : "none"}
          style={[styles.detailsPanel, { opacity: detailsOpacity, transform: [{ translateY: detailsTranslate }] }]}
        >
          <View style={styles.detailsHeader}>
            <Text style={styles.detailsTitle}>Технические характеристики</Text>
            <Feather name="chevron-down" size={20} color="#ffffff" />
          </View>
          <View style={styles.specGrid}>
            <SpecTile label="0-100 км/ч" value={car.acceleration} />
            <SpecTile label="Макс. скорость" value={car.topSpeed} />
            <SpecTile label="Крутящий момент" value={car.torque} />
            <SpecTile label="Привод" value={car.drive} />
          </View>
          <View style={styles.detailRows}>
            <Text style={styles.detailRowText}>Коробка: {car.transmission}</Text>
            <Text style={styles.detailRowText}>
              Кузов: {car.body} · {car.fuel}
            </Text>
            <Text style={styles.detailRowText}>Локация: {car.location}</Text>
          </View>
        </Animated.View>

        {positionLabel ? (
          <Animated.Text style={[styles.positionLabel, { opacity: hintOpacity }]}>{positionLabel}</Animated.Text>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  carCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 32,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    shadowColor: "#000000",
    shadowOpacity: 0.52,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 22 },
    elevation: 8
  },
  carCardExpanded: {
    shadowColor: ACCENT,
    shadowOpacity: 0.28,
    shadowRadius: 34,
    borderColor: "rgba(255,75,75,0.35)"
  },
  cardPressable: { flex: 1 },
  carImage: { width: "100%", height: "100%", resizeMode: "cover" },
  cardDim: { backgroundColor: "#000000" },
  cardTopContent: {
    position: "absolute",
    top: 26,
    left: 24,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12
  },
  carName: { color: "#ffffff", fontFamily: FONT.display, fontSize: 31, lineHeight: 35, fontWeight: "900", maxWidth: CARD_WIDTH - 118 },
  carMeta: { color: "rgba(255,255,255,0.78)", fontFamily: FONT.bodyBold, fontSize: 16, lineHeight: 23, fontWeight: "700" },
  priceBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)"
  },
  priceBadgeText: { color: "#ffffff", fontFamily: FONT.displaySemi, fontSize: 12, fontWeight: "900" },
  tapHint: {
    position: "absolute",
    left: 22,
    bottom: 46,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.13)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)"
  },
  tapHintText: { color: "#ffffff", fontFamily: FONT.bodyExtra, fontSize: 12, fontWeight: "800" },
  positionLabel: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    color: "rgba(255,255,255,0.72)",
    fontFamily: FONT.displaySemi,
    fontSize: 13,
    fontWeight: "800"
  },
  detailsPanel: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 14,
    borderRadius: 24,
    padding: 16,
    backgroundColor: "rgba(11,13,15,0.78)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)"
  },
  detailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12
  },
  detailsTitle: { color: "#ffffff", fontFamily: FONT.displaySemi, fontSize: 16, fontWeight: "900" },
  specGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  detailRows: { gap: 5, marginTop: 12 },
  detailRowText: { color: "#d9dbe0", fontFamily: FONT.bodyBold, fontSize: 13, fontWeight: "700" },
  swipeOverlay: {
    position: "absolute",
    alignSelf: "center",
    top: "42%",
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3
  },
  rejectOverlay: { borderColor: ACCENT, backgroundColor: "rgba(255,75,75,0.08)" },
  likeOverlay: { borderColor: "#ffffff", backgroundColor: "rgba(255,75,75,0.7)" }
});
