import { useEffect, useRef, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { registerSW } from 'virtual:pwa-register';

export function PWAUpdatePrompt() {
  const [visible, setVisible] = useState(false);
  const [updating, setUpdating] = useState(false);
  const updateRef = useRef<((reloadPage?: boolean) => Promise<void>) | null>(null);

  useEffect(() => {
    let active = true;
    const updateServiceWorker = registerSW({
      onNeedRefresh() {
        if (!active) return;
        updateRef.current = updateServiceWorker;
        setVisible(true);
      },
      onRegisterError(error) {
        if (active) console.error('Não foi possível registrar a atualização do PWA:', error);
      },
    });
    updateRef.current = updateServiceWorker;
    return () => { active = false; };
  }, []);

  const update = async () => {
    if (!updateRef.current) return;
    setUpdating(true);
    try {
      await updateRef.current(true);
    } finally {
      setUpdating(false);
    }
  };

  if (!visible) return null;
  return (
    <div role="status" aria-live="polite" className="app-update-badge fixed z-[110] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <button type="button" disabled={updating} onClick={() => void update()} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-torrinco-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
          <RefreshCw className={`h-4 w-4 ${updating ? 'animate-spin' : ''}`} aria-hidden="true" />
          {updating ? 'Atualizando…' : 'Atualizar Torrinco'}
        </button>
        <button type="button" onClick={() => setVisible(false)} className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Atualizar depois">
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
