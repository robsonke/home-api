import { Express, Router, RequestHandler, ErrorRequestHandler } from 'express';
import { AppConfig } from './config';
import express = require('express');
import cors = require('cors');
import bodyParser = require('body-parser');
import morgan = require('morgan');
import { ApiRouterFactory } from './api';
import { Logger, LoggerFactory } from './common';
import { DomoticzMQTTService } from './service/domoticz-mqtt-service'


export class ExpressAppFactory {

  private static readonly LOGGER: Logger = LoggerFactory.getLogger();

  private constructor() { }

  static getExpressApp(
    appConfig: AppConfig,
    preApiRouterMiddlewareFns: Array<RequestHandler | ErrorRequestHandler>,
    postApiRouterMiddlewareFns: Array<RequestHandler | ErrorRequestHandler>): Express {

    const app: Express = express();

    // initiate mqtt client
    let mqttOptions = {
    	host: appConfig.domoticzMQTTUrl
    };
    let domoticzMQTTService = new DomoticzMQTTService(mqttOptions);
    domoticzMQTTService.connect();


    // Create the application router (to be mounted by the express server)
    const apiRouter: Router = ApiRouterFactory.getApiRouter(appConfig, domoticzMQTTService);

    // swagger ui
    const swaggerUi = require('swagger-ui-express');
    const swaggerDocument = require('./swagger.json');
    let options = {
      validatorUrl: null
    };
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, true, options));
    
    // enable cors for all routes
    app.use(cors());

    // add bodyParser as middleware
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    if (appConfig.serveStatic) {
      ExpressAppFactory.LOGGER.info(`Serving static files from public`);
      app.use(express.static('public'));
    }

    if (appConfig.enableHttpRequestLogging) {
      ExpressAppFactory.LOGGER.info(`Request logging is enabled`);
      app.use(morgan('combined'));
    }

    if (preApiRouterMiddlewareFns != null) {
      postApiRouterMiddlewareFns.forEach((middlewareFn) => app.use(middlewareFn));
    }

    app.use('/api', apiRouter);

    if (postApiRouterMiddlewareFns != null) {
      postApiRouterMiddlewareFns.forEach((middlewareFn) => app.use(middlewareFn));
    }

    return app;
  }

}
