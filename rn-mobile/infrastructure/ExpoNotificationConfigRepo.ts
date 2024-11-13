import { domain } from "firstpage-core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Notification_URI,
  Notification_AuthHeaderKey,
  Notification_AuthHeaderValue,
} from "@/constants/AsyncStorageKey";

export default class ExpoNotificationConfigRepo
  implements domain.NotificationConfigRepo
{
  async get(): Promise<domain.NotificationConfig | null> {
    const [uri, authHeaderKey, authHeaderValue] = await Promise.all([
      AsyncStorage.getItem(Notification_URI),
      AsyncStorage.getItem(Notification_AuthHeaderKey),
      AsyncStorage.getItem(Notification_AuthHeaderValue),
    ]);
    if (uri) {
      return Promise.resolve(
        new domain.NotificationConfig(uri, authHeaderKey, authHeaderValue)
      );
    } else {
      return Promise.reject("no notification config");
    }
  }
  async save(notification: domain.NotificationConfig): Promise<void> {
    await Promise.all([
      AsyncStorage.setItem(Notification_URI, notification.uri),
      AsyncStorage.setItem(
        Notification_AuthHeaderKey,
        notification.header_auth_key ?? ""
      ),
      AsyncStorage.setItem(
        Notification_AuthHeaderValue,
        notification.header_auth_value ?? ""
      ),
    ]);
  }
  async delete(): Promise<void> {
    await Promise.all([
      AsyncStorage.removeItem(Notification_URI),
      AsyncStorage.removeItem(Notification_AuthHeaderKey),
      AsyncStorage.removeItem(Notification_AuthHeaderValue),
    ]);
  }
}
