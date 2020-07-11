import React, { useEffect, useCallback, useRef } from "react";
import { toast } from "../../_DesignSystem";
import axios, { basePath, getApiPath } from "../../_interceptedAxios";

/**
 * - Retrieve a list of missing thumbnails
 * - Load the first frame of each video in question
 * - Pass the frames to a web worker which then uploads them back as thumbnail candidates
 * - Server saves an optimized copy of them
 */
const VideoThumbnailGenerator: React.ComponentType<{}> = props => {
  /**
   * An array containing videos that need GIF equivalents.
   */
  const taskList = useRef<Window["fileData"][]>([]);

  /**
   * Loads the first frame of the video and pass it on as the new thumbnail
   */
  const generateThumbnailFromVideo = useCallback(
    (id: string) =>
      new Promise<ArrayBuffer>(resolve => {
        const canvasEl = document.createElement("canvas");
        const ctx = canvasEl.getContext("2d");
        const videoEl = document.createElement("video");
        videoEl.style.position = canvasEl.style.position = "fixed";
        videoEl.style.display = canvasEl.style.display = "none";
        videoEl.preload = "metadata";
        videoEl.autoplay = false;
        videoEl.addEventListener("loadeddata", () => {
          const cleanup = () => {
            document.body.removeChild(canvasEl);
            document.body.removeChild(videoEl);
          };

          const seekHandler = () => {
            videoEl.removeEventListener("seeked", seekHandler);
            videoEl.pause();
            ctx.drawImage(videoEl, 0, 0, videoEl.videoWidth, videoEl.videoHeight);

            try {
              // Generate a final JPEG blob
              canvasEl.toBlob(imgBlob => {
                // We need an ArrayBuffer, so that we can send it to the worker
                const reader = new FileReader();
                reader.addEventListener("loadend", () => {
                  if (reader.result instanceof ArrayBuffer) {
                    cleanup();
                    resolve(reader.result);
                  }
                });
                reader.readAsArrayBuffer(imgBlob);
              }, "image/jpeg");
            } catch (err) {
              console.log(
                "Unknown error while generating a video thumbnail. This procedure might not be supported by the browser. The worker will be terminated."
              );
              console.error(err);
              cleanup();
            }
          };
          canvasEl.width = videoEl.videoWidth;
          canvasEl.height = videoEl.videoHeight;
          videoEl.addEventListener("seeked", seekHandler);
          videoEl.currentTime = 0;
          videoEl.play();
        });

        // NOTE: MP4 is hardcoded, keep that in mind
        videoEl.src = `${basePath}/${id}.mp4#t=0.1`;
        document.body.appendChild(canvasEl);
        document.body.appendChild(videoEl);
      }),
    []
  );

  /**
   * Uploads an image as a thumbnail to the server and assigns it to the given file id
   */
  const uploadThumbnail = useCallback(
    async (id: Window["fileData"]["id"], arrayBuffer: ArrayBuffer) => {
      try {
        const imageBlob: Blob = new Blob([arrayBuffer], { type: "image/jpeg" });
        const postData = new FormData();

        postData.append("type", "video-thumbnail");
        postData.append("id", id);
        postData.append("data", imageBlob);

        await axios.post(getApiPath("finishAdminTask"), postData);
        return true;
      } catch (err) {
        toast.error("error.requestTaskList");
        console.log("error.requestTaskList", "\n", err.message);
        return true;
      }
    },
    []
  );

  /**
   * Loops through every video which needs a new thumbnail,
   * generates them and uploads them
   */
  const loopThroughAllVideos = useCallback(async () => {
    if (taskList.current.length <= 0) return;

    try {
      const curId: Window["fileData"]["id"] = taskList.current[0].id;
      const arrayBuffer: ArrayBuffer = await generateThumbnailFromVideo(curId);
      await uploadThumbnail(curId, arrayBuffer);
    } catch (err) {
      console.log("error.thumbnailGeneration", "\n", err.message || err.toString());
    }

    taskList.current.shift();
    loopThroughAllVideos();
  }, [generateThumbnailFromVideo, uploadThumbnail]);

  /**
   * Retrieve a list of videos not having a proper thumbnail
   */
  useEffect(() => {
    // Don't reload the list unnecessarily
    if (taskList.current.length > 0) return () => {};

    (async () => {
      try {
        const res = await axios.get(getApiPath("getAdminTasks"), {
          params: { type: "video-gif" },
        });

        if (typeof res.data.length !== "undefined" && res.data.length > 0) {
          taskList.current = res.data;
          loopThroughAllVideos();
        }
      } catch (err) {
        toast.error("error.requestTaskList");
        console.log("error.requestTaskList", "\n", err.message);
      }
    })();
    return () => {};
  }, [loopThroughAllVideos]);

  return null;
};

export default VideoThumbnailGenerator;
