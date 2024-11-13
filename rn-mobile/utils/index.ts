import * as FileSystem from "expo-file-system";

export const getJsonConfigLocalFilePath = () => {
  return FileSystem.documentDirectory + "encrypted.json";
};
