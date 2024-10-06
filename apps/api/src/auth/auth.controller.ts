import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { VerifyDto } from './dto/verify.dto';
import { Login } from './interfaces/login.interface';
import { Verify } from './interfaces/verify.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body(new ValidationPipe()) dto: LoginDto): Promise<Login> {
    return this.authService.login(dto);
  }

  @Post('verify')
  async verify(@Body() dto: VerifyDto): Promise<Verify> {
    return this.authService.verify(dto);
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: any): Promise<Verify> {
    return this.authService.refreshToken(body.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('foo')
  async foo() {
    return 'foo';
  }
}
