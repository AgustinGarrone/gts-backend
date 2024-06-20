import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { PokemonModule } from "./pokemon/pokemon.module";
import { pokemonProvider } from "./models/pokemon.model";
import { SeedService } from "./pokemon/seed.service";
import { typeProvider } from "./models/type.model";
import { abilityProvider } from "./models/ability.model";
import { pokemonTypesProvider } from "./models/pokemonTypes.model";
import { pokemonAbilityProvider } from "./models/pokemonAbility.model";

//TODO: modularizar
@Module({
  imports: [AuthModule, DatabaseModule, PokemonModule],
  controllers: [AppController],
  providers: [
    AppService,
    SeedService,
    ...pokemonProvider,
    ...typeProvider,
    ...abilityProvider,
    ...pokemonAbilityProvider,
    ...pokemonTypesProvider,
  ],
})
export class AppModule {}
