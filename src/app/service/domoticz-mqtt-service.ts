import * as mqtt from 'mqtt';
import { Logger, LoggerFactory } from '../common';
import { Device } from '../api/domain/device-domain';
import { BaseDomoticzService } from './base-domoticz-service';

/**
 * Equivalent class for domoticz-service but based on MQTT and therefor much faster.
 */
export class DomoticzMQTTService implements BaseDomoticzService {

  private static readonly LOGGER: Logger = LoggerFactory.getLogger();
  private client: mqtt.Client;

  private static DMTCZ_TOPIC_OUT: string = 'domoticz/out/json';
  private static DMTCZ_TOPIC_IN: string = 'domoticz/in';

  constructor(private mqttOptions: any) {
    this.connect();
  }

  /**
   * @param id the idx of the device
   * @param status can be On/Off/Toggle or in case of a dimmable it's a number between 0 and 100
   * @param type can be switch or dimmable
   */
  public setLightSwitch(id: number, status: string, type: string): Promise<Device> {
    // ugly capitals
    status === 'toggle' ? status = 'Toggle' : this;
    status === 'on' ? status = 'On' : this;
    status === 'off' ? status = 'Off' : this;

    let state: any = { };

    if (type === 'switch')
      state = { command: 'switchlight', idx: +id, switchcmd: status };
    if (type === 'dimmable')
      state = { command: 'switchlight', idx: +id, switchcmd: 'Set Level', level: Number(status) };

    return new Promise<Device>(
      (resolve, reject) => {
        let message: string = JSON.stringify(state);
        this.publish(message);
        resolve();
      }
    );
  }

  /**
   * A switch with several levels, like long click and double click
   * Example url:
   *   http://home.tigrou.nl:8080/json.htm?type=command&param=switchlight&idx=145&switchcmd=Set%20Level&level=20
   *
   * @param id the idx of the device
   * @param status 10/20/30/etc depending on the device settings
   */
  public setMultiSwitch(id: number, level: number): Promise<Device> {
    let state: any = { command: 'switchlight', idx: +id, switchcmd: 'Set Level', level: +level };

    return new Promise<Device>(
      (resolve, reject) => {
        let message: string = JSON.stringify(state);
        this.publish(message);
        resolve();
      }
    );
  }

  /**
   * @param id the device id
   * @param value new temperature as a float
   */
  setTemperature(id: number, value: number): Promise<Device> {
    // not implemented
    return null;
  }

  /*********************************************************************************/
  /* start of mqtt methods */

  public connect(): void {
    this.client = mqtt.connect(this.mqttOptions.host, this.mqttOptions);

    this.client.addListener('connect', this.onConnect);
    this.client.addListener('reconnect', this.onReconnect);
    this.client.addListener('message', this.onMessage);
    this.client.addListener('offline', this.onError);
    this.client.addListener('error', this.onError);
  }

  /**
   * [publish description]
   * @param {string} message [description]
   */
  public publish(message?: string): void {
    DomoticzMQTTService.LOGGER.info('publish: ' + message);
    this.client.publish(DomoticzMQTTService.DMTCZ_TOPIC_IN, message);
  }

  public onConnect = () => {
    DomoticzMQTTService.LOGGER.info('connect');
    this.client.publish('home-api/connected', 'true');
    // not listening for now as we don't use it
    // this.client.subscribe(DomoticzMQTTService.DMTCZ_TOPIC_OUT);
  }

  public onReconnect(): void {
  }

  public onMessage(...args: any[]): void {
    let topic = args[0];
    let message = args[1];
    let packet: mqtt.Packet = args[2];

    DomoticzMQTTService.LOGGER.info('MQTT message: ' + message);
  }

  public onError(error: any): void {
    DomoticzMQTTService.LOGGER.error('onError mqtt: ' + error);
  }


}