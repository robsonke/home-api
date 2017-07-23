import * as URI from 'urijs';
import { Speaker } from '../api/domain/speaker-domain';
import { AppConfig } from '../config';
import { MacOSAudioBaseService } from './macos-audio-base-service';


export class AirfoilService extends MacOSAudioBaseService {

  constructor(appConfig: AppConfig) {
    super(appConfig);
  }

  public getSpeakers(): Promise<Array<Speaker>> {
    return this.doGetRequest('/speakers');
  }

  public setSpeakerState(id: string, connected: boolean) {
    if (connected)
      return this.doPutRequest('/speakers/:id/connect', [{ id: id }]);
    else return this.doPutRequest('/speakers/:id/disconnect', [{ id: id }]);
  }

  public setAppSource(name: string) {
    return this.doPutRequest('/appsource/:name', [{ name: name }]);
  }

  public setSysSource(name: string) {
    return this.doPutRequest('/syssource/:name', [{ name: name }]);
  }
}
