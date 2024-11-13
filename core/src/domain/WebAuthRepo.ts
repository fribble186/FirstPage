import WebAuth from "./WebAuth";

export default interface WebAuthRepo {
  get(): Promise<WebAuth | null>;
  save(Webauth: WebAuth): Promise<void>;
  delete(): Promise<void>;
}
