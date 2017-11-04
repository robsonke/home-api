import { Logger, LoggerFactory } from '../common';
import { Device } from '../api/domain/device-domain';
import * as URI from 'urijs';
import { AppConfig } from '../config';


export interface BaseDomoticzService {
  
  /**
   * @param id the idx of the device
   * @param status can be On/Off/Toggle or in case of a dimmable it's a number between 0 and 100
   * @param type can be switch or dimmable
   */
  setLightSwitch(id: number, status: string, type: string): Promise<Device>;

  /**
   * @param id the device id
   * @param value new temperature as a float
   */
  setTemperature(id: number, value: number): Promise<Device>;

}
