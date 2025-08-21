type Listener = (...args: any[]) => void;

class EventBus {
  private listeners: Record<string, Set<Listener>> = {};

  on(event: string, listener: Listener) {
    if (!this.listeners[event]) this.listeners[event] = new Set();
    this.listeners[event].add(listener);
    return () => this.off(event, listener);
  }

  off(event: string, listener: Listener) {
    this.listeners[event]?.delete(listener);
  }

  emit(event: string, ...args: any[]) {
    this.listeners[event]?.forEach((l) => {
      try { l(...args); } catch (e) { console.error(e); }
    });
  }
}

export const eventBus = new EventBus();
export const EVENTS = {
  DISCUSSION_CREATED: 'discussion:created',
};
