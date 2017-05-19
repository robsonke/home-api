import { Express, Router, RequestHandler, ErrorRequestHandler } from 'express';
import { AppConfig } from './config';
import express = require('express');
import bodyParser = require('body-parser');
import morgan = require('morgan');
import * as swaggerJSDoc from 'swagger-jsdoc';
import { Logger, LoggerFactory } from './common';

export class ExpressAppFactory {

  private static readonly LOGGER: Logger = LoggerFactory.getLogger();

  private constructor() { }

  static getExpressApp(
    appConfig: AppConfig,
    apiRouter: Router,
    preApiRouterMiddlewareFns: Array<RequestHandler | ErrorRequestHandler>,
    postApiRouterMiddlewareFns: Array<RequestHandler | ErrorRequestHandler>): Express {

    const app: Express = express();

    // add Swagger specs
    // let swaggerDefinition = {
    //   info: {
    //     title: 'Home Automation API',
    //     version: '0.1.0',
    //     description: 'Highly opiniated custom project to control all kind of home automation.',
    //   },
    //   host: 'localhost:3000',
    //   basePath: '/api',
    // };
    // let options = {
    //   swaggerDefinition: {
    //     info: {
    //       title: 'Home Automation API',
    //       version: '0.1.0',
    //       description: 'Highly opiniated custom project to control all kind of home automation.',
    //     },
    //   },
    //   apis: ['/app/api/routes/domoticz/*.js'],
    // };
    //
    // // initialize swagger-jsdoc
    // let swaggerSpec = swaggerJSDoc(options);
    //
    // // serve swagger
    // app.get('/swagger.json', function(req, res) {
    //   res.setHeader('Content-Type', 'application/json');
    //   res.send(swaggerSpec);
    // });

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
