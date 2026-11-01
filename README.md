# GENDO — Tu espacio de trabajo

Dashboard de proyectos, actividades, tareas, calendario y presupuesto construido con
Vite + React. Funciona también como **PWA instalable** con soporte offline.

## Scripts

```bash
npm install
npm run dev      # servidor de desarrollo (http://localhost:5173)
npm run build    # compila a dist/ y genera el service worker + manifest
npm run preview  # sirve la build (http://localhost:4173)
```

> La PWA se instala y funciona offline con la **build de producción**
> (`npm run build && npm run preview` o cualquier hosting estático sobre HTTPS).
> En `npm run dev` el service worker es de desarrollo: sirve para probar el
> manifest y el botón de instalación, pero no precarga la app para offline.

## PWA

| Pieza | Dónde |
| --- | --- |
| Manifest (nombre, colores, iconos, atajos) | generado por `vite-plugin-pwa` desde `vite.config.js` → `/manifest.webmanifest` |
| Service worker (precache + offline) | generado con Workbox → `/sw.js` |
| Iconos de la app | `public/icons/` (192, 512 y maskable 512) |
| Icono iOS / favicons | `public/apple-touch-icon.png`, `public/favicon-*.png` |
| Botón "Instalar app" | `src/pwa.jsx` (`beforeinstallprompt`) |
| Aviso de "sin conexión" | `src/pwa.jsx` (`PwaStatus`) |

### Qué queda disponible sin internet

- La app completa se precarga en la primera visita (HTML, JS, CSS, iconos).
- Navegación offline: cualquier ruta cae en `index.html` desde la caché.
- Tipografías de Google Fonts: `StaleWhileRevalidate` / `CacheFirst`.
- Los datos (proyectos, gastos, eventos) ya viven en `localStorage`, así que se
  editan y persisten sin conexión.

### Actualizaciones

`registerType: 'autoUpdate'`: cuando se publica una nueva build, el service
worker se instala, activa y la app queda actualizada en la siguiente carga.

### Probar la instalación

1. `npm run build && npm run preview`
2. Abre `http://localhost:4173` en Chrome/Edge → icono de instalar en la barra
   de direcciones, o el botón **Instalar app** del sidebar.
3. En iOS/Safari: Compartir → "Añadir a pantalla de inicio".
