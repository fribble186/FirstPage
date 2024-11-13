export default interface Decrypter {
  decrypt(cipher: string, password: string): Promise<string>;
}
