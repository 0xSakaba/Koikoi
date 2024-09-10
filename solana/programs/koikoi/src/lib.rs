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
        let amount_sub_fee = amount - fee;
        ctx.accounts.spending.sub_lamports(amount)?;
        ctx.accounts.receiver.add_lamports(amount_sub_fee)?;
        ctx.accounts.fee_receiver.add_lamports(fee)?;

        msg!("Withdrawn {} lamports from spending account {}, {} goes user and {} goes fee receiver", amount, ctx.accounts.spending.key(), amount_sub_fee, fee);

        Ok(())
    }

    pub fn update_spending_account_owner(ctx: Context<UpdateSpendingAccountOwner>, _identifier: String, new_owner: Pubkey) -> Result<()> {
        ctx.accounts.spending.owner = new_owner;
        Ok(())
    }

    pub fn make_game(ctx: Context<MakeGame>, _identifier: String, options: u8) -> Result<()> {
        ctx.accounts.game.options = options;
        ctx.accounts.game.bets = vec![vec![]; options as usize];
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + 32 + 32, seeds = ["koikoi".as_bytes()], bump)]
    pub koikoi: Account<'info, KoikoiAccount>,

    #[account(mut, constraint = signer.key() == pubkey!("AthTeFmzMkeQE2p8ZMAGZoZ8dUNP79eAJXwB5VZWTDDt"))]
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

#[derive(Accounts)]
#[instruction(identifier: String)]
pub struct UpdateSpendingAccountOwner<'info> {
    pub koikoi: Account<'info, KoikoiAccount>,

    #[account(
        mut,
        constraint = signer.key() == spending.owner || signer.key() == koikoi.admin,
        seeds = ["spending".as_bytes(), identifier.as_bytes()],
        bump
    )]
    pub spending: Account<'info, SpendingAccount>,

    #[account(signer)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct SpendingAccount {
    pub owner: Pubkey,
    pub koikoi: Pubkey,
}

#[derive(Accounts)]
#[instruction(identifier: String, options: u8)]
pub struct MakeGame<'info> {
    pub koikoi: Account<'info, KoikoiAccount>,

    #[account(
        init,
        payer = service,
        space = 8 + 1 + (4 + options as usize * 4),
        seeds = ["game".as_bytes(), identifier.as_bytes()],
        bump
    )]
    pub game: Account<'info, GameAccount>,

    #[account(mut, signer)]
    pub service: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct GameAccount {
    pub options: u8,
    pub bets: Vec<Vec<(Pubkey, u64)>>, // bets[option][number] = (user, amount)
}