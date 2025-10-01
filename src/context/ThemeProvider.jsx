import { createContext, useContext, useEffect, useState } from 'react';

const ThemeCtx = createContext({ dark: false, toggle: () => {} });
export const useTheme = () => useContext(ThemeCtx);

export default function ThemeProvider({ children }) {
  const getInitial = () => {
    const saved = localStorage.getItem('hws-dark');
    if (saved === 'true') return true;
    if (saved === 'false') return false;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
  };

  const [dark, setDark] = useState(getInitial);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('hws-dark', String(dark));
  }, [dark]);

  // reacts to system change if user didn't explicitly choose
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!media) return;
    const onChange = (e) => {
      const saved = localStorage.getItem('hws-dark');
      if (saved === null) setDark(e.matches);
    };
    media.addEventListener?.('change', onChange);
    return () => media.removeEventListener?.('change', onChange);
  }, []);

  return (
    <ThemeCtx.Provider value={{ dark, toggle: () => setDark((d) => !d) }}>
      {children}
    </ThemeCtx.Provider>
  );
}
