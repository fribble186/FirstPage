import { domain } from "firstpage-core";
import * as Notifications from "expo-notifications";

export default class ExpoNotificationProvider
  implements domain.NotificationProvider
{
  async getPermission(): Promise<boolean> {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  }
  async requestPermission(): Promise<boolean> {
    const { status } = await Notifications.getPermissionsAsync();
    return status === "granted";
  }
  async connectWebsocket(
    config: domain.NotificationConfig
  ): Promise<WebSocket | null> {
    let socket: WebSocket | null = null;
    const { uri, header_auth_key, header_auth_value } = config;

    try {
      if (header_auth_key && header_auth_value) {
        socket = new WebSocket(
          uri,
          null,
          // @ts-ignore
          {
            headers: {
              [header_auth_key]: header_auth_value,
            },
          }
        );
      } else {
        socket = new WebSocket(uri);
      }
      if (socket) {
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: true,
          }),
        });
        socket.onmessage = (payload) => {
          console.log(payload);
          const { message, title } = JSON.parse(payload.data);
          Notifications.scheduleNotificationAsync({
            content: {
              title,
              body: message,
            },
            trigger: null,
          });
        };
        socket.onopen = () => {
          console.log("WebSocket 已连接到 Gotify");
        };
        socket.onerror = (error) => {
          console.error("WebSocket 发生错误:", error);
        };
        socket.onclose = () => {
          console.log("Gotify WebSocket 断开连接");
        };
      }
    } catch (e) {
      console.log("init notify websocket error: ", e);
    }
    return socket;
  }
  async disconnectWebSocket(instance: WebSocket): Promise<void> {
    instance.close();
  }
}
