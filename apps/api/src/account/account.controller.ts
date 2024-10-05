import { Body, Controller, Logger, Post, ValidationPipe } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountDto } from './dto/account.dto';
import { ValidateAccountDto } from './dto/validate-account.dto';
import { ValidateAccount } from './interfaces/validate-account.interface';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async create(
    @Body(new ValidationPipe()) dto: AccountDto,
  ): Promise<{ publicKey: string } | { error: string }> {
    try {
      Logger.log(`Create account: ${JSON.stringify(dto)}`, 'AccountController');
      return await this.accountService.create(dto);
    } catch (e) {
      Logger.error(e.message, 'AccountController');
      return {
        error: e.message,
      };
    }
  }

  //TODO: move to auth module
  @Post('validate')
  async validateAccount(
    @Body() dto: ValidateAccountDto,
  ): Promise<ValidateAccount> {
    return await this.accountService.validateAccount(dto);
  }
}
