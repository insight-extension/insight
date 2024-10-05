import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateAccountDto {
  @IsNotEmpty()
  @IsString()
  publicKey: string;

  @IsNotEmpty()
  @IsString()
  signature: string;
}
