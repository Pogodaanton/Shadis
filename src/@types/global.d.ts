// We need to declare userData as part of the window object

interface Window {
  /**
   * The backend sets a global "userData" object
   * which provides basic information of the logged in user.
   *
   * Naturally, it is only available, if the client is actually logged in.
   * Hence, we can assume the client is in a logged in state if this object is available.
   *
   * @memberof Window
   */
  userData?: { username: string };
  /**
   * THe backend sets a global "fileData" object
   * which provides everything necessary
   * to mount <FileView/> without prefetching.
   *
   * This object should only appear if a <FileView/> is
   * directly requested by the client meaning the very
   * first route is "/:id"
   *
   * @memberof Window
   */
  fileData?: {
    id: string;
    width: number;
    height: number;
    thumb_height: number;
    extension: string;
    title: string;
    timestamp: number;
    fromServer?: boolean;
    has_gif?: boolean;
  };
}

declare module "react-resize-aware";
declare module "gif.js";
