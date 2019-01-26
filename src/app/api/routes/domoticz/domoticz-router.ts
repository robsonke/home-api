import { RestRouter } from '../../../common';
import { DomoticzController } from './domoticz-controller';
import { DomoticzService, DomoticzMQTTService } from '../../../service';
import { Request, Response } from 'express';

export class DomoticzRouter extends RestRouter {
  domoticzCtrl: DomoticzController;

  constructor(domoticzService: DomoticzService, domoticzMQTTService :DomoticzMQTTService) {
    super();
    this.domoticzCtrl = new DomoticzController(domoticzService, domoticzMQTTService);
    this.initRoutes();
  }

  initRoutes() {
    // in a weird order, to avoid matching problems
    // but I prefer this over ugly rest urls
    this.router.get('/devices', (request: Request, response: Response, next: any) => this.domoticzCtrl.getAllDevices(request, response));
    this.router.get('/devices/temperatures', (request: Request, response: Response, next: any) => this.domoticzCtrl.getTemperatures(request, response));
    this.router.put('/devices/temperatures/:id/:temperature', (request: Request, response: Response, next: any) => this.domoticzCtrl.setTemperature(request, response));
    this.router.get('/devices/:id', (request: Request, response: Response, next: any) => this.domoticzCtrl.getDevice(request, response));
    this.router.get('/devices/lights/switches', (request: Request, response: Response, next: any) => this.domoticzCtrl.getLightSwitches(request, response));
    this.router.put('/devices/lights/switches/:id/:status', (request: Request, response: Response, next: any) => this.domoticzCtrl.setLightSwitch(request, response));
    this.router.put('/devices/lights/dimmables/:id/:level', (request: Request, response: Response, next: any) => this.domoticzCtrl.setLightLevel(request, response));
    this.router.put('/devices/switches/multi/:id/:level', (request: Request, response: Response, next: any) => this.domoticzCtrl.setMultiSwitch(request, response));

  }
}
