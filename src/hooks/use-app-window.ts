import { useState, useEffect } from "react";
import type { Window } from "@tauri-apps/api/window";

export function useAppWindow() {
  const [appWindow, setAppWindow] = useState<Window | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let unlistenResize: (() => void) | null = null;

    import("@tauri-apps/api/window").then(async (module) => {
      const window = module.getCurrentWindow();
      setAppWindow(window);

      const _isMaximized = await window.isMaximized();
      setIsMaximized(_isMaximized);

      const _isFullscreen = await window.isFullscreen();
      setIsFullscreen(_isFullscreen);

      const unlisten = await window.onResized(async () => {
        const curMaximized = await window.isMaximized();
        setIsMaximized(curMaximized);
        const curFullscreen = await window.isFullscreen();
        setIsFullscreen(curFullscreen);
      });

      unlistenResize = unlisten;
    });

    return () => {
      if (unlistenResize) unlistenResize();
    };
  }, []);

  const toogleMaximize = async () => {
    if (appWindow) {
      await appWindow.toggleMaximize();
    }
  };

  const toggleFullscreen = async () => {
    if (appWindow) {
      const current = await appWindow.isFullscreen();
      await appWindow.setFullscreen(!current);
    }
  };

  const minimize = () => appWindow?.minimize();
  const maximize = () => appWindow?.maximize();
  const close = () => appWindow?.close();
  const startDragging = () => appWindow?.startDragging();

  return {
    appWindow,
    isMaximized,
    isFullscreen,
    toogleMaximize,
    toggleFullscreen,
    minimize,
    maximize,
    close,
    startDragging,
  };
}
