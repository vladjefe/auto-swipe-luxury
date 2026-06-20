import React, { useEffect } from "react";
import { BackHandler, Platform, StyleSheet, View } from "react-native";
import { useApp } from "../context/AppContext";
import { ScreenShell } from "../components/common";
import OnboardingScreen from "../screens/OnboardingScreen";
import DiscoverScreen from "../screens/DiscoverScreen";
import GarageScreen from "../screens/GarageScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MatchScreen from "../screens/MatchScreen";
import FiltersScreen from "../screens/FiltersScreen";
import CarDetailScreen from "../screens/CarDetailScreen";

const TABS = {
  discover: DiscoverScreen,
  garage: GarageScreen,
  profile: ProfileScreen
};

const OVERLAYS = {
  match: MatchScreen,
  filters: FiltersScreen,
  carDetail: CarDetailScreen
};

export default function Router() {
  const { hydrated, onboarded, tab, overlay, closeOverlay } = useApp();

  useEffect(() => {
    if (Platform.OS !== "android") {
      return undefined;
    }
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (overlay) {
        closeOverlay();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [overlay, closeOverlay]);

  if (!hydrated) {
    return <ScreenShell />;
  }

  if (!onboarded) {
    return <OnboardingScreen />;
  }

  const TabScreen = TABS[tab] || DiscoverScreen;
  const OverlayScreen = overlay ? OVERLAYS[overlay.name] : null;

  return (
    <View style={styles.root}>
      <TabScreen />
      {OverlayScreen ? (
        <View style={StyleSheet.absoluteFill}>
          <OverlayScreen params={overlay.params} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 }
});
