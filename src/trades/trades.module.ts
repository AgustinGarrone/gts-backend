import { Module } from "@nestjs/common";
import { TradesService } from "./trades.service";
import { TradesController } from "./trades.controller";
import { tradeProvider } from "src/models/trade.model";
import { pokemonProvider } from "src/models/pokemon.model";

@Module({
  controllers: [TradesController],
  providers: [TradesService, ...tradeProvider, ...pokemonProvider],
})
export class TradesModule {}
