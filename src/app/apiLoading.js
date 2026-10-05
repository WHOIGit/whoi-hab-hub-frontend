// Tracks the number of in-flight API requests made through the shared Axios
// instance, so the map can show a loading indicator whenever a UI control
// triggers a new data download.
let pendingCount = 0;
const listeners = new Set();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export function startRequest() {
  pendingCount += 1;
  notifyListeners();
}

export function endRequest() {
  // never drop below zero if a request somehow settles twice
  pendingCount = Math.max(pendingCount - 1, 0);
  notifyListeners();
}

// snapshot for React's useSyncExternalStore
export function getPendingCount() {
  return pendingCount;
}

// subscribe for React's useSyncExternalStore, returns the unsubscribe function
export function subscribeToPendingCount(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
