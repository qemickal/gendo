import { useEffect, useState } from 'react';
import { Download, ArrowUpRight, WifiOff } from 'lucide-react';

// El evento beforeinstallprompt puede dispararse antes de que React monte,
// así que lo capturamos a nivel de módulo y lo compartimos con los componentes.
let deferredPrompt = null;
const listeners = new Set();

const notify = (event) => {
  deferredPrompt = event;
  listeners.forEach((fn) => fn(event));
};

const isStandalone = () => {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
};

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    notify(event);
  });
  window.addEventListener('appinstalled', () => notify(null));
}

/**
 * Botón "Instalar app". Solo se muestra cuando el navegador ofrece instalar
 * la PWA y la app no está corriendo ya en modo independiente.
 */
export function InstallAppButton() {
  const [promptEvent, setPromptEvent] = useState(deferredPrompt);
  const [installed, setInstalled] = useState(isStandalone);

  useEffect(() => {
    const onChange = (event) => {
      setPromptEvent(event);
      setInstalled(isStandalone());
    };
    listeners.add(onChange);

    const media = window.matchMedia?.('(display-mode: standalone)');
    const onDisplayMode = () => setInstalled(isStandalone());
    media?.addEventListener?.('change', onDisplayMode);

    return () => {
      listeners.delete(onChange);
      media?.removeEventListener?.('change', onDisplayMode);
    };
  }, []);

  if (installed || !promptEvent) return null;

  const install = async () => {
    const event = promptEvent;
    setPromptEvent(null);
    notify(null);
    try {
      event.prompt();
      const choice = await event.userChoice;
      if (choice?.outcome === 'accepted') setInstalled(true);
    } catch {
      /* el usuario o el navegador cancelaron la instalación */
    }
  };

  return (
    <button
      type="button"
      className="install-app"
      onClick={install}
      title="Instalar GENDO en este dispositivo"
    >
      <Download size={19} />
      <span>Instalar app</span>
      <ArrowUpRight size={15} />
    </button>
  );
}

/** Aviso flotante cuando el dispositivo pierde la conexión. */
export function PwaStatus() {
  const [online, setOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine
  );

  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => {
      window.removeEventListener('online', up);
      window.removeEventListener('offline', down);
    };
  }, []);

  if (online) return null;

  return (
    <div className="pwa-offline" role="status" aria-live="polite">
      <WifiOff size={15} />
      <span>Sin conexión · tus datos siguen guardados en este dispositivo</span>
    </div>
  );
}
