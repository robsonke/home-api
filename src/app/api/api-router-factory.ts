import express = require('express');
import { Router } from 'express';
import { DomoticzService, AirfoilService, VolumeService } from '../service';
import { DomoticzRouter } from './routes/domoticz/domoticz-router';
import { AirfoilRouter } from './routes/airfoil/airfoil-router';
import { VolumeRouter } from './routes/volume/volume-router';
import { AppConfig } from '../config';
import { Logger, LoggerFactory, InvalidResourceUrlError } from '../common';

export class ApiRouterFactory {

  private static readonly LOGGER: Logger = LoggerFactory.getLogger();

  private constructor() { }

  static getApiRouter(appConfig: AppConfig): Router {
    const router: Router = express.Router();

    const domoticzRouter: Router = new DomoticzRouter(new DomoticzService(appConfig)).router;
    const airfoilRouter: Router = new AirfoilRouter(new AirfoilService(appConfig)).router;
    const volumeRouter: Router = new VolumeRouter(new VolumeService(appConfig)).router;

    ApiRouterFactory.LOGGER.info('Mounting domoticz and airfoil routes');

    router.use('/domoticz', domoticzRouter);
    router.use('/airfoil', airfoilRouter);
    router.use('/volume', volumeRouter);

    router.all('*', (req, res, next) => {
      next(new InvalidResourceUrlError());
    });

    return router;
  }
}
