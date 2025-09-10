import { CoreModule } from '@libs/core/core.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [CoreModule],
  providers: [],
})
export class SharedModule {}
