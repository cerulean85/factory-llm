import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './domains/users/users/users.module';
import { RoleModule } from './domains/users/role/role.module';
import { ConfigModule } from '@nestjs/config';
import { databaseOrmConfigAsync } from './config/database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EquipmentModule } from './domains/equipment/equipment/equipment.module';
import { EquipmentTypeModule } from './domains/equipment/equipment-type/equipment-type.module';
import { AlarmModule } from './domains/alarm/alarm/alarm.module';
import { AlarmHistoryModule } from './domains/alarm/history/alarm-history/alarm-history.module';
import { AlarmUserRelationModule } from './domains/alarm/alarm-user-relation/alarm-user-relation.module';
import { NotiModule } from './domains/noti/noti.module';
import { PalletModule } from './domains/storage/pallet/pallet.module';
import { RemoteModule } from './domains/setting/remote/remote.module';
import { SystemModule } from './domains/setting/system/system.module';

import { SeederModule } from './seeds/seed.module';
import { SeedService } from './seeds/seed.service';

import { SseModule } from './core/sse/sse.module';
import { GrpcCollectorModule } from './core/grpc/collector/grpc-collector.module';

import { GrpcCoreModule } from './core/grpc/foundation/grpc-core.module';
import { grpcCoreConfig } from './config/grpc.config';

import { MailModule } from './core/mail/mail.module';
import { PgBackupModule } from './core/backup/postgres/pg-backup.module';

import { SmsModule } from './core/sms/sms.module';
import { AlarmQueueModule } from './collector-interface/queue/alarm-queue/alarm-queue.module';
import { ScheduleModule } from '@nestjs/schedule';
import { JobQueueModule } from './collector-interface/queue/job-queue/job-queue.module';
import { WarehouseModule } from './domains/storage/warehouse/warehouse.module';
import { CraneCellModule } from './domains/__archived__/crane-cell/crane-cell.module';
import { GantryCellModule } from './domains/__archived__/gantry-cell/gantry-cell.module';
import { ShippingSpecificationModule } from './domains/storage/shipping-specification/shipping-specification.module';
import { TodoModule } from './domains/todo/todo.module';
import { EquipmentOperationHistoryModule } from './domains/equipment/equipment-operation-history/equipmen-operation-history.module';
import { MessageDispatchHistoryModule } from './domains/alarm/history/message-dispatch-history/message-dispatch-history.module';
import { AddressLoggerMiddleware } from './common/middleware/address-logger.middleware';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { DEBUG_MIDDLEWARE } from './config/debug.config';
import { DashBoardModule } from './domains/composites/dash-board/dash-board.module';
import { StoredItemModule } from './domains/__archived__/item/stored_item/stored-item.module';
import { DockViewModule } from './collector-interface/view/dock-view/dock-view.module';
import { EquipmentOperationMaintenanceModule } from './domains/__archived__/equipment-operation-maintenance/equipment-operation-maintenance.module';
import { AlarmMessageDispatchModule } from './domains/alarm/alarm-message-dispatch/alarm-message-dispatch.module';
import { RealtimeEquipmentViewModule } from './collector-interface/view/realtime-equipment-view/realtime-equipment-view.module';
import { RealtimeWarehouseViewModule } from './domains/__archived__/realtime-warehouse-view/realtime-warehouse-view.module';
import { JobHistoryModule } from './domains/storage/job-history/job-history.module';
import { LoginHistoryModule } from './domains/users/login-history/login-history.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot(), // 환경 변수 관리
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync(databaseOrmConfigAsync),
    GrpcCoreModule.forRoot(
      grpcCoreConfig.protoPath,
      grpcCoreConfig.pkg,
      grpcCoreConfig.url,
    ),
    ScheduleModule.forRoot(),
    GrpcCollectorModule,
    SeederModule,
    UsersModule,
    RoleModule,
    EquipmentModule,
    EquipmentTypeModule,
    AlarmModule,
    AlarmUserRelationModule,
    NotiModule,
    PalletModule,
    RemoteModule,
    SystemModule,
    SseModule,
    SeederModule,
    MailModule,
    PgBackupModule,
    AlarmQueueModule,
    JobQueueModule,
    WarehouseModule,
    CraneCellModule,
    GantryCellModule,
    ShippingSpecificationModule,
    TodoModule,
    EquipmentOperationHistoryModule,
    //InventoryAlarmReleaseModule,
    SmsModule,
    MessageDispatchHistoryModule,
    DashBoardModule,
    StoredItemModule,
    AlarmHistoryModule,
    DockViewModule,
    EquipmentOperationMaintenanceModule,
    AlarmMessageDispatchModule,
    RealtimeEquipmentViewModule,
    RealtimeWarehouseViewModule,
    JobHistoryModule,
    LoginHistoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    //IndexCheckService
    //, ViewManagerService
  ],
})
export class AppModule implements OnModuleInit, NestModule {
  constructor(private readonly seedService: SeedService) {}

  async onModuleInit() {
    await this.seedService.runAllSeeders();
  }

  configure(consumer: MiddlewareConsumer) {
    if (DEBUG_MIDDLEWARE) {
      consumer.apply(AddressLoggerMiddleware).forRoutes('*'); // Address 호출내역을 Console에 남김
    }
  }
}
