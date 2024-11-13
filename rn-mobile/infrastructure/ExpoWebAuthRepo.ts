import { domain } from "firstpage-core";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class ExpoWebAuthRepo implements domain.WebAuthRepo {
  async get(): Promise<domain.WebAuth | null> {
    const [storage_account, storage_password] = await Promise.all([
      AsyncStorage.getItem("webauth_account"),
      AsyncStorage.getItem("webauth_password"),
    ]);
    if (storage_account && storage_password) {
      return Promise.resolve(
        new domain.WebAuth(storage_account, storage_password)
      );
    }
    return Promise.resolve(null);
  }
  async save(Webauth: domain.WebAuth): Promise<void> {
    await AsyncStorage.setItem("webauth_account", Webauth.account);
    await AsyncStorage.setItem("webauth_password", Webauth.password);
  }
  async delete(): Promise<void> {
    await AsyncStorage.removeItem("webauth_account");
    await AsyncStorage.removeItem("webauth_password");
  }
}
