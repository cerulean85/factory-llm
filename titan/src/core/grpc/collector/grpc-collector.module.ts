import { Module, forwardRef } from '@nestjs/common';
import { GrpcCollectorService } from './grpc-collector.service';
import { GrpcCoreModule } from '../foundation/grpc-core.module';
import { AlarmModule } from 'src/domains/alarm/alarm/alarm.module';
@Module({
  imports: [AlarmModule],
  providers: [GrpcCollectorService],
  exports: [GrpcCollectorService],
})
export class GrpcCollectorModule {}