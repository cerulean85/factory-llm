import { Controller, Post, Body, Get, Param, Query, ParseIntPipe, Patch, Delete, UseGuards, UseInterceptors, UploadedFiles, UploadedFile, Res, ParseArrayPipe, Put, BadRequestException } from '@nestjs/common';

import { AlarmResponseDto } from './dto/response/alarm-response.dto';
import { CreateAlarmDto } from './dto/request/create-alarm.dto';
import { AlarmService } from './alarm.service';
import { UpdateAlarmDto } from './dto/request/update-alarm.dto';
import { JwtServiceAuthGuard } from '../../../core/auth/jwt/jwt-service.guard';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';
import { Pagination } from 'src/utils/pagination.util';
import { FilteringAlarmDto } from './dto/request/filtering-alarm.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';
import { Multer } from 'multer';
import { Response } from 'express';
import { FILE_PATH } from 'src/config/config.config';
import { 
  ApiQuery,
  ApiOperation, 
  ApiParam,
  ApiBody} from '@nestjs/swagger';
import { ApiPaginatedReturn } from 'src/common/decorator/api-paginated-return.decorator';
import { ApiReturn } from 'src/common/decorator/api-return.decorator';
import { ApiFileDownload } from 'src/common/decorator/api-file-download.decorator';

import { UsersResponseDto } from '../../users/users/dto/response/users-response.dto';
import { CursorFilteringUsersDto } from '../../users/users/dto/request/cursor-filtering-user.dto';
import { UsersService } from '../../users/users/users.service';
import { Cursor } from 'src/utils/cursor.util';
import { DeleteAlarmDto } from './dto/request/delete-alarm.dto';
import { CheckAlarmDto } from './dto/request/check-alarm.dto';
import { CommonUserInfoDto } from 'src/common/dto/user-info.dto';
import { plainToInstance } from 'class-transformer';
import * as path from 'path';

@Controller('alarm')
export class AlarmController {
  constructor(
    private readonly alarmService: AlarmService,
    //private readonly usersService: UsersService,
  ) {}
  //#region GET
  //모든 알람 조회
  @Post('/get-alarm-code-list')
  @ApiBody({ type: FilteringAlarmDto })
  @ApiPaginatedReturn(AlarmResponseDto, "모든 알람 조회", "등록된 모든 알람 조회", "모든 알람" )
  @UseGuards(JwtServiceAuthGuard)
  async getAllAlarm(
    @Body() filteringAlarmDto : FilteringAlarmDto,
  ){
    const findResult = await this.alarmService.getAlarms(filteringAlarmDto);
    const result = Pagination.transformPaginatedData(AlarmResponseDto, filteringAlarmDto, findResult);
    return result;
  };

  // 모든 사용자 조회
  // @Get('/users')
  // @UseGuards(JwtServiceAuthGuard)
  // @ApiReturn(UsersResponseDto, "모든 사용자 조회", "등록된 모든 사용자 조회", "등록된 모든 사용자를 조회함")
  // async findAllUsers(@Query() cursorFilteringUsersDto : CursorFilteringUsersDto) {
  //   const findResult = await this.usersService.findUsersWithCursor(cursorFilteringUsersDto);
  //   const result = Cursor.transformCursorData(UsersResponseDto, cursorFilteringUsersDto, findResult);
  //   return result;
  // };

  //특정 알람 조회
  @Get('/:alarmId')
  @UseGuards(JwtServiceAuthGuard)
  @ApiParam({ name: 'alarmId', type: Number, description: '알람 ID' })
  @ApiReturn(AlarmResponseDto, "특정 알람 조회", "특정 알람 조회", "특정 알람" )
  async getAlarmCode(@Param('alarmId') alarmId: number) {
    const result = await this.alarmService.getAlarmById(alarmId);
    return result;
  };

