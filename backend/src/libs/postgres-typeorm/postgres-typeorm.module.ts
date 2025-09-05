import { ConfigBinder } from '@libs/configurations/config-binder';
import { guard } from '@libs/core/validations/guard';
import { DatabaseSeeder } from '@libs/postgres-typeorm/data-seeder.worker';
import { AuditSubscriber } from '@libs/postgres-typeorm/subscribers/audit.subscriber';
import { SoftDeleteSubscriber } from '@libs/postgres-typeorm/subscribers/soft-delete.subscriber';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

import { PostgresAsyncOptions, PostgresOptions } from './postgres-options';

@Module({ imports: [ConfigModule] })
export class PostgresTypeormModule {
  // https://docs.nestjs.com/modules#dynamic-modules
  // https://docs.nestjs.com/fundamentals/dynamic-modules
  // https://github.com/nestjs/typeorm/blob/master/lib/typeorm-core.module.ts#L82
  // https://github.com/nestjs/typeorm/blob/master/lib/typeorm-core.module.ts#L46
  static forRoot(postgresOptions?: PostgresOptions): DynamicModule {
    // `TypeOrmCoreModule` is global and create by `forRootAsync` and `forRoot` but `TypeOrmModule` itself is not global

    const configOptions = ConfigBinder.getOption<PostgresOptions>('postgresOptions');

    const mergedOptions = Object.assign({}, configOptions);
    if (postgresOptions) {
      for (const key of Object.keys(postgresOptions)) {
        const value: any = postgresOptions[key];
        if (value !== undefined && value !== null) {
          mergedOptions[key] = value;
        }
      }
    }

    const typeOrmModuleOptions = PostgresTypeormModule.createTypeOrmModuleOptions(mergedOptions);

    const typeOrmCoreModule = TypeOrmModule.forRoot(typeOrmModuleOptions);

    const exports = [typeOrmCoreModule];
    const imports = [typeOrmCoreModule];

    return {
      module: PostgresTypeormModule,
      imports,
      exports,
      providers: [DatabaseSeeder],
    };
  }

  static forRootAsync(asyncOptions: PostgresAsyncOptions): DynamicModule {
    const typeOrmModule = TypeOrmModule.forRootAsync({
      imports: asyncOptions.imports ?? [],
      inject: asyncOptions.inject ?? [],
      useFactory: asyncOptions.useFactory
        ? async (...args: any[]): Promise<TypeOrmModuleOptions> => {
            const options = await asyncOptions.useFactory!(args);
            return PostgresTypeormModule.createTypeOrmModuleOptions(options);
          }
        : undefined,
    });

    const exports = [typeOrmModule];
    const imports = [typeOrmModule, ...(asyncOptions.imports ?? [])];

    return {
      module: PostgresTypeormModule,
      imports,
      exports,
      providers: [DatabaseSeeder],
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

    // Use in-memory SQLite if specified
    if (options.useInMemory) {
      return {
        type: 'sqlite',
        database: ':memory:',
        synchronize: options.synchronize ?? true,
        logging: options.logging ?? true,
        migrations: options.migrations,
        migrationsRun: options.migrationsRun,
        subscribers: [AuditSubscriber, SoftDeleteSubscriber],
      };
    }

    // Parse PostgreSQL connection string
    guard.notEmptyOrNull(
      options.connectionString,
      'connectionString',
      'Connection string is required when not using in-memory database',
    );

    const url = new URL(options.connectionString);

    const migrationsPath = ['dist/src/database/migrations/*.js'];
    const entitiesPath = ['dist/src/app/**/*.schema.js'];

    const seedsPath = ['dist/src/database/seeds/**/*.js'];
    const factoriesPath = ['dist/src/database/factories/**/*.js'];

    return {
      type: 'postgres',
      host: url.hostname,
      port: parseInt(url.port) || 5432,
      username: url.username,
      password: url.password,
      database: url.pathname.replace('/', ''),
      ssl: url.searchParams.get('ssl') === 'true' || undefined,
      synchronize: options.synchronize ?? false, // Default to false for production safety
      logging: options.logging ?? false,
      migrationsRun: options.migrationsRun ?? process.env.NODE_ENV === 'development',
      subscribers: [AuditSubscriber, SoftDeleteSubscriber],
      migrations: options.migrations ?? migrationsPath,
      entities: options.entities ?? entitiesPath,

      // // https://github.com/tada5hi/typeorm-extension
      seeds: options.seeds ?? seedsPath,
      factories: options.factories ?? factoriesPath,
    };
  }
}
