import { Dimensions, Platform } from "react-native";

const { width: nativeWindowWidth } = Dimensions.get("window");
const viewportWidth =
  typeof window !== "undefined" && window.innerWidth ? window.innerWidth : nativeWindowWidth;

// SwapCar Mobile — dark theme with a signature lime accent.
export const IS_WEB = Platform.OS === "web";
export const PHONE_WIDTH = IS_WEB ? Math.min(viewportWidth, 402) : nativeWindowWidth;

export const CARD_WIDTH = Math.min(PHONE_WIDTH - 32, 372);
export const CARD_HEIGHT = Math.min(CARD_WIDTH * 1.42, 540);

export const COLORS = {
  bg: "#0B0B0D",
  surface: "#15151A",
  surface2: "#101013",
  surface3: "#17171C",
  elevated: "#1E1E23",
  border: "#26262B",
  border2: "#2E2E34",
  accent: "#C6F24E",
  accentInk: "#0B0B0D",
  accentDim: "#232a16",
  text: "#F4F4F5",
  textMuted: "#9A9AA2",
  textFaint: "#6E6E76",
  blue: "#5B8DEF",
  blueText: "#9CC0FF",
  blueBg: "#13233F",
  red: "#FF5A5A"
};

export const ACCENT = COLORS.accent;

export const FONT = {
  body: "Manrope_500Medium",
  bodyRegular: "Manrope_400Regular",
  bodySemi: "Manrope_600SemiBold",
  bodyBold: "Manrope_700Bold",
  bodyExtra: "Manrope_800ExtraBold",
  display: "SpaceGrotesk_700Bold",
  displaySemi: "SpaceGrotesk_600SemiBold",
  displayMedium: "SpaceGrotesk_500Medium"
};