  // 특정 알람 담당자 조회
  @Get('/:alarmId/users')
  @UseGuards(JwtServiceAuthGuard)
  @ApiParam({ name: 'alarmId', type: Number, description: '알람 ID' })
  @ApiReturn(CommonUserInfoDto, "특정 알람 담당자 조회", "특정 알람 담당자 조회", "특정 알람 담당자" )
  async getAlarmUsers(@Param('alarmId') alarmId: number): Promise<CommonUserInfoDto[]> {
    const result = await this.alarmService.getAlarmUsers(alarmId);
    return result;
  };
  
  // 매뉴얼 파일 다운로드
  @Get('/:alarmId/manual/:fileId')
  @UseGuards(JwtServiceAuthGuard)
  @ApiParam({ name: 'alarmId', type: Number, description: '알람 ID' })
  @ApiParam({ name: 'fileId', type: Number, description: '파일 ID' })
  @ApiFileDownload("메뉴얼 파일 다운로드")
  async getManualFile(@Param('alarmId') alarmId: number, @Param('fileId') fileId: number, @Res() res: Response) {
    const filePath = await this.alarmService.getManual(alarmId, fileId);

    // 파일 확장자에 따른 Content-Type 설정
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream'; // 기본값
    
    switch (ext) {
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
    }
    // 파일명 추출
    const fileName = path.basename(filePath);
    const originalName = fileName.substring(fileName.indexOf('-') + 1); // 타임스탬프 제거
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(originalName)}`);
    
    const result = res.sendFile(filePath);
    return result;
  };
  //#endregion

  //#region POST
  //알람 생성
  @Post()
  @UseGuards(JwtServiceAuthGuard)
  @ApiBody({ type: CreateAlarmDto })
  @ApiReturn(AlarmResponseDto, "알람 생성", "알람 생성", "생성된 알람" )
  async createAlarm(@Body() createAlarmDto: CreateAlarmDto) {
    const rawData = await this.alarmService.createAlarm(createAlarmDto);
    const result = plainToInstance(AlarmResponseDto, rawData, { excludeExtraneousValues: true });
    return result;
  };

  // 알람 CSV 업로드
  @Post('/upload-alarm-csv')
  @UseGuards(JwtServiceAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiReturn(ResponseStatusDto, "알람 CSV 업로드", "알람 CSV 업로드", "알람 CSV 업로드 결과" )
  async uploadAlarmCsv(@UploadedFile() file: Multer.File) {
    const result = await this.alarmService.uploadAlarmCsv(file);
    return result;
  };

  // 알람 CSV 다운로드
  @Post('/download-alarm-csv')
  @UseGuards(JwtServiceAuthGuard)
  @ApiFileDownload("알람 코드 CSV 파일 다운로드")
  async downloadAlarmCsv(@Res() res: Response) {
    const result = await this.alarmService.downloadAlarmCsv();

    const bom = '\uFEFF';
    const csvWithBom = bom + result;

    res.header('Content-Disposition', 'attachment; filename=alarmCodeList.csv');
    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.send(csvWithBom);
  };

  @Post('/check-code')
  @UseGuards(JwtServiceAuthGuard)
  @ApiBody({ type: CheckAlarmDto })
  @ApiReturn(ResponseStatusDto, "알람 이름 중복 조회", "알람 이름 중복 조회", "알람 이름 중복 조회" )
  async checkAlarmCode(@Body() dto: CheckAlarmDto) {
    const result = await this.alarmService.checkCode(dto.alarmCode, dto.equipmentTypeId);
    let resStatusDto = new ResponseStatusDto();
    resStatusDto.isSuccess = result;
    return resStatusDto;
  };
  //#endregion

  // #region PATCH

  //알람 업데이트
  @Put(':alarmId')
  @UseGuards(JwtServiceAuthGuard)
  @ApiParam({ name: 'alarmId', type: Number, description: "알람 ID" })
  @ApiBody({ type: UpdateAlarmDto })
  @ApiReturn(ResponseStatusDto, "알람 업데이트", "알람 업데이트", "알람 업데이트 결과" )
  async updateAlarmCode(@Param('alarmId', ParseIntPipe) alarmId: number, @Body() updateAlarmDto: UpdateAlarmDto) {
    const result = await this.alarmService.updateAlarm(alarmId, updateAlarmDto);
    return result;
  };

  // 매뉴얼 파일 업로드
  @Patch('/manual')
  @UseGuards(JwtServiceAuthGuard)
  @ApiParam({ name: 'alarmId', type: Number, description: '알람 ID' })
  @ApiReturn(Array, "매뉴얼 파일 업로드", "매뉴얼 파일 업로드", "매뉴얼 파일 업로드 결과" )
  @UseInterceptors(FilesInterceptor('file', 5,
    {
      storage: diskStorage({
        destination: FILE_PATH,
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const fixedFileName = Buffer.from(file.originalname, 'latin1').toString('utf8');
          const fileName = uniqueSuffix + '-' + fixedFileName;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        // 허용된 파일 확장자 목록
        const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg'];
        const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
        
        if (allowedExtensions.includes(fileExtension)) {
          cb(null, true);
        } else {
          cb(new BadRequestException(`Invalid Extension. Allowed Extensions: ${allowedExtensions.join(', ')}`), false);
        }
      },
    }
  ))
  async uploadManuals(@UploadedFiles() files: Multer.File[]) {
    const result = await this.alarmService.uploadFile(files);
    return result;
  };

  // 특정 알람 담당자 추가
  @Patch('/:alarmId/users')
  @UseGuards(JwtServiceAuthGuard)
  @ApiParam({ name: 'alarmId', type: Number, description: '알람 ID' })
  @ApiBody({ type: CommonUserInfoDto })
  @ApiReturn(ResponseStatusDto, "특정 알람 담당자 추가", "특정 알람 담당자 추가", "특정 알람 담당자 추가 결과" )
  async addAlarmUser(@Param('alarmId') alarmId: number, @Body() userDto: CommonUserInfoDto) {
    const result = await this.alarmService.addAlarmUser(alarmId, userDto.seqId);
    return result;
  };
  //#endregion
  
  // #region DELETE
  //알람 삭제 (여러개 삭제 가능하도록 수정)
  @Delete('/soft')
  @UseGuards(JwtServiceAuthGuard)
  @ApiBody({ type: DeleteAlarmDto })
  @ApiReturn(ResponseStatusDto, "알람 삭제", "알람 삭제", "알람 삭제 결과" )
  async softDeleteAlarmCode(@Body() dto: DeleteAlarmDto) {
    const intAlarmIdList = dto.alarmIdList.split(',').map(item => parseInt(item.trim()));
    const result = await this.alarmService.softDeleteAlarmById(intAlarmIdList);
    return result;
  };

  // 특정 알람 담당자 삭제
  @Delete("/:alarmId/users")
  @UseGuards(JwtServiceAuthGuard)
  @ApiParam({ name: 'alarmId', type: Number, description: '알람 ID' })
  @ApiBody({ type: CommonUserInfoDto })
  @ApiReturn(ResponseStatusDto, "특정 알람 담당자 삭제", "특정 알람 담당자 삭제", "특정 알람 담당자 삭제 결과" )
  async deleteAlarmUser(@Param('alarmId') alarmId: number, @Body() userDto: CommonUserInfoDto) {
    const result = await this.alarmService.deleteAlarmUser(alarmId, userDto.seqId);
    return result;
  };

  // 매뉴얼 파일 삭제
  @Delete('/:alarmId/manual/:fileId')
  @UseGuards(JwtServiceAuthGuard)
  @ApiParam({ name: 'alarmId', type: Number, description: '알람 ID' })
  @ApiParam({ name: 'fileId', type: Number, description: '파일 ID' })
  @ApiReturn(ResponseStatusDto, "매뉴얼 파일 삭제", "매뉴얼 파일 삭제", "매뉴얼 파일 삭제 결과" )
  async deleteManualFile(@Param('alarmId') alarmId: number, @Param('fileId') fileId: number) {
    const result = await this.alarmService.deleteManual(alarmId, fileId);
    return result;
  };
  // #endregion
};