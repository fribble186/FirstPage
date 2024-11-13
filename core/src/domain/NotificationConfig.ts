export default class NotificationConfig {
  constructor(
    public uri: string,
    public header_auth_key?: string | null,
    public header_auth_value?: string | null
  ) {}
}
