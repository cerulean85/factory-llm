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


/// API 리턴에 대한 것을 관리해주는 데코레이터 (Swagger, Exception Filtering)
/// @param responseDto - response model
/// @param requestDto - query model
/// @param summary - summary
/// @param description - description
/// @param queryDto - query model (optional)
/// @param paramDto - param model (optional)
export function ApiReturn<
  TModel extends Type<any>,
  // TQuery extends Type<any> = any,
  // TParam extends Type<any> = any,
  >(
  responseDto: TModel,
  summary: string,
  summary_description: string,
  param_description: string,
  isArray: boolean = false,
  //queryDto?: TQuery,
  //paramDto?: TParam,
) {
  const decorators = [
    ApiOperation({ summary, description: summary_description }),
    ApiExtraModels(ApiResponseFormat, responseDto),
    ReturnDto(responseDto),
    ApiOkResponse({
      description: param_description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseFormat) },
          {
            properties: {
              data: isArray
                ? { type: 'array', items: { $ref: getSchemaPath(responseDto) } }
                : { $ref: getSchemaPath(responseDto) },
            },
          },
        ],
      },
    })
  ]
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