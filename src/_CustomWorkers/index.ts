// eslint-disable-next-line import/no-webpack-loader-syntax
import VideoWorker from "worker-loader!./video.worker.ts";

export const registerAll = () => {
  const workers: Worker[] = [new VideoWorker()];

  workers.forEach(worker => {
    worker.postMessage({ a: 1 });
    worker.onmessage = ev => {};

    worker.addEventListener("message", ev => {});
  });
};
