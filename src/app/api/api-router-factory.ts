import { RadioStreamService } from './../service/radio-stream-service';
import { RadioStreamRouter } from './routes/radio/radio-router';
import express = require('express');
import { Router } from 'express';
import { DomoticzService, DomoticzMQTTService, AirfoilService, VolumeService } from '../service';
import { DomoticzRouter } from './routes/domoticz/domoticz-router';
import { AirfoilRouter } from './routes/airfoil/airfoil-router';
import { VolumeRouter } from './routes/volume/volume-router';
import { AppConfig } from '../config';
import { Logger, LoggerFactory, InvalidResourceUrlError } from '../common';

export class ApiRouterFactory {

  private static readonly LOGGER: Logger = LoggerFactory.getLogger();

  private constructor() { }

  static getApiRouter(appConfig: AppConfig, domoticzMQTTService: DomoticzMQTTService): Router {
    const router: Router = express.Router();

    const domoticzRouter: Router = new DomoticzRouter(new DomoticzService(appConfig), domoticzMQTTService).router;
    const airfoilRouter: Router = new AirfoilRouter(new AirfoilService(appConfig)).router;
    const volumeRouter: Router = new VolumeRouter(new VolumeService(appConfig)).router;
    const radioStreamRouter: Router = new RadioStreamRouter(new RadioStreamService(appConfig)).router;

    ApiRouterFactory.LOGGER.info('Mounting domoticz and airfoil routes');

    router.use('/domoticz', domoticzRouter);
    router.use('/airfoil', airfoilRouter);
    router.use('/volume', volumeRouter);
    router.use('/radio', radioStreamRouter);

    router.all('*', (req, res, next) => {
      next(new InvalidResourceUrlError());
    });

    return router;
  }
}
