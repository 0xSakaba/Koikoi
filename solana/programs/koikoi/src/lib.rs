use anchor_lang::prelude::*;
use solana_security_txt::security_txt;

declare_id!("3rFegxqcbnmjEKBmZRQbz9CZkVDVLtcL8Hh2qhozyyzc");

security_txt!(
    name: "Koikoi",
    project_url: "https://koikoi.placeholder",
    contacts: "email:placeholder@koikoi.placeholder,link:https://koikoi.placeholder/security,discord:koikoi",
    policy: "https://koikoi.placeholder/security"
);

#[program]
pub mod koikoi {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.koikoi.admin = ctx.accounts.signer.key();
        ctx.accounts.koikoi.withdraw_fee = 5_000; // 0.5%
        ctx.accounts.koikoi.game_fee = 30_000; // 3%
        Ok(())
    }

    pub fn update_config(
        ctx: Context<UpdateConfig>,
        new_admin: Pubkey,
        new_withdraw_fee: u32,
        new_game_fee: u32,
    ) -> Result<()> {
        ctx.accounts.koikoi.admin = new_admin;
        ctx.accounts.koikoi.withdraw_fee = new_withdraw_fee;
        ctx.accounts.koikoi.game_fee = new_game_fee;
        Ok(())
    }

    pub fn create_spending_account(
        ctx: Context<CreateSpendingAccount>,
        _identifier: String,
        owner: Pubkey,
    ) -> Result<()> {
        let spending = &mut ctx.accounts.spending;
        spending.owner = owner;
        Ok(())
    }

    pub fn withdraw_from_spending_account(
        ctx: Context<WithdrawFromSpendingAccount>,
        _identifier: String,
        amount: u64,
    ) -> Result<()> {
        let fee = amount * ctx.accounts.koikoi.withdraw_fee as u64 / 1_000_000;
        let amount_sub_fee = amount - fee;
        ctx.accounts.spending.sub_lamports(amount)?;
        ctx.accounts.receiver.add_lamports(amount_sub_fee)?;
        ctx.accounts.fee_receiver.add_lamports(fee)?;

        msg!(
            "Withdrawn {} lamports from spending account {}, {} goes user and {} goes fee receiver",
            amount,
            ctx.accounts.spending.key(),
            amount_sub_fee,
            fee
        );

        Ok(())
    }

    pub fn update_spending_account_owner(
        ctx: Context<UpdateSpendingAccountOwner>,
        _identifier: String,
        new_owner: Pubkey,
    ) -> Result<()> {
        ctx.accounts.spending.owner = new_owner;
        Ok(())
    }

    pub fn make_game(ctx: Context<MakeGame>, _identifier: String, options: u8) -> Result<()> {
        ctx.accounts.game.options = options;
        ctx.accounts.game.bettors = vec![vec![]; options as usize];
        ctx.accounts.game.bet_amounts = vec![vec![]; options as usize];
        Ok(())
    }

    pub fn place_bet(
        ctx: Context<PlaceBet>,
        _game_identifier: String,
        _user_identifier: String,
        option: u8,
        amount: u64,
    ) -> Result<()> {
        ctx.accounts.spending.sub_lamports(amount)?;
        ctx.accounts.game.add_lamports(amount)?;

        ctx.accounts.game.bettors[option as usize].push(ctx.accounts.spending.key());
        ctx.accounts.game.bet_amounts[option as usize].push(amount);
        ctx.accounts.game.pool += amount;

        msg!(
            "Place {} lamports bet on option {} in game {}",
            amount,
            option,
            ctx.accounts.game.key()
        );
        Ok(())
    }

    pub fn close_game(ctx: Context<CloseGame>, _identifier: String, win_option: u8) -> Result<()> {
        // the game is abort and refund if:
        //   1. the amount of bettor is 1
        //   2. the amount winner is 0
        //   3. the match was not played (win_option == options.number)

        let mut pool = ctx.accounts.game.pool;
        let mut distribution: std::collections::HashMap<Pubkey, u64> =
            std::collections::HashMap::new();
        let mut bettors = 0;

        for bet in ctx.accounts.game.bettors.iter() {
            bettors += bet.len();
        }

        require!(
            win_option <= ctx.accounts.game.options,
            KoikoiError::InvalidWinOption
        );

        let abort = if win_option == ctx.accounts.game.options {
            msg!("Game aborted due to a manually abort");
            true
        } else if ctx.accounts.game.bettors[win_option as usize].len() == 0 {
            msg!("Game aborted due to no winner");
            true
        } else if bettors <= 1 {
            msg!("Game aborted due to no bettor");
            true
        } else {
            false
        };

        if abort {
            // refund
            ctx.accounts.game.sub_lamports(pool)?;

            for i in 0..ctx.accounts.game.bettors.len() {
                for j in 0..ctx.accounts.game.bettors[i].len() {
                    let (bettor, amount) = (
                        ctx.accounts.game.bettors[i][j],
                        ctx.accounts.game.bet_amounts[i][j],
                    );
                    match distribution.get_mut(&bettor) {
                        Some(share) => {
                            *share += amount;
                        }
                        None => {
                            distribution.insert(bettor, amount);
                        }
                    }
                }
            }

            for account in ctx.remaining_accounts.iter() {
                {
                    let share = match distribution.get(&account.key()) {
                        Some(share) => share,
                        None => &0,
                    };
                    account.add_lamports(*share)?;
                    msg!("Refund {} lamports to {}", share, account.key());
                }
                distribution.remove(&account.key());
            }
        } else {
            // split pool
            let mut distribution_frac = 0;
            let service_fee = pool * ctx.accounts.koikoi.game_fee as u64 / 1_000_000;
            pool -= service_fee;

            ctx.accounts.game.sub_lamports(pool)?;

            let win_bettors = &ctx.accounts.game.bettors[win_option as usize];
            let win_amounts = &ctx.accounts.game.bet_amounts[win_option as usize];

            for i in 0..win_bettors.len() {
                distribution_frac += win_amounts[i];
                match distribution.get_mut(&win_bettors[i]) {
                    Some(share) => {
                        *share += win_amounts[i];
                    }
                    None => {
                        distribution.insert(win_bettors[i].clone(), win_amounts[i].clone());
                    }
                }
            }

            for account in ctx.remaining_accounts.iter() {
                {
                    let share = match distribution.get(&account.key()) {
                        Some(share) => share,
                        None => &0,
                    };
                    msg!("Distribute {} lamports to {}", share, account.key());
                    account.add_lamports(pool * share / distribution_frac)?;
                }
                distribution.remove(&account.key());
            }
        }

        require!(
            distribution.is_empty(),
            KoikoiError::DistributionNotCompleted
        );

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
pub struct UpdateConfig<'info> {
    #[account(mut)]
    pub koikoi: Account<'info, KoikoiAccount>,

    #[account(signer, address = koikoi.admin)]
    pub signer: Signer<'info>,
}

