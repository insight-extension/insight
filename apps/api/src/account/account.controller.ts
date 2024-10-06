import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { GetNonceDto } from './dto/get-nonce.dto';
import { ValidateSignatureDto } from './dto/validate-signature.dto';
import { SaveAccountDto } from './dto/save-account.dto';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  // get nonce for public key
  @Post('nonce')
  async getNonceForPublicKey(@Body(new ValidationPipe()) dto: GetNonceDto) {
    return await this.accountService.generateNonceForPublicKey(dto);
  }

  // validate signature
  @Post('validate')
  async validateSignature(
    @Body(new ValidationPipe()) dto: ValidateSignatureDto,
  ) {
    return await this.accountService.validateSignature(dto);
  }

  // save to database
  @Post()
  async save(@Body(new ValidationPipe()) dto: SaveAccountDto) {
    return await this.accountService.save(dto);
  }
}
