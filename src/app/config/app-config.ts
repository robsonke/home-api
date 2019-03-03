import { StringUtils } from '../utils';

export class AppConfig {
  // required environment variables
  port: number;
  logLevel: string; // 'debug' | 'verbose' | 'info' | 'warn' | 'error';
  serveStatic: boolean;
  domoticzUrl: string;
  domoticzMQTTUrl: string;
  domoticzUser: string;
  domoticzPassword: string;
  macosAudioApi: string;
  apiUser: string;
  apiPassword: string;
  adminUser: string;
  adminPassword: string;
  mqttUser: string;
  mqttPassword: string;
  dirbleApiToken: string;
  ringUser: string;
  ringPassword: string;
  sonosHttpApiUrl: string;

  // optional environment variables
  enableHttpRequestLogging: boolean;

  constructor(private environment: any) {
    // required environment variables
    this.port = this.getIntegerEnvVar('PORT');
    this.logLevel = this.getStringEnvVar('LOG_LEVEL');
    this.serveStatic = this.getBooleanEnvVar('SERVE_STATIC');
    this.domoticzUrl = this.getStringEnvVar('DOMOTICZ_URL');
    this.domoticzMQTTUrl = this.getStringEnvVar('DOMOTICZ_MQTT_URL');
    this.domoticzUser = this.getStringEnvVar('DOMOTICZ_USER');
    this.domoticzPassword = this.getStringEnvVar('DOMOTICZ_PASSWORD');
    this.macosAudioApi = this.getStringEnvVar('MACOS_AUDIO_API');
    this.apiUser = this.getStringEnvVar('API_USER');
    this.apiPassword = this.getStringEnvVar('API_PASSWORD');
    this.adminUser = this.getStringEnvVar('ADMIN_USER');
    this.adminPassword = this.getStringEnvVar('ADMIN_PASSWORD');
    this.mqttUser = this.getStringEnvVar('MQTT_USER');
    this.mqttPassword = this.getStringEnvVar('MQTT_PASSWORD');
    this.dirbleApiToken = this.getStringEnvVar('DIRBLE_API_TOKEN');
    this.ringUser = this.getStringEnvVar('RING_USER');
    this.ringPassword = this.getStringEnvVar('RING_PASSWORD');
    this.sonosHttpApiUrl = this.getStringEnvVar('SONOR_HTTP_API_URL');

    // optional environment variables
    this.enableHttpRequestLogging = this.getBooleanEnvVar('ENABLE_HTTP_REQUEST_LOGGING', false);
  }

  getEnvironment(): any {
    return this.environment;
  }

  /////////////////////////

  private getBooleanEnvVar(variableName: string, defaultValue: boolean = null): boolean {
    const value = this.getEnvVar(variableName, defaultValue);

    const errorMessage =
      `Environment Variable ${variableName} does not contain a valid boolean`;

    return StringUtils.parseBoolean(value, errorMessage);
  }

  private getIntegerEnvVar(variableName: string, defaultValue: number = null): number {
    const value = this.getEnvVar(variableName, defaultValue);

    const errorMessage =
      `Environment Variable ${variableName} does not contain a valid integer`;

    return StringUtils.parseInt(value, errorMessage);
  }

  private getStringEnvVar(variableName: string, defaultValue: string = null): string {
    return this.getEnvVar(variableName, defaultValue);
  }

  private getEnvVar(variableName: string, defaultValue: boolean | number | string): string {
    const value = this.environment[variableName] || defaultValue;

    if (value == null) {
      throw new Error(`Environment Variable ${variableName} must be set!`);
    }

    return value;
  }
}
