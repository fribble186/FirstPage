import Shortcut from "./Shortcut";
import URL from "./URL";

export default class ConfigJson {
  constructor(
    public URL: URL[],
    public SHORTCUT?: Shortcut[],
    public IMURL?: URL
  ) {}
}
