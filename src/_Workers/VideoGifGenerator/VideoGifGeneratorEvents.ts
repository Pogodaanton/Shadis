import EventEmitter from "onfire.js";

/**
 * Cross-component event event manager for gif generation
 */
const gifGenEventEmitter: EventEmitter = new EventEmitter();

/**
 * Adds a file to the gif generation queue
 * @param fileData A valid fileData object
 */
export const generateGifFromVideo = (fileData: Window["fileData"]) =>
  gifGenEventEmitter.emit("add", fileData);

export default gifGenEventEmitter;
