class EventManager {
  constructor() {
    this.events = new Map();
    this.weakMeta = new WeakMap();
  }

  addListener(element, event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, new Map());
    }

    const eventHandlers = this.events.get(event);
    const wrappedCallback = async (...args) => {
      if (!this.weakMeta.has(element)) {
        this.weakMeta.set(element, { lastExecution: Date.now() });
      }

      const meta = this.weakMeta.get(element);
      meta.lastExecution = Date.now();
      
      await callback(...args);
    };

    eventHandlers.set(element, wrappedCallback);
    element.addEventListener(event, wrappedCallback);
  }

  removeListener(element, event) {
    if (this.events.has(event)) {
      const eventHandlers = this.events.get(event);
      if (eventHandlers.has(element)) {
        element.removeEventListener(event, eventHandlers.get(element));
        eventHandlers.delete(element);
      }
    }
  }
}

// Example usage
const manager = new EventManager();
const button = document.createElement("button");

manager.addListener(button, "click", async () => {
  console.log("Button clicked!");
});

// Simulating element removal, but memory still grows
setTimeout(() => {
  manager.removeListener(button, "click");
  console.log("Listener removed, expecting GC to clean up");
}, 5000);
