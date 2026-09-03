import { Expose } from "class-transformer";
import { IsInt, IsString, Length } from "class-validator";

export class CreateRefreshTokenDto {

  @Expose({ name: "refreshToken"})
  @IsString()
  refresh_token: string;

  @Expose({ name: "expiresDate" })
  expires_date: Date;

  @Expose({ name: "userSeqId" })
  @IsInt()
  user_seq_id: number;
}