import express = require('express');
import { Router } from 'express';
import { DomoticzRouter } from './routes/domoticz/domoticz-router';
import { DomoticzService } from '../service'
import { AppConfig } from '../config';
import { Logger, LoggerFactory, InvalidResourceUrlError } from '../common';

export class ApiRouterFactory {

  private static readonly LOGGER: Logger = LoggerFactory.getLogger();

  private constructor() { }

  static getApiRouter(appConfig: AppConfig): Router {
    const router: Router = express.Router();

    const domoticzRouter: Router = new DomoticzRouter(new DomoticzService(appConfig)).router;

    ApiRouterFactory.LOGGER.info('Mounting domoticz routes');

    router.use('/domoticz', domoticzRouter);

    router.all('*', (req, res, next) => {
      next(new InvalidResourceUrlError());
    });

    return router;
  }
}
