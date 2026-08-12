import { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NAV_TABS } from "../layout/navTabs";

const DISTANCE_THRESHOLD = 60;
const VELOCITY_THRESHOLD = 0.5; // px/ms

/**
 * Horizontal swipe-to-switch-tabs, gated on |dx| > |dy| so it never steals a
 * vertical scroll gesture. Ignores touches starting inside a `data-swipe-row`
 * element so it doesn't fight SwipeableRow's own horizontal drag.
 */
export function useSwipeNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const start = useRef<{ x: number; y: number; t: number } | null>(null);
  const suppressed = useRef(false);

  const onTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    suppressed.current = !!target.closest("[data-swipe-row]");
    if (suppressed.current) return;
    const touch = e.touches[0];
    start.current = { x: touch.clientX, y: touch.clientY, t: Date.now() };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (suppressed.current || !start.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - start.current.x;
    const dy = touch.clientY - start.current.y;
    const dt = Math.max(Date.now() - start.current.t, 1);
    start.current = null;

    if (Math.abs(dx) <= Math.abs(dy)) return;
    const velocity = Math.abs(dx) / dt;
    if (Math.abs(dx) < DISTANCE_THRESHOLD && velocity < VELOCITY_THRESHOLD) return;

    const index = NAV_TABS.findIndex((t) => t.path === location.pathname);
    if (index === -1) return;
    const nextIndex = dx < 0 ? index + 1 : index - 1;
    if (nextIndex < 0 || nextIndex >= NAV_TABS.length) return;
    navigate(NAV_TABS[nextIndex].path);
  };

  return { onTouchStart, onTouchEnd };
}
