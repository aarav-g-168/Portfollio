import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { buildNotes } from '../data/build-notes';

const initialPreferences = Object.fromEntries(buildNotes.map((note) => [note.id,
  { archived: Boolean(note.archived), pinned: Boolean(note.pinned) }]));

// Preferences are local to this browser; portfolio content stays in build-notes.js.
const useNotesStore = create(persist((set) => ({
  preferences: initialPreferences,
  setArchived: (id, archived) => set((state) => ({ preferences: {
    ...state.preferences, [id]: { ...initialPreferences[id], ...state.preferences[id], archived },
  } })),
  togglePinned: (id) => set((state) => ({ preferences: {
    ...state.preferences, [id]: { ...initialPreferences[id], ...state.preferences[id],
      pinned: !(state.preferences[id]?.pinned ?? initialPreferences[id]?.pinned) },
  } })),
}), {
  name: 'macfolio-notebook-v1',
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({ preferences: state.preferences }),
}));

export default useNotesStore;
