use anchor_lang::prelude::*;

use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{transfer_checked, Mint, TokenAccount, TokenInterface, TransferChecked},
};

use crate::{error::SubscribeErrorCode, UserInfo, SUBSCRIPTION_LEVELS, USER_INFO_SEED};

#[derive(Accounts)]
pub struct Subscribe<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mint::token_program = token_program)]
    pub token: InterfaceAccount<'info, Mint>,
    #[account(
        mut,
        associated_token::mint = token,
        associated_token::authority = user,
        associated_token::token_program = token_program,
    )]
    pub user_token_account: InterfaceAccount<'info, TokenAccount>,
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + UserInfo::INIT_SPACE,
        seeds = [USER_INFO_SEED, user.key().as_ref()],
        bump
    )]
    pub user_info: Account<'info, UserInfo>,
    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = token,
        associated_token::authority = user_info,
        associated_token::token_program = token_program,
    )]
    pub vault: InterfaceAccount<'info, TokenAccount>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

pub fn send_to_vault(ctx: &Context<Subscribe>, amount: u64) -> Result<()> {
    let transfer_accounts = TransferChecked {
        from: ctx.accounts.user_token_account.to_account_info(),
        mint: ctx.accounts.token.to_account_info(),
        to: ctx.accounts.vault.to_account_info(),
        authority: ctx.accounts.user.to_account_info(),
    };
    let cpi_context = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        transfer_accounts,
    );
    transfer_checked(cpi_context, amount, ctx.accounts.token.decimals)
}

pub fn save_user_info(ctx: Context<Subscribe>, amount: u64) -> Result<()> {
    let current_timestamp = Clock::get()?.unix_timestamp;
    if ctx.accounts.user_info.expiration > current_timestamp {
        ctx.accounts.user_info.available_balance += amount;
        msg!("Subscription is already active. Funds have been saved to the vault, and your available balance has been updated.");
        return Err(SubscribeErrorCode::AlreadySubscribed.into());
    }
    let mut subscription_level = 0;
    let mut subscription_cost: u64 = 0;
    let mut duration: i64 = 0;
    for (i, (level_amount, level_duration)) in SUBSCRIPTION_LEVELS.iter().enumerate() {
        if amount >= *level_amount {
            subscription_level = i as u8;
            subscription_cost = *level_amount;
            duration = *level_duration as i64;
        }
    }
    let available_balance = amount - subscription_cost;
    let current_timestamp = Clock::get()?.unix_timestamp;
    let expiration = current_timestamp + duration;
    let bump = ctx.bumps.user_info;
    ctx.accounts.user_info.set_inner(UserInfo {
        available_balance,
        subscription_level,
        expiration,
        bump,
    });
    Ok(())
}
