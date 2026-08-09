import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

export function InstallPWABadge() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(localStorage.getItem('torrinco:pwa-install-dismissed') !== 'true');
    };

    window.addEventListener('beforeinstallprompt', handler);
    
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      setIsInstalled(isStandalone || (window.navigator as any).standalone);
    };
    
    checkInstalled();
    const installedHandler = () => {
      setIsInstalled(true);
      setIsVisible(false);
      localStorage.removeItem('torrinco:pwa-install-dismissed');
    };
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem('torrinco:pwa-install-dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible || !deferredPrompt || isInstalled) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right-4 fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 p-3 flex items-center gap-3">
        <button
          onClick={handleInstall}
          className="flex items-center gap-2 bg-torrinco-700 hover:bg-torrinco-800 text-white text-sm font-medium py-2 px-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-torrinco-500/20"
        >
          <Download className="h-4 w-4" />
          Instalar App
        </button>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Dispensar convite de instalação"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
