import { domain } from "firstpage-core";

export default class ElectronDownloader implements domain.Downloader {
  async download(uri: string): Promise<string> {
    return new Promise((resolve) => {
      if (uri.includes("?")) {
        window.electron.startDownload(`${uri}ts=${Date.now()}`);
      } else {
        window.electron.startDownload(`${uri}?ts=${Date.now()}`);
      }

      // 监听文件保存事件
      window.electron.onFileSaved((encryptedData) => {
        // 存储文件信息到 localStorage
        resolve(encryptedData);
      });
    });
  }
}
