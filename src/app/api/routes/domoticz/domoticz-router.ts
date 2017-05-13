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

    this.router.get('/devices', this.domoticzCtrl.getAllDevices);
    this.router.get('/devices/:id', this.domoticzCtrl.getDevice);
    this.router.get('/devices/lights/switches/:id/:status', this.domoticzCtrl.setLightSwitch);
    this.router.get('/devices/lights/dimmables/:id/:status', this.domoticzCtrl.setLightLevel);

  }
}
