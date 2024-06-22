import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { TradesService } from "./trades.service";
import { CreateTradeDto } from "./dto/create-trade.dto";
import { UpdateTradeDto } from "./dto/update-trade.dto";

@Controller("trades")
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  @Post()
  createTrade(@Body() createTradeDto: CreateTradeDto) {
    return this.tradesService.createTrade(createTradeDto);
  }

  @Get()
  getAvailableTrades() {
    return this.tradesService.getAvailableTrades();
  }

  @Post(":id/propose")
  proposeTrade(@Param("id") id: number) {
    return this.tradesService.proposeTrade(+id);
  }

  @Post(":id/reject")
  rejectTrade(@Param("id") id: number, @Body() updateTradeDto: UpdateTradeDto) {
    return this.tradesService.rejectTrade(+id, updateTradeDto);
  }

  @Post(":id/confirm")
  confirmTrade(
    @Param("id") id: number,
    @Body() updateTradeDto: UpdateTradeDto,
  ) {
    return this.tradesService.confirmTrade(+id, updateTradeDto);
  }
}
