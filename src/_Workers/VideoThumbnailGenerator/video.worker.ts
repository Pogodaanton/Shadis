/* eslint-disable no-restricted-globals */
import axios from "../../_interceptedAxios";
import { ToastContent, ToastOptions } from "react-toastify";

const ctx: Worker = self as any;
let IDList: { id: string }[] = [];

const addToast = (content: ToastContent, title: ToastContent, options: ToastOptions) => {
  ctx.postMessage({
    task: "addToast",
    arguments: [content, title, options],
  });
};

const generateNextThumbnail = () => {
  if (IDList.length <= 0) return;
  ctx.postMessage({
    task: "getFirstFrame",
    arguments: IDList[0].id,
  });
};

// Listen to fetchList request from client.
// The data can either be a single string as a task or an object containing keys "task" and "arguments"
ctx.addEventListener("message", ({ data }) => {
  if (
    typeof data !== "string" &&
    (typeof data !== "object" || typeof data["task"] !== "string")
  )
    return;

  switch (typeof data === "object" ? data.task : data) {
    case "fetchList":
      (async () => {
        try {
          const res = await axios.get(
            self.location.origin + data.baseDirectory + "/api/getAdminTasks.php",
            {
              params: { type: "video-thumbnail" },
            }
          );

          if (res.data) {
            IDList = res.data;
            generateNextThumbnail();
          } else {
            console.log("Web Worker does not have anything to do.");
          }
        } catch (err) {
          addToast("error.requestTaskList", "", { type: "error" });
          console.log("error.requestTaskList", "\n", err.message);
        }
      })();
      break;
    case "setFrame":
      if (typeof data !== "object" || typeof data["arguments"] !== "object") break;
      (async () => {
        try {
          const {
            arrayBuffer,
            id,
          }: { arrayBuffer: ArrayBuffer; id: string } = data.arguments;
          const imageBlob: Blob = new Blob([arrayBuffer], { type: "image/jpeg" });
          const postData = new FormData();

          postData.append("type", "video-thumbnail");
          postData.append("id", id);
          postData.append("data", imageBlob);

          await axios.post(
            self.location.origin + data.baseDirectory + "/api/finishAdminTask.php",
            postData
          );
          IDList.shift();
          generateNextThumbnail();
        } catch (err) {
          addToast("error.requestTaskList", "", { type: "error" });
          console.log("error.requestTaskList", "\n", err.message);
        }
      })();
      break;
  }
});

console.log("Spinning up a new VideoWorker...");
