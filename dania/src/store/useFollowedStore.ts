import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FollowedState {
  ids: string[];
  toggle: (id: string) => void;
  isFollowed: (id: string) => boolean;
}

export const useFollowedStore = create<FollowedState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((s) => ({
          ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id],
        })),
      isFollowed: (id) => get().ids.includes(id),
    }),
    { name: 'dania:followed' }
  )
);
