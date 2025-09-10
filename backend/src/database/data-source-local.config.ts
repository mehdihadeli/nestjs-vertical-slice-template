import { Configuration } from '@libs/configurations/configuration';
import { PostgresOptions } from '@libs/postgres-typeorm/postgres-options';
import { AuditSubscriber } from '@libs/postgres-typeorm/subscribers/audit.subscriber';
import { IdGenerationSubscriber } from '@libs/postgres-typeorm/subscribers/id-generation.subscriber';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

// https://www.thisdot.co/blog/setting-up-typeorm-migrations-in-an-nx-nestjs-project
// https://blog.mazedul.dev/how-to-setup-typeorm-migrations-in-a-nestjs-project
// because we don't have `ConfigModule` we should `init` ConfigLoader manually.
const postgresOptions = Configuration.getOption<PostgresOptions>('postgresOptions');

console.log('ConnectionString is: ', postgresOptions.connectionString);

const url = new URL(postgresOptions.connectionString);

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: url.hostname,
  port: parseInt(url.port) || 5432,
  username: url.username,
  password: url.password,
  database: url.pathname.replace('/', ''),
  ssl: url.searchParams.get('ssl') === 'true' || undefined,
  synchronize: true,
  migrationsRun: true,
  entities: ['dist/src/app/**/*.schema.js'],
  migrations: ['dist/src/database/migrations/*.js'],
  subscribers: [AuditSubscriber, IdGenerationSubscriber],

  // typeorm-extension
  seeds: ['dist/src/database/seeds/**/*.js'],
  factories: ['dist/src/database/factories/**/*.js'],
};

export default new DataSource(dataSourceOptions);
