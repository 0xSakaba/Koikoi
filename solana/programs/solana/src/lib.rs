use anchor_lang::prelude::*;

declare_id!("DHxneo1QPdkj8urSTVDCCm5k4cFCdVTvQUBLyPKLEBDF");

#[program]
pub mod solana {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
