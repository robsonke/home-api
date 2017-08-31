import 'core-js/library';

import { Logger, LoggerFactory } from './common';
import { Express, Router } from 'express';
import { AppConfig } from './config';
import { ExpressAppFactory } from './express-app-factory';
import { RestErrorMiddleware } from './common';

const LOGGER: Logger = LoggerFactory.getLogger();

// Turn environment variables into a strongly typed configuration object
const appConfig: AppConfig = new AppConfig(process.env);

// Get the application middleware (to be mounted after the api router)
const errorMiddleware = [
  RestErrorMiddleware.normalizeToRestError,
  RestErrorMiddleware.serializeRestError
];

const app: Express = ExpressAppFactory.getExpressApp(appConfig, null, errorMiddleware);

// store the app config in the express app
app.set('config', appConfig);

app.listen(appConfig.port, () => {
  LOGGER.info(`Express server listening on port ${appConfig.port}`);
});


// Disclaimer: this is based on this nice setup seed: https://github.com/giannico/typescript-express-rest-seed
