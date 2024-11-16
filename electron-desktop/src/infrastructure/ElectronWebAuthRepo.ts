import { domain } from "firstpage-core";
import { WebAuthAccount, WebAuthPassword } from "../consts/LocalStorageKey";

export default class ElectronWebAuthRepo implements domain.WebAuthRepo {
  async get(): Promise<domain.WebAuth | null> {
    const storage_account = localStorage.getItem(WebAuthAccount);
    const storage_password = localStorage.getItem(WebAuthPassword);
    if (storage_account && storage_password) {
      return Promise.resolve(
        new domain.WebAuth(storage_account, storage_password)
      );
    }
    return Promise.resolve(null);
  }
  async save(Webauth: domain.WebAuth): Promise<void> {
    localStorage.setItem(WebAuthAccount, Webauth.account);
    localStorage.setItem(WebAuthPassword, Webauth.password);
  }
  async delete(): Promise<void> {
    localStorage.removeItem(WebAuthAccount);
    localStorage.removeItem(WebAuthPassword);
  }
}
