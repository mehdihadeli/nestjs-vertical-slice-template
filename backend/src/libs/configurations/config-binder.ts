import { ConfigFactory, ConfigObject, registerAs } from '@nestjs/config';

import { ConfigLoader } from './config-loader';

export class ConfigBinder {
  /**
   * Binds a configuration section to a strongly typed class
   * Similar to .NET's Configure<T> pattern
   */
  static getOption<T>(sectionPath: string): T {
    const appSettingsConfigs = ConfigLoader.bindSection<T>(sectionPath);

    return appSettingsConfigs as T;
  }

  static addOptions<T extends ConfigObject = ConfigObject>(sectionName: string): ConfigFactory {
    return registerAs(sectionName, (): T => ConfigBinder.getOption<T>(sectionName));
  }

  static addOptionsWithValue<T extends ConfigObject = ConfigObject>(sectionName: string, value: T): ConfigFactory {
    return registerAs(sectionName, (): T => value);
  }
}