#[account]
pub struct KoikoiAccount {
    pub admin: Pubkey,
    pub withdraw_fee: u32, // divided by 1000000
    pub game_fee: u32,     // divided by 1000000
}

#[derive(Accounts)]
#[instruction(identifier: String)]
pub struct CreateSpendingAccount<'info> {
    pub koikoi: Account<'info, KoikoiAccount>,

    #[account(
        init,
        payer = service,
        space = 8 + 32 + 32,
        seeds = ["spending".as_bytes(), identifier.as_bytes()],
        bump
    )]
    pub spending: Account<'info, SpendingAccount>,

    #[account(mut, signer, address = koikoi.admin)]
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
        seeds = ["spending".as_bytes(), identifier.as_bytes()],
        bump
    )]
    pub spending: Account<'info, SpendingAccount>,

    #[account(mut, address = spending.owner)]
    pub receiver: SystemAccount<'info>,
    #[account(mut, address = koikoi.admin)]
    pub fee_receiver: SystemAccount<'info>,

    #[account(
        signer,
        constraint = signer.key() == spending.owner || signer.key() == koikoi.admin
    )]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(identifier: String)]
pub struct UpdateSpendingAccountOwner<'info> {
    pub koikoi: Account<'info, KoikoiAccount>,

    #[account(
        mut,
        seeds = ["spending".as_bytes(), identifier.as_bytes()],
        bump
    )]
    pub spending: Account<'info, SpendingAccount>,

    #[account(
        signer,
        constraint = signer.key() == spending.owner || signer.key() == koikoi.admin
    )]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct SpendingAccount {
    pub owner: Pubkey,
}

#[derive(Accounts)]
#[instruction(identifier: String, options: u8)]
pub struct MakeGame<'info> {
    pub koikoi: Account<'info, KoikoiAccount>,

    #[account(
        init,
        payer = service,
        space = GameAccount::get_init_size(options as usize),
        seeds = ["game".as_bytes(), identifier.as_bytes()],
        bump
    )]
    pub game: Account<'info, GameAccount>,

    #[account(
        mut,
        signer,
        address = koikoi.admin
    )]
    pub service: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(game_identifier: String, user_identifier: String)]
pub struct PlaceBet<'info> {
    pub koikoi: Account<'info, KoikoiAccount>,

    #[account(
        mut,
        seeds = ["spending".as_bytes(), user_identifier.as_bytes()],
        bump
    )]
    pub spending: Account<'info, SpendingAccount>,

    #[account(
        mut,
        realloc = game.get_size() + 40,
        realloc::payer = service,
        realloc::zero = false,
        seeds = ["game".as_bytes(), game_identifier.as_bytes()],
        bump
    )]
    pub game: Account<'info, GameAccount>,

    #[account(
        mut,
        signer,
        address = koikoi.admin
    )]
    pub service: Signer<'info>,
    pub system_program: Program<'info, System>,

    #[account(
        mut,
        signer,
        constraint = spending.owner == signer.key() || koikoi.admin == signer.key()
    )]
    pub signer: Signer<'info>, // allow either user or admin to sign
}

#[derive(Accounts)]
#[instruction(identifier: String)]
pub struct CloseGame<'info> {
    pub koikoi: Account<'info, KoikoiAccount>,

    #[account(
        mut,
        seeds = ["game".as_bytes(), identifier.as_bytes()],
        bump,
        close = service
    )]
    pub game: Account<'info, GameAccount>,

    #[account(
        mut,
        signer,
        address = koikoi.admin
    )]
    pub service: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct GameAccount {
    pub options: u8,
    pub pool: u64,
    pub bettors: Vec<Vec<Pubkey>>,
    pub bet_amounts: Vec<Vec<u64>>,
}

impl GameAccount {
    pub fn get_init_size(options: usize) -> usize {
        8 + 1 + 8 + 2 * (4 + 4 * options)
    }
    pub fn get_size(&self) -> usize {
        let mut size: usize = 8 + 1 + 8 + 2 * (4 + 4 * self.options) as usize; // each vec header takes 4
        for bet in &self.bettors {
            size += (32 + 8) * bet.len();
        }

        size
    }
}

#[error_code]
pub enum KoikoiError {
    #[msg("Invalid win option")]
    InvalidWinOption,
    #[msg("Distribution is not completed")]
    DistributionNotCompleted,
}
