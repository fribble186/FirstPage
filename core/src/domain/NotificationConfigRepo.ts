import NotificationConfig from "./NotificationConfig";

export default interface NotificationConfigRepo {
  get(): Promise<NotificationConfig | null>;
  save(notification: NotificationConfig): Promise<void>;
  delete(): Promise<void>;
}
