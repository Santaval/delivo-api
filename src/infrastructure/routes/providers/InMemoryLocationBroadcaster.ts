import { EventEmitter } from "events";
import { ILocationBroadcaster, LocationEvent } from "@/domain/routes/providers/ILocationBroadcaster";

export default class InMemoryLocationBroadcaster implements ILocationBroadcaster {
  private readonly emitter = new EventEmitter();

  constructor() {
    // one listener per connected SSE client; the count is not bounded
    this.emitter.setMaxListeners(0);
  }

  publish(routeId: string, event: LocationEvent): void {
    this.emitter.emit(routeId, event);
  }

  subscribe(routeId: string, callback: (event: LocationEvent) => void): () => void {
    this.emitter.on(routeId, callback);
    return () => {
      this.emitter.off(routeId, callback);
    };
  }
}
