import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiParam,
  getSchemaPath,
} from '@nestjs/swagger';
import { ReturnDto } from './return-dto.decorator';
import { ApiResponseFormat } from '../dto/api-response.dto';
import { PaginationResponseDto } from '../dto/pagination-response.dto';


/// (페이지네이션) API 리턴에 대한 것을 관리해주는 데코레이터 (Swagger, Exception Filtering)
/// @param responseDto - response model
/// @param summary - summary
/// @param summary_description - description
/// @param param_description - param description
/// @param queryDto - query model (optional)
/// @param paramDto - param model (optional)
export function ApiPaginatedReturn<
  TModel extends Type<any>,
  // TQuery extends Type<any> = any,
  // TParam extends Type<any> = any,
>(
  responseDto: TModel,
  summary: string,
  summary_description: string,
  param_description: string,
  // queryDto?: TQuery,
  // paramDto?: TParam,
) {
  const decorators = [
    ApiOperation({ summary, description: summary_description }),
    ApiExtraModels(ApiResponseFormat, PaginationResponseDto, responseDto),
    ReturnDto(PaginationResponseDto<InstanceType<TModel>>),
    ApiOkResponse({
      description: param_description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseFormat) },
          {
            properties: {
              data: {
                allOf: [
                  { $ref: getSchemaPath(PaginationResponseDto) },
                  {
                    properties: {
                      data: {
                        type: 'array',
                        items: { $ref: getSchemaPath(responseDto) },
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    }),
  ];

  // // 조건적으로 ApiQuery 적용
  // if (queryDto) {
  //   decorators.push(ApiQuery({ type: queryDto }));
  // }

  // // 조건적으로 ApiParam 적용
  // if (paramDto) {
  //   decorators.push(ApiParam(paramDto));
  // }

  return applyDecorators(...decorators);
}