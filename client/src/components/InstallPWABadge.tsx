import { useEffect, useState } from 'react';
import { Download, Share2, SquarePlus, X } from 'lucide-react';
import { useDialogFocus } from '../hooks/useDialogFocus';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'torrinco:pwa-install-dismissed-at';
const DISMISS_COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000;

function isStandalone(): boolean {
  const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia('(display-mode: standalone)').matches || navigatorWithStandalone.standalone === true;
}

function isIosSafari(): boolean {
  const navigatorWithTouch = window.navigator as Navigator & { maxTouchPoints?: number };
  const ios = /iPad|iPhone|iPod/.test(navigatorWithTouch.userAgent)
    || (navigatorWithTouch.platform === 'MacIntel' && (navigatorWithTouch.maxTouchPoints ?? 0) > 1);
  const alternativeBrowser = /CriOS|FxiOS|EdgiOS|OPiOS/.test(navigatorWithTouch.userAgent);
  return ios && !alternativeBrowser;
}

function wasDismissedRecently(): boolean {
  if (localStorage.getItem('torrinco:pwa-install-dismissed') === 'true') {
    localStorage.removeItem('torrinco:pwa-install-dismissed');
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    return true;
  }
  const dismissedAt = Number(localStorage.getItem(DISMISS_KEY));
  return Number.isFinite(dismissedAt) && Date.now() - dismissedAt < DISMISS_COOLDOWN_MS;
}

export function InstallPWABadge() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);
  const [iosSafari, setIosSafari] = useState(false);
  const iosDialogRef = useDialogFocus<HTMLElement>(showIosInstructions, () => setShowIosInstructions(false));

  useEffect(() => {
    const standalone = isStandalone();
    const ios = isIosSafari();
    setInstalled(standalone);
    setIosSafari(ios);
    if (!standalone && ios && !wasDismissedRecently()) setIsVisible(true);

    const installPromptHandler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      if (!wasDismissedRecently()) setIsVisible(true);
    };
    const installedHandler = () => {
      setInstalled(true);
      setIsVisible(false);
      setShowIosInstructions(false);
      localStorage.removeItem(DISMISS_KEY);
    };

    window.addEventListener('beforeinstallprompt', installPromptHandler);
    window.addEventListener('appinstalled', installedHandler);
    return () => {
      window.removeEventListener('beforeinstallprompt', installPromptHandler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setIsVisible(false);
    setShowIosInstructions(false);
  };

  const install = async () => {
    if (iosSafari && !deferredPrompt) {
      setShowIosInstructions(true);
      return;
    }
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'dismissed') localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setIsVisible(false);
    setDeferredPrompt(null);
  };

  if (installed || (!isVisible && !showIosInstructions)) return null;

  return (
    <>
      {isVisible && !showIosInstructions && (
        <div className="app-install-badge fixed z-[90] animate-in fade-in slide-in-from-bottom-4 duration-300 sm:w-auto">
          <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => void install()}
              className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-torrinco-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-torrinco-500/20 transition active:scale-[0.98] sm:flex-none"
            >
              <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
              Instalar Torrinco
            </button>
            <button type="button" onClick={dismiss} className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Lembrar da instalação depois">
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {showIosInstructions && (
        <div className="app-scroll-lock app-dialog-overlay fixed inset-0 z-[120] flex items-end justify-center bg-black/55 sm:items-center">
          <section ref={iosDialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="ios-install-title" className="app-dialog-surface w-full max-w-md rounded-t-3xl bg-white p-6 pb-[max(1.5rem,var(--app-safe-bottom))] shadow-2xl sm:rounded-2xl dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-torrinco-600">Instalar aplicativo</p>
                <h2 id="ios-install-title" className="mt-1 text-xl font-bold text-gray-900 dark:text-white">Adicione o Torrinco à tela inicial</h2>
              </div>
              <button type="button" onClick={() => setShowIosInstructions(false)} className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Fechar instruções de instalação">
                <X aria-hidden="true" />
              </button>
            </div>
            <ol className="mt-6 space-y-4 text-sm text-gray-700 dark:text-slate-200">
              <li className="flex gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-torrinco-50 text-torrinco-700 dark:bg-torrinco-950"><Share2 aria-hidden="true" className="h-5 w-5" /></span><span>Toque em <strong>Compartilhar</strong> na barra do Safari.</span></li>
              <li className="flex gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-torrinco-50 text-torrinco-700 dark:bg-torrinco-950"><SquarePlus aria-hidden="true" className="h-5 w-5" /></span><span>Escolha <strong>Adicionar à Tela de Início</strong> e confirme.</span></li>
            </ol>
            <button type="button" onClick={() => { setShowIosInstructions(false); setIsVisible(false); }} className="mt-6 w-full rounded-xl bg-torrinco-700 px-4 py-3 font-semibold text-white">Entendi</button>
            <button type="button" onClick={dismiss} className="mt-2 w-full rounded-xl px-4 py-2 text-sm font-medium text-gray-500 dark:text-slate-400">Não mostrar por 14 dias</button>
          </section>
        </div>
      )}
    </>
  );
}
