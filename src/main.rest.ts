import 'reflect-metadata';

import { Container } from 'inversify';

import { RestApplication } from './rest/rest.application.js';
import { Config, RestConfig, RestSchema } from './shared/libs/config/index.js';
import { DatabaseClient } from './shared/libs/database-client/database-client.interface.js';
import { MongoDatabaseClient } from './shared/libs/database-client/index.js';
import { Logger, PinoLogger } from './shared/libs/logger/index.js';
import { Component } from './shared/types/index.js';

async function bootstrap() {
  const container = new Container();
  container.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  container.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();

  const application = container.get<RestApplication>(Component.RestApplication);
  await application.init();
}

bootstrap();
