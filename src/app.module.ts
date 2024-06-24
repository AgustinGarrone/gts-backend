import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { PokemonModule } from "./pokemon/pokemon.module";
import { pokemonProvider } from "./models/pokemon.model";
import { SeedService } from "./seed/seed.service";
import { typeProvider } from "./models/type.model";
import { abilityProvider } from "./models/ability.model";
import { pokemonTypesProvider } from "./models/pokemonTypes.model";
import { pokemonAbilityProvider } from "./models/pokemonAbility.model";
import { TradesModule } from "./trades/trades.module";
import { SeedModule } from "./seed/seed.module";
import { userProvider } from "./models/user.model";
import { tradeProvider } from "./models/trade.model";
import { NotificationModule } from './notification/notification.module';

//TODO: modularizar
@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    PokemonModule,
    TradesModule,
    SeedModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SeedService,
    ...userProvider,
    ...tradeProvider,
    ...pokemonProvider,
    ...typeProvider,
    ...abilityProvider,
    ...pokemonAbilityProvider,
    ...pokemonTypesProvider,
  ],
})
export class AppModule {}
