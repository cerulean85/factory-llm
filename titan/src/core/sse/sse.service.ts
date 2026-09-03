import { Injectable, Logger } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class SseService {
  private readonly logger = new Logger(SseService.name);
  private clients: Map<string, { res: Response; ip: string }> = new Map();

  addClient(clientId: string, res: Response) {
    const ip = res.req?.socket?.remoteAddress || 'unknown';

    // 기존 연결이 있다면 정리
    const existingClient = this.clients.get(clientId);
    if (existingClient) {
      this.logger.debug(
        `Closing existing connection for client: ${clientId}, IP: ${existingClient.ip}`,
      );
      existingClient.res.end();
      this.clients.delete(clientId);
    }

    this.clients.set(clientId, { res, ip });

    this.logger.debug(`Client connected: ${clientId}, IP: ${ip}`);

    res.on('close', () => {
      this.clients.delete(clientId);
      this.logger.debug(`Client disconnected: ${clientId}, IP: ${ip}`);
      res.end();
    });
  }

  // 특정 클라이언트
  sendEventToClient(clientId: string, data: any) {
    const client = this.clients.get(clientId);
    if (client) {
      client.res.write(`data: ${JSON.stringify(data)}\n\n`);
      //this.logger.debug(`Sent event to client ${clientId} (IP: ${client.ip})`);
    } else {
      this.logger.warn(`Client ${clientId} not found`);
    }
  }

  sendEventToAll(eventName: string, data: any) {
    this.clients.forEach(({ res, ip }, clientId) => {
      res.write(`event: ${eventName}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
      //this.logger.debug(`Sent event "${eventName}" to client ${clientId} (IP: ${ip})`);
    });
  }
}
