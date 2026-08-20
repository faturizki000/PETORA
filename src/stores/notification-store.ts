import { create } from 'zustand';

interface NotificationStore {
  unreadCount: number;
  notifications: Array<{ id: string; title: string; message: string; is_read: boolean }>;
  setUnreadCount: (count: number) => void;
  addNotification: (notification: { id: string; title: string; message: string }) => void;
  markAsRead: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>()((set) => ({
  unreadCount: 0,
  notifications: [],
  setUnreadCount: (count) => set({ unreadCount: count }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [{ ...notification, is_read: false }, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
}));
