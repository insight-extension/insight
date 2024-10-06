import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from 'src/account/account.service';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
  ) {}

  //async validateAccount(publicKey: string) {
  //  const account = await this.accountService.findOneByPublicKey(publicKey);
  //  if (!account) {
  //    return null;
  //  }
  //  return account;
  //}

  async verify(body: any) {
    const account = await this.accountService.validateSignature(body);
    if (!account) {
      throw new Error('Invalid signature');
    }
    Logger.log(`---account: ${JSON.stringify(account)}`);
    const accountExists = await this.accountService.findOneByPublicKey(
      account.publicKey,
    );
    if (!accountExists) {
      this.accountService.save(account);
    }
    return {
      access_token: this.generateAccessToken({ publicKey: account.publicKey }),
      refresh_token: this.generateRefreshToken({
        publicKey: account.publicKey,
      }),
    };
  }

  async login(data: any) {
    //const account = await this.accountService.findOneByPublicKey(
    //  data.publicKey,
    //);
    //if (!account) {
    //  throw new Error('Account not found');
    //}
    const { publicKey, nonce } =
      await this.accountService.generateNonceForPublicKey({
        publicKey: data.publicKey,
      });
    return {
      publicKey: publicKey,
      nonce: nonce,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });
      const account = await this.accountService.findOneByPublicKey(
        payload.publicKey,
      );
      if (!account) {
        throw new Error('Account not found');
      }

      const newPayload = { publicKey: payload.publicKey };

      return {
        access_token: this.generateAccessToken(newPayload),
        refresh_token: this.generateRefreshToken(newPayload),
      };
    } catch {
      throw new Error('Invalid refresh token');
    }
  }

  private generateAccessToken(payload: any) {
    return this.jwtService.sign(payload, {
      expiresIn: '2m',
    });
  }

  private generateRefreshToken(payload: any) {
    return this.jwtService.sign(payload, {
      expiresIn: '30d',
    });
  }
}
