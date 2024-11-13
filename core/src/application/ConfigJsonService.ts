import ConfigJson from "../domain/ConfigJson";
import ConfigJsonRepo from "../domain/ConfigJsonRepo";
import Downloader from "../domain/Downloader";
import Decrypter from "../domain/Decrypter";

export default class ConfigJsonService {
  constructor(
    private configJsonRepo: ConfigJsonRepo,
    private downloader: Downloader,
    private decrypter: Decrypter
  ) {}

  async downloadJsonConfig(uri: string, password: string): Promise<ConfigJson> {
    try {
      const cipher = await this.downloader.download(uri);
      const jsonStr = await this.decrypter.decrypt(cipher, password);
      if (!jsonStr) {
        return Promise.reject("Decrypt Fail!");
      }
      await this.configJsonRepo.save(jsonStr);
      return Promise.resolve(JSON.parse(jsonStr));
    } catch (e) {
      return Promise.reject("Download File or Decrypt Fail!");
    }
  }

  async getJsonConfig(): Promise<ConfigJson> {
    const result = await this.configJsonRepo.get();
    if (!result) {
      return Promise.reject("File Not Exist!");
    }
    return Promise.resolve(result);
  }

  async removeJsonConfig(): Promise<void> {
    await this.configJsonRepo.delete();
  }
}
