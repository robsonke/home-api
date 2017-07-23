import { VolumeService } from './../../../service';
import { Logger, LoggerFactory, RestController } from '../../../common';
import { VolumeStatus } from '../../domain/volumestatus-domain';
import { Request, Response } from 'express';

/**
 * @controller Volume
 * @baseUrl /api/volume
 */
export class VolumeController extends RestController {
  private static readonly LOGGER: Logger = LoggerFactory.getLogger();

  constructor(private volumeService: VolumeService) {
    super();
  }

  /**
   * Get the volume status
   * @httpGet /api/volume/status
   * @httpResponse 200 {VolumeStatus}
   */
  public getVolumeStatus(request: Request, response: Response): Promise<Response> {
    VolumeController.LOGGER.debug('Retrieving the volume status');

    return this.volumeService.getVolumeStatus()
      .then((status: any) => {
        return this.respondPlain(response, status);
      });
  }

  /**
   * Mute the volume
   * @httpPut /api/volume/mute
   */
  public muteVolume(request: Request, response: Response): Promise<Response> {
    return this.volumeService.setMute(true)
      .then((result: any) => {
        return this.respondPlain(response, result);
      });
  }

  /**
   * Unmute the volume
   * @httpPut /api/volume/unmute
   */
  public unmuteVolume(request: Request, response: Response): Promise<Response> {
    return this.volumeService.setMute(false)
      .then((result: any) => {
        return this.respondPlain(response, result);
      });
  }

  /**
   * Pump up the volume
   * @httpPut /api/volume/louder
   */
  public raiseVolume(request: Request, response: Response): Promise<Response> {
    return this.volumeService.adjustVolume(true)
      .then((result: any) => {
        return this.respondPlain(response, result);
      });
  }

  /**
   * Soften the volume
   * @httpPut /api/volume/softer
   */
  public lowerVolume(request: Request, response: Response): Promise<Response> {
    return this.volumeService.adjustVolume(false)
      .then((result: any) => {
        return this.respondPlain(response, result);
      });
  }

  /**
   * Change the volume to a specific level between 0 and 100
   * @httpPut /api/volume/{level}
   * @httpPath level {number} level of the volume
   */
  public changeVolume(request: Request, response: Response): Promise<Response> {
    return this.volumeService.setVolume(request.params.level)
      .then((result: any) => {
        return this.respondPlain(response, result);
      });
  }
}
