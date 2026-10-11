import gsap from 'gsap';
import { dockApps } from '../constants';

const activeMotions = new WeakMap();
const dockWindows = new Set(dockApps.map(({ id }) => id));
const parentDock = { resume: 'finder', txtfile: 'finder', imgfile: 'photos' };
const clamp = (value) => Math.max(0, Math.min(1, value));
const smooth = (value) => { const t = clamp(value); return t * t * (3 - 2 * t); };
const mix = (from, to, amount) => from + (to - from) * amount;
const MOTION = { open: 0.5, close: 0.42, minimum: 0.08 };

// Give snapshots their own selectors, so animation never duplicates live DOM IDs.
const snapshotStyles = (ids) => {
    const pattern = new RegExp(`#(${[...ids].join('|')})(?![\\w-])`, 'g');
    return [...document.styleSheets].flatMap((sheet) => {
        try {
            return [...sheet.cssRules].map((rule) => rule.cssText)
                .filter((text) => { pattern.lastIndex = 0; return pattern.test(text); })
                .map((text) => text.replace(pattern, '[data-genie-id="$1"]'));
        } catch { return []; } // Cross-origin font stylesheets are not needed.
    }).join('\n');
};

const createSnapshot = (element, rect) => {
    const template = element.cloneNode(true);
    const originals = [element, ...element.querySelectorAll('*')];
    const copies = [template, ...template.querySelectorAll('*')];
    const ids = new Set();
    const scrollPositions = [];

    originals.forEach((original, index) => {
        const copy = copies[index];
        if (original.id) {
            ids.add(original.id);
            copy.dataset.genieId = original.id;
            copy.removeAttribute('id');
        }
        if (original.scrollTop || original.scrollLeft) {
            scrollPositions.push({ index, top: original.scrollTop, left: original.scrollLeft });
        }
        if (original instanceof HTMLInputElement || original instanceof HTMLTextAreaElement) copy.value = original.value;
        if (original instanceof HTMLInputElement) copy.checked = original.checked;
        if (original instanceof HTMLOptionElement) copy.selected = original.selected;
        if (original instanceof HTMLImageElement) copy.loading = 'eager';
        if (original instanceof HTMLCanvasElement) {
            // Canvas pixels aren't copied by cloneNode (notably the PDF viewer).
            try {
                const image = document.createElement('img');
                image.src = original.toDataURL();
                image.className = copy.className;
                image.style.cssText = copy.style.cssText;
                image.style.width = `${original.clientWidth}px`;
                image.style.height = `${original.clientHeight}px`;
                copy.replaceWith(image);
            } catch { /* A protected canvas may remain blank during the short transition. */ }
        }
    });

    template.removeAttribute('hidden');
    template.removeAttribute('data-animating');
    const fixed = {
        position: 'absolute', display: 'block', left: '0px', margin: '0px',
        width: `${rect.width}px`, height: `${rect.height}px`,
        minWidth: '0px', minHeight: '0px', maxWidth: 'none', maxHeight: 'none',
        transform: 'none', translate: 'none', scale: 'none', rotate: 'none',
        visibility: 'visible', opacity: '1', pointerEvents: 'none', zIndex: 'auto',
    };
    Object.assign(template.style, fixed);
    return { template, ids, scrollPositions };
};

// Project each horizontal band onto a trapezoid. Shared edges form a continuous
// curved surface, deforming the window contents as well as its silhouette.
const bandTransform = (top, bottom, width, height) => {
    const ratio = top.width / bottom.width;
    const a = top.width / width;
    const c = (bottom.left * ratio - top.left) / height;
    const b = (bottom.y * ratio - top.y) / height;
    const d = (ratio - 1) / height;
    return `matrix3d(${a},0,0,0,${c},${b},0,${d},0,0,1,0,${top.left},${top.y},0,1)`;
};

