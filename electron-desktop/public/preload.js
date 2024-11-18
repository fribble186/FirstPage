// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require("electron");

// As an example, here we use the exposeInMainWorld API to expose the browsers
// and node versions to the main window.
// They'll be accessible at "window.versions".
process.once("loaded", () => {
  contextBridge.exposeInMainWorld("versions", process.versions);
});

contextBridge.exposeInMainWorld("electron", {
  // trigger
  startDownload: (url, headers) =>
    ipcRenderer.send("start-download", url, headers),
  getDecryptedJson: () => ipcRenderer.send("get-decrypted-json"),
  saveDecrypedJson: (decryptedJson) =>
    ipcRenderer.send("save-decrypted-json", decryptedJson),
  removeDecrypedJson: () => ipcRenderer.send("remove-decrypted-json"),
  triggerShortcut: (url) => ipcRenderer.send("start-trigger-shortcut", url),
  minWindow: () => ipcRenderer.send("window-control", "minimize"),
  closeWindow: () => ipcRenderer.send("window-control", "close"),
  // action
  onDecryptedJsonFound: (callback) =>
    ipcRenderer.on("decrypted-json-found", (event, result) => callback(result)),
  onFileSaved: (callback) =>
    ipcRenderer.on("file-saved", (event, encryptedData) =>
      callback(encryptedData)
    ),
  onSaveDecrypedJson: (callback) =>
    ipcRenderer.on("save-decrypted-json-result", (event, result) =>
      callback(result)
    ),
  onRemoveDecrypedJson: (callback) =>
    ipcRenderer.on("remove-decrypted-json-result", (event, result) =>
      callback(result)
    ),
  onWebviewNewWindow: (callback) => {
    ipcRenderer.on("webview-new-window", (e, url) => {
      console.log("webview-new-window", url);
      callback(url);
    });
  },
});
