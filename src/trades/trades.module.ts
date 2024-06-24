import { Module } from "@nestjs/common";
import { TradesService } from "./trades.service";
import { TradesController } from "./trades.controller";
import { tradeProvider } from "src/models/trade.model";
import { DatabaseModule } from "src/database/database.module";
import { NotificationModule } from "src/notification/notification.module";
import { PokemonModule } from "src/pokemon/pokemon.module";

@Module({
  imports: [DatabaseModule, NotificationModule, PokemonModule],
  controllers: [TradesController],
  providers: [TradesService, ...tradeProvider],
})
export class TradesModule {}