export const animateWindowTransition = (element, windowKey, type, onComplete) => {
    const opening = type === 'open';
    const dockKey = dockWindows.has(windowKey) ? windowKey : parentDock[windowKey];
    const dockIcon = dockKey && document.querySelector(`[data-dock-window="${dockKey}"]`);
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const icon = dockIcon?.getBoundingClientRect();
    let motion = activeMotions.get(element);

    if (preference.matches || !icon?.width || !icon?.height) {
        motion?.cancel();
        const restoreFocus = !opening && element.contains(document.activeElement);
        onComplete();
        if (restoreFocus) dockIcon?.focus({ preventScroll: true });
        return null;
    }

    if (!motion) {
        const rect = element.getBoundingClientRect();
        if (!rect.width || !rect.height) { onComplete(); return null; }
        const { template, ids, scrollPositions } = createSnapshot(element, rect);
        const layer = document.createElement('div');
        layer.className = 'genie-transition';
        layer.dataset.window = windowKey;
        layer.setAttribute('aria-hidden', 'true');
        layer.inert = true;
        layer.style.zIndex = element.style.zIndex;
        const styles = document.createElement('style');
        styles.textContent = snapshotStyles(ids);
        layer.append(styles);

        // Integer source offsets keep neighboring bands on the same pixel grid.
        const bandHeight = Math.ceil(rect.height / (rect.width < 600 ? 24 : 32));
        const count = Math.ceil(rect.height / bandHeight);
        const bands = Array.from({ length: count }, (_, index) => {
            const band = document.createElement('div');
            band.className = 'genie-slice';
            band.style.width = `${rect.width}px`;
            // A tiny overlap prevents hairline seams at fractional CSS pixels.
            const height = Math.min(bandHeight + 6, rect.height - index * bandHeight);
            band.style.height = `${height}px`;
            const content = template.cloneNode(true);
            content.style.top = `${-index * bandHeight}px`;
            band.append(content);
            layer.append(band);
            return { element: band, start: index * bandHeight / rect.height, end: (index * bandHeight + height) / rect.height, height };
        });
        document.body.append(layer);
        if (scrollPositions.length) {
            bands.forEach(({ element: band }) => {
                const nodes = [band.firstElementChild, ...band.firstElementChild.querySelectorAll('*')];
                scrollPositions.forEach(({ index, top, left }) => {
                    nodes[index].scrollTop = top;
                    nodes[index].scrollLeft = left;
                });
            });
        }

        const visibility = element.style.visibility;
        const inert = element.inert;
        const heldFocus = element.contains(document.activeElement);
        element.inert = true;
        element.style.visibility = 'hidden';
        const progress = { value: opening ? 1 : 0 };
        let disposed = false;

        const render = () => {
            const p = progress.value;
            const neck = smooth(p / 0.55);
            const travel = smooth((p - 0.18) / 0.82);
            const topY = mix(rect.top, icon.top + icon.height * 0.42, travel);
            const bottomY = mix(rect.bottom, icon.top + icon.height * 0.58, neck);
            const center = rect.left + rect.width / 2;
            const tipCenter = icon.left + icon.width / 2;
            const edge = (v) => {
                const bend = v ** 1.8;
                const collapse = mix(travel ** 1.6, neck, bend);
                const width = mix(rect.width, icon.width * 0.48, collapse);
                return { width, left: mix(center, tipCenter, collapse) - width / 2, y: mix(topY, bottomY, v) };
            };
            bands.forEach((band) => {
                band.element.style.transform = bandTransform(edge(band.start), edge(band.end), rect.width, band.height);
            });
            layer.style.opacity = String(1 - smooth((p - 0.88) / 0.12));
        };

        const cancel = () => {
            if (disposed) return;
            disposed = true;
            motion.tween?.kill();
            layer.remove();
            element.style.visibility = visibility;
            element.inert = inert;
            window.removeEventListener('resize', finish);
            document.removeEventListener('visibilitychange', onVisibility);
            preference.removeEventListener('change', onPreference);
            activeMotions.delete(element);
        };
        const finish = () => {
            if (disposed) return;
            const restoreFocus = motion.type !== 'open' && heldFocus
                && (element.contains(document.activeElement) || document.activeElement === document.body);
            cancel();
            motion.onComplete();
            if (restoreFocus) dockIcon.focus({ preventScroll: true });
        };
        const onVisibility = () => { if (document.hidden) finish(); };
        const onPreference = () => { if (preference.matches) finish(); };
        motion = { progress, render, cancel, finish, layer, tween: null, type, onComplete };
        activeMotions.set(element, motion);
        window.addEventListener('resize', finish);
        document.addEventListener('visibilitychange', onVisibility);
        preference.addEventListener('change', onPreference);
    }

    // Reverse the existing mesh from its current progress on rapid dock clicks.
    motion.tween?.kill();
    motion.type = type;
    motion.onComplete = onComplete;
    motion.layer.style.zIndex = element.style.zIndex;
    motion.render();
    const destination = opening ? 0 : 1;
    motion.tween = gsap.to(motion.progress, {
        value: destination,
        duration: Math.max(MOTION.minimum, (opening ? MOTION.open : MOTION.close) * Math.abs(destination - motion.progress.value)),
        // The mesh already eases its neck and travel separately; easing this
        // progress again makes opening linger and closing hesitate.
        ease: 'none',
        onUpdate: motion.render,
        onComplete: motion.finish,
    });
    return motion;
};
