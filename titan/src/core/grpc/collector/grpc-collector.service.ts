import { Injectable, OnModuleInit, Inject, forwardRef } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { GrpcCoreService } from 'src/core/grpc/foundation/grpc-core.service';
import { AlarmService } from 'src/domains/alarm/alarm/alarm.service';
import { DEBUG_GRPC_STREAMING_ENABLED } from 'src/config/debug.config';
@Injectable()
export class GrpcCollectorService  implements OnModuleInit  {
  private clientId: string;
  
  constructor(
    private readonly alarmService: AlarmService,
    private readonly grpcCoreService: GrpcCoreService,

  ){
    this.clientId = uuidv4();
  }
  
  onModuleInit() {
    console.log('AlarmService: gRPC Subscribe');
    this.subscribeToGrpcEvents();
  }

  private subscribeToGrpcEvents() {
    if (DEBUG_GRPC_STREAMING_ENABLED) {
      this.grpcCoreService.subscribeToStreamWithHandler(
        'GrpcCore',
        'OPCUASubscribe',
        { ClientId: this.clientId },
        (event) => this.handleGrpcEvent(event),
      );
    }
  }

  private handleGrpcEvent(event: any) {
    if(this.alarmService){
      this.alarmService.processAlarmEvent(event)
    }
  }

}