import { DomoticzService } from './../../../service/domoticz-service';
import { Logger, LoggerFactory, RestController } from '../../../common';

export class DomoticzController extends RestController {
  private static readonly LOGGER: Logger = LoggerFactory.getLogger();

  constructor(private domoticzService: DomoticzService) {
    super();
  }

  getAllDevices = (req, res, next): Promise<any> => {
    DomoticzController.LOGGER.debug('Retrieving all devices');

    return this.domoticzService.getDevices()
      .then((devices: any) => {
        this.respondPlain(res, devices);
      });
  }

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
