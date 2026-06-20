import React, { useCallback, useMemo, useRef, useState } from "react";
import { Animated, Easing, PanResponder, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenShell, SwipeButtons, TabBar, HeaderIconButton } from "../components/common";
import CarCard from "../components/CarCard";
import { ACCENT, CARD_HEIGHT, FONT, PHONE_WIDTH } from "../theme";
import { useApp } from "../context/AppContext";
import { cars } from "../data/cars";

const TOTAL = cars.length;

function EmptyDeck({ filtered, onReset, onClearFilters, onGarage }) {
  return (
    <View style={styles.emptyDeck}>
      <View style={styles.emptyIcon}>
        <Ionicons name={filtered ? "options-outline" : "car-sport-outline"} size={46} color={ACCENT} />
      </View>
      <Text style={styles.emptyTitle}>{filtered ? "Ничего не найдено" : "Вы пересмотрели все авто"}</Text>
      <Text style={styles.emptySubtitle}>
        {filtered
          ? "Под выбранные фильтры нет автомобилей.\nОслабьте условия поиска."
          : "Новые предложения появятся позже.\nМожно начать подбор заново."}
      </Text>
      <View style={styles.emptyActions}>
        {filtered ? (
          <Pressable onPress={onClearFilters} style={({ pressed }) => [styles.emptyPrimary, pressed && styles.pressed]}>
            <Text style={styles.emptyPrimaryText}>Сбросить фильтры</Text>
          </Pressable>
        ) : (
          <Pressable onPress={onReset} style={({ pressed }) => [styles.emptyPrimary, pressed && styles.pressed]}>
            <Text style={styles.emptyPrimaryText}>Начать заново</Text>
          </Pressable>
        )}
        <Pressable onPress={onGarage} style={({ pressed }) => [styles.emptySecondary, pressed && styles.pressed]}>
          <Text style={styles.emptySecondaryText}>Открыть гараж</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function DiscoverScreen() {
  const { deck, likeCar, rejectCar, resetDeck, setTab, openOverlay, setFilters, activeFilterCount } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);
  const [position] = useState(() => new Animated.ValueXY());
  const detailProgress = useRef(new Animated.Value(0)).current;
  const swiping = useRef(false);

  const activeCar = deck[0];
  const filtered = activeFilterCount > 0;

  const rotate = position.x.interpolate({
    inputRange: [-PHONE_WIDTH / 2, 0, PHONE_WIDTH / 2],
    outputRange: ["-9deg", "0deg", "9deg"],
    extrapolate: "clamp"
  });
  const rejectOpacity = position.x.interpolate({ inputRange: [-130, -30], outputRange: [1, 0], extrapolate: "clamp" });
  const likeOpacity = position.x.interpolate({ inputRange: [30, 130], outputRange: [0, 1], extrapolate: "clamp" });
  const detailLift = detailProgress.interpolate({ inputRange: [0, 1], outputRange: [0, -18] });
  const detailScale = detailProgress.interpolate({ inputRange: [0, 1], outputRange: [1, 1.045] });

  const collapseDetails = useCallback(() => {
    setIsExpanded(false);
    Animated.timing(detailProgress, { toValue: 0, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, [detailProgress]);

  const toggleDetails = useCallback(() => {
    setIsExpanded((prev) => {
      Animated.spring(detailProgress, { toValue: prev ? 0 : 1, friction: 7, tension: 86, useNativeDriver: true }).start();
      return !prev;
    });
  }, [detailProgress]);

  const finishSwipe = useCallback(
    (direction) => {
      const car = activeCar;
      if (!car || swiping.current) {
        return;
      }
      swiping.current = true;
      collapseDetails();
      const liked = direction === "right";
      Animated.timing(position, {
        toValue: { x: liked ? PHONE_WIDTH + 120 : -PHONE_WIDTH - 120, y: 18 },
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      }).start(() => {
        position.setValue({ x: 0, y: 0 });
        detailProgress.setValue(0);
        setIsExpanded(false);
        swiping.current = false;
        if (liked) {
          likeCar(car.id);
          if (car.featured) {
            openOverlay("match", { carId: car.id });
          }
        } else {
          rejectCar(car.id);
        }
      });
    },
    [activeCar, collapseDetails, detailProgress, likeCar, openOverlay, position, rejectCar]
  );

  const resetSwipe = useCallback(() => {
    Animated.spring(position, { toValue: { x: 0, y: 0 }, friction: 6, tension: 48, useNativeDriver: true }).start();
  }, [position]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 8 || Math.abs(gesture.dy) > 8,
        onPanResponderGrant: collapseDetails,
        onPanResponderMove: Animated.event([null, { dx: position.x, dy: position.y }], { useNativeDriver: false }),
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx > 110) {
            finishSwipe("right");
          } else if (gesture.dx < -110) {
            finishSwipe("left");
          } else {
            resetSwipe();
          }
        }
      }),
    [collapseDetails, finishSwipe, position, resetSwipe]
  );

  const positionLabel = activeCar ? `${TOTAL - deck.length + 1}/${TOTAL}` : null;

  return (
    <ScreenShell withNav>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Подбор</Text>
          <Text style={styles.headerSubtitle}>Только проверенные автомобили</Text>
        </View>
        <HeaderIconButton icon="sliders" onPress={() => openOverlay("filters")} badge={activeFilterCount || null} />
      </View>

      {activeCar ? (
        <>
          <View style={styles.deck} {...panResponder.panHandlers}>
            <CarCard
              car={activeCar}
              positionLabel={positionLabel}
              detailProgress={detailProgress}
              expanded={isExpanded}
              onPress={toggleDetails}
              animatedStyle={{
                transform: [
                  { translateX: position.x },
                  { translateY: Animated.add(position.y, detailLift) },
                  { rotate },
                  { scale: detailScale }
                ]
              }}
            />
            <Animated.View pointerEvents="none" style={[styles.gestureBadge, styles.gestureReject, { opacity: rejectOpacity }]}>
              <Ionicons name="close" size={74} color={ACCENT} />
            </Animated.View>
            <Animated.View pointerEvents="none" style={[styles.gestureBadge, styles.gestureLike, { opacity: likeOpacity }]}>
              <Ionicons name="heart" size={66} color="#ffffff" />
            </Animated.View>
          </View>
          <SwipeButtons onReject={() => finishSwipe("left")} onLike={() => finishSwipe("right")} />
        </>
      ) : (
        <EmptyDeck
          filtered={filtered}
          onReset={resetDeck}
          onClearFilters={() => setFilters({ brands: [], bodies: [], minHp: 0, maxPrice: 100 })}
          onGarage={() => setTab("garage")}
        />
      )}

      <TabBar activeTab="discover" onChange={setTab} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: { height: 80, alignItems: "center", justifyContent: "space-between", flexDirection: "row" },
  headerTitle: { color: "#ffffff", fontFamily: FONT.display, fontSize: 28, lineHeight: 32, fontWeight: "900" },
  headerSubtitle: { color: "#8c9098", fontFamily: FONT.bodyBold, fontSize: 13, fontWeight: "700", marginTop: 4 },
  deck: { alignItems: "center", justifyContent: "center", minHeight: CARD_HEIGHT + 8 },
  gestureBadge: {
    position: "absolute",
    width: 116,
    height: 116,
    borderRadius: 58,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3
  },
  gestureReject: { borderColor: ACCENT, backgroundColor: "rgba(255,75,75,0.1)" },
  gestureLike: { borderColor: "#ffffff", backgroundColor: "rgba(255,75,75,0.76)" },
  emptyDeck: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 40, paddingHorizontal: 8 },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,75,75,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,75,75,0.3)",
    marginBottom: 26
  },
  emptyTitle: { color: "#ffffff", fontFamily: FONT.displaySemi, fontSize: 24, fontWeight: "900", textAlign: "center" },
  emptySubtitle: { color: "#8e9299", fontFamily: FONT.bodySemi, fontSize: 16, lineHeight: 23, fontWeight: "600", textAlign: "center", marginTop: 12 },
  emptyActions: { width: "100%", gap: 14, marginTop: 34 },
  emptyPrimary: { height: 56, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: "#ffffff" },
  emptyPrimaryText: { color: "#0b0b0d", fontFamily: FONT.bodyExtra, fontSize: 16, fontWeight: "800" },
  emptySecondary: { height: 56, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.08)" },
  emptySecondaryText: { color: "#ffffff", fontFamily: FONT.bodyExtra, fontSize: 16, fontWeight: "800" },
  pressed: { opacity: 0.82, transform: [{ scale: 0.98 }] }
});
