import { Injectable } from "@nestjs/common";
import { CreateTradeDto } from "./dto/create-trade.dto";
import { UpdateTradeDto } from "./dto/update-trade.dto";

@Injectable()
export class TradesService {
  createTrade(createTradeDto: CreateTradeDto) {
    return "This action adds a new trade";
  }

  getAvailableTrades() {
    return `This action returns all trades`;
  }

  proposeTrade(id: number) {
    return `This action returns a #${id} trade`;
  }

  rejectTrade(id: number, updateTradeDto: UpdateTradeDto) {
    return `This action returns a #${id} trade`;
  }

  confirmTrade(id: number, updateTradeDto: UpdateTradeDto) {
    return `This action returns a #${id} trade`;
  }
}
