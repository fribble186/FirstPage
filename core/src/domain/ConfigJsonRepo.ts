import ConfigJson from "./ConfigJson";

export default interface ConfigJsonRepo {
  get(): Promise<ConfigJson | null>;
  save(decryptedJsonStr: string): Promise<void>;
  delete(): Promise<void>;
}
