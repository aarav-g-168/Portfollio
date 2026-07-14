// manages the state of all the windows

// stores the application states
import { create } from 'zustand'

// updates the state more easily and immutably
import { immer } from 'zustand/middleware/immer'

import { INITIAL_Z_INDEX, WINDOW_CONFIG } from "../constants"

const useWindowStore = create(immer((set) => ({
    windows: WINDOW_CONFIG,
    nextZIndex: INITIAL_Z_INDEX,

    openWindow: (windowKey, data = null) => set((state) => {
        const win = state.windows[windowKey];
        if (!win) {
            console.error(`Window with id ${windowKey} not found.`);
            return;
        }
        win.isOpen = true;
        win.zIndex = state.nextZIndex;
        win.data = data ?? win.data;
        state.nextZIndex += 1;
    }),

    closeWindow: (windowKey) => set((state) => {
        const win = state.windows[windowKey];
        if (!win) {
            console.error(`Window with id ${windowKey} not found.`);
            return;
        }
        win.isOpen = false;
        win.zIndex = INITIAL_Z_INDEX;
        win.data = null;
    }),

    focusWindow: (windowKey) => set((state) => {
        const win = state.windows[windowKey];
        win.zIndex = state.nextZIndex;
        state.nextZIndex += 1;
    }),
})))

export default useWindowStore