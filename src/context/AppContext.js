import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { cars } from "../data/cars";

const STORAGE_KEY = "auto-swipe:state:v1";

export const DEFAULT_FILTERS = {
  brands: [], // [] means "all brands"
  bodies: [], // [] means "all body types"
  minHp: 0,
  maxPrice: 100
};

const AppContext = createContext(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return ctx;
}

export function AppProvider({ children }) {
  const [hydrated, setHydrated] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [likedIds, setLikedIds] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [rejectedIds, setRejectedIds] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // Navigation: active bottom tab + an optional full-screen overlay on top.
  const [tab, setTab] = useState("discover");
  const [overlay, setOverlay] = useState(null); // { name, params } | null

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          setOnboarded(!!data.onboarded);
          setLikedIds(Array.isArray(data.likedIds) ? data.likedIds : []);
          setFavoriteIds(Array.isArray(data.favoriteIds) ? data.favoriteIds : []);
          setRejectedIds(Array.isArray(data.rejectedIds) ? data.rejectedIds : []);
          setFilters({ ...DEFAULT_FILTERS, ...(data.filters || {}) });
        }
      } catch (e) {
        // Corrupt storage: start clean.
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    const data = { onboarded, likedIds, favoriteIds, rejectedIds, filters };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {});
  }, [hydrated, onboarded, likedIds, favoriteIds, rejectedIds, filters]);

  const completeOnboarding = useCallback(() => setOnboarded(true), []);

  const likeCar = useCallback((id) => {
    setLikedIds((prev) => (prev.includes(id) ? prev : [id, ...prev]));
    setRejectedIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const rejectCar = useCallback((id) => {
    setRejectedIds((prev) => (prev.includes(id) ? prev : [id, ...prev]));
  }, []);

  const removeFromGarage = useCallback((id) => {
    setLikedIds((prev) => prev.filter((x) => x !== id));
    setFavoriteIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const toggleFavorite = useCallback((id) => {
    setFavoriteIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]));
    setLikedIds((prev) => (prev.includes(id) ? prev : [id, ...prev]));
  }, []);

  const resetDeck = useCallback(() => {
    // Bring rejected cars back into the deck; keep the garage intact.
    setRejectedIds([]);
  }, []);

  const matchesFilters = useCallback(
    (car) => {
      if (filters.brands.length && !filters.brands.includes(car.brand)) {
        return false;
      }
      if (filters.bodies.length && !filters.bodies.includes(car.body)) {
        return false;
      }
      if (car.hpValue < filters.minHp) {
        return false;
      }
      if (car.priceValue > filters.maxPrice) {
        return false;
      }
      return true;
    },
    [filters]
  );

  const deck = useMemo(
    () =>
      cars.filter(
        (car) => !rejectedIds.includes(car.id) && !likedIds.includes(car.id) && matchesFilters(car)
      ),
    [rejectedIds, likedIds, matchesFilters]
  );

  const garageCars = useMemo(
    () => likedIds.map((id) => cars.find((c) => c.id === id)).filter(Boolean),
    [likedIds]
  );

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (filters.brands.length) n += 1;
    if (filters.bodies.length) n += 1;
    if (filters.minHp > 0) n += 1;
    if (filters.maxPrice < 100) n += 1;
    return n;
  }, [filters]);

  const value = useMemo(
    () => ({
      hydrated,
      onboarded,
      completeOnboarding,
      likedIds,
      favoriteIds,
      rejectedIds,
      filters,
      setFilters,
      activeFilterCount,
      deck,
      garageCars,
      likeCar,
      rejectCar,
      removeFromGarage,
      toggleFavorite,
      resetDeck,
      tab,
      setTab,
      overlay,
      openOverlay: (name, params) => setOverlay({ name, params: params || {} }),
      closeOverlay: () => setOverlay(null)
    }),
    [
      hydrated,
      onboarded,
      completeOnboarding,
      likedIds,
      favoriteIds,
      rejectedIds,
      filters,
      activeFilterCount,
      deck,
      garageCars,
      likeCar,
      rejectCar,
      removeFromGarage,
      toggleFavorite,
      resetDeck,
      tab,
      overlay
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
