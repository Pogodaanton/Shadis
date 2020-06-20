import React, { useEffect, useCallback, useRef, useState } from "react";
import { toast } from "../../_DesignSystem";
import gifJS from "gif.js";
import axios from "../../_interceptedAxios";

/**
 * gif.js can use a faster quantization through WASM
 */
const canWasm = window["WebAssembly"] !== null;

/**
 * Maximal size of a single GIF chunk when uploading
 */
const chunkSize = 1024 * 1024;

/**
 * Framerate of the output GIF
 */
const desiredFramerate = 8;

/**
 * Gif.js instance
 * NOTE: Worker scripts are not automatically terminated!
 */
const gif = new gifJS({
  workerScript:
    window.location.origin +
    "/static/js/" +
    (canWasm ? "gif.worker-wasm.js" : "gif.worker.js"),
  workers: 4,
  quality: 8,
  // globalPalette: true,
  width: 0,
  height: 0,
  // dither: "Atkinson",
  // dither: false,
  repeat: 0,
});

const VideoGifGenerator: React.ComponentType<{}> = props => {
  /**
   * An array containing video IDs that need GIF equivalents.
   */
  const taskList = useRef<{ id: string }[]>([]);

  /**
   * Current progress with the conversion of a video
   */
  type progressPercentage = number;
  const [progressPercentage, setProgress] = useState(null);

  /**
   * ID of the toast that is used to display the progress
   * of generating and uploading a GIF
   */
  type toastId = string;
  const [toastId, setToastId] = useState<string>(null);
  const [curFileId, setCurFileId] = useState(null);

  /**
   * Generates a gif from an already uploaded video via gif.js
   * @param fileID Already existing id for a video file.
   */
  const generateGif = useCallback((fileID: string[8]) => {
    if (taskList.current.length <= 0) return;
    setCurFileId(fileID);

    const videoEl = document.createElement("video");
    videoEl.style.display = "none";
    videoEl.preload = "metadata";
    videoEl.autoplay = false;

    /**
     * Seeks video to given time, adds the frame to gif.js and progresses to
     * the next GIF frame by calling itself again.
     *
     * @param time Video time to seek to in seconds
     * @param seekSummand Number in seconds by which `time` should progress after successful seeking
     */
    const seekVideo = (time: number, seekSummand: number) => {
      const seekHandler = () => {
        videoEl.removeEventListener("seeked", seekHandler);

        // Setting progress for toast
        setProgress((videoEl.currentTime * 33) / videoEl.duration);

        // Start GIF rendering if there is no frame to add anymore
        if (videoEl.currentTime >= videoEl.duration) {
          gif.render();
          document.body.removeChild(videoEl);
          return;
        }

        gif.addFrame(videoEl, { copy: true, delay: seekSummand * 1000 });
        seekVideo(time + seekSummand, seekSummand);
      };

      videoEl.addEventListener("seeked", seekHandler);
      videoEl.currentTime = time;
    };

    videoEl.addEventListener("loadedmetadata", () => {
      const seekSummand = 1 / desiredFramerate;

      gif.abort();
      gif.frames = [];
      gif.setOptions({
        width: videoEl.videoWidth,
        height: videoEl.videoHeight,
      });

      seekVideo(0, seekSummand);
    });

    // NOTE: MP4 is hardcoded!
    videoEl.src = `${window.location.origin}/${fileID}.mp4`;
    document.body.appendChild(videoEl);
  }, []);

  /**
   * Removes first object from the task list and
   * requests a GIF generation for the next item in the list.
   */
  const shiftToNextGif = useCallback(() => {
    taskList.current.shift();
    if (taskList.current.length <= 0) return;
    generateGif(taskList.current[0].id);
  }, [generateGif]);

  /**
   * Starts uploading procedure.
   *
   * The GIF is split into small chunks and uploaded into a
   * temporary folder. Finally, a stitching request will tell
   * the server to combine the chunks and create an optimized
   * version of the full GIF.
   */
  const uploadGif = useCallback(
    (gifBlob: Blob) => {
      const maxChunkAmount = gifBlob.size / chunkSize;

      const uploadGifChunk = async (chunkNum: number) => {
        const curID = taskList.current[0].id;
        const postData = new FormData();

        const offset = chunkNum * chunkSize;
        const blobChunk = gifBlob.slice(offset, offset + chunkSize);

        /**
         * After uploading all chunks, we need to tell the server
         * to start stitching them together.
         */
        const isStitchRequest = blobChunk.size === 0;

        postData.append(
          "type",
          !isStitchRequest ? "video-gif-upload" : "video-gif-stitch"
        );
        postData.append("id", curID);
        postData.append("chunkNum", chunkNum.toString());
        postData.append("data", !isStitchRequest ? blobChunk : null);

        try {
          await axios.post(
            window.location.origin + "/api/finishAdminTask.php",
            postData,
            {
              onUploadProgress: p => {
                const uploadPercent = (p.loaded * 100) / p.total;
                const chunkCompletePercent = 34 / maxChunkAmount;
                const progress =
                  (uploadPercent * chunkCompletePercent) / 100 +
                  66 +
                  chunkCompletePercent * chunkNum;
                setProgress(progress);
              },
            }
          );

          if (isStitchRequest)
            console.log("Wow, we're at chunk " + chunkNum + " / " + maxChunkAmount);
          if (!isStitchRequest) uploadGifChunk(chunkNum + 1);
          else shiftToNextGif();
        } catch (err) {
          // Skip current GIF if another client is already uploading
          if (typeof err.code !== "undefined" && err.code === 423) {
            shiftToNextGif();
            return;
          }

          toast.error("error.gifUpload");
          console.log("error.gifUpload", "\n", err.message, err, typeof err);
        }
      };

      uploadGifChunk(0);
    },
    [shiftToNextGif]
  );

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(window.location.origin + "/api/getAdminTasks.php", {
          params: { type: "video-gif" },
        });

        if (typeof res.data.length !== "undefined" && res.data.length > 0) {
          console.log(res.data);
          taskList.current = res.data;
          generateGif(taskList.current[0].id);
        }
      } catch (err) {
        toast.error("error.requestTaskList");
        console.log("error.requestTaskList", "\n", err.message);
      }
    })();
    return () => {};
  }, [generateGif]);

  useEffect(() => {
    const gifFinishHandler = uploadGif;
    const handleGifProgress = (progress: number) => {
      setProgress((progress * 100 * 33) / 100 + 33);
    };

    gif.addListener("finished", gifFinishHandler);
    gif.addListener("progress", handleGifProgress);
    return () => {
      gif.removeListener("finished", gifFinishHandler);
      gif.removeListener("progress", handleGifProgress);
    };
  }, [uploadGif]);

  useEffect(() => {
    let toastId: string = null;
    toastId =
      toast("Spinning up GIF generator...", "", { progress: 0, type: "info" }) + "";
    setToastId(toastId);

    return () => {
      if (toastId) toast.dismiss(toastId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!toastId || !curFileId) return;

    let title = "";
    if (progressPercentage < 33)
      title = `Preparing ${curFileId}.mp4 to convert to GIF...`;
    if (progressPercentage >= 33) title = `Generating ${curFileId}.gif...`;
    if (progressPercentage >= 66) title = `Uploading ${curFileId}.gif...`;

    toast.update(toastId, { progress: progressPercentage, title });

    console.log(`${title} - ${progressPercentage}%`);
  }, [curFileId, progressPercentage, toastId]);

  return null;
};

export default VideoGifGenerator;
