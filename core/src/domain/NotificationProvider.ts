import NotificationConfig from "./NotificationConfig";

export default interface NotificationProvider {
  getPermission(): Promise<boolean>;
  requestPermission(): Promise<boolean>;
  connectWebsocket(config: NotificationConfig): Promise<any>;
  disconnectWebSocket(instance: any): Promise<void>;
}
