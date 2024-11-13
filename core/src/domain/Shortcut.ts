export default class Shortcut {
  constructor(
    public title: string,
    public action: {
      uri: string;
      headers?: Record<string, string>;
    }
  ) {}
}
