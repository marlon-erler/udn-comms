// SERVICE WORKER
async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      if (registration.installing) {
        setTimeout(() => window.location.reload(), 500);
      } else if (registration.active) {
        console.log("Service worker active");
      }
    } catch (error) {
      console.error(`Could not install service worker: ${error}`);
    }
  }
}

registerServiceWorker();
