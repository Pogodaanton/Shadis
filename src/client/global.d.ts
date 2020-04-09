// We need to declare userData as part of the window object
interface Window {
  userData?: { username: string };
  fileData?: {
    id: string;
    width: number;
    height: number;
    extension: string;
    title: string;
    timestamp: number;
  };
}
