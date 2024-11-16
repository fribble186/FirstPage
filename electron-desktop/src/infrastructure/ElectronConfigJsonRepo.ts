import { domain } from "firstpage-core";
import { HasDownloadedConfigJson } from "../consts/LocalStorageKey";

// window.electron.startDownload(uri);
//       // 监听文件保存事件
//       window.electron.onFileSaved((encryptedData) => {
//         // 存储文件信息到 localStorage
//         localStorage.setItem("fileSaved", "true");
//         resolve(encryptedData);
//       });
export default class ElectronConfigJsonRepo implements domain.ConfigJsonRepo {
  async get(): Promise<domain.ConfigJson | null> {
    return new Promise((resolve, reject) => {
      const hasDownloaded = localStorage.getItem(HasDownloadedConfigJson);
      if (hasDownloaded === "true") {
        window.electron.getDecryptedJson();
        window.electron.onDecryptedJsonFound((decryptedData) => {
          if (decryptedData) {
            resolve(JSON.parse(decryptedData));
          } else {
            reject("file not exist");
          }
        });
      } else {
        reject("file not exist");
      }
    });
  }
  async save(decryptedJsonStr: string): Promise<void> {
    return new Promise((resolve) => {
      localStorage.setItem(HasDownloadedConfigJson, "true");
      window.electron.saveDecrypedJson(decryptedJsonStr);
      window.electron.onSaveDecrypedJson((result) => {
        if (result) {
          resolve();
        }
      });
    });
  }
  async delete(): Promise<void> {
    return new Promise((resolve) => {
      localStorage.removeItem(HasDownloadedConfigJson);
      window.electron.removeDecrypedJson();
      window.electron.onRemoveDecrypedJson((result) => {
        if (result) {
          resolve();
        }
      });
    });
  }
}
