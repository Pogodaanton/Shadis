import EventEmitter from "onfire.js";

/**
 * Cross-component event event manager for tabs
 */
const tabEventEmitter: EventEmitter = new EventEmitter();

/*
const origOnFunction = tabEventEmitter.on;
tabEventEmitter.on = (eventName: string, cb: Function, once?: boolean) => {
  origOnFunction(eventName, cb, once);
}
*/

export default tabEventEmitter;
