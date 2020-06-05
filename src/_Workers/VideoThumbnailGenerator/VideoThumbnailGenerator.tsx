import React, { useEffect } from "react";
// eslint-disable-next-line import/no-webpack-loader-syntax
import VideoWorker from "worker-loader!./video.worker.ts";
import { useToasts } from "react-toast-notifications";

let worker: VideoWorker = null;

/**
 * - Retrieve a list of missing thumbnails
 * - Load the first frame of each video in question
 * - Pass the frames to a web worker which then uploads them back as thumbnail candidates
 * - Server saves an optimized copy of them
 *
 * NOTE: This code might be a candidate for refactoring. e.g.: One could question the use-
 *       fulness of a worker for a job like this.
 */
const VideoThumbnailGenerator: React.ComponentType<{}> = props => {
  const { addToast } = useToasts();

  useEffect(() => {
    if (typeof Worker === "undefined") return;
    if (!worker) worker = new VideoWorker();

    const getFirstFrame = (id: string) =>
      new Promise<{ arrayBuffer: ArrayBuffer; id: string }>(resolve => {
        const canvasEl = document.createElement("canvas");
        const ctx = canvasEl.getContext("2d");
        const videoEl = document.createElement("video");
        videoEl.style.position = canvasEl.style.position = "fixed";
        videoEl.preload = "metadata";
        videoEl.addEventListener("loadeddata", () => {
          canvasEl.width = videoEl.videoWidth;
          canvasEl.height = videoEl.videoHeight;
          videoEl.style.bottom = canvasEl.style.bottom = -1 * videoEl.videoHeight + "px";
          ctx.drawImage(videoEl, 0, 0, videoEl.videoWidth, videoEl.videoHeight);

          try {
            // Generate a final JPEG blob
            canvasEl.toBlob(imgBlob => {
              // We need an ArrayBuffer, so that we can send it to the worker
              const reader = new FileReader();
              reader.addEventListener("loadend", () => {
                if (reader.result instanceof ArrayBuffer) {
                  resolve({
                    arrayBuffer: reader.result,
                    id,
                  });
                }
              });
              reader.readAsArrayBuffer(imgBlob);
            }, "image/jpeg");
          } catch (err) {
            console.log(
              "Unknown error while generating a video thumbnail. This procedure might not be supported by the browser. The worker will be terminated."
            );
            console.error(err);
            worker.terminate();
          }
        });

        // NOTE: MP4 is hardcoded, keep that in mind
        videoEl.src = `${window.location.origin}/${id}.mp4#t=0.1`;
        document.body.appendChild(canvasEl);
        document.body.appendChild(videoEl);
      });

    const taskHandler = (ev: MessageEvent) => {
      const { data } = ev;
      if (typeof data === "object" && "task" in data && "arguments" in data) {
        switch (data.task) {
          case "addToast":
            addToast(data.arguments[0], data.arguments[1]);
            break;
          case "getFirstFrame":
            if (typeof data.arguments === "string") {
              getFirstFrame(data.arguments).then(obj => {
                worker.postMessage({ task: "setFrame", arguments: obj }, [
                  obj.arrayBuffer,
                ]);
              });
            }
            break;
          default:
            break;
        }
      }
    };

    if (worker.addEventListener) worker.addEventListener("message", taskHandler);
    else worker.onmessage = taskHandler;

    return () => {
      if (worker.addEventListener) worker.removeEventListener("message", taskHandler);
      else worker.onmessage = null;
    };
  }, [addToast]);

  useEffect(() => {
    worker.postMessage("fetchList");
  }, []);

  return null;
};

export default VideoThumbnailGenerator;
