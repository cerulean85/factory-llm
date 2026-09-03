import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { CommonUserInfoDto } from 'src/common/dto/user-info.dto';
import { ALARM_HISTORY_TYPE } from 'src/common/enum/alarm.enum';
import { FileResponseDto } from 'src/core/file/dto/response/file-response.dto';

export class AlarmResponseDto {
  @ApiProperty({ description: '알람 ID', default: -1, type: Number })
  @Expose({ name: 'id' })
  alarmId: number = -1;

  @ApiProperty({ description: '알람 코드', default: '', type: String })
  @Expose({ name: 'code' })
  code: string = "";

  @ApiProperty({ description: '알람 유형', default: ALARM_HISTORY_TYPE.EQUIPMENT, enum: ALARM_HISTORY_TYPE })
  @Expose({ name: 'type'})
  type: ALARM_HISTORY_TYPE = ALARM_HISTORY_TYPE.EQUIPMENT;

  @ApiProperty({ description: '중요도', default: -1, type: Number })
  @Expose({ name: 'importance'})
  importance: number = -1;

  @ApiProperty({ description: '알람 설명', default: '', type: String })
  @Expose({ name: 'description'})
  description: string = "";

  @ApiProperty({ description: '발생일', default: '', type: Date })
  @Expose({ name: 'create_date' })
  createDate: Date = new Date();

  @ApiProperty({ description: '수정일', default: '', type: Date })
  @Expose({ name: 'update_date' })
  updateDate: Date = new Date();

  @ApiProperty({ description: '조치 방법', default: '', type: String })
  @Expose({ name: 'process_method' })
  processMethod: string = "";

  @ApiProperty({ description: '수정일', default: false, type: Boolean })
  @Expose({ name: 'send_enabled' })
  sendEnabled: boolean = false;

  @ApiProperty({ description: 'reset 조치 가능 여부', default: false, type: Boolean })
  @Expose({ name: 'reset_available' })
  resetAvailable: boolean = false;

  @ApiProperty({ description: '담당자 리스트', default: [], type: CommonUserInfoDto, isArray: true })
  @Expose({ name: 'user_list' })
  @Transform(({ obj }) =>
    obj.user_list?.map((user) => ({
      id: user.user_id,
      seqId: user.seq_id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phone_number,
    })),
  )
  userList: CommonUserInfoDto[];

  @ApiProperty({ description: '설비타입명', default: '', type: String })
  @Expose({ name: 'equipment_type' })
  @Transform(({ obj }) => obj.equipment_type?.name)
  equipmentTypeName: string = "";

  @ApiProperty({ description: '매뉴얼 파일 리스트', default: [], type: FileResponseDto, isArray: true })
  @Expose({ name: 'file_list' })
  @Transform(({ obj }) =>
    obj.file_list?.map((file) => ({
      id: file.id,
      createDate: file.create_date,
      name: file.name,
      path: file.path,
    })),
  )
  fileList: FileResponseDto[];
  

}
