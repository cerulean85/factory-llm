import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { SseService } from './sse.service';

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Get('events')
  sendEvents(@Query('clientId') clientId: string, @Res() res: Response) {
    if (!clientId) {
      res.status(400).send('clientId is required');
      return;
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    this.sseService.addClient(clientId, res);
  }
}
// import { Controller, Sse, Get, Query, Res } from '@nestjs/common';
// import { Response } from 'express';
// import { SseService } from './sse.service';

// import { Observable, interval } from 'rxjs';
// import { map } from 'rxjs/operators';

// // @Controller('sse')
// @Controller('events')
// export class SseController {
//   // constructor(private readonly sseService: SseService) {}

//   // @Get('events')
//   // sendEvents(@Query('clientId') clientId: string, @Res() res: Response) {
//   //   if (!clientId) {
//   //     res.status(400).send('clientId is required');
//   //     return;
//   //   }

//   //   res.setHeader('Content-Type', 'text/event-stream');
//   //   res.setHeader('Cache-Control', 'no-cache');
//   //   res.setHeader('Connection', 'keep-alive');

//   //   this.sseService.addClient(clientId, res);
//   // }

//   @Sse('sse') // SSE 엔드포인트
//   sendEvent(): Observable<MessageEvent> {
//     return interval(1000).pipe(
//       map((count) => ({
//         data: `This is message number ${count}`,
//       })),
//     );
//   }
// }


// import { Controller, Sse } from '@nestjs/common';
// import { Observable, interval } from 'rxjs';
// import { map } from 'rxjs/operators';

// @Controller('events')
// export class SseController {
//   @Sse('sse') // SSE 엔드포인트
//   sendEvent(): Observable<MessageEvent> {
//     return interval(5000).pipe(
//       map((count) => {
//         const event: MessageEvent = new MessageEvent('message', {
//           data: {
//             message: `This is message number ${count}`,
//             count: count,
//           },
//         });
//         return event;
//       }),
//     );
//   }
// }


// import { Controller, Get, Res } from '@nestjs/common';
// import { Observable, interval } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { Response } from 'express';
// import { Client } from 'pg';
// import { databaseConfig } from 'src/config/database.config';


// @Controller('events')
// export class SseController {
//   @Get('sse') // SSE 엔드포인트
//   sendEvent(@Res() res: Response): void {

//     // const { Client } = require('pg');

//     // PostgreSQL 연결 설정
//     const client = new Client(databaseConfig);    
//     client.connect();
    
//     res.set({
//       'Content-Type': 'text/event-stream',
//       'Cache-Control': 'no-cache',
//       'Connection': 'keep-alive',
//     });

//     const intervalId = setInterval(() => {
//       const count = Math.floor(Math.random() * 100); // 임의의 카운트 값 생성
//       const event = {
//         data: JSON.stringify({
//           message: `This is message number ${count}`,
//           count: count,
//         }),
//       };

//       res.write(`data: ${event.data}\n\n`); // 클라이언트로 데이터 전송

//       // 일정 시간 후 연결 종료를 위해 설정할 수 있습니다.
//       if (count >= 10) {
//         clearInterval(intervalId); // 10번 후 서버 종료
//         res.end(); // 연결 종료
//       }
//     },10000); // 5초마다 메시지 전송

//     // 클라이언트가 연결을 끊으면 interval을 종료
//     res.on('close', () => {
//       clearInterval(intervalId);
//       res.end();
//     });
//   }
// }
