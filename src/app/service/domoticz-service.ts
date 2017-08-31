let request = require('request-promise');
import { Logger, LoggerFactory } from '../common';
import { Device } from '../api/domain/device-domain';
import * as URI from 'urijs';
import { AppConfig } from '../config';
import { BaseDomoticzService } from './base-domoticz-service';


export class DomoticzService implements BaseDomoticzService {
  private static readonly LOGGER: Logger = LoggerFactory.getLogger();

  constructor(private appConfig: AppConfig) { }

  public getDevice(id: number): Promise<Device> {
    return this.doRequest([{ type: 'devices' }, { rid: id }]);
  }

  /**
   * @param filter can be `light`, `weather`, `temperature`, `utility`
   * @param used true or false or empty but we don't use that
   * @param order any field which you'd like to order by
   */
  public getDevices(filter: string = 'all', used: boolean = true, favorite: boolean = null, order: string = 'Name'): Promise<Array<Device>> {
    let params: Array<any> = [{
      filter: filter,
      used: used,
      order: order,
      type: 'devices'
    }];

    if (favorite != null) {
      params.push({ favorite: ((favorite) ? 1 : 0) });
    }

    return this.doRequest(params);
  }


  /**
   * @param id the idx of the device
   * @param status can be On/Off/Toggle or in case of a dimmable it's a number between 0 and 100
   * @param type can be switch or dimmable
   */
  public setLightSwitch(id: number, status: string, type: string): Promise<Device> {
    let params: Array<any> = [{ type: 'command' }, { idx: id }];

    type === 'switch' ? params.push({ param: 'switchlight' }) : this;
    type === 'dimmable' ? status = 'Set%20Level&level=' + (Number(status) / 100) * 16 : this;

    // ugly capitals
    status === 'toggle' ? status = 'Toggle' : this;
    status === 'on' ? status = 'On' : this;
    status === 'off' ? status = 'Off' : this;

    params.push({ switchcmd: status });

    return this.doRequest(params);
  }

  /**
   * @param id the device id
   * @param value new temperature as a float
   */
  public setTemperature(id: number, value: number): Promise<Device> {
    let params: Array<any> = [
      { type: 'command' },
      { idx: id },
      { param: 'udevice' },
      { svalue: value },
      { nvalue: '0' }
    ];

    return this.doRequest(params);
  }

  private doRequest(params: Array<any>): any {
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
