import SimpleCrypto from "simple-crypto-js";
import { domain } from "firstpage-core";

export default class SimpleCryptoDecrypter implements domain.Decrypter {
  async decrypt(cipher: string, password: string): Promise<string> {
    try {
      const simpleCrypto = new SimpleCrypto(password);
      const decryptStr = simpleCrypto.decrypt(cipher);
      if (!decryptStr) {
        return Promise.reject("解密失败，密码错误");
      }
      console.log("decryptedData", JSON.stringify(decryptStr));
      return Promise.resolve(JSON.stringify(decryptStr));
    } catch (e) {
      console.log(e, cipher, password);
      return Promise.reject(e);
    }
  }
}
