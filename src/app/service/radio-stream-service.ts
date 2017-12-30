import { RadioStream } from './../api/domain/radiostream-domain';
import * as URI from 'urijs';
import { AppConfig } from '../config';
let request = require('request-promise');

export class RadioStreamService {

  constructor(private appConfig: AppConfig) { }

  public getRadioStreams(keyword: string): Promise<Array<RadioStream>> {
    let url: uri.URI = new URI('https://api.dirble.com/v2/search?token=' + this.appConfig.dirbleApiToken);

    const options = {
      method: 'POST',
      uri: url.toString(),
      body: {
        query: keyword
      },
      json: true
    };
    return request(options);
  }
}
