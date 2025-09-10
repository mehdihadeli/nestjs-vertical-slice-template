import { Configuration } from '@libs/configurations/configuration';
import { ModuleMetadata, Provider } from '@nestjs/common';
import { ConfigFactory, registerAs } from '@nestjs/config';

export class PostgresOptions {
  connectionString: string;
  useInMemory: boolean;
  logging?: boolean;
  migrations?: string[];
  entities?: string[];
  factories?: string[];
  seeds?: string[];
}

export interface PostgresAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<PostgresOptions> | PostgresOptions;
  inject?: any[];
  extraProviders?: Provider[];
}

export const addPostgresOptions = (sectionName: string = 'postgresOptions'): ConfigFactory =>
  registerAs(sectionName, (): PostgresOptions => Configuration.getOption<PostgresOptions>(sectionName));

export const getPostgresOptions = (sectionName: string = 'postgresOptions'): PostgresOptions =>
  Configuration.getOption<PostgresOptions>(sectionName);
