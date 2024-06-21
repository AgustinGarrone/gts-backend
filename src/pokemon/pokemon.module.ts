import { Module } from "@nestjs/common";
import { PokemonService } from "./pokemon.service";
import { PokemonController } from "./pokemon.controller";
import { pokemonProvider } from "src/models/pokemon.model";
import { typeProvider } from "src/models/type.model";
import { abilityProvider } from "src/models/ability.model";
import { pokemonAbilityProvider } from "src/models/pokemonAbility.model";
import { pokemonTypesProvider } from "src/models/pokemonTypes.model";
import { SeedService } from "./seed.service";
import { userProvider } from "src/models/user.model";

@Module({
  controllers: [PokemonController],
  providers: [
    PokemonService,
    SeedService,
    ...userProvider,
    ...pokemonProvider,
    ...typeProvider,
    ...abilityProvider,
    ...pokemonAbilityProvider,
    ...pokemonTypesProvider,
  ],
})
export class PokemonModule {}
