let request = require('request-promise');
import { Logger, LoggerFactory } from '../common';
import * as URI from 'urijs';
import { AppConfig } from '../config';


export class DomoticzService {
  private static readonly LOGGER: Logger = LoggerFactory.getLogger();

  constructor(private appConfig: AppConfig) { }

  public getAllDevices(): Promise<any> {
    return this.doRequest([{ type: 'devices' }]);
  }

  public getDevice(id: number): Promise<any> {
    return this.doRequest([{ type: 'devices' }, { rid: id }]);
  }

  public getLightSwitches(): Promise<any> {
    return this.doRequest([{ type: 'devices', filter: 'light', used: 'true', order: 'Name' }]);
  }

  /**
   * Status can be: On/Off/Toggle
   * Type: switch or dimmable
   */
  public setLightSwitch(id: number, status: string, type: string): Promise<any> {
    let params: Array<any> = [{ type: 'command' }, { idx: id }];

    type === 'switch' ? params.push({ param: 'switchlight' }) : this;
    type === 'dimmable' ? status = 'Set%20Level&level=' + (Number(status) / 100) * 16 : this;

    // ugle capitals
    status === 'toggle' ? status = 'Toggle' : this;
    status === 'on' ? status = 'On' : this;
    status === 'off' ? status = 'Off' : this;

    params.push({ switchcmd: status });

    return this.doRequest(params);
  }

  private doRequest(params: Array<any>): Promise<any> {
    let url: uri.URI = this.getUrl();
    params.forEach((param) => url.addSearch(param));

    DomoticzService.LOGGER.info('Calling Domoticz: ' + url.toString());

    return request.get(url.toString()).auth(this.appConfig.domoticzUser, this.appConfig.domoticzPassword, true);
  }

  private getUrl(): uri.URI {
    let url = new URI(this.appConfig.domoticzUrl + '/json.htm');
    return url;
  }
}
