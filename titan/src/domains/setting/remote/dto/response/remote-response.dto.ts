import { Expose, Transform } from 'class-transformer';

export class RemoteResponseDto {
  @Expose()
  id: number = -1;

  @Expose({ name: 'create_date' })
  createDate: Date = new Date();

  @Expose({ name: 'update_date' })
  updateDate: Date = new Date();

  @Expose({ name: 'valid_record' })
  validRecord: boolean = false;

  @Expose()
  location: string = "";

  @Expose()
  ip: string = "";

  @Expose()
  port: number = -1;

  @Expose({ name: 'seq_id' })
  @Transform(({ obj }) => obj.users?.seq_id)
  seqId: number = -1;
}