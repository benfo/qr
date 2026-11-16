import { create } from "zustand";
import { getPreset, PRESETS, PresetId } from "../presets";
import type { DotStyle } from "../components/qr-svg";

type Values = Record<string, string>;

interface QRCodeState {
  presetId: PresetId;
  values: Record<PresetId, Values>;
  color: string;
  transparent: boolean;
  showIcon: boolean;
  dotStyle: DotStyle;
  setPreset: (id: PresetId) => void;
  setValue: (key: string, value: string) => void;
  setColor: (color: string) => void;
  setTransparent: (transparent: boolean) => void;
  setShowIcon: (showIcon: boolean) => void;
  setDotStyle: (dotStyle: DotStyle) => void;
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
  dotStyle: "square",
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
  setDotStyle: (dotStyle) => set({ dotStyle }),
}));

/** The string that ends up inside the QR code. */
export const useEncodedValue = () =>
  useQRCodeStore((state) =>
    getPreset(state.presetId).encode(state.values[state.presetId])
  );
