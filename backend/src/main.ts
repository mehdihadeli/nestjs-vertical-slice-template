import { AppInfrastructure } from '@app/app.infrastructure';
import { AppModule } from '@app/app.module';
import { AppOptions } from '@libs/configurations/app-options';
import { Configuration } from '@libs/configurations/configuration';
import { Guard } from '@libs/core/validations/guard';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.enableShutdownHooks();

  AppInfrastructure.setup(app);

  const appOptions = Configuration.getOption<AppOptions>('appOptions');
  const port = Guard.notNegativeOrZero(appOptions?.port, 'port');

  await app.listen(port);

  Logger.log(`🚀 Application is running on http://localhost:${port}`);
};

bootstrap().catch(handleError);

function handleError(error: any): void {
  Logger.error(`⚠️ Application failed to start: ${error}`);
  process.exit(1);
}

process.on('uncaughtException', handleError);
