import { RingService } from './service/ring-service';
import { Express, Router, RequestHandler, ErrorRequestHandler } from 'express';
import { AppConfig } from './config';
import express = require('express');
import cors = require('cors');
import bodyParser = require('body-parser');
import morgan = require('morgan');
import { ApiRouterFactory } from './api';
import { Logger, LoggerFactory } from './common';
import { DomoticzMQTTService } from './service/domoticz-mqtt-service';
import red = require('node-red');
import http = require('http');
import path = require('path');
import fs = require('fs');
import ringAPI = require('doorbot');

import * as basicAuth from 'express-basic-auth';
import { SonosService } from './service/sonos-service';


export class ExpressAppFactory {

  private static readonly LOGGER: Logger = LoggerFactory.getLogger();

  private constructor() { }

  static getExpressApp(
    appConfig: AppConfig,
    preApiRouterMiddlewareFns: Array<RequestHandler | ErrorRequestHandler>,
    postApiRouterMiddlewareFns: Array<RequestHandler | ErrorRequestHandler>): Express {

    const app: Express = express();
    let server = http.createServer(app);

    let corsOptions = {
      'origin': '*',
      'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
      'preflightContinue': false,
      'optionsSuccessStatus': 204,
      'allowedHeaders': ['Content-Type', 'Authorization']
    };

    // enable cors for all routes
    // this is on purpose above the auth part, as this should be without auth
    app.use(cors(corsOptions));
    app.options('*', cors(corsOptions));

    // secure the api with basic auth
    let user = {};
    user[appConfig.apiUser] = appConfig.apiPassword;
    user[appConfig.adminUser] = appConfig.adminPassword;
    app.use(basicAuth({
      users: user,
      unauthorizedResponse: 'Please add basic authentication.',
      challenge: true,
      realm: 'rjwJINWFapi'
    }));

    const settings = {
      httpAdminRoot: '/red',
      httpNodeRoot: '/redapi',
      userDir: '~/.node-red/',
      functionGlobalContext: { }    // enables global context
    };
    // initialise the runtime with a server and settings
    red.init(server, settings);
    server.listen(appConfig.port, () => {
      this.LOGGER.info(`Express server listening on port ${appConfig.port}`);
    });

    // serve the editor UI from /red
    app.use(settings.httpAdminRoot, red.httpAdmin);

    // serve the http nodes UI from /api
    app.use(settings.httpNodeRoot, red.httpNode);
    // and start node-red
    red.start();

    // initiate mqtt client
    let mqttOptions = {
      host: appConfig.domoticzMQTTUrl,
      username: appConfig.mqttUser,
      password: appConfig.mqttPassword
    };
    let domoticzMQTTService = new DomoticzMQTTService(mqttOptions);

    // Create the application router (to be mounted by the express server)
    const apiRouter: Router = ApiRouterFactory.getApiRouter(appConfig, domoticzMQTTService);

    // swagger ui
    const swaggerUi = require('swagger-ui-express');
    let swaggerDocument = require('./swagger.json');

    // append authentication information to the swagger specs
    swaggerDocument.securityDefinitions = {
      'basicAuth': {
        'type': 'basic'
      }
    };
    swaggerDocument.security = [
      {
        'basicAuth': [ ]
      }
    ];

    let options = {
      validatorUrl: null
    };
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, true, options));

    // add bodyParser as middleware
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    if (appConfig.serveStatic) {
      ExpressAppFactory.LOGGER.info(`Serving static files from public`);
      app.use(express.static('public'));
    }

    if (appConfig.enableHttpRequestLogging) {
      ExpressAppFactory.LOGGER.info(`Request logging is enabled`);
      let accessLogStream = fs.createWriteStream(path.join(__dirname, '../../logs/access.log'), {flags: 'a'});
      app.use(morgan('combined', {stream: accessLogStream}));
    }

    if (preApiRouterMiddlewareFns != null) {
      preApiRouterMiddlewareFns.forEach((middlewareFn) => app.use(middlewareFn));
    }

    app.use('/api', apiRouter);

    if (postApiRouterMiddlewareFns != null) {
      postApiRouterMiddlewareFns.forEach((middlewareFn) => app.use(middlewareFn));
    }

    // ring doorbell watcher
    const ring = ringAPI({
        email: appConfig.ringUser,
        password: appConfig.ringPassword,
        retries: 10, api_version: 11, timeout: (10 * 60 * 1000)
    });

    let ringService = new RingService(appConfig, new SonosService(appConfig));
    ringService.checkRingDeviceEvent(ring);

    return app;
  }

}
