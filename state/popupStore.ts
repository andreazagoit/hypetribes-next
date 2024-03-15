import { create } from "zustand";

type newEntityPopup = {
  popupType: "newEntity";
  data: any;
};
type ActivePopup = undefined | newEntityPopup;

const usePopupStore = create((set) => ({
  activePopup: undefined,
  setActivePopup: (popup: ActivePopup) => set({ activePopup: popup }),
}));

export default usePopupStore;
