import { RestRouter } from '../../../common';
import { VolumeController } from './volume-controller';
import { VolumeService } from '../../../service';
import { Request, Response } from 'express';

export class VolumeRouter extends RestRouter {
  volumeCtrl: VolumeController;

  constructor(volumeService: VolumeService) {
    super();
    this.volumeCtrl = new VolumeController(volumeService);
    this.initRoutes();
  }

  initRoutes() {
    this.router.get('/status', (request: Request, response: Response, next: any) => this.volumeCtrl.getVolumeStatus(request, response));
    this.router.put('/mute', (request: Request, response: Response, next: any) => this.volumeCtrl.muteVolume(request, response));
    this.router.put('/unmute', (request: Request, response: Response, next: any) => this.volumeCtrl.unmuteVolume(request, response));
    this.router.put('/louder', (request: Request, response: Response, next: any) => this.volumeCtrl.raiseVolume(request, response));
    this.router.put('/softer', (request: Request, response: Response, next: any) => this.volumeCtrl.lowerVolume(request, response));
    this.router.put('/:level', (request: Request, response: Response, next: any) => this.volumeCtrl.changeVolume(request, response));
  }
}
