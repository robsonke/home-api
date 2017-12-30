import { RadioStreamController } from './radio-controller';
import { RestRouter } from '../../../common';
import { Request, Response } from 'express';
import { RadioStreamService } from '../../../service/radio-stream-service';

export class RadioStreamRouter extends RestRouter {
  radioStreamCtrl: RadioStreamController;

  constructor(radioStreamService: RadioStreamService) {
    super();
    this.radioStreamCtrl = new RadioStreamController(radioStreamService);
    this.initRoutes();
  }

  initRoutes() {
    this.router.get('/search/:key', (request: Request, response: Response, next: any) => this.radioStreamCtrl.getStreams(request, response));
  }
}
