import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import Api from 'twilio/lib/rest/Api';
import { CommonUserInfoDto } from 'src/common/dto/user-info.dto';
import { ALARM_HISTORY_TYPE } from 'src/common/enum/alarm.enum';
import { IsEnum } from 'class-validator';

export class AlarmHistoryBaseResponseDto {
  @ApiProperty({ description: '알람 내역 번호', default: -1, type: Number })
  @Expose({ name: 'id' })
  alarmHistoryId: number = -1;
  
  @ApiProperty({ description: '알람 내역 생성일자', default: new Date(), type: Date })
  @Expose({ name: 'create_date' })
  createDate: Date = new Date();

  @ApiProperty({ description: '알람 내역 변경일자', default: new Date(), type: Date })
  @Expose({ name: 'update_date' })
  updateDate: Date = new Date();
  
  @ApiProperty({ description: '알람 내역 처리일자', default: new Date(), type: Date })
  @Expose({ name: 'process_date' })
  processDate: Date = new Date();

  @ApiProperty({ description: '메시지', default: '', type: String })
  @Expose({ name: 'message'})
  message: string = "";

  @ApiProperty({ description: '처리 메시지', default: '', type: String })
  @Expose({ name: 'process_message'})
  processMessage: string = "";

  @ApiProperty({ description: '알람 타입', default: ALARM_HISTORY_TYPE.EQUIPMENT, enum: ALARM_HISTORY_TYPE })
  @Expose({ name: 'type'})
  type: ALARM_HISTORY_TYPE = ALARM_HISTORY_TYPE.EQUIPMENT;

  @ApiProperty({ description: '조치자 리스트', default: [], type: CommonUserInfoDto, isArray: true,
    example: [
      { id: 'user1', seqId: 1, name: '홍길동', phoneNumber: '010-1234-5678', email: 'hong@example.com'}]
  })
  @Expose({ name: 'process_user_list' })
  @Transform(({ obj }) =>
    obj.process_user_list?.map((user) => ({
      id: user.user_id,
      seqId: user.seq_id,
      name: user.name,
      phoneNumber: user.phone_number,
      email: user.email
    })),
  )
  processUserList: CommonUserInfoDto[] = [];
}