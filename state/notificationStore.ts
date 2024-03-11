import { create } from "zustand";

interface Notification {
  type: "error" | "info";
  message: string;
}

const useNotificationStore = create((set) => ({
  index: 0,
  notifications: [],
  addNotification: (notification: Notification) =>
    set((state) => {
      console.log("notification", notification);
      const id = state.index;
      const updatedIndex = state.index + 1;

      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, 3000);

      const newNotification = { id, ...notification };

      return {
        index: updatedIndex,
        notifications: [...state.notifications, newNotification],
      };
    }),
}));

export default useNotificationStore;
