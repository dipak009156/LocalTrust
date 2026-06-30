/**
 * demoSettings.js
 * Simple in-memory store for Sentinel demo panel settings.
 * Stored in sessionStorage so they persist across hot-reloads.
 */

const KEY = 'sentinel_demo_settings';

const DEFAULT = {
  fakeGeo: null,    // { lat, lon, country } or null
  isVpn: false,     // simulate VPN flag
};

export function getDemoSettings() {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : { ...DEFAULT };
  } catch {
    return { ...DEFAULT };
  }
}

export function setDemoSettings(patch) {
  const current = getDemoSettings();
  const next = { ...current, ...patch };
  sessionStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function clearDemoSettings() {
  sessionStorage.removeItem(KEY);
  return { ...DEFAULT };
}
