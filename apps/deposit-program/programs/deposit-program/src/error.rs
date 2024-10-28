use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient balance")]
    InsufficientBalance,
    #[msg("Unauthorized Withdrawal")]
    UnauthorizedWithdrawal,
    #[msg("Invalid Master Wallet")]
    InvalidMasterWallet,
}
