import { DynamicModule, Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GrpcCoreService } from './grpc-core.service';

@Global()
@Module({})
export class GrpcCoreModule {
  static forRoot(protoPath: string, pkg: string, url: string): DynamicModule {
    return {
      module: GrpcCoreModule,
      imports: [
        ClientsModule.register([
          {
            name: 'GRPC_CLIENT',
            transport: Transport.GRPC,
            options: { protoPath, package: pkg, url },
          },
        ]),
      ],
      providers: [GrpcCoreService],
      exports: [GrpcCoreService],
    };
  }
}