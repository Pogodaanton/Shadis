/**
 * Assigns a default class and export for service worker scripts
 * in order to avoid missing module errors.
 *
 * Make sure imported web workers start with `worker-loader!`
 * so that webpack handles it as a service-worker.
 */
declare module "worker-loader!*" {
  class WebpackWorker extends Worker {
    constructor();
  }

  export default WebpackWorker;
}
