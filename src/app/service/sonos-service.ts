let request = require('request-promise');
import { Logger, LoggerFactory } from '../common';
import * as URI from 'urijs';
import { AppConfig } from '../config';

/**
 * Sonos service interacting with the Sonos http api
 * uses https://github.com/jishi/node-sonos-http-api
 */
export class SonosService {
  private static readonly LOGGER: Logger = LoggerFactory.getLogger();

  constructor(private appConfig: AppConfig) { }


  public clip(room: string, mp3Clip: string, volume: number = 30): void {
    // pi.sonke:5005/Office/clip/sample_clip.mp3
    this.callSonosHttpApi(`/${room}/clip/${mp3Clip}/${volume}`).then((status: any) => {

    });
  }

  /**
   *
   * @param mp3Clip the name of the mp3 file in the static/clips folder
   * @param volume default 30, 50 is quite loud
   */
  public clipAll(mp3Clip: string, volume: number = 30): void {
    // http call to /clipall/sample_clip.mp3/30
    this.callSonosHttpApi(`/clipall/${mp3Clip}/${volume}`).then((status: any) => {
    });
  }

  private callSonosHttpApi(path: string): Promise<any> {
    let url = this.appConfig.sonosHttpApiUrl;
    url = url + path

    return request.get(url);
  }
}
