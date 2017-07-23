import { RestRouter } from '../../../common';
import { AirfoilController } from './airfoil-controller';
import { AirfoilService } from '../../../service/airfoil-service';
import { Request, Response } from 'express';

export class AirfoilRouter extends RestRouter {
  airfoilCtrl: AirfoilController;

  constructor(airfoilService: AirfoilService) {
    super();
    this.airfoilCtrl = new AirfoilController(airfoilService);
    this.initRoutes();
  }

  initRoutes() {
    this.router.get('/speakers', (request: Request, response: Response, next: any) => this.airfoilCtrl.getAllSpeakers(request, response));
    this.router.put('/speakers/:id/connected', (request: Request, response: Response, next: any) => this.airfoilCtrl.enableSpeaker(request, response));
    this.router.put('/syssource/:name', (request: Request, response: Response, next: any) => this.airfoilCtrl.setSysSource(request, response));
    this.router.put('/appsource/:name', (request: Request, response: Response, next: any) => this.airfoilCtrl.setAppSource(request, response));
  }
}
