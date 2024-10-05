import { IsNotEmpty, IsString } from 'class-validator';

export class AccountDto {
  @IsString()
  @IsNotEmpty()
  publicKey: string;
}
