import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { Client } from 'pg';

import { resetDatabase } from '../utils/respawner';

export class PostgresContainerFixture {
  private container: StartedPostgreSqlContainer | null = null;
  private readonly database = 'testdb';
  private readonly username = 'test_user';
  private readonly password = 'test_pass';
  private readonly image = 'postgres:latest';

  public async start(): Promise<void> {
    console.log('Starting PostgreSQL container with @testcontainers/postgresql...');

    this.container = await new PostgreSqlContainer(this.image)
      .withDatabase(this.database)
      .withUsername(this.username)
      .withPassword(this.password)
      .start();

    console.log(`PostgreSQL started on ${this.container.getHost()}:${this.container.getPort()}`);
  }

  public getConnectionString(): string {
    if (!this.container) {
      throw new Error('PostgreSQL container not started');
    }
    return this.container.getConnectionUri();
  }

  public async resetDb(): Promise<void> {
    const client = new Client({ connectionString: this.getConnectionString() });
    try {
      await client.connect();
      await resetDatabase(client);
    } finally {
      await client.end();
    }
  }

  public async stop(): Promise<void> {
    if (this.container) {
      console.log('Stopping PostgreSQL container...');
      await this.container.stop();
    }
  }

  public getContainer(): StartedPostgreSqlContainer {
    if (!this.container) {
      throw new Error('Container not started');
    }
    return this.container;
  }
}
