import { create } from "zustand";

type PopupType = undefined | "newCollection" | "newItem";

const usePopupStore = create((set) => ({
  popupType: undefined,
  setPopupType: (popupType: PopupType) => set({ popupType }),
}));

export default usePopupStore;
