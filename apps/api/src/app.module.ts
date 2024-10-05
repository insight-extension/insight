import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // setup config
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AccountModule,
  ],
  providers: [],
})
export class AppModule {}
