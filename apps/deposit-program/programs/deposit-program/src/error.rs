use anchor_lang::prelude::*;

#[error_code]
pub enum SubscribeErrorCode {
    #[msg("Insufficient balance")]
    InsufficientBalance,
    #[msg("Unauthorized Withdrawal")]
    UnauthorizedWithdrawal,
    #[msg("Already subscribed")]
    AlreadySubscribed,
}
