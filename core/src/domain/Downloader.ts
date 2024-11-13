export default interface Downloader {
  download(uri: string): Promise<string>;
}
