pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("6vsijynzE22W8A4kkvv2Kq7a36ZEFPvJP9kBgNtN43mK");

#[program]
pub mod deposit_program {
    use super::*;

    pub fn subscribe(ctx: Context<Subscribe>, amount: u64) -> Result<()> {
        instructions::subscribe::handler(ctx, amount)
    }

    // TODO
    //pub fn refund_balance(ctx: Context<RefundBalance>) -> Result<()> {
    //    instructions::refund_balance::handler(ctx)
    //}
}
