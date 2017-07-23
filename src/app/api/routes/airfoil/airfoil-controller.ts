import { AirfoilService } from './../../../service/airfoil-service';
import { Logger, LoggerFactory, RestController } from '../../../common';
import { Speaker } from '../../domain/speaker-domain';
import { Request, Response } from 'express';

/**
 * @controller Airfoil
 * @baseUrl /api/airfoil
 */
export class AirfoilController extends RestController {
  private static readonly LOGGER: Logger = LoggerFactory.getLogger();

  constructor(private airfoilService: AirfoilService) {
    super();
  }


  /**
   * Get all speakers
   * @httpGet /api/airfoil/speakers
   * @httpResponse 200 [{Device}]
   */
  public getAllSpeakers(request: Request, response: Response): Promise<Response> {
    AirfoilController.LOGGER.debug('Retrieving all speakers');

    return this.airfoilService.getSpeakers()
      .then((speakers: any) => {
        return this.respondPlain(response, speakers);
      });
  }

  /**
   * Enable speakers
   * @httpPut /api/airfoil/speakers/{id}/connected
   * @httpPath id {string} id of the speaker
   * @httpResponse 200 [{Speaker}]
   */
  public enableSpeaker(request: Request, response: Response): Promise<Response> {
    AirfoilController.LOGGER.debug('Enable speaker with id: ' + request.params.id);

    return this.airfoilService.setSpeakerState(request.params.id, true)
      .then((speaker: Speaker) => {
        return this.respondPlain(response, speaker);
      });
  }

}
