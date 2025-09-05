import { ConfigBinder } from '@libs/configurations/config-binder';
import { ConfigLoader } from '@libs/configurations/config-loader';
import { PostgresOptions } from '@libs/postgres-typeorm/postgres-options';
import { AuditSubscriber } from '@libs/postgres-typeorm/subscribers/audit.subscriber';
import { SoftDeleteSubscriber } from '@libs/postgres-typeorm/subscribers/soft-delete.subscriber';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

// https://www.thisdot.co/blog/setting-up-typeorm-migrations-in-an-nx-nestjs-project
// https://blog.mazedul.dev/how-to-setup-typeorm-migrations-in-a-nestjs-project
// because we don't have `ConfigModule` we should `init` ConfigLoader manually.
ConfigLoader.init();
const postgresOptions = ConfigBinder.getOption<PostgresOptions>('postgresOptions');

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
  synchronize: postgresOptions.synchronize ?? false,
  entities: ['dist/src/app/**/*.schema.js'],
  migrations: ['dist/src/database/migrations/*.js'],
  subscribers: [AuditSubscriber, SoftDeleteSubscriber],

  // typeorm-extension
  seeds: ['dist/src/database/seeds/**/*.js'],
  factories: ['dist/src/database/factories/**/*.js'],
};

export default new DataSource(dataSourceOptions);
