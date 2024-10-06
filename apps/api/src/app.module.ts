import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // setup config
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AccountModule,
    AuthModule,
  ],
  providers: [],
})
export class AppModule {}
