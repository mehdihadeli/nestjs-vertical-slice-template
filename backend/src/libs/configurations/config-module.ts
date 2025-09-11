import { ENVIRONMENT_TOKEN } from '@libs/configurations/constants';
import { Environment } from '@libs/configurations/environment';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigFactory, ConfigModule as NestConfigModule, ConfigModuleOptions } from '@nestjs/config';

@Global()
@Module({})
export class CustomConfigModule {
  static forRoot<ValidationOptions extends Record<string, any>>(
    options?: ConfigModuleOptions<ValidationOptions>,
  ): DynamicModule {
    const nestConfigModule = NestConfigModule.forRoot(options);

    const env: Environment = (process.env.NODE_ENV as Environment) ?? Environment.Development;
    return {
      module: CustomConfigModule,
      providers: [
        {
          provide: ENVIRONMENT_TOKEN,
          useValue: env,
        },
      ],
      imports: [nestConfigModule],
      exports: [NestConfigModule, ENVIRONMENT_TOKEN],
    };
  }

  static forFeature(config: ConfigFactory): DynamicModule {
    const nestFeatureModule = NestConfigModule.forFeature(config);

    return {
      module: CustomConfigModule,
      imports: [nestFeatureModule],
      exports: [nestFeatureModule],
    };
  }
}
