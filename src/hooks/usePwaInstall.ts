import { useState, useEffect, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const DISMISS_KEY = "adlocal_pwa_prompt_dismissed_at";
const DISMISS_COOLDOWN_DAYS = 7;

const checkIsStandalone = (): boolean => {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone ===
      true
  );
};

const checkIsDismissed = (): boolean => {
  if (typeof window === "undefined") return false;
  const dismissedAt = localStorage.getItem(DISMISS_KEY);
  if (!dismissedAt) return false;
  const diffDays =
    (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
  return diffDays < DISMISS_COOLDOWN_DAYS;
};

const checkIsIOS = (): boolean => {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua) && !checkIsStandalone();
};

export const usePwaInstall = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(checkIsStandalone);
  const [isIOS] = useState<boolean>(checkIsIOS);
  const [isDismissed, setIsDismissed] = useState<boolean>(checkIsDismissed);

  useEffect(() => {
    // Escuchar cambios en modo standalone
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsInstalled(true);
      }
    };
    mediaQuery.addEventListener("change", handleMediaChange);

    // Capturar evento beforeinstallprompt en Android / Chrome
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      localStorage.removeItem(DISMISS_KEY);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setIsInstalled(true);
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error al desplegar prompt de instalación PWA:", err);
      return false;
    }
  }, [deferredPrompt]);

  const dismissPrompt = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setIsDismissed(true);
  }, []);

  const canInstall = !isInstalled && !isDismissed && (!!deferredPrompt || isIOS);

  return {
    canInstall,
    isInstalled,
    isIOS,
    isDismissed,
    hasNativePrompt: !!deferredPrompt,
    promptInstall,
    dismissPrompt,
  };
};

