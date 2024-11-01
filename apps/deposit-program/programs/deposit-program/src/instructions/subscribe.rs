use anchor_lang::prelude::*;

use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{transfer_checked, Mint, TokenAccount, TokenInterface, TransferChecked},
};

use crate::{error::ErrorCode, UserInfo, LOCAL_MASTER_WALLET, SUBSCRIPTION_LEVELS, USER_INFO_SEED};

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
    /// See Anchor example:
    /// https://github.com/solana-developers/anchor-examples/blob/main/account-constraints/address/programs/example/src/lib.rs
    /// CHECK: Restricts `master_wallet` to the `MASTER_WALLET` address.
    #[account(
        address = LOCAL_MASTER_WALLET
    )]
    pub master_wallet: UncheckedAccount<'info>,
    #[account(
        mut,
        associated_token::mint = token,
        associated_token::authority = master_wallet,
        associated_token::token_program = token_program
    )]
    pub master_wallet_token_account: InterfaceAccount<'info, TokenAccount>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<Subscribe>, amount: u64) -> Result<()> {
    let (subscription_cost, duration) = match SUBSCRIPTION_LEVELS
        .iter()
        .rev()
        .find(|(cost, _)| amount >= *cost)
    {
        Some(level) => *level,
        None => return Err(ErrorCode::InsufficientBalance.into()),
    };
    // Calculate the amount to send to the vault
    let vault_amount = amount.saturating_sub(subscription_cost); // Ensure no negative value
    let current_timestamp = Clock::get()?.unix_timestamp;
    // Check if the user already has an active subscription
    if ctx.accounts.user_info.expiration > current_timestamp {
        msg!("Active subscription found. Updating user's available balance.");
        send_to_vault(&ctx, amount)?; // Transfer entire amount to vault
        update_user_info(ctx, amount)?;
        //return Err(Error::from(SubscribeErrorCode::AlreadySubscribed));
    } else {
        msg!("No active subscription found. Proceeding with new subscription.");
        send_to_master_wallet(&ctx, subscription_cost)?; // Send subscription cost to master wallet
        if vault_amount > 0 {
            send_to_vault(&ctx, vault_amount)?; // Send remaining amount to vault
        }
        save_user_info(ctx, vault_amount, duration)?; // Save user info with updated balance
    }
    msg!("Subscription processed successfully.");
    Ok(())
}

pub fn update_user_info(ctx: Context<Subscribe>, additional_balance: u64) -> Result<()> {
    ctx.accounts.user_info.available_balance += additional_balance;
    msg!("Subscription is active. Funds have been added to the vault, and your available balance has been updated.");
    Ok(())
}

pub fn send_to_master_wallet(ctx: &Context<Subscribe>, amount: u64) -> Result<()> {
    let transfer_accounts = TransferChecked {
        from: ctx.accounts.user_token_account.to_account_info(),
        mint: ctx.accounts.token.to_account_info(),
        to: ctx.accounts.master_wallet_token_account.to_account_info(),
        authority: ctx.accounts.user.to_account_info(),
    };
    let cpi_context = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        transfer_accounts,
    );
    transfer_checked(cpi_context, amount, ctx.accounts.token.decimals)?;
    msg!("Transferred {} tokens to master wallet.", amount);
    Ok(())
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
    transfer_checked(cpi_context, amount, ctx.accounts.token.decimals)?;
    msg!("Transferred {} tokens to vault.", amount);
    Ok(())
}

pub fn save_user_info(
    ctx: Context<Subscribe>,
    available_balance: u64,
    duration: u64,
) -> Result<()> {
    let current_timestamp = Clock::get()?.unix_timestamp;
    let expiration = current_timestamp + duration as i64;
    let bump = ctx.bumps.user_info;
    ctx.accounts.user_info.set_inner(UserInfo {
        available_balance,
        expiration,
        bump,
    });
    msg!("New subscription saved with updated expiration.");
    Ok(())
}
