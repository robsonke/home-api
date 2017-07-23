let request = require('request-promise');
import { AppConfig } from '../config';
import { Logger, LoggerFactory } from '../common';
import * as URI from 'urijs';

export abstract class MacOSAudioBaseService {

  private static readonly LOGGER: Logger = LoggerFactory.getLogger();

  constructor(private appConfig: AppConfig) { }

  protected doGetRequest(path: string): any {
    let url: uri.URI = this.getUrl(path);
    MacOSAudioBaseService.LOGGER.info('Calling MacOS Rest API: ' + url.toString());

    return request.get(url.toString());
  }

  protected doPutRequest(path: string, params: Array<any>): any {
    let url: uri.URI = this.getUrl(path);

    let urlString: string = url.toString();
    if (params != null) {
      params.forEach((param, index) => {
        for (let paramKey in param)
          urlString = urlString.replace(":" + paramKey, param[paramKey]);
      });
    }

    MacOSAudioBaseService.LOGGER.info('Calling MacOS Rest API: ' + urlString);

    return request.put(urlString, {});
  }

  private getUrl(path: string): uri.URI {
    let url = new URI(this.appConfig.macosAudioApi + path);
    return url;
  }

}
