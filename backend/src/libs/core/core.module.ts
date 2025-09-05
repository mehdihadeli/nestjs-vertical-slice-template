import { AppOptions } from '@libs/configurations/app-options';
import { ConfigModule } from '@libs/configurations/config.module';
import { ConfigBinder } from '@libs/configurations/config-binder';
import { ExceptionsModule } from '@libs/exceptions/exceptions.module';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ENVIRONMENT } from './constants';
import { Environment } from './environment';

@Module({
  imports: [
    ConfigModule.forFeature(ConfigBinder.addOptions<AppOptions>('appOptions')),
    CqrsModule.forRoot(),
    ExceptionsModule,
  ],
  providers: [
    {
      provide: ENVIRONMENT,
      useValue: (Object.values(Environment) as string[]).includes(process.env.NODE_ENV ?? '')
        ? (process.env.NODE_ENV as Environment)
        : Environment.Development,
    },
  ],

  exports: [
    // Re-export CqrsModule
    CqrsModule,
    ExceptionsModule,
  ],
})
export class CoreModule {}
