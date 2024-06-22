import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { userProvider } from "src/models/user.model";
import { pokemonProvider } from "src/models/pokemon.model";
import { abilityProvider } from "src/models/ability.model";
import { typeProvider } from "src/models/type.model";
import { pokemonAbilityProvider } from "src/models/pokemonAbility.model";
import { pokemonTypesProvider } from "src/models/pokemonTypes.model";
import { tradeProvider } from "src/models/trade.model";
import { SeedService } from "./seed.service";

@Module({
  imports: [DatabaseModule],
  providers: [
    SeedService,
    ...userProvider,
    ...pokemonProvider,
    ...typeProvider,
    ...abilityProvider,
    ...pokemonAbilityProvider,
    ...pokemonTypesProvider,
    ...tradeProvider,
  ],
})
export class SeedModule {}
