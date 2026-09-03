import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CommonUserInfoDto } from 'src/common/dto/user-info.dto';
import { FileResponseDto } from 'src/core/file/dto/response/file-response.dto';

export class EquipmentAlarmHistoryResponseDto {
  @ApiProperty({ description: '설비 알람 내역 번호', default: -1, type: Number })
  @Expose()
  @Transform(({ obj }) => obj.id)
  equipmentAlarmHistoryId: number = -1;

  @ApiProperty({ description: '알람코드 번호', default: -1, type: Number })
  @Expose()
  @Transform(({ obj }) => obj.alarm?.id)
  alarmId: number = -1;

  @ApiProperty({ description: '알람코드', default: '', type: String })
  @Expose()
  @Transform(({ obj }) => obj.alarm?.code)
  alarmCode: string = "";

  @ApiProperty({ description: '조치방법', default: '', type: String })
  @Expose()
  @Transform(({ obj }) => obj.alarm?.process_method)
  alarmProcessMethod: string = "";

  @ApiProperty({ description: '알람중요도', default: '', type: Number })
  @Expose()
  @Transform(({ obj }) => obj.alarm?.importance)
  alarmImportance: number = 0;

  @ApiProperty({ description: '알람설명', default: '', type: String })
  @Expose()
  @Transform(({ obj }) => obj.alarm?.description)
  alarmDescription: string = "";

  @ApiProperty({ description: '설비명', default: '', type: String })
  @Expose({ name: 'equipment_name' })
  equipmentName: string = '';

  @ApiProperty({ description: '설비코드', default: '', type: String })
  @Expose({ name: 'equipment_code' })
  equipmentCode: string = '';

  @ApiProperty({ description: '설비유형명', default: '', type: String })
  @Expose()
  @Transform(({ obj }) => obj.alarm?.equipment_type?.name)
  equipmentTypeName: string = "";

  @ApiProperty({ description: '설비유형ID', default: '', type: String })
  @Expose()
  @Transform(({ obj }) => obj.alarm?.equipment_type?.id)
  equipmentTypeId: number = -1;

  @ApiProperty({ description: '담당자 리스트', default: [], type: CommonUserInfoDto, isArray: true,
    example: [
      { id: 'user1', seqId: 1, name: '홍길동', phoneNumber: '010-1234-5678', email: 'hong@example.com'}]
  })
  @Expose()
  @Transform(({ obj }) =>
    obj.alarm?.manager_user_list?.map((user) => ({
      id: user.user_id,
      seqId: user.seq_id,
      name: user.name,
      phoneNumber: user.phone_number,
      email: user.email
    })),
  )
  managerUserList: CommonUserInfoDto[] = [];

  @ApiProperty({ description: '매뉴얼 파일 리스트', default: [], type: FileResponseDto, isArray: true })
  @Expose({ name: 'file_list' })
  @Transform(({ obj }) =>
    obj.alarm?.file_list?.map((file) => ({
      id: file.id,
      name: file.name,
      path: file.path,
    })),
  )
  fileList: FileResponseDto[] = [];
}