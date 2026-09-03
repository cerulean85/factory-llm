import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class GrpcCoreService implements OnModuleInit {
  private grpcClients: Record<string, any> = {}; // 여러 proto 서비스 저장
  private eventSubjects: Record<string, Subject<any>> = {}; // 서비스별 Subject 관리

  constructor(@Inject('GRPC_CLIENT') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.grpcClients['GrpcCore'] = this.client.getService<any>('GrpcCore');
    //this.grpcClients['AnotherGrpcService'] = this.client.getService<any>('AnotherGrpcService');
  }

  // grpc 메서드 호출
  callMethod<T, R>(serviceName: string, methodName: string, payload: T): Observable<R> {
    const grpcService = this.grpcClients[serviceName];
    if (!grpcService || !grpcService[methodName]) {
      throw new Error(`Method ${methodName} not found in service ${serviceName}`);
    }
    return grpcService[methodName](payload);
  }

  // 스트리밍 핸들러
  subscribeToStreamWithHandler(
    serviceName: string,
    methodName: string,
    payload: any,
    handler: (event: any) => void
  ) {
    this.subscribeToStream(serviceName, methodName, payload);
  
    this.getEventStream(serviceName).subscribe({
      next: handler,
      error: (err) => {
        console.error(`Error in gRPC Event Stream for ${serviceName}:`, err);
      },
    });
  }

  
  // grpc 스트리밍 
  private subscribeToStream(serviceName: string, methodName: string, payload: any, retryCount : number = 0, maxRetries : number = 0) {
    const grpcService = this.grpcClients[serviceName];
    if (!grpcService || !grpcService[methodName]) {
      console.error(`gRPC Subscribe method ${methodName} is not available in ${serviceName}.`);
      return;
    }
  
    if (!this.eventSubjects[serviceName]) {
      this.eventSubjects[serviceName] = new Subject<any>();
    }
  
    //console.log(`Attempting to subscribe to ${serviceName}.${methodName}`);
  
    grpcService[methodName](payload).subscribe({
      next: (event) => {
        if ( retryCount > 0){
          console.log(`Successfully reconnected to ${serviceName}.${methodName}`);
          retryCount = 0;
        }
        //console.log(`Received gRPC Event from ${serviceName}:`, event);
        this.eventSubjects[serviceName].next(event);
      },
      error: (err) => {
        if (err.code === 14) {
          if(retryCount === 0){
            console.error(`(${serviceName}) gRPC Server Unavailable: ${err.message}`);
          }

          if (retryCount < maxRetries || maxRetries === 0) {
            const delay = Math.min(1000 * (retryCount + 1), 10000); // 지수 백오프 (최대 10초)
            setTimeout(() => {
              this.subscribeToStream(serviceName, methodName, payload, retryCount + 1, maxRetries);
            }, delay);
          } else {
            console.error(`Max retries reached. Failed to connect to ${serviceName}.${methodName}`);
          }
        } else {
          console.error(`gRPC Subscription Error in ${serviceName}:`, err);
        }
      },
    });
  }

  // 특정 gRPC 서비스의 이벤트 스트림 반환
  private getEventStream(serviceName: string): Observable<any> {
    if (!this.eventSubjects[serviceName]) {
      this.eventSubjects[serviceName] = new Subject<any>();
    }
    return this.eventSubjects[serviceName].asObservable();
  }
}