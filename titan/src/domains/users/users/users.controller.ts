import { 
  Logger, Controller, Post, Body, 
  Get, Param, Query, Delete, 
  UseGuards, 
  Patch,
  Res,
  Req} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/request/create-users.dto';
import { UpdateUsersDto } from './dto/request/update-users.dto';
import { TempPasswordDto } from './dto/request/temp-password.dto';
import { UsersResponseDto } from './dto/response/users-response.dto';
import { JwtServiceAuthGuard } from '../../../core/auth/jwt/jwt-service.guard';
import { JwtRefreshGuard } from '../../../core/auth/jwt/jwt-refresh.guard';
import { LoginReqDto } from './dto/request/login-users-req.dto';
import { SendCodeDto } from './dto/request/send-code.dto';
import { Pagination } from 'src/utils/pagination.util';
import { FilteringUsersDto } from './dto/request/filtering-user.dto';
import { LoginResponseDto } from './dto/response/login-response.dto';
import { ApiTags, ApiParam, ApiQuery, ApiBody} from '@nestjs/swagger';
import { ApiPaginatedReturn } from 'src/common/decorator/api-paginated-return.decorator';
import { ApiReturn } from 'src/common/decorator/api-return.decorator';
import { ResponseStatusDto } from 'src/common/dto/response-status.dto';
import { AccessTokenResponseDto } from './dto/response/access-token-response.dto';
import { FindedUserIdResponseDto } from './dto/response/finded-user-id-response.dot';
import { SendCertifyEmailReqDto } from './dto/request/send-certify-email-req.dto';
import { FindUserIdReqDto } from './dto/request/find-user-id-req.dto';
import { RefreshTokenReqDto } from './dto/request/refresh-token-req.dto';
import { Response, Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { InitEndOfDay, InitStartOfDay } from 'src/utils/date-transform.util';

@ApiTags('사용자 API')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name)
  constructor(
  private readonly usersService: UsersService,
  ) {}

  @Get()
  @UseGuards(JwtServiceAuthGuard)
  @ApiPaginatedReturn(UsersResponseDto, "모든 사용자 조회", "등록된 모든 사용자 조회", "모든 사용자" )
  async findAllUsers(@Query() filteringUsersDto : FilteringUsersDto) {
    if (filteringUsersDto.startDate) {
      filteringUsersDto.startDate = InitStartOfDay(filteringUsersDto.startDate);
    }
    if (filteringUsersDto.endDate) {
      filteringUsersDto.endDate = InitEndOfDay(filteringUsersDto.endDate);
    }
    const userLists = await this.usersService.findUsers(filteringUsersDto);
    const result = Pagination.transformPaginatedData(UsersResponseDto, filteringUsersDto, userLists);
    return result;
  };

  @Get('/check')  
  @ApiQuery({ name: 'userId', type: String, description: '확인할 사용자 아이디' })  
  @ApiReturn(ResponseStatusDto
    , `사용자 아이디 확인 결과
      - true: 존재하지 않는 아이디(회원가입가능)
      - false: 존재하는 아이디(회원가입불가)`
    , '사용자 아이디 확인 결과'
    , '사용자 아이디 존재 여부')
  async checkUserId(@Query('userId') userId: string) {
    const result = await this.usersService.checkExistUserId(userId);
    return result;
  };

  @Get('/:seqId')
  @UseGuards(JwtServiceAuthGuard)
  @ApiParam({ name: 'seqId', type: Number, description: '조회할 사용자 번호' })  
  @ApiReturn(UsersResponseDto, '특정 사용자 조회', '요청된 사용자의 정보를 조회', '사용자 정보 반환')
  async findUserInfo(@Param('seqId') seqId: number){
    const result = await this.usersService.findUsersBySeqId(seqId);
    return result;
  };
  
  @Post('signup')
  @ApiBody({ type: CreateUsersDto })
  @ApiReturn(UsersResponseDto, '회원가입', '회원가입', '회원가입 성공 여부')
  async createUser(@Body() createUserDto: CreateUsersDto){
    const rawData = await this.usersService.createUsers(createUserDto);
    const result = plainToInstance(UsersResponseDto, rawData, { excludeExtraneousValues: true });
    return result;
  };

  @Post('login')
  @ApiBody({ type: LoginReqDto })
  @ApiReturn(LoginResponseDto, '로그인', '로그인', '사용자 정보 반환')
  async login(@Body() loginDto: LoginReqDto, @Res({ passthrough: true }) res: Response, @Req() req: Request) {
    // IP 주소 추출
    let ip =
      req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
      req.headers['x-real-ip']?.toString() ||
      req.ip ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress;

    // IPv6 loopback을 IPv4로 변환
    if (ip === '::1' || ip === '::ffff:127.0.0.1') {
      ip = '127.0.0.1';
    }

    // IPv6 형태에서 IPv4 추출 (::ffff:192.168.1.1 -> 192.168.1.1)
    if (ip && ip.startsWith('::ffff:')) {
      ip = ip.substring(7);
    }

    if (!ip) {
      ip = 'unknown';
    }
    
    const result = await this.usersService.login(loginDto, ip);
    res.setHeader('Authorization', `Bearer ${result.accessToken}`);
    res.setHeader('refreshToken', result.refreshToken);
    return result;
  };
  
  @Post('id')
  @ApiBody({ type: FindUserIdReqDto })
  @ApiReturn(FindedUserIdResponseDto, '아이디 찾기', '사용자 아이디 찾기', '사용자 아이디 정보 반환')
  async findUserId(@Body()  dto : FindUserIdReqDto ) {
    const result = await this.usersService.findUserId(dto);
    return result;
  };
  
  @Post('send-code')
  @ApiBody({ type: SendCertifyEmailReqDto })
  @ApiReturn(String, '이메일 인증 코드 발송', '이메일 인증 코드 발송', '이메일 인증 코드 발송 결과')
  async sendCode(@Body() sendCertifyEmailDto : SendCertifyEmailReqDto) {
    const result = await this.usersService.sendVerificateCode(sendCertifyEmailDto);
    return result;
  };

  @Post('confirm-code')
  @ApiBody({ type: SendCodeDto })
  @ApiReturn(ResponseStatusDto, '이메일 인증 코드 확인', '이메일 인증 코드 확인', '이메일 인증 코드 확인 결과')
  async confirmCode(@Body() sendCodeDto: SendCodeDto) {
    const result = await this.usersService.verificateCode(sendCodeDto);
    return result;
  };

  @Post('/:seqId/logout')
  @UseGuards(JwtServiceAuthGuard)
  @ApiParam({ name: 'seqId', type: Number, description: '조회할 사용자 번호' })  
  @ApiReturn(ResponseStatusDto, '로그아웃', '로그아웃', '로그아웃 성공 여부')
  async logout(@Body() dto: RefreshTokenReqDto) {
    const result = await this.usersService.removeRefreshToken(dto);
    return result;
  };

  // 비밀번호 확인
  @Post('/:seqId/validate-password')
  @UseGuards(JwtServiceAuthGuard)
  @ApiParam({ name: 'seqId', type: Number, description: '비밀번호를 확인할 사용자 번호' })
  @ApiBody({ type: String })
  @ApiReturn(ResponseStatusDto, '비밀번호 확인', '비밀번호 확인', '비밀번호 확인 결과')
  async validatePassword(@Param('seqId') seqId: number, @Body() {password}) {
    const result = await this.usersService.checkValidPassword(seqId, password);
    return result;
  };

  @Patch('unblock')
  @ApiBody({ type: LoginReqDto })
  @ApiReturn(ResponseStatusDto, '사용자 차단 해제', '사용자 차단 해제', '사용자 차단 해제 결과')
  async unblock(@Body() loginDto: LoginReqDto) {
    const result = await this.usersService.unblockUsers(loginDto);
    return result;
  };

  @Patch('/:seqId/info')
  @UseGuards(JwtServiceAuthGuard)
  @ApiParam({ name: 'seqId', type: Number, description: '회원정보를 업데이트할 사용자 번호' })  
  @ApiBody({ type: UpdateUsersDto })
  @ApiReturn(ResponseStatusDto, '(비밀번호 제외한) 회원정보 업데이트', '(비밀번호 제외한) 회회원정보 업데이트', '회원정보 업데이트 결과')
  async updateUser(@Param('seqId') seqId: number,
    @Body() updateUsersDto: UpdateUsersDto,
    @Req() req: Request) {
      const token = req.headers['authorization']?.split(' ')[1] ?? '';
    const result = await this.usersService.updateInfo(seqId, token, updateUsersDto);
    return result;
  };

  // // 회원정보 업데이트와 동일한 기능 인 듯. 추후 리펙토링 필요
  // @Patch('/:seqId/update-password')
  // @UseGuards(JwtServiceAuthGuard)
  // @ApiParam({ name: 'seqId', type: Number, description: '비밀번호를 업데이트할 사용자 번호' })
  // @ApiBody({ type: UpdateUsersDto })
  // @ApiReturn(ResponseStatusDto, '비밀번호 업데이트', '비밀번호 업데이트', '비밀번호 업데이트 결과')
  // async updatePassword(@Param('seqId') seqId: number, @Body() updateUsersDto: UpdateUsersDto) {
  //   const result = await this.usersService.updateInfo(seqId, updateUsersDto);
  //   return result;
  // };

  // Access Token 재발급
  @Patch('/:seqId/refresh')
  // @UseGuards(JwtRefreshGuard)
  @ApiParam({ name: 'seqId', type: Number, description: '조회할 사용자 번호' })  
  @ApiReturn(AccessTokenResponseDto, 'Access Token 재발급', 'Access Token 재발급', '사용자 정보 반환')
  async getRefresh(@Body() dto: RefreshTokenReqDto) {
    const accessToken = await this.usersService.refreshAccessToken(dto);
    return accessToken; 
  };

  // 임시 비밀번호 발급
  @Patch('temp-password')
  @ApiBody({ type: TempPasswordDto })
  @ApiReturn(ResponseStatusDto, '임시 비밀번호 발급', '임시 비밀번호 발급', '임시 비밀번호 발급 결과')
  async issueTempPassword(@Body() tempPasswordDto : TempPasswordDto){
    const result = await this.usersService.issueTempPassword(tempPasswordDto);
    return result;
  };

  // 유저 차단
  @Patch('/:seqId/block')
  @UseGuards(JwtServiceAuthGuard)
  @ApiParam({ name: 'seqId', type: Number, description: '차단할 사용자 번호' })  
  @ApiReturn(ResponseStatusDto, '사용자 차단', '사용자 차단', '사용자 차단 결과')
  async blockUser(@Param('seqId') seqId: number){
    const result = await this.usersService.blockUsers(seqId);
    return result;
  };

  // 유저 차단 (비활성화)
  @Delete('/:seqId/soft')
  @UseGuards(JwtServiceAuthGuard)
  @ApiParam({ name: 'seqId', type: Number, description: '비활성화할 사용자 번호' })  
  @ApiReturn(ResponseStatusDto, '사용자 비활성화', '사용자 비활성화', '사용자 비활성화 결과')
  async deleteUser(@Param('seqId') seqId: number) {
    const result = await this.usersService.softDeleteUser(seqId);
    return result;
  };
}