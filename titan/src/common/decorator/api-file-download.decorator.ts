import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

export function ApiFileDownload(summary: string, description?: string) {
  return applyDecorators(
    ApiOperation({ summary, description }),
    ApiResponse({
      status: 200,
      description: description || '파일 다운로드',
      content: {
        'application/octet-stream': {
          schema: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })
  );
}