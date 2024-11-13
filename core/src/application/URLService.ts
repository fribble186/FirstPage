import WebAuthRepo from "../domain/WebAuthRepo";
import WebAuth from "../domain/WebAuth";

export default class URLService {
  constructor(private webauthRepo: WebAuthRepo) {}
  async getAuthUrl(uri: string, encrypted?: boolean): Promise<string> {
    let authuri = uri;
    const url = new URL(uri);
    const webauth = await this.webauthRepo.get();
    const auth_account = webauth?.account;
    const auth_password = webauth?.password;
    if (auth_account && auth_password && encrypted) {
      url.username = auth_account;
      url.password = auth_password;
      authuri = url.toString();
    }
    return authuri;
  }
  async getWebAuth(): Promise<WebAuth | null> {
    const webAuth = await this.webauthRepo.get();
    return Promise.resolve(webAuth);
  }
  async saveWebAuth(webAuth: WebAuth): Promise<void> {
    await this.webauthRepo.save(webAuth);
  }
  async clearWebAuth(): Promise<void> {
    await this.webauthRepo.delete();
  }
}
