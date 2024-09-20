# Game flow

This document explains the life cycle of a game

1. Admin creates Match
   - Administrator initiates the process by creating a new Match
2. Owner creates temporary Game (not visible for other users)
   - The Owner (a User) creates a temporary Game entry in the database
3. Owner places bet and creates Game Account
   - When the Owner places a bet, a Game Account is simultaneously created on Solana
   - This action transforms the temporary Game into a more concrete entity
4. Game converted to a public Game (visible for other users)
   - The temporary Game entry in the database is now converted into an public Game
5. Other Users join Game
   - After the Game becomes official, other Users can join and participate
6. Admin ends Match, associated Games end
   - When the Admin concludes the Match, all associated Games are also terminated
