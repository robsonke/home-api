import { SonosService } from './sonos-service';
let request = require('request-promise');
import { Logger, LoggerFactory } from '../common';
import { Device } from '../api/domain/device-domain';
import * as URI from 'urijs';
import { AppConfig } from '../config';


export class RingService {
  private static readonly LOGGER: Logger = LoggerFactory.getLogger();

  constructor(private appConfig: AppConfig, private sonosService: SonosService) { }


  public checkRingDeviceEvent(ring: any): void {
    //this.sonosService.clip();
    ring.devices((e, devices) => {
      RingService.LOGGER.info(`Listening to Ring events by polling the API`);
      const check = () => {
        ring.dings((e, json) => {
          if(json && Array.isArray(json) && json.length > 0) {
            // kind = motion or kind = ding
            let event: any = json[0];
            let time: Date = new Date(event.now);
            RingService.LOGGER.info(`Ring event: ${event.kind} at ${event.doorbot_description} around ${time}`);
            if (event.kind === 'ding') {
              this.sonosService.clipAll('doorbell.mp3', 40);
            }
            else if (event.kind === 'motion') {
              // nothing for now
              //this.sonosService.clipAll('doorbell.mp3', 20);
            }
          }
        });
      };
      // poll every second
      setInterval(check, 1 * 1000);
      check();
    });
  }
}
