import { RestRouter } from '../../../common';
import { DomoticzController } from './domoticz-controller';
import { DomoticzService } from '../../../service/domoticz-service';

export class DomoticzRouter extends RestRouter {
  domoticzCtrl: DomoticzController;

  constructor(domoticzService: DomoticzService) {
    super();
    this.domoticzCtrl = new DomoticzController(domoticzService);
    this.initRoutes();
  }

  initRoutes() {

    // in a weird order, to avoid matching problems
    // but I prefer this over ugly rest urls
    this.router.get('/devices', this.domoticzCtrl.getAllDevices);
    this.router.get('/devices/temperatures', this.domoticzCtrl.getTemperatures);
    this.router.put('/devices/temperatures/:id/:temperature', this.domoticzCtrl.setTemperature);
    this.router.get('/devices/:id', this.domoticzCtrl.getDevice);
    this.router.get('/devices/lights/switches', this.domoticzCtrl.getLightSwitches);
    this.router.put('/devices/lights/switches/:id/:status', this.domoticzCtrl.setLightSwitch);
    this.router.put('/devices/lights/dimmables/:id/:status', this.domoticzCtrl.setLightLevel);

  }
}
