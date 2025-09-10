import { Configuration } from '@libs/configurations/configuration';
import { guard } from '@libs/core/validations/guard';
import { DatabaseSeeder } from '@libs/postgres-typeorm/data-seeder.worker';
import { MigrationWorker } from '@libs/postgres-typeorm/migration-worker';
import { AuditSubscriber } from '@libs/postgres-typeorm/subscribers/audit.subscriber';
import { IdGenerationSubscriber } from '@libs/postgres-typeorm/subscribers/id-generation.subscriber';
import { DynamicModule, Logger, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

import { PostgresOptions } from './postgres-options';

@Module({})
export class PostgresTypeormModule {
  static logger = new Logger(PostgresTypeormModule.name);

  // https://docs.nestjs.com/modules#dynamic-modules
  // https://docs.nestjs.com/fundamentals/dynamic-modules
  // https://github.com/nestjs/typeorm/blob/master/lib/typeorm-core.module.ts#L82
  // https://github.com/nestjs/typeorm/blob/master/lib/typeorm-core.module.ts#L46
  static forRootAsync(postgresOptions?: PostgresOptions): DynamicModule {
    // it is better we defer reading configs using `forRootAsync` for more flexibility to change options until runtime,
    // otherwise whenever we import AppModules all imported child modules will load immediately and don't have
    // flexibility of overriding options in test
    const typeOrmModule = TypeOrmModule.forRootAsync({
      useFactory: () => {
        const configOptions = Configuration.getOption<PostgresOptions>('postgresOptions');

        const mergedOptions = Object.assign({}, configOptions);
        if (postgresOptions) {
          for (const key of Object.keys(postgresOptions)) {
            const value: any = postgresOptions[key];
            if (value !== undefined && value !== null) {
              mergedOptions[key] = value;
            }
          }
        }
        const res = PostgresTypeormModule.createTypeOrmModuleOptions(mergedOptions);

        return res;
      },
    });

    return {
      module: PostgresTypeormModule,
      imports: [typeOrmModule],
      exports: [typeOrmModule],
      providers: [
        // - Make sure DatabaseSeeder and MigrationWorker provider so they can have lifecycle hooks, the same if we
        // want to have PostgresTypeormModule as a life cycle hook
        DatabaseSeeder,
        MigrationWorker,
      ],
    };
  }

  static forFeature(
    entities?: EntityClassOrSchema[],
    dataSource?: DataSource | DataSourceOptions | string,
  ): DynamicModule {
    return TypeOrmModule.forFeature(entities, dataSource);
  }

  private static createTypeOrmModuleOptions(options: PostgresOptions): TypeOrmModuleOptions & SeederOptions {
    guard.notNull(options, 'postgresOptions');

    const migrationsPath = ['dist/src/database/migrations/*.js'];
    const entitiesPath = ['dist/src/app/**/*.schema.js'];

    const seedsPath = ['dist/src/database/seeds/**/*.js'];
    const factoriesPath = ['dist/src/database/factories/**/*.js'];

    // Use in-memory SQLite if specified
    if (options.useInMemory) {
      return {
        type: 'sqlite',
        database: ':memory:',
        logging: options.logging ?? true,
        migrations: options.migrations,
        subscribers: [AuditSubscriber, IdGenerationSubscriber],
        seeds: options.seeds ?? seedsPath,
        factories: options.factories ?? factoriesPath,
      };
    }

    // Parse PostgreSQL connection string
    guard.notEmptyOrNull(
      options.connectionString,
      'connectionString',
      'Connection string is required when not using in-memory database',
    );

    const url = new URL(options.connectionString);

    const dataSourceOptions: DataSourceOptions & SeederOptions = {
      type: 'postgres',
      host: url.hostname,
      port: parseInt(url.port) || 5432,
      username: url.username,
      password: url.password,
      database: url.pathname.replace('/', ''),
      ssl: url.searchParams.get('ssl') === 'true' || undefined,
      logging: options.logging ?? false,
      subscribers: [AuditSubscriber, IdGenerationSubscriber],
      migrations: options.migrations ?? migrationsPath,
      entities: options.entities ?? entitiesPath,

      // we will apply migrations manually
      migrationsRun: false,
      synchronize: false,

      // https://github.com/tada5hi/typeorm-extension
      seeds: options.seeds ?? seedsPath,
      factories: options.factories ?? factoriesPath,
    };

    return dataSourceOptions;
  }
}
