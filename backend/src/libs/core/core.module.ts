import { AppOptions } from '@libs/configurations/app-options';
import { CustomConfigModule } from '@libs/configurations/config-module';
import { Configuration } from '@libs/configurations/configuration';
import { ExceptionsModule } from '@libs/exceptions/exceptions.module';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
@Module({
  imports: [
    CustomConfigModule.forFeature(Configuration.addOptions<AppOptions>('appOptions')),
    CqrsModule.forRoot(),
    ExceptionsModule,
  ],
  providers: [],

  exports: [
    // Re-export CqrsModule
    CqrsModule,
    ExceptionsModule,
  ],
})
export class CoreModule {}
