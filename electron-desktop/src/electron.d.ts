declare global {
  interface Window {
    electron: {
      triggerShortcut: (url: string, headers: string) => void;
      startDownload: (url: string) => void;
      onFileSaved: (callback: (encryptedData: string) => void) => void;
      getDecryptedJson: () => void;
      onDecryptedJsonFound: (callback: (decryptedData: string) => void) => void;
      saveDecrypedJson: (decryptedData: string) => void;
      onSaveDecrypedJson: (callback: (result: string) => void) => void;
      removeDecrypedJson: () => void;
      onRemoveDecrypedJson: (callback: (result: string) => void) => void;
      onWebviewNewWindow: (callback: (url: string) => void) => void;
    };
  }
}

export {};
