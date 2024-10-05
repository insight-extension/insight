import { sign } from 'tweetnacl';
import bs58 from 'bs58';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { AccountDto } from './dto/account.dto';
import { AccountEntity } from './entity/account.entity';
import { ValidateAccountDto } from './dto/validate-account.dto';
import { ValidateAccount } from './interfaces/validate-account.interface';

class AccountWithNonceEntity {
  publicKey: string;
  nonce: string;
}

@Injectable()
export class AccountService {
  //TODO: migrate to database
  private readonly accounts: AccountEntity[] = [];
  // cache for account with nonce
  private readonly accountsWithNonce: AccountWithNonceEntity[] = [];

  async create(dto: AccountDto) {
    const existingAccount = this.checkAccountWithPublicKey(dto.publicKey);
    if (existingAccount && existingAccount.verified) {
      throw new BadRequestException(
        `User with public key ${dto.publicKey} already exists and verified`,
      );
    } else if (existingAccount && !existingAccount.verified) {
      const nonce = this.generateNonce();
      this.accountsWithNonce.push({
        publicKey: existingAccount.publicKey,
        nonce: nonce,
      });
      return {
        publicKey: existingAccount.publicKey,
        nonce: nonce,
      };
    }

    const newAccountWithNonce = new AccountWithNonceEntity();
    newAccountWithNonce.publicKey = dto.publicKey;
    newAccountWithNonce.nonce = this.generateNonce();

    this.accountsWithNonce.push(newAccountWithNonce);

    return {
      publicKey: newAccountWithNonce.publicKey,
      nonce: newAccountWithNonce.nonce,
    };
  }

  async validateAccount(dto: ValidateAccountDto): Promise<ValidateAccount> {
    Logger.log(
      `Validate account: ${dto.publicKey}, ${dto.signature}`,
      'AccountService',
    );
    const accountWithNonce = this.accountsWithNonce.find(
      (a) => a.publicKey === dto.publicKey,
    );

    if (!accountWithNonce) {
      throw new BadRequestException(
        'Account with provided public key not found',
      );
    }

    const publicKeyUint8 = bs58.decode(dto.publicKey);
    Logger.log(typeof publicKeyUint8, 'AccountService');
    const signatureUint8 = bs58.decode(dto.signature);
    Logger.log(typeof signatureUint8, 'AccountService');

    const msgUint8 = new TextEncoder().encode(accountWithNonce.nonce);
    Logger.log(typeof msgUint8, 'AccountService');

    const isValid = sign.detached.verify(
      msgUint8,
      signatureUint8,
      publicKeyUint8,
    );
    Logger.log(isValid, 'AccountService');

    if (!isValid) {
      throw new BadRequestException('Invalid signature');
    }

    let account = this.checkAccountWithPublicKey(dto.publicKey);
    if (!account) {
      account = new AccountEntity();
      account.publicKey = dto.publicKey;
      account.verified = true;
      this.accounts.push(account);
    } else {
      account.verified = true;
    }

    const index = this.accountsWithNonce.findIndex(
      (a) => a.publicKey === dto.publicKey,
    );
    if (index !== -1) {
      this.accountsWithNonce.splice(index, 1);
    }

    return { publicKey: account.publicKey, verified: account.verified };
  }

  private checkAccountWithPublicKey(publicKey: string): AccountEntity {
    return this.accounts.find((u) => u.publicKey === publicKey);
  }

  private generateNonce(): string {
    const payload = randomBytes(32).toString('hex');
    return `insight: ${payload}`;
  }
}
