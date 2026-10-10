// manages the state of all the windows

// stores the application states
import { create } from 'zustand'

// updates the state more easily and immutably
import { immer } from 'zustand/middleware/immer'
import gsap from 'gsap'

import { INITIAL_Z_INDEX, WINDOW_CONFIG } from "../constants"

const useWindowStore = create(immer((set) => ({
    windows: WINDOW_CONFIG,
    nextZIndex: INITIAL_Z_INDEX,

    setGenieAnimating: (windowKey, value) => set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;
        win.genieAnimating = value;
    }),

    openWindow: (windowKey, data = null) => set((state) => {
        const win = state.windows[windowKey];
        if (!win) {
            console.error(`Window with id ${windowKey} not found.`);
            return;
        }
        win.isOpen = true;
        win.hasOpened = true;
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
        win.genieAnimating = false;
    }),

    // hides the window without clearing its state, so reopening keeps data/z-index continuity
    minimizeWindow: (windowKey) => set((state) => {
        const win = state.windows[windowKey];
        if (!win) {
            console.error(`Window with id ${windowKey} not found.`);
            return;
        }
        win.isOpen = false;
    }),

    focusWindow: (windowKey) => set((state) => {
        const win = state.windows[windowKey];
        win.zIndex = state.nextZIndex;
        state.nextZIndex += 1;
    }),

    toggleMaximize: (windowKey) => set((state) => {
        const win = state.windows[windowKey];
        if (!win) {
            console.error(`Window with id ${windowKey} not found.`);
            return;
        }

        const el = document.getElementById(windowKey);
        if (!el) return;
        if (win.genieAnimating) return;

        if (!win.maximized) {
            // Store original position and size before maximizing
            win.originalStyle = {
                top: el.style.top || '',
                left: el.style.left || '',
                // Preserve CSS sizing so restored windows still adapt to the viewport.
                width: el.style.width || '',
                height: el.style.height || '',
                position: el.style.position || 'absolute',
                x: Number(gsap.getProperty(el, 'x')) || 0,
                y: Number(gsap.getProperty(el, 'y')) || 0,
            };

            // Apply full-screen styles
            el.style.position = 'fixed';
            el.style.top = '0';
            el.style.left = '0';
            el.style.width = '100vw';
            el.style.height = '100vh';
            el.style.borderRadius = '0';
            el.style.maxWidth = 'none';
            el.style.maxHeight = 'none';
            gsap.set(el, { x: 0, y: 0 });
            win.maximized = true;
        } else {
            // Restore original position and size
            if (win.originalStyle) {
                el.style.position = win.originalStyle.position;
                el.style.top = win.originalStyle.top;
                el.style.left = win.originalStyle.left;
                el.style.width = win.originalStyle.width;
                el.style.height = win.originalStyle.height;
                el.style.borderRadius = '';
                el.style.maxWidth = '';
                el.style.maxHeight = '';
                gsap.set(el, { x: win.originalStyle.x ?? 0, y: win.originalStyle.y ?? 0 });
                win.originalStyle = null;
            }
            win.maximized = false;
        }
    }),
})))

export default useWindowStore
