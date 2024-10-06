import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({
    status: 201,
    description:
      'Generates a nonce for the given public key to proceed with the login flow.',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('login')
  async login(@Body(new ValidationPipe()) dto: LoginDto): Promise<Login> {
    return this.authService.login(dto);
  }

  @ApiResponse({
    status: 201,
    description:
      'Verifies the provided signature and returns access and refresh tokens. If the account does not exist, it will be created.',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('verify')
  async verify(@Body(new ValidationPipe()) dto: VerifyDto): Promise<Verify> {
    return this.authService.verify(dto);
  }

  @ApiResponse({
    status: 201,
    description:
      'Generates a new access and refresh token for the given public key.',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('refresh-token')
  async refreshToken(
    @Body(new ValidationPipe()) dto: RefreshTokenDto,
  ): Promise<Verify> {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @ApiResponse({
    status: 200,
    description: 'Test endpoint. Returns foo. Requires authentication.',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get('foo')
  async foo() {
    return 'foo';
  }
}
