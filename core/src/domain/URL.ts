export default class URL {
  constructor(
    public title: string,
    public desc: string,
    public uri: string,
    public encrypted?: 0 | 1
  ) {}
}
