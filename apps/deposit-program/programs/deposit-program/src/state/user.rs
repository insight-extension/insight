use anchor_lang::prelude::*;

#[derive(InitSpace)]
#[account]
pub struct UserInfo {
    pub available_balance: u64,
    //pub subscription_level: u8,
    pub expiration: i64,
    pub bump: u8,
}
