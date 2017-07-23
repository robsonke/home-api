import * as URI from 'urijs';
import { Speaker } from '../api/domain/speaker-domain';
import { VolumeStatus } from '../api/domain/volumestatus-domain';
import { AppConfig } from '../config';
import { MacOSAudioBaseService } from './macos-audio-base-service';

/**
 * Exposes the macos audio rest api in a service class to be again exposed
 * through a rest controller of this api.
 */
export class VolumeService extends MacOSAudioBaseService {

  constructor(appConfig: AppConfig) {
    super(appConfig);
  }

  public getVolumeStatus(): Promise<VolumeStatus> {
    return this.doGetRequest('/volume/status');
  }

  public setMute(muted: boolean): any {
    if (muted) return this.doPutRequest('/volume/mute', null);
    else return this.doPutRequest('/volume/unmute', null);
  }

  public adjustVolume(increment: boolean): any {
    if (increment) return this.doPutRequest('/volume/louder', null);
    else return this.doPutRequest('/volume/softer', null);
  }

  /**
   * Sets the volume to a specified level
   * @param  {number} level a value between 0 and 100
   */
  public setVolume(level: number): any {
    return this.doPutRequest('/volume/:level', [{ level: level }]);
  }
}
