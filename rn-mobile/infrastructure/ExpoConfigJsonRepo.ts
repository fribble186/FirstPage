import { domain } from "firstpage-core";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getJsonConfigLocalFilePath } from "@/utils";
import { HasDownloadedConfigJson } from "@/constants/AsyncStorageKey";

export default class ExpoConfigJsonRepo implements domain.ConfigJsonRepo {
  async get(): Promise<domain.ConfigJson | null> {
    const hasDownloaded = await AsyncStorage.getItem(HasDownloadedConfigJson);
    if (hasDownloaded === "true") {
      const fileUri = getJsonConfigLocalFilePath();
      const fileExists = await FileSystem.getInfoAsync(fileUri);
      if (fileExists) {
        const decryptedData = await FileSystem.readAsStringAsync(fileUri);
        return Promise.resolve(JSON.parse(decryptedData) as domain.ConfigJson);
      }
    }
    return Promise.reject("file not exist");
  }
  async save(decryptedJsonStr: string): Promise<void> {
    // 将解密后的数据存储到 AsyncStorage 中标记已缓存
    await AsyncStorage.setItem(HasDownloadedConfigJson, "true");

    // 将解密的 JSON 文件存储到本地文件系统
    await FileSystem.writeAsStringAsync(
      getJsonConfigLocalFilePath(),
      decryptedJsonStr
    );
  }
  async delete(): Promise<void> {
    const fileUri = getJsonConfigLocalFilePath();
    await FileSystem.deleteAsync(fileUri);
    await AsyncStorage.removeItem(HasDownloadedConfigJson);
  }
}
