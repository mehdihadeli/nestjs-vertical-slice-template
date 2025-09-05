import { isObject } from '@nestjs/common/utils/shared.utils';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

export class ConfigLoader {
  private static configItems: Record<string, any> = {};

  static init(): void {
    const env = process.env.NODE_ENV ?? 'development';

    let envVars = this.initEnvs(env);
    const appsettings = this.loadAppSettings(env);

    // Parse envs into a nested object structure (NET style __ mapping)
    envVars = this.parseEnvToNested(envVars);

    // Merge env over appsettings (env wins, supports deeply nested objects)
    ConfigLoader.configItems = this.deepMerge(appsettings, envVars);
  }

  /**
   * Binds a config section using `:` notation, e.g. 'openTelemetryOptions:aspireDashboardOTLPOptions'
   */
  static bindSection<T>(sectionPath: string): T | null {
    const sections = sectionPath.split(':');
    let current = ConfigLoader.configItems;
    for (const section of sections) {
      if (typeof current === 'object' && current !== null && section in current) {
        current = current[section];
      } else {
        return null;
      }
    }
    return current as T;
  }

  /**
   * Recursively merges objects (env overrides base). Arrays are replaced.
   */
  private static deepMerge(base: Record<string, unknown>, override: Record<string, unknown>): Record<string, unknown> {
    if (Array.isArray(base) || Array.isArray(override)) {
      return override ?? base;
    }

    const result: Record<string, unknown> = { ...base };

    for (const key of Object.keys(override)) {
      const baseValue = base[key];
      const overrideValue = override[key];

      if (
        typeof baseValue === 'object' &&
        baseValue !== null &&
        typeof overrideValue === 'object' &&
        overrideValue !== null &&
        !Array.isArray(baseValue) &&
        !Array.isArray(overrideValue)
      ) {
        result[key] = this.deepMerge(baseValue as Record<string, unknown>, overrideValue as Record<string, unknown>);
      } else {
        result[key] = overrideValue;
      }
    }

    return result;
  }

