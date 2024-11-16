// public/electron.js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { net } = require("electron");
const fs = require("fs");
const url = require("url");

const getEncryptedFilePath = () => {
  return path.join(app.getPath("userData"), "configJsonFile.enc");
};
const getDecryptedFilePath = () => {
  return path.join(app.getPath("userData"), "configJsonFile.dec");
};

function triggerUrl(url, headers) {
  return new Promise((resolve, reject) => {
    // 创建 HTTP 请求
    const request = net.request({
      method: "GET",
      url,
      headers: headers ? JSON.parse(headers) : undefined,
    });

    request.on("response", (response) => {
      let data = "";

      // 接收数据
      response.on("data", (chunk) => {
        data += chunk;
      });

      // 响应结束时处理数据
      response.on("end", () => {
        try {
          console.log(data);
          resolve(data); // 返回数据到渲染进程
        } catch (err) {
          reject("Failed to parse response");
        }
      });
    });

    // 请求失败时的处理
    request.on("error", (error) => {
      console.log(error);
      reject("Request failed: " + error.message);
    });

    // 发起请求
    request.end();
  });
}
// 下载文件函数
function downloadFile(url, path) {
  return new Promise((resolve, reject) => {
    const request = net.request(url);

    request.on("response", (response) => {
      let data = "";
      response.on("data", (chunk) => {
        data = data + chunk;
      });

      response.on("end", () => {
        console.log("File downloaded successfully.", data);
        fs.writeFileSync(path, data);
        if (data) {
          resolve(data);
        } else {
          console.log("empty download");
          reject("no buffer");
        }
      });

      response.on("error", (e) => {
        console.log("download error", e);
        reject(e);
      });
    });

    request.end();
  });
}
function removeFile(path) {
  const isExist = fs.existsSync(path);
  if (isExist) {
    try {
      fs.unlinkSync(path);
      return true;
    } catch (e) {
      console.log(e);
    }
  }
  return false;
}
function getFile(path) {
  const isExist = fs.existsSync(path);
  if (isExist) {
    try {
      const buffer = fs.readFileSync(path);
      return buffer.toString("utf8");
    } catch (e) {
      console.log(e);
    }
  }
  return false;
}
function saveFile(path, data) {
  try {
    fs.writeFileSync(path, data);
    console.log("File has been saved successfully!");
  } catch (err) {
    console.error("Error writing the file:", err);
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    frame: false,
    width: 1000,
    height: 650,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      webviewTag: true,
      nodeIntegration: false,
      allowRunningInsecureContent: true,
      history: true,
    },
  });
  mainWindow.webContents.on("did-attach-webview", (event, wc) => {
    wc.setWindowOpenHandler((details) => {
      mainWindow.webContents.send("webview-new-window", details.url);
      return { action: "deny" };
    });
  });
  ipcMain.on("start-download", (event, url) => {
    console.log("start-download");
    downloadFile(url, getEncryptedFilePath()).then((data) => {
      mainWindow.webContents.send("file-saved", data);
    });
  });
  ipcMain.on("get-decrypted-json", () => {
    console.log("get-decrypted-json");
    const decryptedJson = getFile(getDecryptedFilePath());
    mainWindow.webContents.send("decrypted-json-found", decryptedJson);
  });
  ipcMain.on("save-decrypted-json", (event, decryptedJson) => {
    console.log("save-decrypted-json");
    saveFile(getDecryptedFilePath(), decryptedJson);
    mainWindow.webContents.send("save-decrypted-json-result", "success");
  });
  ipcMain.on("remove-decrypted-json", () => {
    console.log("remove-decrypted-json");
    removeFile(getDecryptedFilePath());
    mainWindow.webContents.send("remove-decrypted-json-result", "success");
  });
  ipcMain.on("start-trigger-shortcut", (e, url, headers) => {
    triggerUrl(url, headers);
  });
  //   const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../build/index.html')}`;
  //   mainWindow.loadURL(startUrl);
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:3000"); // 适用于开发模式，生产模式下需要加载静态文件
  } else {
    mainWindow.loadURL(`file://${path.join(__dirname, "../build/index.html")}`); // 适用于开发模式，生产模式下需要加载静态文件
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
