import { ConfigBinder } from '@libs/configurations/config-binder';
import { ModuleMetadata, Provider } from '@nestjs/common';
import { ConfigFactory, registerAs } from '@nestjs/config';

export class PostgresOptions {
  connectionString: string;
  useInMemory: boolean;
  synchronize?: boolean;
  logging?: boolean;
  migrations?: string[];
  entities?: string[];
  factories?: string[];
  seeds?: string[];
  migrationsRun?: boolean;
}

export interface PostgresAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<PostgresOptions> | PostgresOptions;
  inject?: any[];
  extraProviders?: Provider[];
}

export const addPostgresOptions = (sectionName: string = 'postgresOptions'): ConfigFactory =>
  registerAs(sectionName, (): PostgresOptions => ConfigBinder.getOption<PostgresOptions>(sectionName));

export const getPostgresOptions = (sectionName: string = 'postgresOptions'): PostgresOptions =>
  ConfigBinder.getOption<PostgresOptions>(sectionName);