  /**
   * Parses env vars with __ and _ to a nested object:
   * E.g. POSTGRES_OPTIONS__CONNECTION_STRING → { postgresOptions: { connectionString: ... } }
   */
  private static parseEnvToNested(envs: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};
    for (const [fullKey, value] of Object.entries(envs)) {
      // Fixed lint error: use an arrow function
      const parts = fullKey.split('__').map(part => ConfigLoader.envPartToCamel(part));
      let obj = result;
      for (let i = 0; i < parts.length; ++i) {
        const part = parts[i];
        if (i === parts.length - 1) {
          obj[part] = value;
        } else {
          obj = obj[part] ??= {};
        }
      }
    }
    return result;
  }

  /**
   * Converts ENV part (ALL_CAPS_UNDERSCORE) to camelCase. E.g. POSTGRES_OPTIONS → postgresOptions
   */
  private static envPartToCamel(key: string): string {
    return key.toLowerCase().replace(/_([\da-z])/g, (_: string, match: string) => match.toUpperCase());
  }

  private static initEnvs(env: string): Record<string, any> {
    const evnConfigs = {
      ...process.env,
      ...this.loadEnvFile(env),
    };

    this.assignVariablesToProcess(evnConfigs);

    return evnConfigs;
  }

  private static loadAppSettings(env: string): Record<string, any> {
    const configPath = join(process.cwd(), 'config');

    // Load base configuration
    const baseConfigKeyValues = this.loadAppSettingConfigFile(join(configPath, 'appsettings.json'));

    // Load environment-specific configuration
    const envConfigKeyValues = this.loadAppSettingConfigFile(join(configPath, `appsettings.${env}.json`));

    // Merge base appsettings and environment specific appsettings
    return this.mergeAppSettingsConfigs(baseConfigKeyValues, envConfigKeyValues);
  }

  private static loadAppSettingConfigFile(filePath: string): Record<string, any> {
    try {
      if (!existsSync(filePath)) {
        return {};
      }

      const fileContent = readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent) as Record<string, any>;
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'message' in error
          ? (error as { message: string }).message
          : String(error);

      console.warn(`Could not load config file: ${filePath}`, message);
      return {};
    }
  }

  private static mergeAppSettingsConfigs(
    base: Record<string, any>,
    override: Record<string, any>,
  ): Record<string, any> {
    const result: Record<string, any> = { ...base };

    for (const key of Object.keys(override)) {
      const overrideVal = override[key];
      const baseVal = result[key];
      if (
        typeof overrideVal === 'object' &&
        overrideVal !== null &&
        typeof baseVal === 'object' &&
        baseVal !== null &&
        !Array.isArray(overrideVal) &&
        !Array.isArray(baseVal)
      ) {
        // Deep merge for objects (ignore arrays)
        result[key] = this.mergeAppSettingsConfigs(baseVal, overrideVal);
      } else {
        // Override for primitives or arrays
        result[key] = overrideVal;
      }
    }

    return result;
  }

  /**
   * Merges JSON configuration with environment variables
   * Environment variables override JSON values
   */
  private static overrideEnvironments(
    appsettingKeyValues: Record<string, any>,
    envKeyValues: Record<string, any>,
    rootKey: string = '',
  ): Record<string, any> {
    if (!appsettingKeyValues || typeof appsettingKeyValues !== 'object') {
      return appsettingKeyValues;
    }

    const result: Record<string, any> = {
      ...appsettingKeyValues,
    };

    for (const key of Object.keys(result)) {
      let envVarName = this.createEnvVarName(key);
      if (rootKey) {
        envVarName = `${rootKey}_${envVarName}`;
      }
      const envValue = envKeyValues[envVarName];

      if (envValue !== undefined) {
        // Convert environment variable string to appropriate type
        result[key] = this.convertValue(envValue, result[key]);
      }

      // Recursively process nested objects
      if (typeof result[key] === 'object' && result[key] !== null && !Array.isArray(result[key])) {
        result[key] = this.overrideEnvironments(result[key], envKeyValues, envVarName);
      }
    }

    // Return the fully merged config with env overrides
    return result;
  }

  /**
   * Creates environment variable name from section path and key
   * Example: "database:host" becomes "DATABASE_HOST"
   * CamelCase or PascalCase will become with underscores (e.g., "appConfig:apiPrefix" => "APP_CONFIG_API_PREFIX")
   */
  private static createEnvVarName(key: string): string {
    function camelToSnakeUpper(str: string): string {
      return str
        .replace(/([\da-z])([A-Z])/g, '$1_$2') // insert _ before capitals preceded by a lowercase/number
        .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2') // insert _ between sequences like "APIKey" => "API_Key"
        .toUpperCase();
    }
    const snakeCaseParts = camelToSnakeUpper(key);
    return snakeCaseParts;
  }

  /**
   * Converts environment variable string to appropriate type
   */
  private static convertValue(envValue: string, originalValue: unknown): unknown {
    if (typeof originalValue === 'number') {
      return Number(envValue);
    } else if (typeof originalValue === 'boolean') {
      return envValue.toLowerCase() === 'true';
    } else if (Array.isArray(originalValue)) {
      return envValue.split(',').map(item => item.trim());
    }

    return envValue;
  }

  private static loadEnvFile(env: string): Record<string, any> {
    const envFilePath = `${process.cwd()}/config/env/.env.${env}`;
    let config: ReturnType<typeof dotenv.parse> = {};
    if (fs.existsSync(envFilePath)) {
      config = Object.assign(dotenv.parse(fs.readFileSync(envFilePath)), config);
    }

    return config;
  }

  private static assignVariablesToProcess(config: Record<string, unknown>): void {
    if (!isObject(config)) {
      return;
    }
    const keys = Object.keys(config).filter(key => !(key in process.env));
    keys.forEach(key => {
      const value = config[key];
      if (typeof value === 'string') {
        process.env[key] = value;
      } else if (typeof value === 'boolean' || typeof value === 'number') {
        process.env[key] = `${value}`;
      }
    });
  }
}
