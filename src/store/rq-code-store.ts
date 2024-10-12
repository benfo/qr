import { create } from "zustand";

interface QRCodeState {
  url: string;
  setUrl: (url: string) => void;
}

export const useQRCodeStore = create<QRCodeState>((set) => ({
  url: "",
  setUrl: (url) => set({ url }),
}));
