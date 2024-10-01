import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, Provider, web3 } from "@project-serum/anchor";

import {
  ClickerGameObject,
  GameState,
  LeaderboardItem,
  WalletAndGamePublicKey,
  WalletAndNetwork,
} from "./types";
import { SOLANA_DEVNET_URL } from "./consts";

class AnchorClient {
  private programAddress: PublicKey = new PublicKey(
    "Edo4xMkzByZTUiFXWf7wRpTKC2mGvpZpCWcby7REpn3w"
  );

  public async myGames(
    wallet: AnchorWallet,
    games: ClickerGameObject[]
  ): Promise<ClickerGameObject[]> {
    return games.filter(
      (game) => game.account.player.toString() === wallet.publicKey.toBase58()
    );
  }

  public async getCurrentGame({
    wallet,
    endpoint,
  }: WalletAndNetwork): Promise<GameState> {
    try {
      const program = await this.getProgram({ wallet, endpoint });

      const filteredGames =
        (await program.account.game?.all()) as ClickerGameObject[];

      let games = await this.myGames(wallet, filteredGames);

      if (games.length === 0) {
        // create a new game
        const gameAccountKeypair = web3.Keypair.generate();

        await program.methods.initialize!()
          .accounts({
            game: gameAccountKeypair.publicKey,
            player: wallet.publicKey,
            systemProgram: web3.SystemProgram.programId,
          })
          .signers([gameAccountKeypair])
          .rpc();

        // refresh list of games
        games = await this.myGames(wallet, filteredGames);
      }

      const game = games[0] as ClickerGameObject;

      return {
        clicks: game.account.clicks as number,
        isReady: true,
        gameAccountPublicKey: game.publicKey.toBase58(),
        errorMessage: "",
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          clicks: 0,
          isReady: false,
          gameAccountPublicKey: "",
          errorMessage: error.message,
        };
      }

      return {
        clicks: 0,
        isReady: false,
        gameAccountPublicKey: "",
        errorMessage: "unknown error",
      };
    }
  }

  public async saveClick({
    wallet,
    endpoint,
    gameAccountPublicKey,
  }: WalletAndGamePublicKey) {
    const program = await this.getProgram({ wallet, endpoint });

    await program.methods.click!()
      .accounts({
        game: gameAccountPublicKey,
      })
      .rpc();
  }

  public async getConnectionProvider({
    wallet,
    endpoint,
  }: WalletAndNetwork): Promise<Provider> {
    const connection = new Connection(endpoint, "processed");
    const provider = new AnchorProvider(connection, wallet, {
      preflightCommitment: "processed",
      commitment: "processed",
    });
    return provider;
  }

  public async getProgram({
    wallet,
    endpoint,
  }: WalletAndNetwork): Promise<Program> {
    const provider = await this.getConnectionProvider({ wallet, endpoint });
    const idl = await Program.fetchIdl(this.programAddress, provider);
    if (idl === null) {
      throw new Error("Solana program missing IDL");
    }
    return new Program(idl, this.programAddress, provider);
  }

  public async getLeaderboard({
    wallet,
    endpoint,
  }: WalletAndNetwork): Promise<LeaderboardItem[]> {
    try {
      const program = await this.getProgram({ wallet, endpoint });

      let games = (await program.account.game?.all()) as ClickerGameObject[];

      return games.map((game) => {
        const item: LeaderboardItem = {
          playerPublicKey: game.account.player.toString(),
          clicks: game.account.clicks,
        };
        return item;
      });
    } catch {
      return [];
    }
  }

  public async airdrop({ wallet, endpoint }: WalletAndNetwork): Promise<void> {
    const AIRDROP_AMOUNT = 1000000000; // 1 SOL

    // can only airdrop on devnet
    if (endpoint !== SOLANA_DEVNET_URL) return;

    const provider = await this.getConnectionProvider({ wallet, endpoint });
    const currentBalance = await provider.connection.getBalance(
      wallet.publicKey
    );

    // don't airdrop if user already has at least 1 test SOL
    if (currentBalance > AIRDROP_AMOUNT) return;

    // otherwise, let's airdrop some test SOL!
    const signature = await provider.connection.requestAirdrop(
      wallet.publicKey,
      AIRDROP_AMOUNT
    );
    await provider.connection.confirmTransaction(signature);
  }
}

export const anchorCLient = new AnchorClient();
