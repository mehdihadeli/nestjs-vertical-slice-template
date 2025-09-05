import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import {
  HealthCheckService,
  MemoryHealthIndicator,
  MicroserviceHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

/** The HealthController class checks the health of various components including the database, memory,
 and disk. */
@Controller({ path: 'health', version: VERSION_NEUTRAL })
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  async check(): Promise<any> {
    return this.health.check([
      //() => this.db.pingCheck('database', { timeout: 300 }),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () =>
        this.microservice.pingCheck('food-service', {
          transport: Transport.TCP,
          options: { host: '127.0.0.1', port: 4000 },
        }),
    ]);
  }
}
