use anchor_lang::prelude::*;

declare_id!("HD4TbaR8NWezvps6y12VfHQguMkLB5f8XBeEsnd16DPP");

#[program]
pub mod koikoi {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.koikoi.admin = ctx.accounts.signer.key();
        ctx.accounts.koikoi.withdraw_fee = 5_000; // 0.5%
        Ok(())
    }

    pub fn update_admin(ctx: Context<UpdateAdmin>, new_admin: Pubkey) -> Result<()> {
        ctx.accounts.koikoi.admin = new_admin;
        Ok(())
    }

    pub fn create_spending_account(ctx: Context<CreateSpendingAccount>, _identifier: String, owner: Pubkey) -> Result<()> {
        let spending = &mut ctx.accounts.spending;
        spending.owner = owner;
        spending.koikoi = ctx.accounts.koikoi.key();
        Ok(())
    }

    pub fn withdraw_from_spending_account(ctx: Context<WithdrawFromSpendingAccount>, _identifier: String, amount: u64) -> Result<()> {
        let fee = amount * ctx.accounts.koikoi.withdraw_fee as u64 / 1_000_000;
        ctx.accounts.spending.sub_lamports(amount)?;
        ctx.accounts.receiver.add_lamports(amount - fee)?;
        ctx.accounts.fee_receiver.add_lamports(fee)?;

        Ok(())
    }


}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + 32 + 32, seeds = ["koikoi".as_bytes()], bump)]
    pub koikoi: Account<'info, KoikoiAccount>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)] 
pub struct UpdateAdmin<'info> {
    #[account(mut, constraint = koikoi.admin == signer.key())]
    pub koikoi: Account<'info, KoikoiAccount>,

    #[account(signer)]
    pub signer: Signer<'info>,
}


#[account]
pub struct KoikoiAccount {
    pub admin: Pubkey,
    pub withdraw_fee: u32, // divided by 1000000
}

#[derive(Accounts)]
#[instruction(identifier: String)]
pub struct CreateSpendingAccount<'info> {
    pub koikoi: Account<'info, KoikoiAccount>,

    #[account(init, payer = service, space = 8 + 32 + 32, seeds = ["spending".as_bytes(), identifier.as_bytes()], bump)]
    pub spending: Account<'info, SpendingAccount>,

    #[account(mut, constraint = service.key() == koikoi.admin)]
    pub service: Signer<'info>,
    pub system_program: Program<'info, System>,

    pub user: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(identifier: String)]
pub struct WithdrawFromSpendingAccount<'info> {
    pub koikoi: Account<'info, KoikoiAccount>,

    #[account(
        mut,
        constraint = signer.key() == spending.owner || signer.key() == koikoi.admin,
        seeds = ["spending".as_bytes(), identifier.as_bytes()],
        bump
    )]
    pub spending: Account<'info, SpendingAccount>,

    #[account(mut, constraint = receiver.key() == spending.owner)]
    pub receiver: SystemAccount<'info>,
    #[account(mut, constraint = fee_receiver.key() == koikoi.admin)]
    pub fee_receiver: SystemAccount<'info>,

    #[account(signer)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct SpendingAccount {
    pub owner: Pubkey,
    pub koikoi: Pubkey,
}