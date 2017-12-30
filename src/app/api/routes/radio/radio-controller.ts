import { AirfoilService } from './../../../service/airfoil-service';
import { Logger, LoggerFactory, RestController } from '../../../common';
import { Speaker } from '../../domain/speaker-domain';
import { Request, Response } from 'express';
import { RadioStreamService } from '../../../service/radio-stream-service';

/**
 * @controller RadioStream
 * @baseUrl /api/radio
 */
export class RadioStreamController extends RestController {
  private static readonly LOGGER: Logger = LoggerFactory.getLogger();

  constructor(private radioStreamService: RadioStreamService) {
    super();
  }


  /**
   * Search for streams
   * @httpGet /api/radio/search/{key}
   * @httpPath key {string} the search word
   * @httpResponse 200 [{RadioStream}]
   */
  public getStreams(request: Request, response: Response): Promise<Response> {
    RadioStreamController.LOGGER.debug('Search for streams');

    return this.radioStreamService.getRadioStreams(request.params.key)
      .then((streams: any) => {
        return this.respondPlain(response, streams);
      });
  }
}
