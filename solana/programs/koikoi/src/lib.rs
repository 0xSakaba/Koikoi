use anchor_lang::prelude::*;

declare_id!("HD4TbaR8NWezvps6y12VfHQguMkLB5f8XBeEsnd16DPP");

#[program]
pub mod koikoi {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.koikoi.admin = ctx.accounts.signer.key();
        Ok(())
    }

    pub fn update_admin(ctx: Context<UpdateAdmin>, new_admin: Pubkey) -> Result<()> {
        ctx.accounts.koikoi.admin = new_admin;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + 32, seeds = ["koikoi".as_bytes()], bump)]
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
#[derive(Default)]
pub struct KoikoiAccount {
    pub admin: Pubkey,
}
