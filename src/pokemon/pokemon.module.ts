import { Module } from "@nestjs/common";
import { PokemonService } from "./pokemon.service";
import { PokemonController } from "./pokemon.controller";
import { pokemonProvider } from "src/models/pokemon.model";
import { DatabaseModule } from "src/database/database.module";
import { AuthModule } from "src/auth/auth.module";
import { tradeProvider } from "src/models/trade.model";

@Module({
  imports: [DatabaseModule, AuthModule],
  exports: [PokemonService],
  controllers: [PokemonController],
  providers: [PokemonService, ...pokemonProvider, ...tradeProvider],
})
export class PokemonModule {}
