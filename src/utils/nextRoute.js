// src/utils/nextRoute.js
const KEY = 'hws_next';

export function setNext(next) {
  try { localStorage.setItem(KEY, next); } catch {
    console.error('Error setting next route', next);
  }
}
export function getNext() {
  try { return localStorage.getItem(KEY) || ''; } catch { return ''; }
}
export function clearNext() {
  try { localStorage.removeItem(KEY); } catch {
    console.error('Error clearing next route');
  }
}
