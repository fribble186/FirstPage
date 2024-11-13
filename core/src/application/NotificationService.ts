import NotificationConfig from "../domain/NotificationConfig";
import NotificationConfigRepo from "../domain/NotificationConfigRepo";
import NotificationProvider from "../domain/NotificationProvider";

export default class NotificationService {
  public websocket: any;
  constructor(
    private notificationProvider: NotificationProvider,
    private notificationConfigRepo: NotificationConfigRepo
  ) {}
  async getConfig(): Promise<NotificationConfig> {
    const config = await this.notificationConfigRepo.get();
    if (!config) {
      return Promise.reject("NO Notification Config!");
    }
    return Promise.resolve(config);
  }
  async saveConfig(config: NotificationConfig): Promise<void> {
    await this.notificationConfigRepo.save(config);
  }
  async removeConfig(): Promise<void> {
    await this.notificationConfigRepo.delete();
  }
  async getPermission(): Promise<boolean> {
    return await this.notificationProvider.getPermission();
  }
  async requestPermission(): Promise<boolean> {
    if (await this.notificationProvider.getPermission()) {
      return Promise.resolve(
        await this.notificationProvider.requestPermission()
      );
    }
    return Promise.resolve(true);
  }
  async connect(): Promise<void> {
    const permission = await this.notificationProvider.getPermission();
    const config = await this.notificationConfigRepo.get();
    if (permission && config) {
      this.websocket = await this.notificationProvider.connectWebsocket(config);
    }
  }
  async disconnect(): Promise<void> {
    if (this.websocket) {
      this.notificationProvider.disconnectWebSocket(this.websocket);
    }
  }
}
