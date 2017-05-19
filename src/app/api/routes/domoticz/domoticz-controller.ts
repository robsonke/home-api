import { DomoticzService } from './../../../service/domoticz-service';
import { Logger, LoggerFactory, RestController } from '../../../common';
import {Device} from '../../domain/device-domain';
import {Get, Post, Route, Body, Query, Header, Path, SuccessResponse, Controller } from 'tsoa';
import { Request, Response } from 'express';

@Route('domoticz')
export class DomoticzController extends RestController {
  private static readonly LOGGER: Logger = LoggerFactory.getLogger();

  // respond(res: Response, item: any | Array<any>, statusCode: number = 200): Response {
  //   return res.status(statusCode).json(item);
  // }
  //
  // respondPlain(res: Response, item: any | Array<any>, statusCode: number = 200): Response {
  //   res.set('Content-Type', 'application/json');
  //   return res.status(statusCode).send(item);
  // }
  //
  // respondNoContent(res: Response, statusCode: number = 204): Response {
  //   return res.status(statusCode).json();
  // }
  // 
  constructor(private domoticzService: DomoticzService) {
    super();
  }

  /**
   * @swagger
   * definition:
   *   Device:
   *     properties:
   *       name:
   *         type: string
   *       idx:
   *         type: integer
   */

  /**
   * @swagger
   * /devices:
   *   get:
   *     tags:
   *       - Domoticz
   *     description: Returns all devices
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: An array of devices
   *         schema:
   *           $ref: '#/definitions/Device'
   */





  /**
   * Get project definition
   * @httpGet /projects/{title}
   * @httpPath title {string} name of the project
   * @httpQuery ?version {string} specify a version
   * @httpQuery ?env {string} environment to find the project definition
   * @httpResponse 200 {Project}
   * @httpResponse 400 the environment doesn't exists
   * @httpResponse 404 Project definitions for the given title/version/env doesn't exists
   */
  @Get('devices')
  public getAllDevices(): Promise<Device> {
    DomoticzController.LOGGER.debug('Retrieving all devices');

    return this.domoticzService.getDevices()
      .then((devices: any) => {
        this.respondPlain(res, devices);
      });
  }
  // getAllDevices = (req, res, next): Promise<any> => {
  //   DomoticzController.LOGGER.debug('Retrieving all devices');
  //
  //   return this.domoticzService.getDevices()
  //     .then((devices: any) => {
  //       this.respondPlain(res, devices);
  //     });
  // }

  /**
   * @swagger
   * /devices/id:
   *   get:
   *     tags:
   *       - Domoticz
   *     description: Returns all devices
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: An array of devices
   *         schema:
   *           $ref: '#/definitions/Device'
   */
  @Get('{id}')
  getDevice = (req, res, next): any => {
    DomoticzController.LOGGER.debug('Retrieving one device');
    return this.domoticzService.getDevice(req.params.id)
      .then((device: any) => {
        return this.respondPlain(res, device);
      });
  }

  getLightSwitches = (req, res, next): Promise<any> => {
    DomoticzController.LOGGER.debug('Retrieving all light switches');

    return this.domoticzService.getDevices('light')
      .then((switches: any) => {
        this.respondPlain(res, switches);
      });
  }

  setLightSwitch = (req, res, next): Promise<any> => {
    DomoticzController.LOGGER.debug('Turn on/off lights, id: ' + req.params.id + ', status: ' + req.params.status);

    return this.domoticzService.setLightSwitch(req.params.id, req.params.status, 'switch')
      .then((status: any) => {
        this.respondPlain(res, status);
      });
  }

  getTemperatures = (req, res, next): Promise<any> => {
    DomoticzController.LOGGER.debug('Retrieving all temperature devices');

    return this.domoticzService.getDevices('temperature')
      .then((switches: any) => {
        this.respondPlain(res, switches);
      });
  }

  setTemperature = (req, res, next): Promise<any> => {
    DomoticzController.LOGGER.debug('Set the temperature, id: ' + req.params.id + ', temperature: ' + req.params.temperature);

    return this.domoticzService.setTemperature(req.params.id, req.params.temperature)
      .then((status: any) => {
        this.respondPlain(res, status);
      });
  }

  setLightLevel = (req, res, next): Promise<any> => {
    DomoticzController.LOGGER.debug('Change dimmable level of a light, id: ' + req.params.id + ', level: ' + req.params.status);

    return this.domoticzService.setLightSwitch(req.params.id, req.params.status, 'dimmable')
      .then((status: any) => {
        this.respondPlain(res, status);
      });
  }


}
