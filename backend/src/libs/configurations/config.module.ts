import { ConfigLoader } from '@libs/configurations/config-loader';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigFactory, ConfigModule as NestConfigModule, ConfigModuleOptions } from '@nestjs/config';

@Global()
@Module({})
export class ConfigModule {
  static forRoot<ValidationOptions extends Record<string, any>>(
    options?: ConfigModuleOptions<ValidationOptions>,
  ): DynamicModule {
    const nestConfigModule = NestConfigModule.forRoot(options);

    ConfigLoader.init();

    return {
      module: ConfigModule,
      imports: [NestConfigModule, nestConfigModule],
      exports: [NestConfigModule],
    };
  }

  static forFeature(config: ConfigFactory): DynamicModule {
    const nestFeatureModule = NestConfigModule.forFeature(config);

    return {
      module: ConfigModule,
      imports: [nestFeatureModule],
      exports: [nestFeatureModule],
    };
  }
}
