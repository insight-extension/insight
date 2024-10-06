import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

//TODO: types
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Request() req: any) {
    Logger.log(`req.body: ${JSON.stringify(req.body)}`);
    return this.authService.login(req.body);
  }

  @Post('verify')
  async verify(@Body() body: any) {
    return this.authService.verify(body);
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: any) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('foo')
  async foo() {
    return 'foo';
  }
}
