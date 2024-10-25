use anchor_lang::prelude::*;

#[derive(InitSpace)]
#[account]
pub struct UserInfo {
    pub balance: u64,
    pub bump: u8,
}
