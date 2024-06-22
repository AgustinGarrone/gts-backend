import { Module } from "@nestjs/common";
import { PokemonService } from "./pokemon.service";
import { PokemonController } from "./pokemon.controller";
import { pokemonProvider } from "src/models/pokemon.model";
import { userProvider } from "src/models/user.model";
import { DatabaseModule } from "src/database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [PokemonController],
  providers: [PokemonService, ...userProvider, ...pokemonProvider],
})
export class PokemonModule {}
