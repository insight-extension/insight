use anchor_lang::prelude::*;

use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{transfer_checked, Mint, TokenAccount, TokenInterface, TransferChecked},
};

use crate::{UserInfo, USER_INFO_SEED};

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
        init,
        payer = user,
        space = 8 + UserInfo::INIT_SPACE,
        seeds = [USER_INFO_SEED, user.key().as_ref()],
        bump
    )]
    pub user_info: Account<'info, UserInfo>,
    #[account(
        init,
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
    ctx.accounts.user_info.set_inner(UserInfo {
        balance: amount,
        bump: ctx.bumps.user_info,
    });
    Ok(())
}
