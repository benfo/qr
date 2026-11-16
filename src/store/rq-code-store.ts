import { create } from "zustand";
import { getPreset, PRESETS, PresetId } from "../presets";
import type { DotStyle, EyeStyle } from "../components/qr-svg";

type Values = Record<string, string>;

export type IconColorMode = "brand" | "code" | "custom";

interface QRCodeState {
  presetId: PresetId;
  values: Record<PresetId, Values>;
  color: string;
  transparent: boolean;
  showIcon: boolean;
  /** Where the centre icon's colour comes from; see useIconColor. */
  iconColorMode: IconColorMode;
  /** The icon colour used in "custom" mode. */
  iconCustomColor: string;
  dotStyle: DotStyle;
  eyeFrame: EyeStyle;
  eyeCentre: EyeStyle;
  setPreset: (id: PresetId) => void;
  setValue: (key: string, value: string) => void;
  setColor: (color: string) => void;
  setTransparent: (transparent: boolean) => void;
  setShowIcon: (showIcon: boolean) => void;
  setIconColorMode: (mode: IconColorMode) => void;
  setIconCustomColor: (color: string) => void;
  setDotStyle: (dotStyle: DotStyle) => void;
  setEyeFrame: (eyeFrame: EyeStyle) => void;
  setEyeCentre: (eyeCentre: EyeStyle) => void;
}

const initialValues = Object.fromEntries(
  PRESETS.map((p) => [p.id, { ...p.defaults }])
) as Record<PresetId, Values>;

export const useQRCodeStore = create<QRCodeState>((set) => ({
  presetId: "link",
  values: initialValues,
  color: "#000000",
  transparent: false,
  showIcon: false,
  iconColorMode: "brand",
  iconCustomColor: "#000000",
  dotStyle: "square",
  eyeFrame: "square",
  eyeCentre: "square",
  setPreset: (presetId) => set({ presetId }),
  setValue: (key, value) =>
    set((state) => ({
      values: {
        ...state.values,
        [state.presetId]: { ...state.values[state.presetId], [key]: value },
      },
    })),
  setColor: (color) => set({ color }),
  setTransparent: (transparent) => set({ transparent }),
  setShowIcon: (showIcon) => set({ showIcon }),
  setIconColorMode: (iconColorMode) =>
    set((state) =>
      // Start a custom colour from whatever the icon shows now.
      iconColorMode === "custom" && state.iconColorMode !== "custom"
        ? { iconColorMode, iconCustomColor: resolveIconColor(state) }
        : { iconColorMode }
    ),
  setIconCustomColor: (iconCustomColor) => set({ iconCustomColor }),
  setDotStyle: (dotStyle) => set({ dotStyle }),
  setEyeFrame: (eyeFrame) => set({ eyeFrame }),
  setEyeCentre: (eyeCentre) => set({ eyeCentre }),
}));

/** The string that ends up inside the QR code. */
export const useEncodedValue = () =>
  useQRCodeStore((state) =>
    getPreset(state.presetId).encode(state.values[state.presetId])
  );

/** "brand" uses the icon's own colour (WhatsApp green), else the code's. */
function resolveIconColor(state: QRCodeState) {
  if (state.iconColorMode === "custom") return state.iconCustomColor;
  const brand = getPreset(state.presetId).iconColor;
  return state.iconColorMode === "brand" && brand ? brand : state.color;
}

export const useIconColor = () => useQRCodeStore(resolveIconColor);
