import { Logger, Injectable, NotFoundException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { CreateUsersDto } from './dto/request/create-users.dto';

import { Users } from './entities/users.entity';
import * as crypto from "crypto";
import * as bcryptjs from "bcryptjs";

import { UpdateUsersDto } from './dto/request/update-users.dto';
import { TempPasswordDto } from './dto/request/temp-password.dto';
import { LoginReqDto } from './dto/request/login-users-req.dto';

import { randomInt } from 'crypto';

import { MailService } from 'src/core/mail/mail.service';
import { MailRequestDto } from 'src/core/mail/dto/mail-request.dto';

import { HASH_SALT, SECRET_KEY } from '../../../config/auth.config';
import { RefreshTokenService } from '../../../core/auth/refresh-token/refresh-token.service';

import { ResponseStatusDto } from 'src/common/dto/response-status.dto';
import { plainToInstance } from 'class-transformer';
import { UsersResponseDto } from './dto/response/users-response.dto';
import { FilteringUsersDto } from './dto/request/filtering-user.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { AlarmUserRelationService } from '../../alarm/alarm-user-relation/alarm-user-relation.service';
import { Transactional } from 'typeorm-transactional';
import { SendCodeDto } from './dto/request/send-code.dto';
import { AccessTokenResponseDto } from './dto/response/access-token-response.dto';
import { LoginResponseDto } from './dto/response/login-response.dto';
import { FindedUserIdResponseDto } from './dto/response/finded-user-id-response.dot';
import { SendCertifyEmailReqDto } from './dto/request/send-certify-email-req.dto';
import { FindUserIdReqDto } from './dto/request/find-user-id-req.dto';
import { RefreshTokenReqDto } from './dto/request/refresh-token-req.dto';
import { CursorFilteringUsersDto } from './dto/request/cursor-filtering-user.dto';
import { ORDER } from 'src/common/enum/db.enum';
import { UsersOrderKey } from './repositories/users.base.repository';
import * as jwt from 'jsonwebtoken';
import { DEBUG_JWT_ENABLED } from 'src/config/debug.config';
import { CreateLoginHistoryDto } from '../login-history/dto/request/create-login-history.dto';
import { LoginHistoryService } from '../login-history/login-history.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name)
  private verificationCodes = new Map<string, string>() // 이메일-코드 매핑
  constructor(
  private readonly usersRepository: UsersRepository, 
  private readonly mailService: MailService,
  private readonly refreshTokenService: RefreshTokenService,
  private readonly alarmUserRelationService: AlarmUserRelationService,
  private readonly loginHistoryService: LoginHistoryService
  ) {}

  // #region public
  //유저 생성
  async createUsers(createUsersDto: CreateUsersDto): Promise<Users> {
    const filterDto = new FilteringUsersDto();
    filterDto.userId = createUsersDto.user_id;
    const existing = await this.usersRepository.getFilteredOne({ filter: filterDto });
    if (existing) {
      this.logger.warn('The user already exists.');
      throw new ConflictException('The user already exists.'); // 409 Conflict
      }
    const newUser = await this.usersRepository.createUsers(createUsersDto);
    return newUser;
  };


  // Pagination 형식으로 모든 유저 찾기
  async findUsers(filteringUsersDto : FilteringUsersDto = new FilteringUsersDto()): Promise<PaginationResponseDto<Users>> {
    const filterDto = new FilteringUsersDto();
    Object.assign(filterDto, filteringUsersDto);
    filterDto.validRecord = true;
    const usersList = await this.usersRepository.getFilteredPaginatedList({ filter: filterDto, orderMap: { [UsersOrderKey.ID]: ORDER.DESC } });
    return usersList;
  };


  // 무한 스크롤 형식으로 전체 사용자 찾기
  async findUsersWithCursor(cursorFilteringUsersDto: CursorFilteringUsersDto = new CursorFilteringUsersDto()) {
    const filterDto = new CursorFilteringUsersDto();
    Object.assign(filterDto, cursorFilteringUsersDto);
    filterDto.validRecord = true;
    const result = await this.usersRepository.getFilteredCursorList(filterDto, ORDER.DESC);
    return result;
  };

  // Pagination 형식으로 모든 유저 찾기
  async findAllUserEntities(): Promise<Users[]> {
    const usersList = await this.usersRepository.getFilteredList();
    return usersList;
  };


  // 유저 email 혹은 phone_number에 해당하는 id 찾기
  async findUserId(dto: FindUserIdReqDto): Promise<FindedUserIdResponseDto> {
    const { emailOrPhoneNumber } = dto;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d{1,4}?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
    const filterDto = new FilteringUsersDto();

    if (emailRegex.test(emailOrPhoneNumber)) {
      filterDto.email = emailOrPhoneNumber;
    } else if (phoneRegex.test(emailOrPhoneNumber)) {
      filterDto.phoneNumber = emailOrPhoneNumber;
    } else {
      this.logger.warn(`Invalid information: ${emailOrPhoneNumber}`);
      throw new NotFoundException(`Invalid information: ${emailOrPhoneNumber}`);
    }
    const user = await this.usersRepository.getFilteredOne({ filter: filterDto });

    if (!user) {
      this.logger.warn(`User not found for ${emailOrPhoneNumber}`);
      throw new NotFoundException(`User not found for ${emailOrPhoneNumber}`);
    }
    const findedUserIdResponseDto = new FindedUserIdResponseDto();
    findedUserIdResponseDto.userId = user.user_id;
    return findedUserIdResponseDto;
  };

  // 로그인
  async login(loginDto: LoginReqDto, ip:string): Promise<LoginResponseDto> {
    const user = await this.validateServiceUser(loginDto);
    let [accessToken, refreshToken] = ["", ""];
    if (user.seq_id > 0) {
      const tokens = await this.generateTokens(user);
      [accessToken, refreshToken] = [tokens.accessToken, tokens.refreshToken];
    }
    const loginInfo = plainToInstance(LoginResponseDto, {
      userSeqId: user.seq_id,
      accessToken: accessToken,
      refreshToken: refreshToken
    });

    const createLoginHistoryDto = new CreateLoginHistoryDto();
    createLoginHistoryDto.try_ip = ip;
    createLoginHistoryDto.user_seq_id = user.seq_id;
    const result = await this.loginHistoryService.createLoginHistory(createLoginHistoryDto);
    if (!result) {
      this.logger.error(`Failed to create login history: ${createLoginHistoryDto}`)
    }

    return loginInfo;
  };

  // 차단 해제
  async unblockUsers(loginDto: LoginReqDto): Promise<ResponseStatusDto> {
    const user = await this.validateServiceUser(loginDto);
    const isSuccess = await this.usersRepository.blockUserBySeqId(user.seq_id, false);

    const responseStatusDto = new ResponseStatusDto();
    responseStatusDto.isSuccess = isSuccess;
    if (!isSuccess) {
      responseStatusDto.message = `Failed to unblock user: ${user.user_id}`;
      this.logger.warn(`Failed to unblock user: ${user.user_id}`);
      throw new NotFoundException(`Failed to unblock user: ${user.user_id}`);
    } else {
      responseStatusDto.message = `User unblocked successfully: ${user.user_id}`; 
    };

    return responseStatusDto;
  };
  
  // seq_id로 사용자 찾기
  async findUsersBySeqId(seqId: number): Promise<UsersResponseDto> {
    const filterDto = new FilteringUsersDto();
    filterDto.seqId = seqId;
    const user = await this.usersRepository.getFilteredOne({ filter: filterDto });
    const result = plainToInstance(UsersResponseDto, user, { excludeExtraneousValues: true });
    return result;
  }

  async findUsersEntityBySeqId(seqId: number): Promise<Users | null> {
    const filterDto = new FilteringUsersDto();
    filterDto.seqId = seqId;
    const user = await this.usersRepository.getFilteredOne({ filter: filterDto });
    return user;
  }

  async findUsersEntityByUserId(userId: string): Promise<Users | null> {
    const filterDto = new FilteringUsersDto();
    filterDto.userId = userId;
    const user = await this.usersRepository.getFilteredOne({ filter: filterDto });
    return user;
  }

  // SeqID 리스트로 유저 찾기
  async findUsersBySeqIdList(seqIds: number[] = []): Promise<Users[]> {
    if(seqIds.length <= 0) return [];
    const filterDto = new FilteringUsersDto();
    filterDto.seqIdList = seqIds;
    const users = await this.usersRepository.getFilteredList({ filter: filterDto });
    return users;
  };


  // UserID로 유저 찾기
  async findUserByUserId(userId: string): Promise<Users | null> {
    const filterDto = new FilteringUsersDto();
    filterDto.userId = userId;
    const user = await this.usersRepository.getFilteredOne({ filter: filterDto });
    if (!user) {
      this.logger.warn(`User not found: ${userId}`);
      throw new NotFoundException(`User not found: ${userId}`);      
    };
    return user;
  };

  // 유저 정보 수정
  async updateInfo(seqId: number, token: string, updateUsersDto : UpdateUsersDto): Promise<ResponseStatusDto> {
    if (DEBUG_JWT_ENABLED) {
      const decoded = jwt.verify(token, SECRET_KEY);
      if (decoded['seqId'] != seqId) {
        this.logger.warn('Do not have permission to edit.');
        throw new ForbiddenException('Do not have permission to edit.');
      };
    }
    //암호화
    if (updateUsersDto.password) {
      const hashedPassword = await bcryptjs.hash(updateUsersDto.password, 10); // 10은 saltRounds
      updateUsersDto.password = hashedPassword; // 암호화된 비밀번호로 대체
    };

    const updOk = await this.usersRepository.updateUsers(seqId, updateUsersDto);
    const responseStatusDto = new ResponseStatusDto();
    responseStatusDto.isSuccess = updOk;
    responseStatusDto.message = updOk ? 'User information updated successfully.' : 'Failed to update user information.';
    return responseStatusDto;
  };

  // 임시 비밀번호 발급
  async issueTempPassword(tempPasswordDto : TempPasswordDto): Promise<ResponseStatusDto> {
    const { userId, email } =  tempPasswordDto
    const filterDto = new FilteringUsersDto();
    filterDto.userId = userId;
    const user = await this.usersRepository.getFilteredOne({ filter: filterDto });
    if (!user) {
      this.logger.warn('User not found');
      throw new NotFoundException('User not found');
    };
    const tempPassword = await this.generateTempPassword();
    const hashedPassword = await bcryptjs.hash(tempPassword, HASH_SALT);
    const updateUsersDto = new UpdateUsersDto();
    updateUsersDto.password = hashedPassword;
    const updPwOk = await this.usersRepository.updateUsers(user.seq_id, updateUsersDto);
    if(!updPwOk) {
      this.logger.warn('Failed to update password');
      throw new NotFoundException(`users with ID ${user.seq_id} not found`);
    };

    const mailRequestDto = new MailRequestDto();
    mailRequestDto.to = email;
    mailRequestDto.subject = "This is a TITAN temporary password information email.";
    mailRequestDto.text = `Hello, this is an email about TITAN temporary password guidance. Your temporary password is ${tempPassword}. Please change your password after you log in.`
      
    const resMail = await this.mailService.sendMail(mailRequestDto);
    const resStatusDto = new ResponseStatusDto();
    resStatusDto.isSuccess = resMail.isSuccess;
    resStatusDto.message = resMail.isSuccess ? 'Temporary password sent successfully.' : 'Failed to send temporary password.';

    return resStatusDto;
  };

  // 유저 비활성화
  @Transactional()
  async softDeleteUser(seqId: number): Promise<ResponseStatusDto> {
    const result = await this.usersRepository.softDeleteUsersBySeqId(seqId);
    if(!result){
      this.logger.warn('Failed to delete');
      throw new NotFoundException(`users with ID ${seqId} not found`);
    };
      
    const resRelationDeleted = await this.alarmUserRelationService.deleteAlarmUserRelationByUserSeqId(seqId);
    const responseStatusDto = new ResponseStatusDto();
    responseStatusDto.isSuccess = resRelationDeleted.isSuccess;
    responseStatusDto.message = resRelationDeleted.isSuccess ? 'User deleted successfully.' : 'Failed to delete user.';
    return responseStatusDto;
  };

  async checkValidPassword(seqId: number, password: string) : Promise<ResponseStatusDto> {
    const filterDto = new FilteringUsersDto();
    filterDto.seqId = seqId;
    const user = await this.usersRepository.getFilteredOne({ filter: filterDto });
    if (!user) {
      this.logger.warn('User not found');
      throw new NotFoundException('User not found');
    };
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    const responseStatusDto = new ResponseStatusDto();
    responseStatusDto.isSuccess = isPasswordValid;
    responseStatusDto.message = isPasswordValid ? 'Password is valid.' : 'Password is invalid.';
    return responseStatusDto;
  };


  // 인증 번호 발송
  async sendVerificateCode(sendCertifyEmailDto: SendCertifyEmailReqDto): Promise<{code:string}> {
    const code = randomInt(100000, 999999).toString();
    
    const mailRequestDto = new MailRequestDto();
    mailRequestDto.to = sendCertifyEmailDto.email;
    mailRequestDto.subject = 'Verificate Email';
    mailRequestDto.text = `Enter The Verificate Code ${code}.`
    
    const resStatusDto = await this.mailService.sendMail(mailRequestDto);
    if(resStatusDto.isSuccess === false) {
      this.logger.warn(`Failed to send email: ${resStatusDto.message}`);
    } else {
      this.verificationCodes.set(sendCertifyEmailDto.email, code); // 이메일-코드 매핑 저장
    };
    // return resStatusDto;
    return {code};
  };

  // 인증 번호 확인
  async verificateCode(sendCodeDto : SendCodeDto): Promise<ResponseStatusDto> {
    const resStatusDto = new ResponseStatusDto();
    const result = await this.verifyCode(sendCodeDto);
    resStatusDto.isSuccess = result;
    resStatusDto.message = result ? 'Verification successful.' : 'Verification failed.';
    return resStatusDto;
  };

  // access token 재발급
  async refreshAccessToken(dto: RefreshTokenReqDto): Promise<AccessTokenResponseDto> {
    const { refreshToken } = dto;
    const accessTokenResponseDto = new AccessTokenResponseDto();
    accessTokenResponseDto.accessToken = await this.refreshTokenService.refreshAccessToken(refreshToken);
    return accessTokenResponseDto;
  };

  // refresh token 삭제
  async removeRefreshToken(dto: RefreshTokenReqDto): Promise<ResponseStatusDto> {
    const { refreshToken } = dto;
    const res = new ResponseStatusDto();
    res.isSuccess = await this.refreshTokenService.removeAuth(refreshToken);
    res.message = "Refresh token removed successfully.";
    return res;
  };

  // refresh/access token 발급
  async generateTokens(users : Users): Promise<{accessToken: string, refreshToken: string}> {
    const accessToken = await this.refreshTokenService.generateAccessToken(users);
    const refreshToken = await this.refreshTokenService.generateRefreshToken(users);
    return { accessToken, refreshToken };
  };

  // 사용자 차단
  async blockUsers(seqId: number): Promise<ResponseStatusDto> {
    const responseStatusDto = new ResponseStatusDto();
    const blockUserOk = await this.usersRepository.blockUserBySeqId(seqId, true);
    responseStatusDto.isSuccess = blockUserOk;
    responseStatusDto.message = blockUserOk ? 'User blocked successfully.' : 'Failed to block user.';
    return responseStatusDto;
  };
  // #endregion


  // #region private
  // 임시 비밀번호 생성
  private async generateTempPassword(length = 10): Promise<string> {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
  };

  // 로그인 시 아이디, 비밀번호 일치 여부 확인
  private async validateServiceUser(loginDto: LoginReqDto): Promise<Users> {
    const { userId, password } = loginDto
    const user = await this.findUserByUserId(userId);
    if (!user) {
      this.logger.warn('User not found.');
      // throw new NotFoundException('User not found.');
      return new Users();
    };
    if (!await bcryptjs.compare(password, user.password)) {
      this.logger.warn('The password is not valid.');
      // throw new UnauthorizedException('The password is not valid.');
      return new Users();
    };
    return user;
  };

  async verifyCode(sendCodeDto : SendCodeDto): Promise<boolean> {
    const { email, code } = sendCodeDto;
    const storedCode = this.verificationCodes.get(email);
    if (storedCode === code) {
      return this.verificationCodes.delete(email); // 인증 후 코드 삭제
    } else {
      this.logger.warn(`Verification code is wrong.`);
      throw new BadRequestException(`Verification code is wrong.`);
    };
  };
  
  // UserID로 유저 찾기
  async checkExistUserId(userId: string) {
    if (!userId) {
      throw new NotFoundException('User ID is required.');
    }
    const exist = await this.usersRepository.existByUserId(userId);
    const responseStatusDto = new ResponseStatusDto();
    if(exist){
      responseStatusDto.isSuccess = false;
      responseStatusDto.message = "User ID already exists.";
    } else {
      responseStatusDto.isSuccess = true;
      responseStatusDto.message = "User ID is available.";
    };
    return responseStatusDto;
  };
};
  // #endregion