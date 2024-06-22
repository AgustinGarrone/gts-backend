import { Module } from "@nestjs/common";
import { TradesService } from "./trades.service";
import { TradesController } from "./trades.controller";
import { tradeProvider } from "src/models/trade.model";

@Module({
  controllers: [TradesController],
  providers: [TradesService, ...tradeProvider],
})
export class TradesModule {}
