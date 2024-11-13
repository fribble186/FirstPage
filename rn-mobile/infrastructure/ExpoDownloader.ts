import * as FileSystem from "expo-file-system";
import { getJsonConfigLocalFilePath } from "@/utils";
import { domain } from "firstpage-core";

export default class ExpoDownloader implements domain.Downloader {
  async download(uri: string): Promise<string> {
    const fileUri = await FileSystem.downloadAsync(
      uri,
      getJsonConfigLocalFilePath()
    );
    const encryptedData = await FileSystem.readAsStringAsync(fileUri.uri);
    console.log("download", encryptedData);
    return encryptedData;
  }
}
