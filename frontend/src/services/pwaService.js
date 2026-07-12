export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return null;

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    console.log('PWA: Service Worker registered');
    return registration;
  } catch (error) {
    console.warn('PWA: Service Worker registration failed', error);
    return null;
  }
}

export function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true;
}
