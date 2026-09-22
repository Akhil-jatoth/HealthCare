self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || "Medicine reminder", {
      body: data.body || "It is time to take your medicine.",
      icon: "/client/public/favicon.svg",
      data: { url: data.url || "/demo.html" },
      tag: "medicine-reminder",
      requireInteraction: true,
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data?.url || "/demo.html"));
});
