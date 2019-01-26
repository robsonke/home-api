import { DomoticzService, DomoticzMQTTService } from './../../../service';
import { Logger, LoggerFactory, RestController } from '../../../common';
import { Device } from '../../domain/device-domain';
import { Request, Response } from 'express';

/**
 * @controller Domoticz
 * @baseUrl /api/domoticz
 */
export class DomoticzController extends RestController {
  private static readonly LOGGER: Logger = LoggerFactory.getLogger();

  constructor(private domoticzService: DomoticzService, private domoticzMQTTService :DomoticzMQTTService) {
    super();
  }


  /**
   * Get all devices
   * @httpGet /api/domoticz/devices
   * @httpResponse 200 [{Device}]
   */
  public getAllDevices(request: Request, response: Response): Promise<Response> {
    DomoticzController.LOGGER.debug('Retrieving all devices');

    return this.domoticzService.getDevices()
      .then((device: any) => {
        let devices = JSON.parse(device);
        return this.respondPlain(response, devices.result);
      });
  }

  /**
   * Get one device
   * @httpGet /api/domoticz/devices/{id}
   * @httpPath id {number} id of the device
   * @httpResponse 200 {Device}
   */
  public getDevice(request: Request, response: Response): Promise<Response> {
    DomoticzController.LOGGER.debug('Retrieving one device');
    return this.domoticzService.getDevice(request.params.id)
      .then((device: any) => {
        return this.respondPlain(response, device);
      });
  }

  /**
   * Get all light switches
   * @httpGet /api/domoticz/devices/lights/switches
   * @httpResponse 200 [{Device}]
   */
  public getLightSwitches(request: Request, response: Response): Promise<Response> {
    DomoticzController.LOGGER.debug('Retrieving all light switches');

    return this.domoticzService.getDevices('light')
      .then((switches: any) => {
        return this.respondPlain(response, switches);
      });
  }

  /**
   * Set light switches on/off
   * @httpPut /api/domoticz/devices/lights/switches/{id}/{status}
   * @httpPath id {number} id of the device
   * @httpPath status {string} on or off
   */
  public setLightSwitch(request: Request, response: Response): Promise<void> {
    DomoticzController.LOGGER.debug('Turn on/off lights, id: ' + request.params.id + ', status: ' + request.params.status);
    // can be switched to domoticzService
    return this.domoticzMQTTService.setLightSwitch(request.params.id, request.params.status, 'switch')
      .then((status: any) => {
        this.respondPlain(response, status);
      });
  }

  /**
   * Set multi switch levels
   * @httpPut /api/domoticz/devices/switches/multi/{id}/{level}
   * @httpPath id {number} id of the device
   * @httpPath level {number} 10/20/30/40/50 depending on the device settings
   */
  public setMultiSwitch(request: Request, response: Response): Promise<void> {
    DomoticzController.LOGGER.debug('Set multi switch, id: ' + request.params.id + ', level: ' + request.params.level);
    // can be switched to domoticzService
    return this.domoticzMQTTService.setMultiSwitch(request.params.id, request.params.level)
      .then((status: any) => {
        this.respondPlain(response, status);
      });
  }

  /**
   * Get all temperature devices
   * @httpGet /api/domoticz/devices/temperatures
   */
  public getTemperatures(request: Request, response: Response): Promise<Response> {
    DomoticzController.LOGGER.debug('Retrieving all temperature devices');
    return this.domoticzService.getDevices('temperature')
      .then((switches: any) => {
        return this.respondPlain(response, switches);
      });
  }

  /**
   * Set the temperature
   * @httpPut /api/domoticz/devices/temperatures/{id}/{temperature}
   * @httpPath id {number} id of the device
   * @httpPath temperature {number} the new temperature
   */
  public setTemperature(request: Request, response: Response): Promise<void> {
    DomoticzController.LOGGER.debug('Set the temperature, id: ' + request.params.id + ', temperature: ' + request.params.temperature);
    // can be switched to domoticzService
    return this.domoticzService.setTemperature(request.params.id, request.params.temperature)
      .then((status: any) => {
        this.respondPlain(response, status);
      });
  }

  /**
   * Set light switches at a specific dim value
   * @httpPut /api/domoticz/devices/lights/dimmables/{id}/{level}
   * @httpPath id {number} id of the device
   * @httpPath level {number} level between 0 and 100
   */
  public setLightLevel(request: Request, response: Response): Promise<void> {
    DomoticzController.LOGGER.debug('Change dimmable level of a light, id: ' + request.params.id + ', level: ' + request.params.level);
    // can be switched to domoticzService
    return this.domoticzMQTTService.setLightSwitch(request.params.id, request.params.level, 'dimmable')
      .then((status: any) => {
        this.respondPlain(response, status);
      });
  }


}
