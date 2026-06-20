import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenShell, Chip } from "../components/common";
import { FONT } from "../theme";
import { useApp } from "../context/AppContext";
import { ALL_BODIES, ALL_BRANDS, HP_OPTIONS, PRICE_OPTIONS } from "../data/cars";

export default function FiltersScreen() {
  const { filters, setFilters, closeOverlay } = useApp();
  const [brands, setBrands] = useState(filters.brands);
  const [bodies, setBodies] = useState(filters.bodies);
  const [minHp, setMinHp] = useState(filters.minHp);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice);

  const toggle = (list, setList, value) => {
    setList(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  };

  const reset = () => {
    setBrands([]);
    setBodies([]);
    setMinHp(0);
    setMaxPrice(100);
  };

  const apply = () => {
    setFilters({ brands, bodies, minHp, maxPrice });
    closeOverlay();
  };

  return (
    <ScreenShell>
      <View style={styles.header}>
        <Text style={styles.title}>Фильтры</Text>
        <Pressable style={styles.headerIcon} onPress={closeOverlay}>
          <Feather name="x" size={22} color="#ffffff" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.label}>Марка</Text>
        <View style={styles.chipRow}>
          {ALL_BRANDS.map((brand) => (
            <Chip key={brand} label={brand} active={brands.includes(brand)} onPress={() => toggle(brands, setBrands, brand)} />
          ))}
        </View>

        <Text style={styles.label}>Кузов</Text>
        <View style={styles.chipRow}>
          {ALL_BODIES.map((body) => (
            <Chip key={body} label={body} active={bodies.includes(body)} onPress={() => toggle(bodies, setBodies, body)} />
          ))}
        </View>

        <Text style={styles.label}>Мощность, л.с.</Text>
        <View style={styles.chipRow}>
          {HP_OPTIONS.map((option) => (
            <Chip key={option.label} label={option.label} active={minHp === option.value} onPress={() => setMinHp(option.value)} />
          ))}
        </View>

        <Text style={styles.label}>Цена, млн ₽</Text>
        <View style={styles.chipRow}>
          {PRICE_OPTIONS.map((option) => (
            <Chip
              key={option.label}
              label={option.label}
              active={maxPrice === option.value}
              onPress={() => setMaxPrice(option.value)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable onPress={reset} style={({ pressed }) => [styles.resetButton, pressed && styles.pressed]}>
          <Text style={styles.resetText}>Сбросить</Text>
        </Pressable>
        <Pressable onPress={apply} style={({ pressed }) => [styles.applyButton, pressed && styles.pressed]}>
          <Text style={styles.applyText}>Применить</Text>
        </Pressable>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: { height: 80, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { color: "#ffffff", fontFamily: FONT.display, fontSize: 28, fontWeight: "900" },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.07)"
  },
  scroll: { paddingTop: 8, paddingBottom: 20 },
  label: {
    color: "#8e9299",
    fontFamily: FONT.displaySemi,
    fontSize: 14,
    fontWeight: "800",
    marginTop: 22,
    marginBottom: 14,
    textTransform: "uppercase",
    letterSpacing: 0.3
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  footer: { flexDirection: "row", gap: 14, paddingVertical: 18 },
  resetButton: {
    flex: 1,
    height: 56,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)"
  },
  resetText: { color: "#ffffff", fontFamily: FONT.bodyExtra, fontSize: 16, fontWeight: "800" },
  applyButton: { flex: 2, height: 56, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: "#ffffff" },
  applyText: { color: "#0b0b0d", fontFamily: FONT.bodyExtra, fontSize: 16, fontWeight: "800" },
  pressed: { opacity: 0.82, transform: [{ scale: 0.98 }] }
});
