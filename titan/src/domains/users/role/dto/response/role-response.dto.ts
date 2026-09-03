import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { ROLE_TYPE } from 'src/common/enum/users.enum';

export class RoleResponseDto {
  @ApiProperty({ description: '권한 ID', default: -1, type: Number })
  @Expose({ name: 'id' })
  roleId: number = -1;

  @ApiProperty({ description: '권한 유형', default: ROLE_TYPE.DEFAULT, enum: ROLE_TYPE })
  @Expose()
  type: ROLE_TYPE = ROLE_TYPE.DEFAULT;

  @ApiProperty({ description: '사용자 Seq ID', default: -1, type: Number })
  @Expose({ name: 'user_seq_id' })
  @Transform(({ obj }) => obj.users?.seq_id)
  userSeqId: number = -1;
 
  @ApiProperty({ description: '사용자 ID', default: '', type: String })
  @Expose({ name: 'user_id' })
  @Transform(({ obj }) => obj.users?.user_id)
  userId: string = "";

  @ApiProperty({ description: '사용자 이름', default: '', type: String })
  @Expose({ name: 'name' })
  @Transform(({ obj }) => obj.users?.name)
  userName: string = "";

  @ApiProperty({ description: '권한 생성 날짜', default: new Date(), type: Date })
  @Expose({ name: 'create_date' })
  createDate: Date = new Date();

  @ApiProperty({ description: '권한 수정 날짜', default: new Date(), type: Date })
  @Expose({ name: 'update_date' })
  //@Transform(({ value }) => value ? dayjs(new Date(value)).format('YYYY-MM-DD HH:mm:ss') : null)
  updateDate: Date = new Date();

}